import type { Editor } from "@tiptap/core";

// if textIsSelected only the selection will be de-/marked. if no selection the whole word will be de-/marked
export function extendMarkRangeIfUnselected(editor: Editor, mark: string) {
    const { from, to } = editor.view.state.selection;
    const textIsSelected = from !== to;
    const chain = editor.chain().focus();
    return textIsSelected ? chain : chain.extendMarkRange(mark);
}
