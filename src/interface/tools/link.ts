// https://tiptap.dev/api/marks/link

import Link from "@tiptap/extension-link";
import customMessages from "../i18n/custom-messages";
import DialogLink from "../components/DialogLink.vue";
import type { Ref } from "vue";
import type { Editor } from "@tiptap/core";
import type { Tool, LinkAttributes, Dialog } from "../types/tool";

const add: Tool = {
    // https://tiptap.dev/api/marks/link
    key: "link",
    name: customMessages.tools.link,
    icon: "link",
    extension: [linkExtenstionConfig],
    action: (editor: Editor, { dialog }: { dialog: Ref<Dialog> }) => {
        dialog.value = {
            component: DialogLink,
            get: () => editor.getAttributes("link"),
            set: (attrs: LinkAttributes) =>
                editor
                    .chain()
                    .focus()
                    .extendMarkRange("link")
                    .setLink(attrs)
                    .run(),
            unset: () =>
                editor
                    .chain()
                    .focus()
                    .extendMarkRange("link")
                    .unsetLink()
                    .run(),
        };
    },
    disabled: (editor: Editor) =>
        !editor.can().chain().focus().toggleLink({ href: "" }).run(),
    active: (editor: Editor) => editor.isActive("link"),
};

const remove: Tool = {
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
};

const auto: Tool = {
    // If you want to use autolink without a link button
    key: "autolink",
    name: customMessages.tools.autolink,
    excludeFromToolbar: true,
    extension: [linkExtenstionConfig],
};

function linkExtenstionConfig(selection: string[]) {
    const autolink = selection.indexOf("autolink") >= 0;

    return Link.configure({
        autolink,
        linkOnPaste: true,
        openOnClick: false,
    });
}

export default { add, remove, auto };
