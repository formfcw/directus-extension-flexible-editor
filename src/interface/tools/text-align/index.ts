// interface/tools/text-align.ts

import TextAlign from "@tiptap/extension-text-align";
import { defineTool } from "../../lib";
import customMessages from "../../i18n/custom-messages";
import type { Editor } from "@tiptap/core";
import ToolButton from "./ToolButton.vue";

export default defineTool({
    key: "textAlign",
    name: customMessages.tools.text_align,
    icon: "format_align_left",
    extension: [
        (selection) =>
            TextAlign.configure({
                types: selection?.filter((extension) =>
                    ["heading", "paragraph", "codeBlock"].includes(extension)
                ),
            }),
    ],
    toolbarButton: ToolButton,
    action: (editor: Editor, alignment: string) => {
        editor.chain().focus().setTextAlign(alignment).run();
    },
    disabled: (editor: Editor) =>
        !editor.can().chain().focus().setTextAlign("left").run(),
    disabledInSingleLineMode: true,
    active: (editor: Editor) => {
        const alignments = ["left", "center", "right", "justify"];
        return alignments.some((alignment) =>
            editor.isActive({ textAlign: alignment })
        );
    },
});
