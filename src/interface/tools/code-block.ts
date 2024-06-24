// https://tiptap.dev/api/nodes/code-block

import CodeBlock from "@tiptap/extension-code-block";
import { defineTool } from "../lib";
import customMessages from "../i18n/custom-messages";
import type { Editor } from "@tiptap/core";

export default defineTool({
    key: "codeBlock",
    name: customMessages.tools.code_block,
    extension: [CodeBlock],
    groups: ["format"],
    shortcut: ["meta", "alt", "C"],
    action: (editor: Editor) => editor.chain().focus().toggleCodeBlock().run(),
    disabled: (editor: Editor) =>
        !editor.can().chain().focus().toggleCodeBlock().run(),
    active: (editor: Editor) => editor.isActive("codeBlock"),
});
