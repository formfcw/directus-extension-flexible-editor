// Based on https://github.com/directus/directus/blob/main/app/src/utils/add-related-primary-key-to-fields.ts

// [START] different from original
// import { useFieldsStore } from '@/stores/fields';
import { useStores } from "@directus/extensions-sdk";
// [END] different from original

/**
 * Adds the primary key field for any passed relational dot-notation field to the array of fields.
 * Useful for cases where you need to fetch a single piece of nested relational data, but also need
 * access to its primary key.
 *
 * @param currentCollection - Current root collection
 * @param fields - Array of (dot-notation) fields you want to augment
 *
 * @example
 * const collection = 'articles';
 * const fields = ['title', 'user.name'];
 *
 * addRelatedPrimaryKeyToFields(collection, fields);
 * // => ['title', 'user.name', 'user.id'];
 */
export function addRelatedPrimaryKeyToFields(
    currentCollection: string,
    fields: string[]
): string[] {
    if (!fields?.length) return [];

    // [START] different from original
    const { useFieldsStore } = useStores();
    // [END] different from original

    const fieldsStore = useFieldsStore();

    const sanitizedFields: string[] = [];

    for (const fieldName of fields) {
        sanitizedFields.push(fieldName);

        if (!fieldName.includes(".")) continue;
        const fieldParts = fieldName.split(".");

        const field = fieldsStore.getField(currentCollection, fieldName);
        if (!field) continue;

        const primaryKeyField = fieldsStore.getPrimaryKeyFieldForCollection(
            field.collection
        );

        const fieldToInclude =
            primaryKeyField &&
            fieldParts.slice(0, -1).concat(primaryKeyField.field).join(".");

        if (fieldToInclude && !sanitizedFields.includes(fieldToInclude)) {
            sanitizedFields.push(fieldToInclude);
        }
    }

    return sanitizedFields;
}
