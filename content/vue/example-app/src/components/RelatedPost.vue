<template>
    <a
        :href="data?.post.slug"
        :title="`id: ${data?.post.id}, slug: ${data?.post.slug}`"
    >
        <slot />
    </a>
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