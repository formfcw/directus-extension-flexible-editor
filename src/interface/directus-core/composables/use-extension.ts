// Based on https://github.com/directus/directus/blob/main/app/src/composables/use-extension.ts

import { Ref, computed, unref } from "vue";
import type {
    AppExtensionConfigs,
    AppExtensionType,
    HybridExtensionType,
    Plural,
} from "@directus/types";
// [START] different from original
// import { useExtensions } from "@/extensions";
import { useExtensions } from "@directus/extensions-sdk";
import { pluralize } from "@directus/utils";
// [END] different from original

export function useExtension<T extends AppExtensionType | HybridExtensionType>(
    type: T | Ref<T>,
    name: string | Ref<string | null>
): Ref<AppExtensionConfigs[Plural<T>][number] | null> {
    const extensions = useExtensions();

    return computed(() => {
        if (unref(name) === null) return null;
        return (
            (extensions[pluralize(unref(type))].value as any[]).find(
                ({ id }) => id === unref(name)
            ) ?? null
        );
    });
}
