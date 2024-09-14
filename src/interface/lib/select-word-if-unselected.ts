import type { Editor } from "@tiptap/core";

// if textIsSelected only the selection will be de-/marked. if no selection the whole word will be de-/marked
export function selectWordIfUnselected(editor: Editor) {
    const { state, commands } = editor;

    // Get the current selection
    const { from, to } = state.selection;
    const textIsSelected = from !== to;
    if (textIsSelected) return;

    // Get the text of the document
    const docText = state.doc.textContent;

    // Find the start of the current word
    let start = from;
    while (start > 0 && !/\s/.test(docText[start - 1] as string)) {
        start--;
    }

    // Find the end of the current word
    let end = from;
    while (end < docText.length && !/\s/.test(docText[end] as string)) {
        end++;
    }

    // Update the selection to select the current word
    commands.setTextSelection({ from: start + 1, to: end + 1 });
}
