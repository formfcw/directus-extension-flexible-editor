// https://tiptap.dev/api/extensions/history

import History from "@tiptap/extension-history";
import { defineTool } from "../lib";
import customMessages from "../i18n/custom-messages";
import type { Editor } from "@tiptap/core";

const undo = defineTool({
    key: "undo",
    name: customMessages.tools.undo,
    icon: "undo",
    extension: [History],
    shortcut: ["meta", "Z"],
    action: (editor: Editor) => editor.chain().focus().undo().run(),
    disabled: (editor: Editor) => !editor.can().chain().focus().undo().run(),
    active: () => false,
});

const redo = defineTool({
    key: "redo",
    name: customMessages.tools.redo,
    icon: "redo",
    extension: [History],
    shortcut: ["meta", "shift", "Z"],
    action: (editor: Editor) => editor.chain().focus().redo().run(),
    disabled: (editor: Editor) => !editor.can().chain().focus().redo().run(),
    active: () => false,
});

export default { undo, redo };
