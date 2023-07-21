// https://tiptap.dev/api/marks/italic

import Italic from "@tiptap/extension-italic";
import customMessages from "../i18n/custom-messages";
import { extendMarkRangeIfUnselected } from "./utils";
import type { Editor } from "@tiptap/core";
import type { Tool } from "../types/tool";

export default {
    key: "italic",
    name: customMessages.tools.italic,
    icon: "format_italic",
    extension: [Italic],
    shortcut: ["meta", "I"],
    action: (editor: Editor) =>
        extendMarkRangeIfUnselected(editor, "italic").toggleItalic().run(),
    disabled: (editor) => !editor.can().chain().focus().toggleItalic().run(),
    active: (editor: Editor) => editor.isActive("italic"),
} as Tool;
