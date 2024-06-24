// https://tiptap.dev/api/nodes/horizontal-rule

import HorizontalRule from "@tiptap/extension-horizontal-rule";
import { defineTool } from "../lib";
import customMessages from "../i18n/custom-messages";
import type { Editor } from "@tiptap/core";

export default defineTool({
    key: "horizontalRule",
    name: customMessages.tools.hr,
    icon: "horizontal_rule",
    extension: [HorizontalRule],
    shortcut: [],
    action: (editor: Editor) =>
        editor.chain().focus().setHorizontalRule().run(),
    disabled: (editor: Editor) =>
        !editor.can().chain().focus().setHorizontalRule().run(),
    disabledInSingleLineMode: true,
    active: () => false,
});
