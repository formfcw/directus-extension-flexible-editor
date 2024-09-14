<template>
    <node-view-wrapper :class="inline ? 'relation-inline-block' : 'relation-block'">
        <v-skeleton-loader
            v-if="loading"
            :type="inline ? 'text' : 'block-list-item'"
        />

        <div
            v-else-if="element && hasAllowedCollection(element)"
            @click="editItem(element)"
            @mousedown="onMousedown()"
            class="v-list-item link block clickable"
            :class="{ selected: selected && editor.isFocused }"
        >
            <v-icon
                data-drag-handle
                class="drag-handle"
                name="drag_handle"
                draggable="true"
                left
                @click.stop
                :small="inline"
            />
            <duplication-warning :node-id="node.attrs.id"></duplication-warning>
            <span
                v-if="!inline"
                class="collection"
            >{{ getCollectionName(element) }}:</span>
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
                :small="inline"
            />
        </div>

        <template v-else>
            <v-notice
                v-if="!inline"
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

            <div
                v-else
                class="inline-warning"
            >
                <v-icon
                    name="warning"
                    small
                />
                <span>{{ t('related_item_missing') }}</span>
                <v-icon
                    class="clear-icon"
                    name="delete"
                    @click.stop="deleteNode"
                    small
                />
            </div>
        </template>
    </node-view-wrapper>
</template>



