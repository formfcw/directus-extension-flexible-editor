// NOTE: [guide] Add a `Tool` by creating a new file in this directory, importing it and adding it to the `tools: Tool[]` array below! If you import a tiptap extension that also renders content, make sure to add it to /shared/extensions.ts as well!

import heading from "./heading";
import history from "./history";
import relationBlock from "./relation-block";
import relationInlineBlock from "./relation-inline-block";
import paragraph from "./paragraph";
import codeBlock from "./code-block";
import bold from "./bold";
import italic from "./italic";
import strike from "./strike";
import code from "./code";
import subscript from "./subscript";
import superscript from "./superscript";
import link from "./link";
import relationMark from "./relation-mark";
import hardBreak from "./hard-break";
import horizontalRule from "./horizontal-rule";
import textAlign from "./text-align";
import bulletList from "./bullet-list";
import orderedList from "./ordered-list";
import blockquote from "./blockquote";
import table from "./table";
import fullscreen from "./fullscreen";
import type { AnyExtension } from "@tiptap/core";
import type { Tool, ToolSelection, InterfaceOption } from "../types";

const tools: Tool[] = [
    relationBlock,
    relationInlineBlock,
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
    subscript,
    superscript,
    link.add,
    link.remove,
    link.auto,
    relationMark,
    hardBreak,
    horizontalRule,
    textAlign,
    bulletList,
    orderedList,
    blockquote,
    table,
    history.undo,
    history.redo,
    fullscreen,
];

export const selectedTools = (
    selection: ToolSelection,
    includeRelationNodes = false
) =>
    tools.filter(
        ({ key }) =>
            selection.indexOf(key) >= 0 ||
            (includeRelationNodes &&
                [
                    "relation-block",
                    "relation-inline-block",
                    "relation-mark",
                ].indexOf(key) >= 0)
    );

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
