<template>
    <div
        v-if="errors.length"
        class="errors"
    >
        <v-notice
            v-for="errorMsg in errors"
            type="warning"
        >
            <span>{{ t(errorMsg) }}</span>
        </v-notice>
    </div>
    <div
        v-else-if="editor"
        :class="{ disabled }"
        class="field"
    >
        <toolbar
            v-if="tools.length"
            :tools="selectedTools(tools)"
            :editor="editor"
            :display-format="displayFormat"
        ></toolbar>
        <editor-content
            :editor="editor"
            :spellcheck="spellcheck ? 'true' : 'false'"
            :class="{ [font]: true, [editorHeight]: true }"
            class="flexible-editor"
        />
    </div>
</template>



<script setup lang="ts">
    // Imports
    import { ref, toRef, watch, provide } from 'vue'
    import { useEditor, EditorContent } from '@tiptap/vue-3'
    import Toolbar from './components/Toolbar.vue'
    import Document from '@tiptap/extension-document'
    import Text from '@tiptap/extension-text'
    import Paragraph from '@tiptap/extension-paragraph'
    import Placeholder from '@tiptap/extension-placeholder'
    import Dropcursor from '@tiptap/extension-dropcursor'
    import Gapcursor from '@tiptap/extension-gapcursor'
    import RelationBlock from "./nodes/relation-block";
    import { toolsExtensions, interfaceOptionsDefault, selectedTools } from './tools'
    import { useSyncRelationNodes } from "./composables/use-sync-relation-nodes"
    import { useRelationReference } from './composables/use-relation-reference'
    // import { useM2aStore } from './composables/use-m2a-store'
    import { useI18n } from "vue-i18n";
    import { useI18nFallback } from './composables/use-i18n-fallback';
    import type { Ref } from 'vue';
    import type { PrimaryKey } from "@directus/types";
    import type { JSONContent } from "@tiptap/vue-3";


    // Props
    interface Props {
        value: JSONContent | null;
        disabled: boolean;
        m2aField: string | null;
        placeholder: string;
        tools: string[];
        displayFormat: boolean;
        font: string;
        spellcheck: boolean;
        editorHeight: "height-fixed" | "height-grow" | "height-grow-till-overflow";
        field: string | null;
        collection: string | null;
        primaryKey: string | number | null;
    }
    const props = withDefaults(defineProps<Props>(), {
        value: null,
        disabled: false,
        m2aField: null,
        placeholder: '',
        tools: () => interfaceOptionsDefault,
        displayFormat: false,
        font: "sans-serif",
        spellcheck: false,
        editorHeight: 'height-grow-till-overflow',
        field: null,
        collection: null,
        primaryKey: null,
    });


    // I18n
    const { t } = useI18nFallback(useI18n());


    // Emits
    const emit = defineEmits(['input', 'setFieldValue']);


    // TipTap Editor Setup
    const editor = useEditor({
        content: props.value,
        extensions: [
            Document,
            Text,
            Paragraph,
            Placeholder.configure({
                placeholder: props.placeholder,
            }),
            Dropcursor,
            Gapcursor,
            RelationBlock,
            ...toolsExtensions(props.tools)
        ],
        async onCreate({ editor }) {
            emit('input', await editor.getJSON());
        },
        async onUpdate({ editor }) {
            syncRelationNodes();
            emit('input', await editor.getJSON());
        },
    });
    watch(() => props.value, (value) => {
        const isSame = JSON.stringify(editor.value!.getJSON()) === JSON.stringify(value)
        if (isSame) return;
        editor.value!.commands.setContent(value, false);
    });
    watch(() => props.disabled, (disabled) =>
        editor.value!.setEditable(!disabled)
    );


    // Fallback function
    let syncRelationNodes = () => { };


    // Provide
    provide('m2aField', toRef(props, 'm2aField'));


    const errors = ref<string[]>([]);


    if (props.m2aField) {
        // use Relation Reference and provide the values
        const m2aRelation = useRelationReference({
            editorInstance: editor,
            m2aField: toRef(props, 'm2aField') as Ref<string>,
            editorField: toRef(props, 'field') as Ref<string>,
            itemCollection: toRef(props, 'collection') as Ref<string>,
            itemPrimaryKey: toRef(props, 'primaryKey') as Ref<PrimaryKey>,
            updateM2aField: (value) => emit("setFieldValue", { field: props.m2aField, value })
        });
        provide('m2aRelation', m2aRelation);

        errors.value = m2aRelation.errors.value;

        // sync relation nodes with M2A relation and M2A store
        const { initFetchedItems, syncRelationNodes: _syncRelationNodes } = useSyncRelationNodes({ m2aRelation, editor, editorField: props.field });
        syncRelationNodes = _syncRelationNodes;

        watch(m2aRelation.fetchedItems, initFetchedItems);
    }
</script>