<script setup lang="ts">
    // nodeViewProps: https://github.com/ueberdosis/tiptap/blob/develop/docs/guide/node-views/vue.md#all-available-props
    import { computed, inject } from 'vue';
    import { NodeViewWrapper } from '@tiptap/vue-3'
    import { useI18n } from "vue-i18n";
    import { useI18nFallback } from '../../composables/use-i18n-fallback'
    import DuplicationWarning from '../../components/DuplicationWarning.vue'
    import type { NodeViewProps } from '@tiptap/vue-3';
    import type { RelationReference } from '../../types';

    const props = defineProps<NodeViewProps & { inline?: boolean }>();

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
        color: var(--theme--foreground, var(--v-list-item-color));
        text-decoration: none;
        border-radius: var(--theme--border-radius, var(--v-list-item-border-radius));
    }

    .v-list-item.link {
        cursor: pointer;
        transition: var(--fast) var(--transition);
        transition-property: background-color, color;
        user-select: none;
    }

    .v-list-item.link:not(.disabled):not(.block):hover {
        color: var(--v-list-item-color-hover);
        background-color: var(--theme--form--field--input--background, var(--v-list-item-background-color-hover));
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
        --v-list-item-color: var(--theme--foreground-subdued, var(--foreground-subdued)) !important;
        cursor: not-allowed;
    }

    .v-list-item.block {
        --v-list-item-border-color: var(--theme--form--field--input--border-color, var(--border-subdued));
        --v-list-item-background-color: var(--theme--form--field--input--background, var(--background-page));
        --v-list-item-background-color-hover: var(--theme--form--field--input--background, var(--card-face-color));
        --v-icon-color: var(--theme--foreground-subdued, var(--foreground-subdued));

        position: relative;
        display: flex;
        height: var(--theme--form--field--input--height, var(--input-height));
        margin: 0;
        padding: 8px var(--theme--form--field--input--padding, var(--input-padding));
        background-color: var(--v-list-item-background-color);
        border: var(--theme--border-width, var(--border-width)) solid var(--v-list-item-border-color);
        border-radius: var(--theme--border-radius, var(--border-radius));
        transition: border-color var(--fast) var(--transition);
    }

    .v-list-item.block :slotted(.drag-handle) {
        cursor: grab;
    }

    .v-list-item.block :slotted(.drag-handle):hover {
        color: var(--theme--foreground, var(--foreground-normal));
    }

    .v-list-item.block :slotted(.drag-handle:active) {
        cursor: grabbing;
    }

    .v-list-item.block :slotted(.spacer) {
        flex-grow: 1;
    }

    .v-list-item.block.clickable:hover {
        background-color: var(--theme--form--field--input--background, var(--v-list-item-background-color-hover));
        border: var(--theme--border-width, var(--border-width)) solid var(--theme--form--field--input--border-color-hover, var(--v-list-item-border-color-hover));
    }

    .v-list-item.block.sortable-chosen {
        border: var(--theme--border-width, var(--border-width)) solid var(--theme--primary, var(--primary)) !important;
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
        --v-list-item-border-color: var(--theme--primary, var(--primary)) !important;
    }

    .spacer {
        flex-grow: 1;
    }

    .collection {
        color: var(--theme--primary, var(--primary));
        white-space: nowrap;
        margin-right: 1ch;
    }

    .drag-handle {
        cursor: move;
        cursor: grab;
    }

    .drag-handle:hover {
        color: var(--v-icon-color-hover);
    }

    .drag-handle:active {
        cursor: grabbing;
    }

    .clear-icon {
        --v-icon-color: var(--theme--foreground-subdued, var(--foreground-subdued));
        --v-icon-color-hover: var(--theme--danger, var(--danger));

        margin-right: 8px;
        color: var(--v-icon-color);
        transition: color var(--fast) var(--transition);
        cursor: pointer;
    }

    .clear-icon:hover {
        color: var(--v-icon-color-hover);
    }

    .v-list-item.selected {
        --v-list-item-border-color: var(--theme--form--field--input--border-color-hover, var(--v-list-item-border-color-hover));
    }

    /* Inline Block Overwrites */

    .relation-inline-block {
        --inline-block-height: calc(1em * var(--editor-lineheight));
        --v-list-item-max-width: 33%;
        --v-list-item-padding: 0 6px;

        position: relative;
        display: inline;
        vertical-align: baseline;
        /* for the cursor */
        margin-left: 1px;
    }

    .relation-inline-block .v-list-item {
        --v-list-item-background-color: var(--theme--primary-background);
        --v-list-item-background-color-hover: var(--v-list-item-background-color);
        --v-icon-color: var(--theme--primary-subdued);
        --v-icon-color-hover: var(--theme--primary);
        --theme--form--field--input--border-color: var(--theme--primary-subdued);

        position: relative;
        display: inline-flex;
        vertical-align: top;
        max-width: var(--v-list-item-max-width);
        height: var(--inline-block-height);
        padding: var(--v-list-item-padding);
        border: 0;
        overflow: visible;
        background: none;
        color: var(--theme--primary);
    }

    .relation-inline-block .v-list-item:before {
        content: "";
        position: absolute;
        top: -0.5px;
        left: 0;
        right: 0;
        bottom: -0.5px;
        border-radius: var(--theme--border-radius);
        background-color: var(--v-list-item-background-color);
    }

    .relation-inline-block:hover,
    .relation-inline-block.ProseMirror-selectednode {
        z-index: 1;
    }

    .relation-inline-block .v-list-item:hover:before,
    .relation-inline-block .v-list-item.selected:before {
        border: var(--theme--border-width) solid var(--theme--primary-subdued);
        top: calc(-1 * var(--theme--border-width));
        bottom: calc(-1 * var(--theme--border-width));
    }

    .relation-inline-block .v-list-item.block.clickable:hover {
        border: 0;
        background-color: var(--v-list-item-background-color-hover);
    }

    .relation-inline-block .clear-icon {
        --v-icon-color: var(--theme--primary-subdued);
        margin-right: 0;
    }

    .relation-inline-block .render-template {
        display: inline-block;
        padding-right: 4px;
    }

    .relation-inline-block .render-template>* {
        height: var(--inline-block-height);
        vertical-align: top;
    }

    .relation-inline-block .inline-warning {
        --v-icon-color: var(--theme--warning);

        display: inline-flex;
        align-items: center;
        vertical-align: top;
        gap: 4px;
        background: var(--theme--background-normal);
        padding: 0 6px;
        border-radius: var(--theme--border-radius);
    }

    .relation-inline-block .inline-warning .clear-icon {
        --v-icon-color: var(--theme--foreground-subdued);
    }

    .relation-inline-block .v-skeleton-loader {
        display: inline-block;
        width: 10%;
    }
</style>