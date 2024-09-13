import type { Editor } from "@tiptap/core";

// If textIsSelected || isAtEndOfLine || siblingCharIsSpace, only the selection is deselected. If there is no selection, the entire mark is deselected.
export function extendMarkRangeIfUnselected(editor: Editor, mark: string) {
    const { from, to, $anchor } = editor.view.state.selection;
    const doc = editor.view.state.doc;

    const textIsSelected = from !== to;
    const isAtEndOfLine = $anchor.pos === $anchor.end();
    const siblingCharIsSpace =
        doc.textBetween(from, from + 1, undefined, " ") === " " ||
        doc.textBetween(from - 1, from, undefined, " ") === " ";

    const chain = editor.chain().focus();

    return textIsSelected || isAtEndOfLine || siblingCharIsSpace
        ? chain
        : chain.extendMarkRange(mark);
}
