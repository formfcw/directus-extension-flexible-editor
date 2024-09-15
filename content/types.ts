import type { RelationNodeAttrs } from "../shared/types";

export type RelationNodeSerializers<T> = {
    collection: string;
    component: T;
}[];
export type RelationNodeProps = RelationNodeAttrs & {
    data?: Record<string, any> | null;
};

// TODO: [Stage 2][deprecated] type RelationBlockSerializers & RelationBlockProps
export type RelationBlockSerializers<T> = RelationNodeSerializers<T>;
export type RelationBlockProps = RelationNodeProps;
