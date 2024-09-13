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
    disabledInSingleLineMode?: boolean;
    active?: (editor: Editor) => void;
};

export type ToolButtonProps = {
    title: string;
    icon: string | boolean;
    display: string | boolean;
    action: (attrs?: any) => void;
    shortcut: Tool["shortcut"];
    active: boolean;
    disabled: boolean;
};

export type CustomToolButtonProps = ToolButtonProps & { editor: Editor };

export type InterfaceOption = { text: string; value: string };

export type ToolbarMode = "static" | "sticky" | "floating";
