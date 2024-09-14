export type RelationBlockSerializers<T> = {
    collection: string;
    component: T;
}[];

import type { RelationNodeAttrs } from "../shared/types";
import type { JSONContent } from "tiptap-render-view";
export type RelationBlockProps = RelationNodeAttrs & {
    data?: JSONContent | null;
};
