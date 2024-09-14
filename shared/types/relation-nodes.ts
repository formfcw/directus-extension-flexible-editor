export type UUID = string;

export type RelationNodeAttrs = {
    id: UUID | null;
    junction: string | null;
    collection: string | null;
};
