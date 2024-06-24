// https://tiptap.dev/api/marks/bold

import Bold from "@tiptap/extension-bold";
import customMessages from "../i18n/custom-messages";
import { defineTool, extendMarkRangeIfUnselected } from "../lib";
import type { Editor } from "@tiptap/core";

export default defineTool({
    key: "bold",
    name: customMessages.tools.bold,
    icon: "format_bold",
    extension: [Bold],
    shortcut: ["meta", "B"],
    action: (editor: Editor) =>
        extendMarkRangeIfUnselected(editor, "bold").toggleBold().run(),
    disabled: (editor: Editor) =>
        !editor.can().chain().focus().toggleBold().run(),
    active: (editor: Editor) => editor.isActive("bold"),
});
