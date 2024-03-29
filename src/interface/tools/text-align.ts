// https://tiptap.dev/api/extensions/text-align
import TextAlign from "@tiptap/extension-text-align";
import customMessages from "../i18n/custom-messages";
import type { Editor } from "@tiptap/core";
import type { Tool } from "../types";

const textAlignOptions = ["left", "center", "right", "justify"];

export const textAlignTools = textAlignOptions.map((alignment) => ({
    key: `align_${alignment}`,
    name: (customMessages.tools as any)[`align_${alignment}`],
    icon: `format_align_${alignment}`,
    extension: [
        TextAlign.configure({ types: ["heading", "paragraph", "codeBlock"] }),
    ],
    action: (editor: Editor) =>
        editor.chain().focus().setTextAlign(alignment).run(),
    disabled: (editor: Editor) =>
        !editor.can().chain().focus().setTextAlign(alignment).run(),
    active: (editor: Editor) =>
        editor.isActive("textStyle", { textAlign: alignment }),
})) as Tool[];
