<template>
    <span class="line-truncate">{{ plainText }}</span>
</template>



<script setup lang="ts">
    import { computed } from "vue";
    import { generateText } from "@tiptap/core";
    import extensions from './extensions';
    import type { JSONContent } from "@tiptap/vue-3";

    const props = withDefaults(
        defineProps<{ value: JSONContent | null }>(),
        { value: null }
    );

    const plainText = computed(() => {
        if (!props.value) return '';
        return generateText(props.value, extensions);
    });
</script>



<style scoped>
    .line-truncate {
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
    }
</style>
