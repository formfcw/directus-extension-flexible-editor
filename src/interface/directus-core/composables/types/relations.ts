// Extracted from https://github.com/directus/directus/blob/main/app/src/composables/use-relation-m2m.ts

import type { Field, Relation } from "@directus/types";
import type { Collection } from "../../types/collections";

export type RelationM2M = {
    relation: Relation;
    relatedCollection: Collection;
    relatedPrimaryKeyField: Field;
    junctionCollection: Collection;
    junctionPrimaryKeyField: Field;
    junctionField: Field;
    reverseJunctionField: Field;
    junction: Relation;
    sortField?: string;
    type: "m2m";
};

export type RelationO2M = {
    relation: Relation;
    relatedCollection: Collection;
    relatedPrimaryKeyField: Field;
    reverseJunctionField: Field;
    sortField?: string;
    type: "o2m";
};
