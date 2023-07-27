<template>
    <RenderNodes
        v-if="content"
        :content="content"
        :serializers="serializers"
        :componentSerializers="componentSerializers"
    />
</template>



<script setup lang="ts">
    import { Node, Mark } from "@tiptap/core";
    import RenderNodes from "tiptap-render-view/vue"
    import extensions from '../../shared/extensions'
    import type { VueRelationBlockSerializers, VueComponentSerializers, JSONContent, Extensions } from "./types"

    const props = defineProps<{
        content: JSONContent;
        serializers?: Extensions;
        componentSerializers?: VueComponentSerializers;
        relationBlocks?: VueRelationBlockSerializers;
    }>();

    const serializers = props.serializers ?? extensions ?? [];

    const relationBlockSerializer =
        Node.create({
            name: 'relation-block',
            renderHTML({ node, HTMLAttributes }) {
                if (props.relationBlocks) {
                    for (const { collection, component } of props.relationBlocks) {
                        if (HTMLAttributes.collection == collection)
                            return [component, HTMLAttributes, 0] as any;
                    }
                }

                return [node.type, HTMLAttributes, 0] as any;
            }
        });

    serializers.push(relationBlockSerializer);
</script>