<template>
    <v-menu
        class="first"
        show-arrow
        placement="bottom-start"
        :fullHeight="true"
    >
        <template #activator="{ toggle }">
            <ToolButton
                :title
                :icon
                :action="toggle"
                :disabled="disabled && !!relationInlineBlockTool.disabled?.(editor)"
                :active="active || !!relationInlineBlockTool.active?.(editor)"
            />
        </template>
        <v-list>
            <v-list-item
                v-for="availableCollection of blockCollections"
                :key="availableCollection.collection"
                clickable
                @click="() => createItem(availableCollection.collection)"
                :active="isActive(availableCollection.collection)"
                :aria-pressed="isActive(availableCollection.collection)"
                :disabled
            >
                <v-list-item-icon>
                    <v-icon :name="availableCollection.icon" />
                </v-list-item-icon>
                <v-list-item-content>
                    <v-text-overflow :text="availableCollection.name" />
                </v-list-item-content>
            </v-list-item>

            <v-divider
                v-if="blockCollections.length && allowedInlineBlockCollections.length"
                inline-title
            >{{
                $t('inline') }}</v-divider>

            <v-list-item
                v-for="availableCollection of allowedInlineBlockCollections"
                :key="availableCollection.collection"
                clickable
                @click="() => createItem(availableCollection.collection, 'relationInlineBlock')"
                :active="isActive(availableCollection.collection, 'relation-inline-block')"
                :aria-pressed="isActive(availableCollection.collection, 'relation-inline-block')"
                :disabled="relationInlineBlockTool.disabled?.(editor)"
            >
                <v-list-item-icon>
                    <v-icon :name="availableCollection.icon" />
                </v-list-item-icon>
                <v-list-item-content>
                    <v-text-overflow :text="availableCollection.name" />
                </v-list-item-content>
            </v-list-item>
        </v-list>
    </v-menu>

    <drawer-item
        v-model:active="editModalActive.relationBlock"
        :disabled="drawerDisabled"
        :collection="relationInfo!.junctionCollection.collection"
        :primary-key="currentlyEditing || '+'"
        :related-primary-key="relatedPrimaryKey || '+'"
        :junction-field="relationInfo!.junctionField.field"
        :edits="editsAtStart"
        :circular-field="relationInfo!.reverseJunctionField.field"
        @input="(item: Record<string, any>) => stageEdits(item, action)"
    />

    <drawer-item
        v-model:active="editModalActive.relationInlineBlock"
        :disabled="drawerDisabled"
        :collection="relationInfo!.junctionCollection.collection"
        :primary-key="currentlyEditing || '+'"
        :related-primary-key="relatedPrimaryKey || '+'"
        :junction-field="relationInfo!.junctionField.field"
        :edits="editsAtStart"
        :circular-field="relationInfo!.reverseJunctionField.field"
        @input="(item: Record<string, any>) => stageEdits(item, relationInlineBlockAction)"
    />
</template>



<script setup lang="ts">
    import { computed, inject } from 'vue';
    import ToolButton from "../../components/ToolButton.vue";
    import relationInlineBlockTool from "../relation-inline-block"
    import type { CustomToolButtonProps, RelationReference, RelationNodeAttrs } from '../../types';

    type RelationBlockType = 'relation-block' | 'relation-inline-block';

    const props = defineProps<CustomToolButtonProps>();

    const { editModalActive, disabled: drawerDisabled, relationInfo, allowedCollections, allowedBlockCollections, allowedInlineBlockCollections, currentlyEditing, relatedPrimaryKey, editsAtStart, stageEdits, createItem }: RelationReference = inject('m2aRelation')!;

    const blockCollections = computed(() => {
        if (allowedBlockCollections.value.length) return allowedBlockCollections.value;
        if (!allowedInlineBlockCollections.value.length) return allowedCollections.value;
        return [];
    })

    const relationInlineBlockAction = (attrs: RelationNodeAttrs) => relationInlineBlockTool.action!(props.editor, attrs);

    function isActive(collection: string, type: RelationBlockType = "relation-block") {
        return props.editor.isActive(type, { collection })
    }
</script>



<style scoped>
    .v-list-item.active {
        --v-list-item-icon-color: var(--theme--foreground-subdued, var(--foreground-subdued)) !important;
    }

    /* TODO: [Stage 2] Remove this hack! Puts Relation Block menu to the front. */
    .first {
        order: -1;
    }

    .v-divider {
        --v-divider-label-color: var(--theme--foreground-subdued);
    }
</style>