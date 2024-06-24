<template>
    <v-card class="card">
        <v-card-title class="card-title">{{ t('add_edit_link') }}</v-card-title>
        <v-card-text>
            <div class="grid">
                <v-notice
                    v-if="validationErrors.length"
                    type="danger"
                    class="field"
                >
                    <div>
                        <p>{{ t('validation_errors_notice') }}</p>
                        <ul>
                            <li v-for="error in validationErrors">{{ error }}</li>
                        </ul>
                    </div>
                </v-notice>

                <div class="field">
                    <div class="type-label">{{ t('type') }}</div>
                    <v-select
                        v-model="modelValues.type"
                        :items="linkTypes"
                    ></v-select>
                </div>
                <div class="field">
                    <div class="type-label">{{ hrefLabel }}</div>
                    <v-input
                        v-model="modelValues.href"
                        :placeholder="linkPlaceholder"
                    ></v-input>
                </div>
                <div class="field">
                    <div class="type-label">{{ t('open_link_in') }}</div>
                    <v-checkbox
                        v-model="modelValues.newTab"
                        :label="t('new_tab')"
                        :disabled="disableTarget"
                        block
                    ></v-checkbox>
                </div>
            </div>
        </v-card-text>
        <v-card-actions>
            <v-button
                @click="$emit('closeDialog')"
                secondary
            >{{ t('cancel') }}</v-button>
            <v-button
                @click="onRemove"
                :disabled="oldLinkIsEmpty"
                danger
            >{{ t('remove') }}</v-button>
            <v-button
                @click="onAdd"
                :disabled="linkIsEmpty"
            >{{ t('save') }}</v-button>
        </v-card-actions>
    </v-card>
</template>



