import { mergeAttributes, Node } from "@tiptap/core";
import { VueNodeViewRenderer } from "@tiptap/vue-3";
import NodeView from "./NodeView.vue";
import type { RelationNodeAttrs } from "../../types";

declare module "@tiptap/core" {
    interface Commands<ReturnType> {
        "relation-block": {
            setRelationBlock: (attrs?: RelationNodeAttrs) => ReturnType;
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
        return VueNodeViewRenderer(NodeView);
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
