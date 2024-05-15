<template>
    <v-button
        @click="action"
        tabindex="-1"
        v-tooltip:[tooltipPlacement]="tooltip"
        :aria-label="title"
        :disabled="disabled"
        :aria-disabled="disabled"
        :aria-pressed="active"
        :class="{ 'is-active': active }"
        :icon="small"
        :small="small"
        :x-small="!small"
    >
        <template v-if="icon === false">{{ display ? display : title }}</template>
        <v-icon
            v-if="icon !== false"
            :name="icon"
        />
    </v-button>
</template>



<script setup lang="ts">
    // TODO: [Stage 2][improve] attribute bindings on <v-button> not on <button> but on parent element
    import { computed, inject, type Ref } from 'vue';
    import { translateShortcut } from '../directus-core/utils/translate-shortcut';
    import type { ToolButtonProps } from '../types';

    const props = withDefaults(defineProps<ToolButtonProps>(), {
        icon: false,
        display: false,
        shortcut: () => [],
        active: false,
        disabled: false,
    });

    const tooltip = computed(() => {
        if (!props.shortcut.length)
            return props.title;

        return `${props.title} (${translateShortcut(props.shortcut)})`;
    });

    const small = computed(() => props.icon || props.display);

    const fullscreen = inject('fullscreen') as Ref;
    const tooltipPlacement = computed(() => fullscreen.value ? 'bottom' : 'top');
</script>



<style scoped>
    .is-active :deep(.button:not(:disabled)) {
        color: var(--v-button-color-active);
        background-color: var(--v-button-background-color-active);
    }
</style>