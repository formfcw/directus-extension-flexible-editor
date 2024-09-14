import extensions from "../../shared/extensions";
import RelationBlock from "../interface/tools/relation-block/node-extension";
import RelationInlineBlock from "../interface/tools/relation-inline-block/node-extension";
import RelationMark from "../interface/tools/relation-mark/node-extension";

export default [
    ...extensions,
    RelationBlock,
    RelationInlineBlock,
    RelationMark,
];
