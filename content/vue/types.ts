export type * from "tiptap-render-view/vue";

import type { Component } from "vue";

export type * from "../types";

import type { RelationBlockSerializers } from "../types";
export type VueRelationBlockSerializers = RelationBlockSerializers<Component>;
