<template>
    <node-view-wrapper class="relation-block">
        <v-skeleton-loader
            v-if="loading"
            :type="'block-list-item'"
        />

        <div
            v-else-if="element && hasAllowedCollection(element)"
            @click="editItem(element)"
            @mousedown="onMousedown()"
            class="v-list-item link block clickable"
        >
            <v-icon
                data-drag-handle
                class="drag-handle"
                name="drag_handle"
                draggable="true"
                left
                @click.stop
            />
            <duplication-warning :node-id="node.attrs.id"></duplication-warning>
            <span class="collection">{{ getCollectionName(element) }}:</span>
            <render-template
                :collection="element[relationInfo!.collectionField.field]"
                :template="templates[element[relationInfo!.collectionField.field]]"
                :item="element[relationInfo!.junctionField.field]"
            />
            <div class="spacer"></div>
            <v-icon
                class="clear-icon"
                name="delete"
                @click.stop="deleteNode"
            />
        </div>

        <v-notice
            v-else
            type="warning"
        >
            <span>{{ t('related_item_missing') }}</span>
            <div class="spacer"></div>
            <v-icon
                class="clear-icon"
                name="delete"
                @click.stop="deleteNode"
            />
        </v-notice>
    </node-view-wrapper>
</template>



<script setup lang="ts">
    // nodeViewProps: https://github.com/ueberdosis/tiptap/blob/develop/docs/guide/node-views/vue.md#all-available-props
    import { computed, inject } from 'vue';
    import { NodeViewWrapper } from '@tiptap/vue-3'
    import DuplicationWarning from './DuplicationWarning.vue'
    import { useI18n } from "vue-i18n";
    import { useI18nFallback } from '../composables/use-i18n-fallback'
    import type { NodeViewProps } from '@tiptap/vue-3';
    import type { RelationReference } from '../types/relation-reference';

    const props = defineProps<NodeViewProps>();

    const { t } = useI18nFallback(useI18n());

    const { loading, templates, relationInfo, findDisplayItem, editItem, hasAllowedCollection, getCollectionName }: RelationReference = inject('m2aRelation')!;

    const element = computed(() => findDisplayItem(props.node.attrs.id));

    // Prevent the gapcursor from appearing while clicking the relation block
    const onMousedown = () => {
        if (!props.editor.isFocused)
            props.editor.commands.blur();
    };
</script>



<style scoped>
    /* Based on the styles of https://github.com/directus/directus/blob/main/app/src/components/v-list-item.vue */
    .v-list-item {
        position: relative;
        display: flex;
        flex-basis: 100%;
        flex-grow: 1;
        flex-shrink: 1;
        align-items: center;
        min-width: var(--v-list-item-min-width);
        max-width: var(--v-list-item-max-width);
        min-height: var(--v-list-item-min-height);
        max-height: var(--v-list-item-max-height);
        margin: var(--v-list-item-margin);
        padding: var(--v-list-item-padding);
        overflow: hidden;
        color: var(--v-list-item-color);
        text-decoration: none;
        border-radius: var(--v-list-item-border-radius);
    }

    .v-list-item.link {
        cursor: pointer;
        transition: var(--fast) var(--transition);
        transition-property: background-color, color;
        user-select: none;
    }

    .v-list-item.link:not(.disabled):not(.block):hover {
        color: var(--v-list-item-color-hover);
        background-color: var(--v-list-item-background-color-hover);
    }

    .v-list-item.link:not(.disabled):not(.block):active {
        color: var(--v-list-item-color-active);
        background-color: var(--v-list-item-background-color-active);
    }

    .v-list-item.active {
        color: var(--v-list-item-color-active);
        background-color: var(--v-list-item-background-color-active);
    }

    .v-list-item.disabled {
        --v-list-item-color: var(--foreground-subdued) !important;
        cursor: not-allowed;
    }

    .v-list-item.block {
        --v-list-item-border-color: var(--border-subdued);
        --v-list-item-background-color: var(--background-page);
        --v-list-item-background-color-hover: var(--card-face-color);
        --v-icon-color: var(--foreground-subdued);

        position: relative;
        display: flex;
        height: var(--input-height);
        margin: 0;
        padding: 8px var(--input-padding);
        background-color: var(--v-list-item-background-color);
        border: var(--border-width) solid var(--v-list-item-border-color);
        border-radius: var(--border-radius);
        transition: border-color var(--fast) var(--transition);
    }

    .v-list-item.block :slotted(.drag-handle) {
        cursor: grab;
    }

    .v-list-item.block :slotted(.drag-handle):hover {
        color: var(--foreground-color);
    }

    .v-list-item.block :slotted(.drag-handle:active) {
        cursor: grabbing;
    }

    .v-list-item.block :slotted(.spacer) {
        flex-grow: 1;
    }

    .v-list-item.block.clickable:hover {
        background-color: var(--v-list-item-background-color-hover);
        border: var(--border-width) solid var(--v-list-item-border-color-hover);
    }

    .v-list-item.block.sortable-chosen {
        border: var(--border-width) solid var(--primary) !important;
    }

    .v-list-item.block.sortable-ghost {
        pointer-events: none;
    }

    .v-list-item.block+.v-list-item.block {
        margin-top: 8px;
    }
</style>



<style scoped>
    /* Custom styles */

    .v-list-item:active {
        /* Alternative to sortable-chosen */
        border: var(--border-width) solid var(--primary) !important;
    }

    .spacer {
        flex-grow: 1;
    }

    .collection {
        color: var(--primary);
        white-space: nowrap;
        margin-right: 1ch;
    }

    .drag-handle {
        cursor: move;
        cursor: grab;
    }

    .drag-handle:hover {
        color: var(--foreground-color);
    }

    .drag-handle:active {
        cursor: grabbing;
    }

    .clear-icon {
        --v-icon-color: var(--foreground-subdued);
        --v-icon-color-hover: var(--danger);

        margin-right: 8px;
        color: var(--foreground-subdued);
        transition: color var(--fast) var(--transition);
        cursor: pointer;
    }

    .clear-icon:hover {
        color: var(--danger);
    }
</style>