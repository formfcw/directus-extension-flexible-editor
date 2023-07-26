import { mergeAttributes, Node } from "@tiptap/core";
import { VueNodeViewRenderer } from "@tiptap/vue-3";
import RelationBlock from "../components/RelationBlock.vue";
import { RelationBlockAttrs } from "../types";

declare module "@tiptap/core" {
    interface Commands<ReturnType> {
        "relation-block": {
            setRelationBlock: (attrs?: RelationBlockAttrs) => ReturnType;
        };
    }
}

const tag = "relation-block";

export default Node.create({
    name: tag,
    group: "block",
    draggable: true,
    selectable: true,
    // Does not have any content
    atom: true,

    addAttributes() {
        return {
            id: { default: null },
            junction: { default: null },
            collection: { default: null },
        };
    },

    parseHTML() {
        return [{ tag }];
    },

    renderHTML({ HTMLAttributes }) {
        return [tag, mergeAttributes(HTMLAttributes)];
    },

    renderText({ node }) {
        // Used for the display
        return `[${node.attrs.collection}]${"\n"}`;
    },

    addNodeView() {
        return VueNodeViewRenderer(RelationBlock);
    },

    addCommands() {
        return {
            setRelationBlock:
                (
                    attrs = {
                        id: null,
                        junction: null,
                        collection: null,
                    }
                ) =>
                ({ commands }) => {
                    return commands.insertContent({ type: tag, attrs });
                },
        };
    },
});
