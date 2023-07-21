// Based on https://github.com/directus/directus/blob/main/app/src/utils/adjust-fields-for-displays.ts

// [START] different from original
// import { useExtension } from "@/composables/use-extension";
import { useExtension } from "../composables/use-extension";
// import { useFieldsStore } from "@/stores/fields";
// import { Field } from '@directus/shared/types';
import type { Field } from "@directus/types";
import { useStores } from "@directus/extensions-sdk";
// [END] different from original
import { computed } from "vue";

export function adjustFieldsForDisplays(
    fields: readonly string[],
    parentCollection: string
): string[] {
    // [START] different from original
    const { useFieldsStore } = useStores();
    // [END] different from original

    const fieldsStore = useFieldsStore();

    const adjustedFields: string[] = fields
        .map((fieldKey) => {
            const field: Field | null = fieldsStore.getField(
                parentCollection,
                fieldKey
            );

            if (!field) return fieldKey;
            if (field.meta?.display === null) return fieldKey;

            const display = useExtension(
                "display",
                computed(() => field.meta?.display ?? null)
            );

            if (!display) return fieldKey;
            if (!display.value?.fields) return fieldKey;

            let fieldKeys: string[] | null = null;

            if (Array.isArray(display.value.fields)) {
                fieldKeys = display.value.fields.map(
                    (relatedFieldKey: string) =>
                        `${fieldKey}.${relatedFieldKey}`
                );
            }

            if (typeof display.value.fields === "function") {
                fieldKeys = display.value
                    .fields(field.meta?.display_options, {
                        collection: field.collection,
                        field: field.field,
                        type: field.type,
                    })
                    .map(
                        (relatedFieldKey: string) =>
                            `${fieldKey}.${relatedFieldKey}`
                    );
            }

            if (fieldKeys) {
                return fieldKeys.map((fieldKey) => {
                    /**
                     * This is for the special case where you want to show a thumbnail in a relation to
                     * directus_files. The thumbnail itself isn't a real field, but shows the thumbnail based
                     * on the other available fields (like ID, title, and type).
                     */
                    if (
                        fieldKey.includes("$thumbnail") &&
                        field.collection === "directus_files"
                    ) {
                        return fieldKey
                            .split(".")
                            .filter((part) => part !== "$thumbnail")
                            .join(".");
                    }

                    return fieldKey;
                });
            }

            return fieldKey;
        })
        .flat();

    return adjustedFields;
}