<style scoped>
    .errors>div:not(:first-child) {
        margin-top: 8px;
    }

    /* Field */
    .field {
        background-color: var(--background-page);
        border: var(--border-width) solid var(--border-normal);
        border-radius: var(--border-radius);
    }

    .field:hover {
        border-color: var(--border-normal-alt);
    }

    .field:focus-within {
        border-color: var(--primary);
        box-shadow: 0 0 16px -8px var(--v-input-box-shadow-color-focus);
    }

    .disabled {
        color: var(--foreground-subdued);
        background-color: var(--background-subdued);
        border-color: var(--border-normal);
        pointer-events: none;
    }

    /* Fonts */
    .monospace {
        font-family: var(--family-monospace);
    }

    .serif {
        font-family: var(--family-serif);
    }

    .sans-serif {
        font-family: var(--family-sans-serif);
    }

    /* Editor */
    .field {
        --editor-lineheight: 1.6;
        /* --editor-height = --editor-lineheight * 7 */
        --editor-height: calc(11.2em + var(--input-padding) + var(--input-padding));
        --editor-overflow-height: calc(100vh - var(--header-bar-height) - var(--header-bar-height) - var(--form-vertical-gap) - var(--form-vertical-gap) - var(--input-padding) - var(--input-padding));
    }

    .flexible-editor {
        --editor-block-mt: 24px;
    }

    .flexible-editor {
        background-color: transparent;
    }

    /* Editor Size */
    .flexible-editor :deep(.ProseMirror) {
        line-height: var(--editor-lineheight);
        padding: var(--input-padding);
        overflow: auto;
    }

    .flexible-editor.height-fixed :deep(.ProseMirror) {
        height: var(--editor-height);
    }

    .flexible-editor.height-grow-till-overflow :deep(.ProseMirror),
    .flexible-editor.height-grow :deep(.ProseMirror) {
        min-height: var(--editor-height);
    }

    .flexible-editor.height-grow-till-overflow :deep(.ProseMirror) {
        max-height: var(--editor-overflow-height);
    }

    /* Editor Styles */
    .flexible-editor :deep(.ProseMirror blockquote > * ~ *),
    .flexible-editor :deep(.ProseMirror > * ~ *) {
        margin-top: var(--editor-block-mt);
    }

    .flexible-editor :deep(h1),
    .flexible-editor :deep(h2),
    .flexible-editor :deep(h3),
    .flexible-editor :deep(h4),
    .flexible-editor :deep(h5),
    .flexible-editor :deep(h6) {
        line-height: 1.4;
    }

    .flexible-editor :deep(h1) {
        font-size: 2.5em;
    }

    .flexible-editor :deep(h2) {
        font-size: 2.25em;
    }

    .flexible-editor :deep(h3) {
        font-size: 2em;
    }

    .flexible-editor :deep(h4) {
        font-size: 1.75em;
    }

    .flexible-editor :deep(h5) {
        font-size: 1.5em;
    }

    .flexible-editor :deep(h6) {
        font-size: 1.25em;
    }

    .flexible-editor :deep(hr) {
        color: transparent;
        background-color: var(--border-normal);
        height: 7px;
        border: 3px solid var(--background-page);
        border-left: none;
        border-right: none;
    }

    .flexible-editor :deep(hr.ProseMirror-selectednode) {
        border-color: var(--background-normal);
    }

    .flexible-editor :deep(blockquote) {
        border-left: var(--border-width) solid var(--border-normal);
        padding-left: var(--input-padding);
    }

    .flexible-editor :deep(strong) {
        font-weight: bold;
    }

    .flexible-editor :deep(a) {
        color: var(--primary);
        border-bottom: 1px solid var(--primary);
    }

    .flexible-editor :deep(code) {
        background-color: var(--background-normal);
        padding: 2px 4px;
        border-radius: var(--border-radius);
    }

    .flexible-editor :deep(pre) {
        background-color: var(--background-normal);
        padding: var(--input-padding);
        border-radius: var(--border-radius);
    }

    .flexible-editor :deep(ol),
    .flexible-editor :deep(ul) {
        padding-left: var(--input-padding);
    }

    /* Placeholder */
    .flexible-editor :deep(p.is-editor-empty:first-child::before) {
        color: var(--v-input-placeholder-color);
        content: attr(data-placeholder);
        float: left;
        height: 0;
        pointer-events: none;
    }

    /* Make gap cursor appear like a normal cursor */
    .flexible-editor :deep(.ProseMirror .ProseMirror-gapcursor) {
        position: relative;
        font-size: 1em;
        line-height: var(--editor-lineheight);
    }

    .flexible-editor :deep(.ProseMirror .ProseMirror-gapcursor:after) {
        position: absolute;
        top: auto;
        right: 0;
        z-index: 1;
        bottom: var(--editor-block-mt);
        display: block;
        width: 0;
        height: 1.1em;
        /* This works as long as every block the gapcursor is appended has a height of `--input-height` */
        height: var(--input-height);
        border-top: none;
        border-left: 1px solid black;
    }

    .flexible-editor :deep(.ProseMirror .ProseMirror-gapcursor:first-child:after) {
        right: auto;
        left: 0;
        bottom: auto;
        top: 0;
    }

    /* .flexible-editor :deep(.ProseMirror:not(.ProseMirror-focused) > .ProseMirror-gapcursor:first-of-type + *) */
    .flexible-editor :deep(.ProseMirror .ProseMirror-gapcursor:first-child + *),
    .flexible-editor :deep(.ProseMirror .ProseMirror-gapcursor:last-child) {
        margin-top: 0;
    }

    .flexible-editor :deep(.ProseMirror .ProseMirror-gapcursor:last-child:after) {
        bottom: 0;
    }
</style>



<style>
    /* not scoped */
    .prosemirror-dropcursor-block {
        background-color: var(--border-normal) !important;
    }
</style>