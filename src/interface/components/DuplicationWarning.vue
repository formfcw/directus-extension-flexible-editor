<template>
    <!-- TODO: [duplication warning] solve duplication -->
    <v-icon
        v-if="duplicationWarning"
        name="warning"
        class="warning"
        v-tooltip="t('duplication_warning')"
        left
        @click.stop
    />
</template>



<script setup lang="ts">
    // TODO: [duplication warning] solve duplication
    import { computed } from 'vue';
    import { useM2aStore } from "../composables/use-m2a-store";
    import { useI18n } from "vue-i18n";
    import { useI18nFallback } from '../composables/use-i18n-fallback'
    import type { UUID } from '../types';
    import type { M2AStoreItem } from '../composables/use-m2a-store';

    interface Props { nodeId: UUID }
    const props = defineProps<Props>();

    const { t } = useI18nFallback(useI18n());

    const m2aStore = useM2aStore();
    const duplicationWarning = computed(() => {
        const itemInStore = (item: M2AStoreItem) => item.nodeId === props.nodeId;
        const storeItem = m2aStore.state.value.find(itemInStore);
        return storeItem?.duplicationWarning ? true : false;
    });
</script>


<style scoped>
    .warning {
        --v-icon-color: var(--theme--warning, var(--warning));
    }

    .warning:hover {
        --v-icon-color: var(--theme--warning-accent, var(--warning-110));
    }
</style>