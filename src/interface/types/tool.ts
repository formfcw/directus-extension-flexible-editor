import type { Component } from "vue";
import type { Editor, AnyExtension } from "@tiptap/core";

export type ToolSelection = string[];

type ExtensionFunction = (selection: ToolSelection) => AnyExtension;

export type Tool = {
    key: string;
    name: string;
    icon?: string;
    display?: string;
    excludeFromOptions?: boolean;
    excludeFromToolbar?: boolean;
    extension: Array<AnyExtension | ExtensionFunction>;
    groups?: string[];
    shortcut?: string[];
    toolbarButton?: Component;
    action?: (editor: Editor, attrs?: any) => void;
    disabled?: (editor: Editor) => void;
    active?: (editor: Editor) => void;
};

export type ToolButtonProps = {
    title: string;
    icon: string | boolean;
    display: string | boolean;
    action: Tool["action"];
    shortcut: Tool["shortcut"];
    active: boolean;
    disabled: boolean;
    editor: Editor;
};

export type LinkAttributes = { href: string; target?: string | null };

export type InterfaceOption = { text: string; value: string };

export type Dialog = {
    component: Component;
    get: () => void;
    set: (attrs: LinkAttributes) => void;
    unset: () => void;
};
