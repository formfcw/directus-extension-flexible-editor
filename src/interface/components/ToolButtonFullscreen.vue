<template>
    <ToolButton
        :title="t(`tools.fullscreen`)"
        :icon="icon"
        :action="toggleFullscreen"
        :active="fullscreen"
        :disabled="disabled"
    />
</template>

<script setup lang="ts">
    import { inject, computed, type Ref } from 'vue'
    import ToolButton from "./ToolButton.vue";
    import { useI18n } from "vue-i18n";
    import { useI18nFallback } from "../composables/use-i18n-fallback";
    import type { CustomToolButtonProps } from "../types";

    const props = defineProps<CustomToolButtonProps>();

    const { t } = useI18nFallback(useI18n());

    const fullscreen = inject('fullscreen') as Ref;

    function toggleFullscreen() {
        fullscreen.value = !fullscreen.value;
        props.editor.chain().focus();
    }

    const icon = computed(() => fullscreen.value ? 'fullscreen_exit' : 'fullscreen');
</script>
