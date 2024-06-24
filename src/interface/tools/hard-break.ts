// https://tiptap.dev/api/nodes/hard-break

import HardBreak from "@tiptap/extension-hard-break";
import { defineTool } from "../lib";
import customMessages from "../i18n/custom-messages";
import type { Editor } from "@tiptap/core";

export default defineTool({
    key: "hardBreak",
    name: customMessages.tools.hard_break,
    icon: "keyboard_return",
    extension: [HardBreak],
    shortcut: ["shift", "Enter"],
    action: (editor: Editor) => editor.chain().focus().setHardBreak().run(),
    disabled: (editor: Editor) =>
        !editor.can().chain().focus().setHardBreak().run(),
    disabledInSingleLineMode: true,
    active: () => false,
});
