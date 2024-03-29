// interface/tools/text-align.ts

import TextAlign from "@tiptap/extension-text-align";
import customMessages from "../i18n/custom-messages";
import type { Editor } from "@tiptap/core";
import type { Tool } from "../types";
import ToolButtonTextAlign from "../components/ToolButtonTextAlign.vue";

export default {
    key: "textAlign",
    name: customMessages.tools.text_align,
    icon: "format_align_left",
    extension: [TextAlign.configure({ types: ["heading", "paragraph", "codeBlock"] })],
    toolbarButton: ToolButtonTextAlign,
    action: (editor: Editor, alignment: string) => {
        editor.chain().focus().setTextAlign(alignment).run();
    },
    disabled: (editor: Editor) => !editor.can().chain().focus().setTextAlign('left').run(),
    disabledInSingleLineMode: true,
    active: (editor: Editor) => {
        const alignments = ['left', 'center', 'right', 'justify'];
        return alignments.some(alignment => editor.isActive({ textAlign: alignment }));
    },
} as Tool;
