import type { JSONContent } from "@tiptap/core";

type EditorNodes = Record<string, any>;

/**
 * @param primaryKeyField - The primary key field of the editor nodes junction collection (default: `id`)
 * @param itemField - The item field of the editor nodes junction collection (default: `item`)
 */
export default (
    data: EditorNodes[],
    content: JSONContent,
    primaryKeyField = "id",
    itemField = "item"
) => {
    return toContentWithInjectedData(content);

    function toContentWithInjectedData(content: JSONContent) {
        if (!content) return null;

        if (content.type == "relation-block" && content.attrs?.id) {
            const relatedNode = data.find(
                (node) => node[primaryKeyField] === content.attrs!.id
            );

            content.attrs.data = relatedNode?.[itemField];
        }

        content.content?.map(toContentWithInjectedData);

        return content;
    }
};
