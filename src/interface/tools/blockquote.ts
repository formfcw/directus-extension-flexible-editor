// https://tiptap.dev/api/nodes/blockquote

import Blockquote from "@tiptap/extension-blockquote";
import customMessages from "../i18n/custom-messages";
import type { Editor } from "@tiptap/core";
import type { Tool } from "../types/tool";

export default {
    key: "blockquote",
    name: customMessages.tools.blockquote,
    icon: "format_quote",
    extension: [Blockquote],
    shortcut: ["meta", "shift", "B"],
    action: (editor: Editor) => editor.chain().focus().toggleBlockquote().run(),
    disabled: (editor: Editor) =>
        !editor.can().chain().focus().toggleBlockquote().run(),
    active: (editor: Editor) => editor.isActive("blockquote"),
} as Tool;
