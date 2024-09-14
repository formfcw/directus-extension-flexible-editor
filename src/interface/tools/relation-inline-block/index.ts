import { defineTool } from "../../lib";
import type { Editor } from "@tiptap/core";
import type { RelationNodeAttrs } from "../../types";

export default defineTool({
    // Custom
    key: "relation-inline-block",
    // name won’t be used
    name: "relation-inline-block",
    excludeFromOptions: true,
    // Already imported
    extension: [],
    // Rendered through relation-block
    excludeFromToolbar: true,
    action: (editor: Editor, attrs: RelationNodeAttrs) => {
        focusAfterSelectionIfNotEmpty();
        editor.chain().focus().setRelationInlineBlock(attrs).run();
        focusAfterSelectionIfNotEmpty();

        function focusAfterSelectionIfNotEmpty() {
            // We need this workaround to prevent selecting the relation block after inserting it, if the editor content was empty (https://github.com/ueberdosis/tiptap/issues/3355)
            if (!editor.view.state.selection.empty) {
                editor.chain().focus(editor.view.state.selection.to).run();
            }
        }
    },
    disabled: (editor: Editor) =>
        !editor.can().chain().focus().setRelationBlock().run(),
    active: (editor: Editor) => editor.isActive("relation-inline-block"),
});
