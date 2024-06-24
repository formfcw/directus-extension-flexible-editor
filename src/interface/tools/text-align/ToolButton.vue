<template>
    <v-menu
        show-arrow
        placement="bottom-start"
        :fullHeight="true"
    >
        <template #activator="{ toggle }">
            <ToolButton
                :title
                :disabled
                :icon="currentAlignment.icon"
                :action="toggle"
            />
        </template>
        <v-list>
            <v-list-item
                clickable
                v-for="option in alignmentOptions"
                :key="option.alignment"
                @click="editor.chain().focus().setTextAlign(option.alignment).run()"
                :disabled="!editor.can().chain().focus().setTextAlign(option.alignment).run()"
                :active="editor.isActive({ textAlign: option.alignment })"
            >
                <v-list-item-icon>
                    <v-icon :name="option.icon" />
                </v-list-item-icon>
                <v-list-item-content>
                    <v-text-overflow :text="t(option.label)" />
                </v-list-item-content>
                <v-list-item-hint>{{ translateShortcut(option.shortcut) }}</v-list-item-hint>
            </v-list-item>
        </v-list>
    </v-menu>
</template>

<script setup lang="ts">
    import { computed } from 'vue';
    import { useI18n } from "vue-i18n";
    import { useI18nFallback } from "../../composables/use-i18n-fallback";
    import ToolButton from "../../components/ToolButton.vue";
    import { translateShortcut } from "../../directus-core/utils/translate-shortcut";
    import type { CustomToolButtonProps } from "../../types";

    const props = defineProps<CustomToolButtonProps>();

    const { t } = useI18nFallback(useI18n());

    const alignmentOptions = [
        {
            alignment: 'left',
            icon: 'format_align_left',
            label: 'text_align.align_left',
            shortcut: ['meta', 'shift', 'L']
        },
        {
            alignment: 'center',
            icon: 'format_align_center',
            label: 'text_align.align_center',
            shortcut: ['meta', 'shift', 'E']
        },
        {
            alignment: 'right',
            icon: 'format_align_right',
            label: 'text_align.align_right',
            shortcut: ['meta', 'shift', 'R']
        },
        {
            alignment: 'justify',
            icon: 'format_align_justify',
            label: 'text_align.align_justify',
            shortcut: ['meta', 'shift', 'J']
        }
    ];

    const currentAlignment = computed(
        () => alignmentOptions.find(option =>
            props.editor.isActive({ textAlign: option.alignment })
        ) ?? alignmentOptions[0]
    );
</script>
