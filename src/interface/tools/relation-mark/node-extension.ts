import { mergeAttributes, Mark } from "@tiptap/core";
import messages from "../../i18n/custom-messages";
import type { RelationNodeAttrs } from "../../types";

declare module "@tiptap/core" {
    interface Commands<ReturnType> {
        "relation-mark": {
            setRelationMark: (attrs?: RelationNodeAttrs) => ReturnType;
            unsetRelationMark: () => ReturnType;
        };
    }
}

const tag = "a";
const name = "relation-mark";

export default Mark.create({
    name,
    priority: 1000,
    keepOnSplit: false,
    exitable: true,

    addAttributes() {
        return {
            id: { default: null },
            junction: { default: null },
            collection: { default: null },
            noRelatedItem: { default: null },
        };
    },

    parseHTML() {
        return [{ tag: `${tag}.${name}` }];
    },

    renderHTML({ HTMLAttributes }) {
        const attrs: Record<string, any> = { class: name };

        if (HTMLAttributes.noRelatedItem) {
            attrs.class += " related-item-missing";
            attrs.title = messages.related_item_missing;
        }

        return [tag, mergeAttributes(HTMLAttributes, attrs), 0];
    },

    addCommands() {
        return {
            setRelationMark:
                (
                    attrs = {
                        id: null,
                        junction: null,
                        collection: null,
                    }
                ) =>
                ({ chain }) => {
                    return chain().setMark(name, attrs).run();
                },
            unsetRelationMark:
                () =>
                ({ chain }) => {
                    return chain()
                        .unsetMark(name, { extendEmptyMarkRange: true })
                        .run();
                },
        };
    },
});
