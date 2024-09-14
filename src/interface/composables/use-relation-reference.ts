// This file is mainly based on the scripts of https://github.com/directus/directus/blob/main/app/src/interfaces/list-m2a/list-m2a.vue

import { ref, computed, inject } from "vue";
import { get, isEmpty, cloneDeep, uniq } from "lodash";
import { useRelationM2A } from "../directus-core/composables/use-relation-m2a.js";
import { useRelationMultiple } from "../directus-core/composables/use-relation-multiple";
// TODO: [test] We do not need this, because the permission counts for the whole … Test it with permissions on the editor
// import { useRelationPermissionsM2A } from "../directus-core/composables/use-relation-permissions";
import { adjustFieldsForDisplays } from "../directus-core/utils/adjust-fields-for-displays";
import { getFieldsFromTemplate } from "@directus/extensions-sdk";
import { addRelatedPrimaryKeyToFields } from "../directus-core/utils/add-related-primary-key-to-fields";
import { v4 as uuidv4 } from "uuid";
import { useM2aStore } from "../composables/use-m2a-store";
import type { Ref, ComputedRef } from "vue";
import type { Collection } from "../directus-core/types/collections";
import type {
    RelationQueryMultiple,
    DisplayItem,
} from "../directus-core/composables/use-relation-multiple";
import type {
    UUID,
    RelationNodeType,
    RelationReference,
    RelationReferenceAttributes,
    RelationNodeAttrs,
} from "../types";

