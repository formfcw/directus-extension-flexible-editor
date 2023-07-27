export type RelationBlockSerializers<T> = {
    collection: string;
    component: T;
}[];

import type { RelationBlockAttrs } from "../shared/types";
import type { JSONContent } from "tiptap-render-view";
export type RelationBlockProps = RelationBlockAttrs & {
    data?: JSONContent | null;
};
