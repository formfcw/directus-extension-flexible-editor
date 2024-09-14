<template>
    <v-menu
        v-for="availableCollection of allowedMarkCollections"
        :key="availableCollection.collection"
        show-arrow
        placement="bottom-start"
        :fullHeight="true"
    >
        <template #activator="{ toggle }">
            <ToolButton
                :title="availableCollection.name"
                :icon="availableCollection.icon"
                :action="isActive(availableCollection.collection) ? toggle : () => create(availableCollection.collection)"
                :disabled
                :active="isActive(availableCollection.collection)"
                :aria-pressed="isActive(availableCollection.collection)"
            />
        </template>
        <v-list>
            <v-list-item v-if="selectedRelationMark?.attrs?.noRelatedItem">
                <v-list-item-icon>
                    <v-icon
                        name="warning"
                        class="warning"
                    />
                </v-list-item-icon>
                <v-list-item-content>{{ t('related_item_missing') }}</v-list-item-content>
            </v-list-item>

            <v-list-item
                v-else
                clickable
                @click="edit"
            >
                <v-list-item-icon><v-icon name="edit" /></v-list-item-icon>
                <v-list-item-content><v-text-overflow :text="t('edit')" /></v-list-item-content>
            </v-list-item>

            <v-list-item
                clickable
                @click="editor.chain().focus().unsetRelationMark().run();"
            >
                <v-list-item-icon><v-icon name="delete" /></v-list-item-icon>
                <v-list-item-content><v-text-overflow :text="t('remove')" /></v-list-item-content>
            </v-list-item>
        </v-list>
    </v-menu>

    <drawer-item
        v-model:active="editModalActive.relationMark"
        :disabled="drawerDisabled"
        :collection="relationInfo!.junctionCollection.collection"
        :primary-key="currentlyEditing || '+'"
        :related-primary-key="relatedPrimaryKey || '+'"
        :junction-field="relationInfo!.junctionField.field"
        :edits="editsAtStart"
        :circular-field="relationInfo!.reverseJunctionField.field"
        @input="(item: Record<string, any>) => stageEdits(item, action)"
    />
</template>



<script setup lang="ts">
    import { computed, inject } from 'vue';
    import { useI18n } from "vue-i18n"
    import { useI18nFallback } from '../../composables/use-i18n-fallback'
    import ToolButton from "../../components/ToolButton.vue";
    import type { CustomToolButtonProps, RelationReference } from '../../types';

    const props = defineProps<CustomToolButtonProps>();

    const { t } = useI18nFallback(useI18n());

    const { editModalActive, disabled: drawerDisabled, relationInfo, allowedMarkCollections, currentlyEditing, relatedPrimaryKey, editsAtStart, stageEdits, createItem, editItem, findDisplayItem }: RelationReference = inject('m2aRelation')!;

    const selectedRelationMark = computed(() => props.editor.state.selection.$anchor.marks().find(mark => mark.type.name === 'relation-mark'));

    function create(collection) {
        createItem(collection, 'relationMark')
    }

    function edit() {
        const nodeId = selectedRelationMark.value?.attrs?.id;
        if (!nodeId) return;

        const item = findDisplayItem(nodeId);
        if (!item) return;

        editItem(item, 'relationMark');
    }

    function isActive(collection: string) {
        return props.editor.isActive('relation-mark', { collection })
    }
</script>



<style scoped>
    .v-list-item.active {
        --v-list-item-icon-color: var(--theme--foreground-subdued, var(--foreground-subdued)) !important;
    }

    .v-divider {
        --v-divider-label-color: var(--theme--foreground-subdued, var(--foreground-subdued));
    }

    .v-icon.warning {
        --v-icon-color: var(--theme--warning, var(--warning));
    }
</style>