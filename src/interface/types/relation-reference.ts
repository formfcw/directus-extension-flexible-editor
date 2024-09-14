import type { Ref, ComputedRef } from "vue";
import type { JSONContent } from "@tiptap/vue-3";
import type { Item, PrimaryKey } from "@directus/types";
import type { RelationM2A } from "../directus-core/composables/use-relation-m2a.js";
import type { Collection } from "../directus-core/types/collections";
import type { DisplayItem } from "../directus-core/composables/use-relation-multiple";
import type { UUID } from "../types";
import type { RelationNodeAttrs } from "../../../shared/types";

export type RelationReferenceAttributes = {
    m2aField: Ref<string>;
    editorField: Ref<string>;
    itemCollection: Ref<string>;
    itemPrimaryKey: Ref<PrimaryKey>;
    updateM2aField: (value: JSONContent) => void;
    relationBlocks: Ref<Collection[] | null>;
    relationInlineBlocks: Ref<Collection[] | null>;
    relationMarks: Ref<Collection[] | null>;
};

export type RelationNodeType =
    | "relationBlock"
    | "relationInlineBlock"
    | "relationMark";

export type RelationReference = {
    errors: Ref<string[]>;
    templates: ComputedRef<Record<string, any>>;
    editModalActive: Ref<{
        relationBlock: boolean;
        relationInlineBlock: boolean;
        relationMark: boolean;
    }>;
    disabled: Ref<boolean>;
    relationInfo: ComputedRef<RelationM2A | undefined>;
    allowedCollections: ComputedRef<Collection[]>;
    allowedBlockCollections: ComputedRef<Collection[]>;
    allowedInlineBlockCollections: ComputedRef<Collection[]>;
    allowedMarkCollections: ComputedRef<Collection[]>;
    currentlyEditing: Ref<string | number | null>;
    relatedPrimaryKey: Ref<string | number | null>;
    junctionPrimaryKeyField: string;
    editsAtStart: Ref<Record<string, any>>;
    fetchedItems: Ref<Item[]>;
    displayItems: ComputedRef<DisplayItem[]>;
    loading: Ref<boolean>;
    duplicationFieldsSchema: Record<string, any>;
    create: (...items: Record<string, any>[]) => void;
    update: (...items: DisplayItem[]) => void;
    remove: (...items: DisplayItem[]) => void;
    createItem: (collection: string, type?: RelationNodeType) => void;
    editItem: (item: DisplayItem, type?: RelationNodeType) => void;
    stageEdits: (
        item: Record<string, any>,
        insertNode: (attrs: RelationNodeAttrs) => void
    ) => void;
    deleteItem: (item: DisplayItem) => void;
    hasAllowedCollection: (item: DisplayItem) => boolean;
    getCollectionName: (item: DisplayItem) => string | false | undefined;
    findDisplayItem: (nodeId: UUID) => DisplayItem | undefined;
    addCreateUpdateDeleteProps: (itemFields: any) => void;
    mergeItemWithEdits: (
        itemFields: any,
        mergeFields: any,
        warning: any
    ) => void;
    cloneItemByDuplicationFields: (
        itemFields: any,
        duplicationFieldsSchema: any
    ) => Record<string, any>;
};
