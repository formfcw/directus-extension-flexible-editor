import type { Ref, ShallowRef, ComputedRef } from "vue";
import type { Editor, JSONContent } from "@tiptap/vue-3";
import type { Item, PrimaryKey } from "@directus/types";
import type { RelationM2A } from "../directus-core/composables/use-relation-m2a.js";
import type { Collection } from "../directus-core/types/collections";
import type { DisplayItem } from "../directus-core/composables/use-relation-multiple";
import type { UUID } from "../types";

export type RelationReferenceAttributes = {
    editorInstance: ShallowRef<Editor | undefined>;
    m2aField: Ref<string>;
    editorField: Ref<string>;
    itemCollection: Ref<string>;
    itemPrimaryKey: Ref<PrimaryKey>;
    updateM2aField: (value: JSONContent) => void;
};

export type RelationReference = {
    errors: Ref<string[]>;
    templates: ComputedRef<Record<string, any>>;
    editModalActive: Ref<boolean>;
    disabled: Ref<boolean>;
    relationInfo: ComputedRef<RelationM2A | undefined>;
    allowedCollections: ComputedRef<Collection[]>;
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
    createItem: (collection: string) => void;
    editItem: (item: DisplayItem) => void;
    stageEdits: (item: Record<string, any>) => void;
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
