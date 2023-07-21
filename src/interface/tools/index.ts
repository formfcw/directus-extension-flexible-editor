// NOTE: [guide] Add a `Tool` by creating a new file in this directory, importing it and adding it to the `tools: Tool[]` array below! If you import a tiptap extension inside the `Tool`, make sure to add it to /display/extensions.ts as well!

import heading from "./heading";
import history from "./history";
import relationBlock from "./relation-block";
import paragraph from "./paragraph";
import codeBlock from "./code-block";
import bold from "./bold";
import italic from "./italic";
import strike from "./strike";
import code from "./code";
import link from "./link";
import hardBreak from "./hard-break";
import horizontalRule from "./horizontal-rule";
import bulletList from "./bullet-list";
import orderedList from "./ordered-list";
import blockquote from "./blockquote";
import type { AnyExtension } from "@tiptap/core";
import type { Tool, ToolSelection, InterfaceOption } from "../types/tool";

const tools: Tool[] = [
    relationBlock,
    paragraph,
    codeBlock,
    heading(1),
    heading(2),
    heading(3),
    heading(4),
    heading(5),
    heading(6),
    bold,
    italic,
    strike,
    code,
    link.add,
    link.remove,
    link.auto,
    hardBreak,
    horizontalRule,
    bulletList,
    orderedList,
    blockquote,
    history.undo,
    history.redo,
];

export const selectedTools = (selection: ToolSelection) =>
    tools.filter(({ key }) => selection.indexOf(key) >= 0);

export const toolsExtensions = (selection: ToolSelection): AnyExtension[] => {
    const toolsExtensions: AnyExtension[] = [];
    const uniqueNames: string[] = [];

    selectedTools(selection).forEach(({ extension }) =>
        extension.forEach((item) => {
            const extensionItem =
                typeof item === "function" ? item(selection) : item;
            const extensionNotExists =
                uniqueNames.indexOf(extensionItem.name) < 0;

            if (extensionNotExists) {
                uniqueNames.push(extensionItem.name);
                toolsExtensions.push(extensionItem);
            }
        })
    );

    return toolsExtensions;
};

const optionalTools: Tool[] = tools.filter((tool) => !tool.excludeFromOptions);

export const interfaceOptions: InterfaceOption[] = optionalTools.map(
    ({ key, name }) => ({ text: name, value: key })
);

export const interfaceOptionsDefault: string[] = optionalTools.map(
    ({ key }) => key
);

export const relationBlockTool: Tool | undefined = tools.find(
    ({ key }) => key === "relation-block"
);