export function useRelationReference({
    m2aField,
    editorField,
    itemCollection,
    itemPrimaryKey,
    updateM2aField,
    relationBlocks,
    relationInlineBlocks,
    relationMarks,
}: RelationReferenceAttributes): RelationReference {
    const m2aStore = useM2aStore();

    // TODO: [improve][disabled] when the whole field is disabled … no?
    const disabled = ref(false);

    // Other values from this collection item
    const values: Ref = inject("values", ref({}));

    // Get/set the M2A reference
    const value = computed({
        get: () => values.value[m2aField.value],
        set: (val) => updateM2aField(val),
    });

    // Errors
    const errors: Ref<string[]> = ref([]);

    // Get relation info
    const { relationInfo } = useRelationM2A(itemCollection, m2aField);

    const junctionPrimaryKeyField =
        relationInfo.value!.junctionPrimaryKeyField.field;

    if (relationInfo.value!.junctionPrimaryKeyField.type !== "uuid")
        errors.value.push("errors.type_of_junction_primary_key_field_not_uuid");

    const junctionCollection =
        relationInfo.value!.junctionCollection.collection;

    const duplicationFields =
        relationInfo.value!.junctionCollection?.meta?.item_duplication_fields ??
        [];
    const duplicationFieldsSchema =
        _duplicationFieldsToObject(duplicationFields);

    if (!duplicationFields.length)
        errors.value.push("errors.duplication_fields_not_set");

    const {
        allowedCollections,
        allowedBlockCollections,
        allowedInlineBlockCollections,
        allowedMarkCollections,
    } = _useAllowedCollections();

    // [DIRECTUS_CORE] from m2a-field
    const templates: ComputedRef<Record<string, any>> = computed(() => {
        if (!relationInfo.value) return {};
        const templates: Record<string, string> = {};

        for (const collection of allowedCollections.value) {
            const primaryKeyField =
                relationInfo.value.relationPrimaryKeyFields[
                    collection.collection
                ];
            templates[collection.collection] =
                collection.meta?.display_template ||
                `{{${primaryKeyField?.field}}}`;
        }

        return templates;
    });

    // [DIRECTUS_CORE][!MODIFIED!] from m2a-field
    const fields = computed(() => {
        if (!relationInfo.value) return [];
        const fields: string[] = [];

        for (const collection of allowedCollections.value) {
            const displayFields: string[] = adjustFieldsForDisplays(
                getFieldsFromTemplate(templates.value[collection.collection]),
                collection.collection
            ).map(
                (field) =>
                    `${relationInfo.value?.junctionField.field}:${collection.collection}.${field}`
            );

            fields.push(
                ...addRelatedPrimaryKeyToFields(
                    collection.collection,
                    displayFields
                )
            );
        }

        // [!MODIFIED!] this is to get this fields in `fetchedItems`
        fields.push(...duplicationFields);
        return uniq(fields);
        // return fields;
    });

    // [DIRECTUS_CORE][!MODIFIED!] from m2a-field. `limit` needs to be -1, because we do not have pages in any case!
    const query = computed<RelationQueryMultiple>(() => ({
        fields: fields.value,
        limit: -1,
        page: 1,
    }));

    // [DIRECTUS_CORE] from m2a-field
    const {
        create,
        update,
        remove,
        // select,
        displayItems,
        // totalItemCount,
        loading,
        // selected,
        // fetchedSelectItems,
        fetchedItems,
        // useActions,
        cleanItem,
        isItemSelected,
        // isLocalItem,
        getItemEdits,
    } = useRelationMultiple(value, query, relationInfo, itemPrimaryKey);

    // [DIRECTUS_CORE][!MODIFIED!] from m2a-field
    const editModalActive: RelationReference["editModalActive"] = ref({
        relationBlock: false,
        relationInlineBlock: false,
        relationMark: false,
    });
    const currentlyEditing = ref<string | number | null>(null);
    const relatedPrimaryKey = ref<string | number | null>(null);
    // [!MODIFIED!] `editingCollection` not needed
    // const editingCollection = ref<string | null>(null);
    // [!MODIFIED!] `selectingFrom` not needed
    // const selectingFrom = ref<string | null>(null);
    const editsAtStart = ref<Record<string, any>>({});
    let newItem = false;

    /* TODO: [test] We do not need this, because the permission applies for the entire editor
    const { createAllowed, deleteAllowed, selectAllowed, updateAllowed } = useRelationPermissionsM2A(relationInfo);

    const createCollections = computed(() => {
        const info = relationInfo.value;
        if (!info) return [];

        return info.allowedCollections.filter((collection) => {
            return createAllowed.value[collection.collection];
        });
    });
    */

    return {
        errors,
        templates,
        editModalActive,
        disabled,
        relationInfo,
        allowedCollections,
        allowedBlockCollections,
        allowedInlineBlockCollections,
        allowedMarkCollections,
        currentlyEditing,
        relatedPrimaryKey,
        junctionPrimaryKeyField,
        editsAtStart,
        fetchedItems,
        displayItems,
        loading,
        duplicationFieldsSchema,
        create,
        createItem,
        update,
        editItem,
        stageEdits,
        remove,
        deleteItem,
        hasAllowedCollection,
        getCollectionName,
        findDisplayItem,
        addCreateUpdateDeleteProps,
        mergeItemWithEdits,
        cloneItemByDuplicationFields,
        // testvalue: value,
    };

    // [DIRECTUS_CORE][!MODIFIED!] from m2a-field
    function createItem(
        collection: string,
        type: RelationNodeType = "relationBlock"
    ) {
        if (!relationInfo.value) return;

        currentlyEditing.value = null;
        relatedPrimaryKey.value = null;

        editsAtStart.value = {
            [relationInfo.value.collectionField.field]: collection,
            [relationInfo.value.junctionField.field]: {},
        };

        newItem = true;
        // [!MODIFIED!] assign `type` and add `type` to function parameters
        editModalActive.value[type] = true;
    }

    // [DIRECTUS_CORE][!MODIFIED!][!MODIFIED!] from m2a-field
    function editItem(
        item: DisplayItem,
        type: RelationNodeType = "relationBlock"
    ) {
        if (!relationInfo.value) return;

        const relationPkField =
            relationInfo.value.relationPrimaryKeyFields[
                item[relationInfo.value.collectionField.field]
            ]?.field;

        const junctionField = relationInfo.value.junctionField.field;
        const junctionPkField =
            relationInfo.value.junctionPrimaryKeyField.field;

        newItem = false;

        editsAtStart.value = {
            ...getItemEdits(item),
            [relationInfo.value.collectionField.field]:
                item[relationInfo.value.collectionField.field],
        };

        // [!MODIFIED!] assign `type` and add `type` to function parameters
        editModalActive.value[type] = true;
        // [!MODIFIED!] `editingCollection` not needed
        // editingCollection.value = item[relationInfo.value.collectionField.field];

        if (item?.$type === "created" && !isItemSelected(item)) {
            currentlyEditing.value = null;
            relatedPrimaryKey.value = null;
            // [!MODIFIED!] `editingCollection` not needed
            // editingCollection.value = null;
        } else {
            if (!relationPkField) return;
            currentlyEditing.value = get(item, [junctionPkField], null);
            relatedPrimaryKey.value = get(
                item,
                [junctionField, relationPkField],
                null
            );
        }
    }

    // [DIRECTUS_CORE][!MODIFIED!] from m2a-field
    function stageEdits(
        item: Record<string, any>,
        insertNode: (attrs: RelationNodeAttrs) => void
    ) {
        if (isEmpty(item)) return;

        if (newItem) {
            const nodeId = uuidv4();

            insertNode({
                id: nodeId,
                junction: junctionCollection,
                collection: item.collection,
            });

            // Create M2A relation
            item[junctionPrimaryKeyField] = nodeId;
            create(item);

            // Add to M2A Store
            const cleanedItem = cloneDeep(cleanItem(item));
            m2aStore.create(
                cleanedItem,
                junctionPrimaryKeyField,
                editorField.value
            );
        } else {
            // Update M2A relation
            update(item);

            // Update M2A Store
            const cleanedItem = cloneDeep(cleanItem(item));
            m2aStore.update(cleanedItem, junctionPrimaryKeyField);
        }
    }

    // [DIRECTUS_CORE][!MODIFIED!] from m2a-field
    function deleteItem(item: DisplayItem) {
        // if (
        //     page.value === Math.ceil(totalItemCount.value / limit.value) &&
        //     page.value !== Math.ceil((totalItemCount.value - 1) / limit.value)
        // ) {
        //     page.value = Math.max(1, page.value - 1);
        // }

        remove(item);
    }

    // [DIRECTUS_CORE] from m2a-field
    function hasAllowedCollection(item: DisplayItem) {
        const info = relationInfo.value;
        if (!info) return false;
        return (
            allowedCollections.value.findIndex(
                (coll) =>
                    relationInfo &&
                    coll.collection === item[info.collectionField.field]
            ) !== -1
        );
    }

    // [DIRECTUS_CORE][!MODIFIED!] from m2a-field
    function getCollectionName(item: DisplayItem) {
        const info = relationInfo.value;
        if (!info) return false;

        const collection = allowedCollections.value.find(
            (coll) => coll.collection === item[info.collectionField.field]
        );

        // if (te(`collection_names_singular.${collection?.collection}`)) {
        //     return t(`collection_names_singular.${collection?.collection}`);
        // }

        // if (te(`collection_names_plural.${collection?.collection}`)) {
        //     return t(`collection_names_plural.${collection?.collection}`);
        // }

        return collection?.name;
    }

    function findDisplayItem(nodeId: UUID) {
        return displayItems.value.find(
            (displayItem) => displayItem[junctionPrimaryKeyField] === nodeId
        );
    }

    function addCreateUpdateDeleteProps(itemFields: any) {
        // TODO: [Stage 2][duplication] Only apply to fields, that are not JSON. Check by field type instead of `_objectNotProseMirror`. Only for relations! … Create lot’s of use cases!

        for (let fieldKey in itemFields) {
            const field = itemFields[fieldKey];

            if (Array.isArray(field)) {
                itemFields[fieldKey] = {
                    create: field.map((item) => {
                        addCreateUpdateDeleteProps(item);
                        return item;
                    }),
                    update: [],
                    delete: [],
                };
                continue;
            }

            if (
                _isObject(field) &&
                _objectHasProps(field) &&
                _objectNotProseMirror(field)
            )
                addCreateUpdateDeleteProps(field);
        }
    }

    // TODO: [Stage 2][flow chart] Place link to flow chart here
    function mergeItemWithEdits(
        itemFields: any,
        mergeFields: any,
        warning: { duplication: boolean }
    ) {
        for (let fieldKey in itemFields) {
            const field = itemFields[fieldKey];
            const mergeField = mergeFields?.[fieldKey];

            if (
                field?.hasOwnProperty("create") &&
                Array.isArray(field.create)
            ) {
                // TODO: [Stage 2][duplication] How do we know that it’s called `id`? could be a different name … get the primaryKey field of each relation
                const primaryKey = "id";
                const editsInclude = (mode: "create" | "delete" | "update") =>
                    mergeField &&
                    mergeField.hasOwnProperty(mode) &&
                    Array.isArray(mergeField[mode]) &&
                    mergeField[mode].length;

                if (editsInclude("create")) {
                    field.create.push(...mergeField.create);
                }

                if (editsInclude("delete")) {
                    const itemsToKeep = (item: any) =>
                        mergeField.delete.indexOf(item[primaryKey]) < 0;

                    // TODO: [duplication warning] solve duplication
                    const countBeforeDeletion = field.create.length;

                    field.create = field.create.filter(itemsToKeep);

                    // TODO: [duplication warning] solve duplication
                    if (countBeforeDeletion <= field.create.length)
                        warning.duplication = true;
                }

                if (editsInclude("update")) {
                    /* TODO: [Stage 2][duplication] This does not work for deep nested items, because in fetched data there is no ID for nested relations. Only duplicationFields are available, as well as other fields (have a look at `fields.value` above) 

                    So one approach could be to add id fields to the `fields.value` via the duplication_fields array. But what if it is not called id? There is a method `getRelationsForField` in the `relationStore` …

                    Another approach would be to use the api while copying
                    */

                    // TODO: [duplication warning] solve duplication
                    let countFieldsToMerge = 0;

                    field.create = field.create.map((item: any) => {
                        const fieldsToMerge = mergeField.update.find(
                            (mergeItem: any) =>
                                mergeItem.hasOwnProperty(primaryKey) &&
                                mergeItem[primaryKey] === item[primaryKey]
                        );

                        if (fieldsToMerge) {
                            mergeItemWithEdits(item, fieldsToMerge, warning);
                            countFieldsToMerge++;
                        }

                        return item;
                    });

                    // TODO: [duplication warning] solve duplication
                    if (countFieldsToMerge === 0) warning.duplication = true;
                }

                continue;
            }

            if (_isObject(field) && _objectHasProps(field)) {
                mergeItemWithEdits(field, mergeField, warning);
                continue;
            }

            if (mergeField) {
                itemFields[fieldKey] = mergeField;
            }
        }
    }

    function cloneItemByDuplicationFields(
        itemFields: any,
        duplicationFieldsSchema: any
    ) {
        const reducedFields: any = {};

        for (let fieldKey in itemFields) {
            const field = itemFields[fieldKey];
            const isCreateUpdateDelete =
                ["create", "update", "delete"].indexOf(fieldKey) >= 0 &&
                Array.isArray(field);

            if (isCreateUpdateDelete) {
                reducedFields[fieldKey] = field.map((item) =>
                    cloneItemByDuplicationFields(item, duplicationFieldsSchema)
                );
                continue;
            }

            const fieldInDuplicationSchema =
                duplicationFieldsSchema.hasOwnProperty(fieldKey);

            if (!fieldInDuplicationSchema) continue;

            const cloneChildAsIs = duplicationFieldsSchema[fieldKey] === null;

            if (cloneChildAsIs) {
                reducedFields[fieldKey] = field;
                continue;
            }

            reducedFields[fieldKey] = cloneItemByDuplicationFields(
                field,
                duplicationFieldsSchema[fieldKey]
            );
        }

        return reducedFields;
    }

    function _duplicationFieldsToObject(fields: string[]) {
        if (!fields || !fields.length) return {};

        const obj = {};
        const dotNotationToObject = (path: string, obj: any) => {
            // Based on https://stackoverflow.com/a/22985802
            const parts = path.split(".");
            let part: string | undefined;
            while ((part = parts.shift())) {
                const _parts: string[] = part.split(":");
                part = _parts[0] ?? "";
                if (parts.length < 1) obj[part] = null;
                else if (typeof obj[part] !== "object") obj[part] = {};
                obj = obj[part]; // update "pointer"
            }
        };

        fields.forEach((field) => dotNotationToObject(field, obj));

        return obj;
    }

    function _isObject(obj: unknown) {
        return typeof obj === "object" && !Array.isArray(obj) && obj !== null;
    }

    function _objectHasProps(obj: { [key: string]: unknown }) {
        return Object.keys(obj).length;
    }

    function _objectNotProseMirror(field: { [key: string]: unknown }) {
        if (!field.type && !field.content) return true;

        return field.type !== "doc";
    }

    function _useAllowedCollections() {
        // [DIRECTUS_CORE] from m2a-field
        const allowedCollections = computed(() => {
            if (!relationInfo.value) return [];
            return relationInfo.value.allowedCollections.filter(
                (collection) => collection.meta?.singleton !== true
            );
        });

        const allowedBlockCollections = computed(() =>
            allowedCollectionsByType(relationBlocks, true)
        );
        const allowedInlineBlockCollections = computed(() =>
            allowedCollectionsByType(relationInlineBlocks)
        );
        const allowedMarkCollections = computed(() =>
            allowedCollectionsByType(relationMarks)
        );

        return {
            allowedCollections,
            allowedBlockCollections,
            allowedInlineBlockCollections,
            allowedMarkCollections,
        };

        function allowedCollectionsByType(
            relationNodeType: Ref<Collection[] | null>,
            allOnDefault = false
        ) {
            if (allOnDefault && typeof relationNodeType.value === "undefined") {
                return allowedCollections.value;
            }

            if (!relationNodeType.value?.length) return [];

            return allowedCollections.value.filter((collection: any) =>
                relationNodeType.value!.includes(collection.collection)
            );
        }
    }
}
