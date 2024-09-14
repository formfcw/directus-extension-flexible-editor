// NOTE: [wording] There are relation blocks and relation marks, but both of them are relation nodes

// TODO: [Stage 2][_main changes] (1.) Every editor instance needs its own m2a field and m2a junction. (2.) Every editor has its own store — no shared store anymore! (3.) Rewrite Duplication for broader use cases. When coping to a different editor: for new ones use the clipboard api; for existing fetch from the api; for edited merge/do both.

// TODO: [Stage 2][duplication] Add warning: Never set duplication values for a nested Flexible Editor field

// TODO: [Stage 2][relation marks] There is a slot in the drawer component to add custom buttons. This could be useful for relation marks in order to remove it.

import { defineInterface, useStores } from "@directus/extensions-sdk";
import component from "./interface.vue";
import { interfaceOptions, interfaceOptionsDefault } from "./tools";
import customMessages from "./i18n/custom-messages";

export default defineInterface({
    id: "flexible-editor-interface",
    name: "Flexible Editor",
    icon: "description",
    description: customMessages.extension_description,
    component,
    types: ["json"],
    // NOTE: We can’t use `localTypes: ["m2a"]`, because the generated junction collection won’t have an `id` of `uuid`, and we don’t want the relation-nodes to be required
    // localTypes: ["m2a"],
    group: "standard",
    recommendedDisplays: ["flexible-editor-display"],
    options: ({ collection, $state }: any) => {
        const relationReferenceOptions = useRelationReferenceOptions();

        return [
            ...relationReferenceOptions,
            {
                field: "placeholder",
                name: "$t:placeholder",
                meta: {
                    interface: "system-input-translated-string",
                    options: {
                        placeholder: "$t:enter_a_placeholder",
                    },
                },
            },
            {
                field: "tools",
                name: customMessages.tools_title,
                type: "json",
                schema: {
                    default_value: interfaceOptionsDefault,
                },
                meta: {
                    width: "full",
                    interface: "select-multiple-dropdown",
                    options: {
                        choices: interfaceOptions,
                    },
                },
            },
            {
                field: "toolbarMode",
                name: customMessages.toolbar_mode.title,
                type: "string",
                meta: {
                    width: "half",
                    interface: "select-dropdown",
                    options: {
                        choices: [
                            {
                                text: customMessages.toolbar_mode.static,
                                value: "static",
                            },
                            {
                                text: customMessages.toolbar_mode.sticky,
                                value: "sticky",
                            },
                            {
                                text: customMessages.toolbar_mode.floating,
                                value: "floating",
                            },
                        ],
                    },
                },
                schema: {
                    default_value: "static",
                },
            },
            {
                field: "displayFormat",
                name: customMessages.formats_appearance,
                type: "boolean",
                meta: {
                    width: "half",
                    interface: "boolean",
                    options: {
                        label: customMessages.formats_as_button,
                    },
                },
                schema: {
                    default_value: false,
                },
            },
            {
                field: "inputMode",
                name: customMessages.input_mode.title,
                type: "string",
                meta: {
                    width: "half",
                    interface: "select-dropdown",
                    options: {
                        choices: [
                            {
                                text: customMessages.input_mode.multi,
                                value: "multi",
                            },
                            {
                                text: customMessages.input_mode.single,
                                value: "single",
                            },
                        ],
                    },
                },
                schema: {
                    default_value: "multi",
                },
            },
            {
                field: "editorHeight",
                name: customMessages.editor_height.title,
                type: "string",
                meta: {
                    width: "half",
                    interface: "select-dropdown",
                    options: {
                        choices: [
                            {
                                text: customMessages.editor_height
                                    .grow_till_overflow,
                                value: "height-grow-till-overflow",
                            },
                            {
                                text: customMessages.editor_height.grow,
                                value: "height-grow",
                            },
                            {
                                text: customMessages.editor_height.fixed,
                                value: "height-fixed",
                            },
                        ],
                    },
                },
                schema: {
                    default_value: "height-grow-till-overflow",
                },
            },
            {
                field: "font",
                name: "$t:font",
                type: "string",
                meta: {
                    width: "half",
                    interface: "select-dropdown",
                    options: {
                        choices: [
                            {
                                text: "$t:sans_serif",
                                value: "sans-serif",
                            },
                            {
                                text: "$t:monospace",
                                value: "monospace",
                            },
                            {
                                text: "$t:serif",
                                value: "serif",
                            },
                        ],
                    },
                },
                schema: {
                    default_value: "sans-serif",
                },
            },
            {
                field: "spellcheck",
                name: customMessages.spellcheck,
                type: "boolean",
                meta: {
                    width: "half",
                    interface: "boolean",
                },
                schema: {
                    default_value: false,
                },
            },
        ];

        function useRelationReferenceOptions() {
            const relationNodes = getRelatedAnyCollections();

            const options: Record<string, any>[] = [
                {
                    field: "m2aField",
                    type: "string",
                    name: customMessages.m2a_field,
                    meta: {
                        width: relationNodes ? "half" : "full",
                        interface: "system-field",
                        options: {
                            collectionName: collection,
                            typeAllowList: ["alias"],
                            allowNone: true,
                        },
                        note: "$t:optional",
                    },
                },
            ];

            if (relationNodes) {
                options.push(
                    ...[
                        {
                            field: "relation-blocks",
                            type: "json",
                            name: customMessages.relation_nodes.blocks,
                            schema: {
                                default_value: relationNodes.defaults,
                            },
                            meta: {
                                width: "half",
                                interface: "select-multiple-dropdown",
                                options: {
                                    choices: relationNodes.options,
                                    allowNone: true,
                                },
                            },
                        },
                        {
                            field: "relation-inline-blocks",
                            type: "json",
                            name: customMessages.relation_nodes.inline_blocks,
                            meta: {
                                width: "half",
                                interface: "select-multiple-dropdown",
                                options: {
                                    choices: relationNodes.options,
                                    allowNone: true,
                                },
                            },
                        },
                        {
                            field: "relation-marks",
                            type: "json",
                            name: customMessages.relation_nodes.marks,
                            meta: {
                                width: "half",
                                interface: "select-multiple-dropdown",
                                options: {
                                    choices: relationNodes.options,
                                    allowNone: true,
                                },
                            },
                        },
                    ]
                );
            } else {
                options.unshift({
                    field: "warning",
                    type: "alias",
                    meta: {
                        width: "full",
                        interface: "presentation-notice",
                        options: {
                            color: "warning",
                            icon: "warning",
                            text: customMessages.invalid_m2a_field,
                        },
                        hidden: true,
                        conditions: [
                            {
                                rule: {
                                    _and: [{ m2aField: { _nnull: true } }],
                                },
                                hidden: false,
                            },
                        ],
                    },
                });
            }

            return options;

            function getRelatedAnyCollections() {
                const m2aField = $state?.field?.meta?.options?.m2aField;
                if (!m2aField) return;

                const { useRelationsStore, useCollectionsStore } = useStores();
                if (!useRelationsStore || !useCollectionsStore) return;

                const relationStore = useRelationsStore();
                const m2aRelations = relationStore.getRelationsForField(
                    collection,
                    m2aField
                );

                if (!m2aRelations.length) return;

                const relationNodesValues = m2aRelations.find(
                    (item: any) => item.meta?.one_allowed_collections?.length
                )?.meta?.one_allowed_collections;

                if (!relationNodesValues.length) return;

                const collectionsStore = useCollectionsStore();
                collectionsStore.collection;

                const relationNodesOptions = collectionsStore.collections
                    .filter((item: any) =>
                        relationNodesValues.includes(item.collection)
                    )
                    .map((item: any) => ({
                        text: item.name,
                        value: item.collection,
                    }));

                if (!relationNodesOptions.length) return;

                return {
                    defaults: relationNodesValues,
                    options: relationNodesOptions,
                };
            }
        }
    },
    preview: `<svg width="156" height="96" viewBox="0 0 156 96" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M132 16H24C21.2386 16 19 18.2386 19 21V75C19 77.7614 21.2386 80 24 80H132C134.761 80 137 77.7614 137 75V21C137 18.2386 134.761 16 132 16Z" stroke="var(--theme--primary, var(--primary))" stroke-width="2"/>
    <path d="M32 23H28C26.8954 23 26 23.8954 26 25V29C26 30.1046 26.8954 31 28 31H32C33.1046 31 34 30.1046 34 29V25C34 23.8954 33.1046 23 32 23Z" fill="var(--theme--primary, var(--primary))"/>
    <path d="M44 23H40C38.8954 23 38 23.8954 38 25V29C38 30.1046 38.8954 31 40 31H44C45.1046 31 46 30.1046 46 29V25C46 23.8954 45.1046 23 44 23Z" fill="var(--theme--primary, var(--primary))" fill-opacity="0.25"/>
    <path d="M56 23H52C50.8954 23 50 23.8954 50 25V29C50 30.1046 50.8954 31 52 31H56C57.1046 31 58 30.1046 58 29V25C58 23.8954 57.1046 23 56 23Z" fill="var(--theme--primary, var(--primary))" fill-opacity="0.25"/>
    <path d="M68 23H64C62.8954 23 62 23.8954 62 25V29C62 30.1046 62.8954 31 64 31H68C69.1046 31 70 30.1046 70 29V25C70 23.8954 69.1046 23 68 23Z" fill="var(--theme--primary, var(--primary))" fill-opacity="0.25"/>
    <path d="M80 23H76C74.8954 23 74 23.8954 74 25V29C74 30.1046 74.8954 31 76 31H80C81.1046 31 82 30.1046 82 29V25C82 23.8954 81.1046 23 80 23Z" fill="var(--theme--primary, var(--primary))" fill-opacity="0.25"/>
    <path d="M92 23H88C86.8954 23 86 23.8954 86 25V29C86 30.1046 86.8954 31 88 31H92C93.1046 31 94 30.1046 94 29V25C94 23.8954 93.1046 23 92 23Z" fill="var(--theme--primary, var(--primary))" fill-opacity="0.25"/>
    <rect x="60" y="37" width="60" height="4" rx="1" fill="var(--theme--primary, var(--primary))" fill-opacity="0.25"/>
    <rect x="27" y="47" width="102" height="16" rx="5" stroke="var(--theme--primary, var(--primary))" stroke-width="2"/>
    <path d="M42 53H34V54.3437H42V53ZM34 57H42V55.6563H34V57Z" fill="var(--theme--primary, var(--primary))"/>
    <path d="M121.104 58.1042H114.896V51.8958H118V51H114.896C114.396 51 114 51.3958 114 51.8958V58.1042C114 58.6042 114.396 59 114.896 59H121.104C121.604 59 122 58.6042 122 58.1042V55H121.104V58.1042ZM118.896 51V51.8958H120.479L116.125 56.25L116.75 56.875L121.104 52.5208V54.1042H122V51H118.896Z" fill="var(--theme--primary, var(--primary))"/>
    <rect x="48" y="53" width="30" height="4" rx="1" fill="var(--theme--primary, var(--primary))"/>
    <rect x="82" y="53" width="10" height="4" rx="1" fill="var(--theme--primary, var(--primary))"/>
    <rect x="26" y="69" width="60" height="4" rx="1" fill="var(--theme--primary, var(--primary))" fill-opacity="0.25"/>
    <rect x="26" y="37" width="30" height="4" rx="1" fill="var(--theme--primary, var(--primary))" fill-opacity="0.25"/>
    </svg>`,
});
