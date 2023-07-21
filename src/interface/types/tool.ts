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
    action?: (editor: Editor, attrs?: any) => void;
    disabled?: (editor: Editor) => void;
    active?: (editor: Editor) => void;
};

export type LinkAttributes = { href: string; target?: string | null };

export type InterfaceOption = { text: string; value: string };

export type Dialog = {
    component: Component;
    get: () => void;
    set: (attrs: LinkAttributes) => void;
    unset: () => void;
};
