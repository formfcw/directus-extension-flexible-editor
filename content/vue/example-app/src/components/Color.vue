<template>
    <div :style="{ backgroundColor: data?.name ?? 'black' }"></div>
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
        display: inline-block;
        vertical-align: top;
        width: 1em;
        height: 1em;
    }
</style>