export type * from "tiptap-render-view/vue";
import type { Component } from "vue";
import type { RelationNodeSerializers } from "../types";

export type * from "../types";
export type VueRelationNodeSerializers = RelationNodeSerializers<Component>;

// TODO: [Stage 2][deprecated] type VueRelationBlockSerializers
export type VueRelationBlockSerializers = VueRelationNodeSerializers;
