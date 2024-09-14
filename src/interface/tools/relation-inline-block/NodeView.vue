<template>
    <node-view v-bind="{ ...$props, inline: true }" />
</template>



<script setup lang="ts">
    import NodeView from '../relation-block/NodeView.vue';
</script>
