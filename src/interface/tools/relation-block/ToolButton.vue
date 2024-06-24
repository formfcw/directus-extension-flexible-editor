<template>
    <v-menu
        class="first"
        show-arrow
        placement="bottom-start"
        :fullHeight="true"
    >
        <template #activator="{ toggle }">
            <ToolButton
                :title
                :icon
                :action="toggle"
                :disabled
                :active
            />
        </template>
        <v-list>
            <v-list-item
                v-for="availableCollection of allowedCollections"
                :key="availableCollection.collection"
                clickable
                @click="createItem(availableCollection.collection)"
                :active="isActive(availableCollection.collection)"
                :aria-pressed="isActive(availableCollection.collection)"
                :disabled
            >
                <v-list-item-icon>
                    <v-icon :name="availableCollection.icon" />
                </v-list-item-icon>
                <v-list-item-content>
                    <v-text-overflow :text="availableCollection.name" />
                </v-list-item-content>
            </v-list-item>
        </v-list>
    </v-menu>

    <drawer-item
        v-model:active="editModalActive"
        :disabled="drawerDisabled"
        :collection="relationInfo!.junctionCollection.collection"
        :primary-key="currentlyEditing || '+'"
        :related-primary-key="relatedPrimaryKey || '+'"
        :junction-field="relationInfo!.junctionField.field"
        :edits="editsAtStart"
        :circular-field="relationInfo!.reverseJunctionField.field"
        @input="stageEdits"
    />
</template>



<script setup lang="ts">
    import { inject } from 'vue';
    import ToolButton from "../../components/ToolButton.vue";
    import type { CustomToolButtonProps, RelationReference } from '../../types';

    const props = defineProps<CustomToolButtonProps>();

    const { editModalActive, disabled: drawerDisabled, relationInfo, allowedCollections, currentlyEditing, relatedPrimaryKey, editsAtStart, stageEdits, createItem }: RelationReference = inject('m2aRelation')!;

    function isActive(collection: string) {
        return props.editor.isActive('relation-block', { collection })
    }
</script>



<style scoped>
    .v-list-item.active {
        --v-list-item-icon-color: var(--theme--foreground-subdued, var(--foreground-subdued)) !important;
    }
    /* TODO: [Stage 2] Remove this hack! Puts Relation Block menu to the front. */
    .first {
        order: -1;
    }
</style>