<template>
    <div>
        <p>Video URL<br />{{ data.video_url }}</p>
    </div>
</template>

<script setup lang="ts">
    import { defineProps } from 'vue'
    import type { RelationNodeProps } from 'directus-extension-flexible-editor/content'

    defineProps<{
        id: RelationNodeProps['id']
        junction: RelationNodeProps['junction']
        collection: RelationNodeProps['collection']
        data?: RelationNodeProps['data']
    }>()
</script>

<style scoped>
    div {
        background: black;
        color: white;
        position: relative;
        padding-bottom: 56.25%;
        height: 0;
    }

    div>p {
        position: absolute;
        top: 50%;
        transform: translate(0, -50%);
        width: 100%;
        text-align: center;
    }
</style>
