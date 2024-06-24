// https://tiptap.dev/api/marks/link

import Link from "@tiptap/extension-link";
import { defineTool } from "../../lib";
import customMessages from "../../i18n/custom-messages";
import AddButton from "./AddButton.vue";
import type { Editor } from "@tiptap/core";

const add = defineTool({
    // https://tiptap.dev/api/marks/link
    key: "link",
    name: customMessages.tools.link,
    icon: "link",
    extension: [linkExtenstionConfig],
    toolbarButton: AddButton,
    disabled: (editor: Editor) =>
        !editor.can().chain().focus().toggleLink({ href: "" }).run(),
    active: (editor: Editor) => editor.isActive("link"),
});

const remove = defineTool({
    // https://tiptap.dev/api/marks/link
    key: "removeLink",
    name: customMessages.tools.unlink,
    icon: "link_off",
    extension: [linkExtenstionConfig],
    action: (editor: Editor) => editor.chain().focus().unsetLink().run(),
    // keep toggleLink for `disabled`
    disabled: (editor: Editor) =>
        !editor.can().chain().focus().toggleLink({ href: "" }).run(),
    active: () => false,
});

const auto = defineTool({
    // If you want to use autolink without a link button
    key: "autolink",
    name: customMessages.tools.autolink,
    excludeFromToolbar: true,
    extension: [linkExtenstionConfig],
});

function linkExtenstionConfig(selection: string[]) {
    const autolink = selection.indexOf("autolink") >= 0;

    return Link.configure({
        autolink,
        linkOnPaste: true,
        openOnClick: false,
    });
}

export default { add, remove, auto };
