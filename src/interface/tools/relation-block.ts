import customMessages from "../i18n/custom-messages";
import type { Editor } from "@tiptap/core";
import type { Tool } from "../types/tool";
import type { RelationBlockAttrs } from "../types/relation-nodes";

export default {
    // Custom
    key: "relation-block",
    name: customMessages.tools.relation_block,
    icon: "add",
    excludeFromOptions: true,
    excludeFromToolbar: true,
    // Already imported
    extension: [],
    action: (editor: Editor, attrs: RelationBlockAttrs) => {
        editor.chain().focus().setRelationBlock(attrs).run();

        // We need this workaround to prevent selecting the relation block after inserting it, if the editor content was empty (https://github.com/ueberdosis/tiptap/issues/3355)
        if (!editor.view.state.selection.empty) {
            editor
                .chain()
                .focus(editor.view.state.selection.to)
                // .insertContent({ type: "paragraph" }).focus()
                .run();
        }
    },
    disabled: (editor: Editor) =>
        !editor.can().chain().focus().setRelationBlock().run(),
    active: (editor: Editor) => editor.isActive("relation-block"),
} as Tool;
