// https://tiptap.dev/api/marks/strike

import Strike from "@tiptap/extension-strike";
import customMessages from "../i18n/custom-messages";
import { defineTool, extendMarkRangeIfUnselected } from "../lib";
import type { Editor } from "@tiptap/core";

export default defineTool({
    key: "strike",
    name: customMessages.tools.strike,
    icon: "format_strikethrough",
    extension: [Strike],
    shortcut: ["meta", "shift", "X"],
    action: (editor: Editor) =>
        extendMarkRangeIfUnselected(editor, "strike").toggleStrike().run(),
    disabled: (editor: Editor) =>
        !editor.can().chain().focus().toggleStrike().run(),
    active: (editor: Editor) => editor.isActive("strike"),
});
