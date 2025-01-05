// TODO: [Stage 2][store] This persists across other entries. So if you navigate to another item (without refreshing the page!) the store data still exists
// TODO: [Stage 2][store] Refactor this store, so that there is a local store/memory for each editor field instead.
// TODO: [Stage 2][store] Additionally an init store/memory could be used to remove unused items at initialization time — maybe this store/memory will be removed after init. An other approach would be to make a collection-wide-store that holds a reference to each editor field store/memory.
// TODO: [Stage 2][store] On Copy/Cut we push the local store/memory of the editor field to a clipboard-store/memory so that we can paste store-items to different collections or fields …

// This stores all items even if they are deleted in order to provide Cut & Paste feature

import { v4 as uuidv4 } from "uuid";
import { cloneDeep, isEqual } from "lodash";
import { ref } from "vue";
import type { Ref } from "vue";
import type { UUID, RelationReference } from "../types";
import type { Item, PrimaryKey } from "@directus/types";

type EditorField = UUID | null;

export type M2AStoreItem = {
    nodeId: UUID;
    field: EditorField;
    currentItem: boolean;
    new: boolean;
    active: boolean;
    edits: boolean | Item;
    item: Item;
    duplicationWarning?: boolean;
};

// global state, created in module scope
const state: Ref<M2AStoreItem[]> = ref([]);
const initialized = ref(false);
const initializedFetchedItems: Ref<Item[]> = ref([]);

export const useM2aStore = () => ({
    state,

    initialized(fetchedItems: Item[]) {
        if (!isEqual(fetchedItems, initializedFetchedItems.value)) {
            initialized.value = false;
            initializedFetchedItems.value = fetchedItems;
        }

        return initialized.value;
    },

    init(fetchedItems: Item[], junctionPrimaryKeyField: PrimaryKey) {
        initialized.value = true;

        fetchedItems.map((item: Item) => {
            const nodeId = item[junctionPrimaryKeyField];
            const blockState = {
                nodeId,
                field: null,
                currentItem: true,
                new: false,
                active: true,
                edits: false,
                item,
            };
            const existingIndex = state.value.findIndex(
                (item) => item.nodeId === nodeId
            );

            if (existingIndex !== -1) {
                state.value[existingIndex] = blockState;
            } else {
                state.value.push(blockState);
            }
        });
    },

    reset(editorNodeIds: UUID[], field: EditorField) {
        state.value.map((item) => {
            const itemInEditor = editorNodeIds.indexOf(item.nodeId) >= 0;

            if (itemInEditor) {
                item.active = true;
                item.currentItem = true;
            } else if (item.field == field) {
                item.active = false;
                item.currentItem = false;
            }

            return item;
        });
    },

    setEditorFields(editorNodeIds: UUID[], field: EditorField) {
        state.value.map((item) => {
            const itemInEditor = editorNodeIds.indexOf(item.nodeId) >= 0;

            if (itemInEditor) item.field = field;

            return item;
        });
    },

    create(
        item: Item,
        junctionPrimaryKeyField: PrimaryKey,
        field: EditorField
    ) {
        state.value.push({
            nodeId: item[junctionPrimaryKeyField],
            field,
            currentItem: true,
            new: true,
            active: true,
            edits: false,
            item,
        });
    },

    update(item: Item, junctionPrimaryKeyField: PrimaryKey) {
        const storeItemIndex = state.value.findIndex(
            (storeItem) => storeItem.nodeId === item[junctionPrimaryKeyField]
        );

        if (storeItemIndex === -1) return;

        if (state.value[storeItemIndex]!.new) {
            state.value[storeItemIndex]!.item = item;
        } else {
            state.value[storeItemIndex]!.edits = item;
        }
    },

    deactivateUnusedItems(existingNodeIds: UUID[], field: EditorField): UUID[] {
        const inactiveNodeIds: UUID[] = [];

        state.value = state.value.map((item) => {
            if (!item.active) return item;

            // Three cases for `item.field`: null (no editor), same field (isSameEditor) or other field (isOtherEditor)

            const isSameEditor = item.field === field;
            // TODO: [Stage 2][store] Using the following line, ensures that M2A items from other editors are deleted as well, if they don’t have a field value set in the state. We uncomment it here, so that items of hidden fields are not accidentally deleted. In Stage 2 this is maybe obsolete, because we won’t share state between editors.
            // const isOtherEditor = !isSameEditor && item.field !== null;
            const isOtherEditor = !isSameEditor;

            if (isOtherEditor) return item;

            if (isSameEditor) {
                const itemExistsInEditor = existingNodeIds.some(
                    (nodeId) => nodeId === item.nodeId
                );
                if (itemExistsInEditor) return item;
            }

            inactiveNodeIds.push(item.nodeId);
            item.active = false;

            return item;
        });

        return inactiveNodeIds;
    },

    getItem(nodeId: UUID) {
        return state.value.find((item) => item.nodeId === nodeId);
    },

    itemExists(nodeId: UUID) {
        return this.getItem(nodeId) ? true : false;
    },

    itemIsActive(nodeId: UUID) {
        return this.getItem(nodeId)?.active;
    },

    activateItem(nodeId: UUID) {
        this.getItem(nodeId)!.active = true;
    },

    itemIsNew(nodeId: UUID) {
        return this.getItem(nodeId)?.new;
    },

    itemFromDifferentEditor(nodeId: UUID, field: EditorField) {
        return this.getItem(nodeId)?.field !== field;
    },

    itemFromDifferentItem(nodeId: UUID) {
        return !this.getItem(nodeId)?.currentItem;
    },

    setField(nodeId: UUID, field: EditorField) {
        this.getItem(nodeId)!.field = field;
    },

    duplicateItem(
        originalNodeId: UUID,
        {
            duplicationFieldsSchema,
            cloneItemByDuplicationFields,
            addCreateUpdateDeleteProps,
            mergeItemWithEdits,
            junctionPrimaryKeyField,
        }: RelationReference
    ) {
        const storeItem: M2AStoreItem = this.getItem(originalNodeId)!;
        const nodeId = uuidv4();
        const duplicate: M2AStoreItem = cloneDeep({
            ...storeItem,
            currentItem: true,
            active: true,
            new: true,
            nodeId,
        });

        if (!storeItem.new) {
            addCreateUpdateDeleteProps(duplicate.item);

            const existingItemHasNewEdits = duplicate.edits !== false;

            if (existingItemHasNewEdits) {
                // prevent overwriting the editor values
                // duplicate.edits.editor = duplicate.item.editor;

                // TODO: [duplication warning] solve duplication
                const warning = { duplication: false };

                mergeItemWithEdits(
                    duplicate.item,
                    duplicate.edits,
                    // TODO: [duplication warning] solve duplication
                    warning
                );

                // TODO: [duplication warning] solve duplication
                duplicate.duplicationWarning = warning.duplication;
            }

            duplicate.item = cloneItemByDuplicationFields(
                duplicate.item,
                duplicationFieldsSchema
            );

            // duplicated items act like new ones, so we can get rid of any edits
            duplicate.edits = false;
        }

        duplicate.item[junctionPrimaryKeyField] = nodeId;

        state.value.push(duplicate);

        return nodeId;
    },
});