<script setup lang="ts">
    import isEmail from 'validator/lib/isEmail';
    import isURL from 'validator/lib/isURL';
    import isSlug from 'validator/lib/isSlug';
    import { ref, computed, watchEffect } from 'vue'
    import { useI18n } from "vue-i18n";
    import { useI18nFallback } from '../../composables/use-i18n-fallback'


    // Props
    interface Props { get: Function }
    const props = defineProps<Props>();


    // I18n
    const { t } = useI18nFallback(useI18n());


    // Types of links
    type LinkType = {
        text: string;
        value: string | null;
        prefix: string[];
        hidePrefix?: boolean;
        placeholder?: string | boolean;
        noTarget?: boolean;
        newTabDefault?: boolean;
    };
    const linkTypes: LinkType[] = [
        { text: t('link_types.link'), value: 'external_link', prefix: ['http://', 'https://'], placeholder: 'https://', newTabDefault: true },
        { text: t('link_types.internal_link'), value: 'internal_link', prefix: ['/'], placeholder: '/', newTabDefault: false },
        { text: t('link_types.email'), value: 'email', prefix: ['mailto:'], hidePrefix: true, placeholder: 'mail@example.com', noTarget: true },
        { text: t('link_types.phone_number'), value: 'tel', prefix: ['tel:'], hidePrefix: true, placeholder: '+1234567890', noTarget: true },
        { text: t('link_types.other'), value: null, prefix: [] },
    ];


    // Display old values
    const getDisplayValues = (old: Record<string, any>) => {
        let type = old.href ? null : 'external_link';
        let href = old.href ? old.href : '';
        let newTab: boolean | null = null;

        if (old.hasOwnProperty('target')) {
            newTab = old.target === null ? false : true;
        }

        linkTypes.forEach(linkType => {
            linkType.prefix.forEach(prefix => {
                if (href.startsWith(prefix)) {
                    type = linkType.value;

                    if (linkType.noTarget)
                        newTab = null;

                    if (linkType.hidePrefix)
                        href = href.replace(new RegExp(`^${prefix}`, "g"), '');

                    return;
                }
            })
        });

        return { type, href, newTab };
    };
    const oldValues = props.get();
    const modelValues = ref(getDisplayValues(oldValues));


    // Prepare values for inserting
    const getSaveableValues = () => {
        let { type, href, newTab } = modelValues.value;
        let target = newTab ? '_blank' : null;

        if (newTab)
            target = '_blank';

        linkTypes.forEach(linkType => {
            if (linkType.value !== type) return;

            if (newTab === null && linkType.newTabDefault)
                target = '_blank';

            linkType.prefix.forEach(prefix => {
                if (linkType.hidePrefix) {
                    href = prefix + href;
                    return;
                }
            })
        });

        return { href, target };
    };


    // Error
    const validationErrors = ref<string[]>([]);
    const validateInput = () => {
        let { type, href } = modelValues.value;

        validationErrors.value = [];

        const externalLinkOptions = {
            require_protocol: true,
            protocols: ['http', 'https'],
            validate_length: false,
        };

        if (type === 'external_link') {
            const protocolExists = linkTypes
                .filter(({ value }) => value === type)[0]!.prefix
                .some(prefix => href.startsWith(prefix));

            if (!protocolExists) {
                validationErrors.value.push(t('validation_error_link_no_protocol'));
            }

            if (!isURL(href, externalLinkOptions)) {
                validationErrors.value.push(t('validation_error_link'));
            }
        }

        if (type === 'internal_link') {
            if (!href.startsWith('/')) {
                validationErrors.value.push(t('validation_error_link_no_slash'));
            }

            if (!isSlug(href)) {
                validationErrors.value.push(t('validation_error_link'));
            }
        }

        if (type === 'email' && !isEmail(href)) {
            validationErrors.value.push(t('validation_error_email'));
        }

        const regexPhoneNumber = /^[\+]?[\d\s]+$/;

        if (type === 'tel' && !regexPhoneNumber.test(href)) {
            validationErrors.value.push(t('validation_error_phone'));
        }
    };


    // Href label
    const hrefLabel = computed(() => {
        if (modelValues.value.type === 'external_link')
            return t('link_types.link');

        if (modelValues.value.type === 'internal_link')
            return t('link_types.internal_link');

        if (modelValues.value.type === 'email')
            return t('link_types.email');

        if (modelValues.value.type === 'tel')
            return t('link_types.phone_number');

        return t('url');
    });


    // Placeholder
    const linkPlaceholder = computed(() => {
        const linkType = linkTypes.find(({ value }) => value === modelValues.value.type);

        if (linkType?.placeholder)
            return linkType.placeholder;

        return false;
    });


    // When changing type and if noTarget is set, set newTab to null
    watchEffect(() => {
        const linkType = linkTypes.find(({ value }) => value === modelValues.value.type);

        if (linkType?.noTarget)
            modelValues.value.newTab = null;
    });


    // disableTarget if noTarget is set
    const disableTarget = computed(() => {
        const linkType = linkTypes.find(({ value }) => value === modelValues.value.type);

        if (linkType?.noTarget)
            return true;

        return false;
    });


    // Disable buttons if href is empty
    const linkIsEmpty = computed(() => modelValues.value.href === '' || modelValues.value.href === null);
    const oldLinkIsEmpty = computed(() => !oldValues.hasOwnProperty('href'));


    // Actions
    const emit = defineEmits(['get', 'set', 'unset', 'closeDialog']);
    const onRemove = () => {
        emit('unset');
        emit('closeDialog');
    };
    const onAdd = () => {
        validateInput();

        if (validationErrors.value.length)
            return;

        emit('set', getSaveableValues());
        emit('closeDialog');
    };
</script>



<style scoped>
    .card {
        --form-vertical-gap: 40px;
    }

    /* Relevant parts of the following styles are based on 'src/interfaces/input-rich-text-html/input-rich-text-html.vue' (Directus repository) */
    .card {
        overflow: auto;
    }

    .card-title {
        margin-bottom: 24px;
        font-size: 24px;
    }

    /* Relevant parts of the following styles are based on '@/styles/mixins/form-grid' (Directus repository) */
    .grid {
        display: grid;
        grid-template-columns: [start] minmax(0, 1fr) [half] minmax(0, 1fr) [full];
        gap: var(--theme--form--row-gap, var(--form-vertical-gap)) var(--theme--form--column-gap, var(--form-horizontal-gap));
    }

    .grid .type-label {
        margin-bottom: 8px;
    }

    .grid .field {
        grid-column: start / fill;

        @media (min-width: 960px) {
            grid-column: start / full;
        }
    }
</style>