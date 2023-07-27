<template>
    <dl>
        <template
            v-for="(item, key) in data.items"
            :key="key"
        >
            <dt>{{ item.term }}</dt>
            <dd>{{ item.definition }}</dd>
        </template>
    </dl>
</template>

<script setup lang="ts">
    import { defineProps } from 'vue'
    import type { RelationBlockProps } from 'directus-extension-flexible-editor/content'

    defineProps<{
        id: RelationBlockProps['id']
        junction: RelationBlockProps['junction']
        collection: RelationBlockProps['collection']
        data?: RelationBlockProps['data']
}>()
</script>
