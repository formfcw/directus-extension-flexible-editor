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

        const relationBlockNodes = ["relation-block", "relation-inline-block"];

        if (
            content.type &&
            relationBlockNodes.indexOf(content.type) >= 0 &&
            content.attrs?.id
        ) {
            const relatedNode = data.find(
                (node) => node[primaryKeyField] === content.attrs!.id
            );

            content.attrs.data = relatedNode?.[itemField];
        }

        if (content.type == "text" && content.marks?.length) {
            content.marks.map((mark) => {
                if (mark.type != "relation-mark" || !mark.attrs?.id)
                    return mark;

                const relatedNode = data.find(
                    (node) => node[primaryKeyField] === mark.attrs!.id
                );

                mark.attrs.data = relatedNode?.[itemField];

                return mark;
            });
        }

        content.content?.map(toContentWithInjectedData);

        return content;
    }
};
