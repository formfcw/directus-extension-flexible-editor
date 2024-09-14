import { defineTool, selectWordIfUnselected } from "../../lib";
import ToolButton from "./ToolButton.vue";
import type { Editor } from "@tiptap/core";
import type { RelationNodeAttrs } from "../../types";

export default defineTool({
    // Custom
    key: "relation-mark",
    // name won’t be used
    name: "relation-mark",
    excludeFromOptions: true,
    // Already imported
    extension: [],
    toolbarButton: ToolButton,
    action: (editor: Editor, attrs: RelationNodeAttrs) => {
        selectWordIfUnselected(editor);
        editor.chain().focus().setRelationMark(attrs).run();
    },
    disabled: (editor: Editor) =>
        !editor.can().chain().focus().setRelationMark().run(),
    active: (editor: Editor) => editor.isActive("relation-mark"),
});
