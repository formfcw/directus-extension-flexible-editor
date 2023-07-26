<template>
    <v-menu
        show-arrow
        placement="bottom-start"
        :fullHeight="true"
    >
        <template #activator="{ toggle }">
            <ToolButton
                :title="relationBlockTool!.name"
                :icon="relationBlockTool!.icon"
                :action="toggle"
                :disabled="relationBlockToolsDisabled"
            />
        </template>
        <v-list>
            <!-- TODO: [improve] active, pressed, disabled check -->
            <v-list-item
                v-for="availableCollection of allowedCollections"
                :key="availableCollection.collection"
                clickable
                @click="createItem(availableCollection.collection)"
                :active="relationBlockTool!.active?.(editor)"
                :aria-pressed="relationBlockTool!.active?.(editor)"
                :disabled="relationBlockTool!.disabled?.(editor)"
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

    <Teleport to="body">
        <drawer-item
            v-model:active="editModalActive"
            :disabled="disabled"
            :collection="relationInfo!.junctionCollection.collection"
            :primary-key="currentlyEditing || '+'"
            :related-primary-key="relatedPrimaryKey || '+'"
            :junction-field="relationInfo!.junctionField.field"
            :edits="editsAtStart"
            :circular-field="relationInfo!.reverseJunctionField.field"
            @input="stageEdits"
        />
    </Teleport>
</template>



<script setup lang="ts">
    import { computed, inject } from 'vue';
    import ToolButton from './ToolButton.vue';
    import { relationBlockTool } from '../tools'
    import type { Editor } from '@tiptap/vue-3';
    import type { RelationReference } from '../types';


    // Props
    interface Props { editor: Editor }
    const props = defineProps<Props>();


    // TODO: [improve] block tools disabled
    const relationBlockToolsDisabled = computed(() => false);


    const { editModalActive, disabled, relationInfo, allowedCollections, currentlyEditing, relatedPrimaryKey, editsAtStart, stageEdits, createItem }: RelationReference = inject('m2aRelation')!;
</script>