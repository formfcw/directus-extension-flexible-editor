// https://tiptap.dev/api/marks/superscript

import Superscript from "@tiptap/extension-superscript";
import { defineTool, extendMarkRangeIfUnselected } from "../lib";
import customMessages from "../i18n/custom-messages";
import type { Editor } from "@tiptap/core";

export default defineTool({
    key: "superscript",
    name: customMessages.tools.superscript,
    icon: "superscript",
    extension: [Superscript],
    shortcut: ["meta", "."],
    action: (editor: Editor) =>
        extendMarkRangeIfUnselected(editor, "superscript").toggleSuperscript().run(),
    disabled: (editor: Editor) =>
        !editor.can().chain().focus().toggleSuperscript().run(),
    active: (editor: Editor) => editor.isActive("superscript"),
});
