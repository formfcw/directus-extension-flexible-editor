// Based on https://github.com/directus/directus/blob/main/app/src/types/collections.ts

import type {
    Collection as CollectionRaw,
    CollectionType,
} from "@directus/types";
import type { TranslateResult } from "vue-i18n";

export interface Collection extends CollectionRaw {
    name: string | TranslateResult;
    icon: string;
    type: CollectionType;
    color?: string | null;
}
