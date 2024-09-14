import { useM2aStore } from "./use-m2a-store";

import type { ShallowRef } from "vue";
import type { RelationReference, UUID } from "../types";
import type { Editor } from "@tiptap/vue-3";
import type { Item } from "@directus/types";
import type { M2AStoreItem } from "./use-m2a-store";
import type { NodeWithPos } from "@tiptap/vue-3";
import {
    Node as ProseMirrorNodeOriginal,
    Attrs as ProseMirrorAttrs,
} from "@tiptap/pm/model";

type ProseMirrorNode = ProseMirrorNodeOriginal & {
    // remove readonly
    attrs: ProseMirrorAttrs;
};

type EditorNodes = NodeWithPos & {
    nodeId: UUID;
    mark: Record<string, any> | undefined;
    nodeIndex: number;
};

type SyncRelationNodesAttributes = {
    m2aRelation: RelationReference;
    editor: ShallowRef<Editor | undefined>;
    editorField: string | null;
};

export function useSyncRelationNodes({
    m2aRelation,
    editor,
    editorField,
}: SyncRelationNodesAttributes) {
    const m2aStore = useM2aStore();

    return {
        resetRelationNodes() {
            const editorNodeIds: UUID[] = _getExistingEditorNodes().map(
                ({ nodeId }) => nodeId
            );
            m2aStore.reset(editorNodeIds, editorField);
        },
        initFetchedItems,
        syncRelationNodes() {
            const editorNodes = _getExistingEditorNodes();
            syncRemovedNodes(editorNodes);
            syncInsertedNodes(editorNodes);
        },
    };

    function initFetchedItems(fetchedItems: Item[]) {
        if (!m2aStore.initialized(fetchedItems))
            m2aStore.init(fetchedItems, m2aRelation.junctionPrimaryKeyField);

        // First add all fetchedItems to M2A Store, then set the editor fields per editor
        const editorNodes = _getExistingEditorNodes();
        const editorNodeIds: UUID[] = editorNodes.map(({ nodeId }) => nodeId);

        m2aStore.setEditorFields(editorNodeIds, editorField);
        validateRelationMarks(editorNodes);
    }

    function validateRelationMarks(editorNodes: EditorNodes[]) {
        editorNodes.forEach(({ node, pos, nodeId, mark }) => {
            if (!mark) return;

            if (m2aRelation.findDisplayItem(nodeId)) return;

            _updateMarkAttrs(node, pos, {
                ...(mark.attrs ?? []),
                noRelatedItem: true,
            });
        });
    }

    function syncInsertedNodes(editorNodes: EditorNodes[]) {
        /*
            AI prompt: Create all possible combinations for the following sentence: COPY/CUT SAVED_NODE/NEW_NODE from SAVED_ITEM/NEW_ITEM and paste into SAME_FIELD/DIFFERENT_FIELD of SAME_ITEM/DIFFERENT_ITEM
            
            - COPY SAVED_NODE from SAVED_ITEM and paste into SAME_FIELD of SAME_ITEM
            - COPY SAVED_NODE from SAVED_ITEM and paste into SAME_FIELD of DIFFERENT_ITEM
            - COPY SAVED_NODE from SAVED_ITEM and paste into DIFFERENT_FIELD of SAME_ITEM
            - COPY SAVED_NODE from SAVED_ITEM and paste into DIFFERENT_FIELD of DIFFERENT_ITEM
            - CUT SAVED_NODE from SAVED_ITEM and paste into SAME_FIELD of SAME_ITEM
            - CUT SAVED_NODE from SAVED_ITEM and paste into SAME_FIELD of DIFFERENT_ITEM
            - CUT SAVED_NODE from SAVED_ITEM and paste into DIFFERENT_FIELD of SAME_ITEM
            - CUT SAVED_NODE from SAVED_ITEM and paste into DIFFERENT_FIELD of DIFFERENT_ITEM
            - COPY NEW_NODE from SAVED_ITEM and paste into SAME_FIELD of SAME_ITEM
            - COPY NEW_NODE from SAVED_ITEM and paste into SAME_FIELD of DIFFERENT_ITEM
            - COPY NEW_NODE from SAVED_ITEM and paste into DIFFERENT_FIELD of SAME_ITEM
            - COPY NEW_NODE from SAVED_ITEM and paste into DIFFERENT_FIELD of DIFFERENT_ITEM
            - COPY NEW_NODE from NEW_ITEM and paste into SAME_FIELD of SAME_ITEM
            - COPY NEW_NODE from NEW_ITEM and paste into SAME_FIELD of DIFFERENT_ITEM
            - COPY NEW_NODE from NEW_ITEM and paste into DIFFERENT_FIELD of SAME_ITEM
            - COPY NEW_NODE from NEW_ITEM and paste into DIFFERENT_FIELD of DIFFERENT_ITEM
            - CUT NEW_NODE from SAVED_ITEM and paste into SAME_FIELD of SAME_ITEM
            - CUT NEW_NODE from SAVED_ITEM and paste into SAME_FIELD of DIFFERENT_ITEM
            - CUT NEW_NODE from SAVED_ITEM and paste into DIFFERENT_FIELD of SAME_ITEM
            - CUT NEW_NODE from SAVED_ITEM and paste into DIFFERENT_FIELD of DIFFERENT_ITEM
            - CUT NEW_NODE from NEW_ITEM and paste into SAME_FIELD of SAME_ITEM
            - CUT NEW_NODE from NEW_ITEM and paste into SAME_FIELD of DIFFERENT_ITEM
            - CUT NEW_NODE from NEW_ITEM and paste into DIFFERENT_FIELD of SAME_ITEM
            - CUT NEW_NODE from NEW_ITEM and paste into DIFFERENT_FIELD of DIFFERENT_ITEM

            NOT POSSIBLE:
            - COPY SAVED_NODE from NEW_ITEM and paste into SAME_FIELD of SAME_ITEM
            - COPY SAVED_NODE from NEW_ITEM and paste into SAME_FIELD of DIFFERENT_ITEM
            - COPY SAVED_NODE from NEW_ITEM and paste into DIFFERENT_FIELD of SAME_ITEM
            - COPY SAVED_NODE from NEW_ITEM and paste into DIFFERENT_FIELD of DIFFERENT_ITEM
            - CUT SAVED_NODE from NEW_ITEM and paste into SAME_FIELD of SAME_ITEM
            - CUT SAVED_NODE from NEW_ITEM and paste into SAME_FIELD of DIFFERENT_ITEM
            - CUT SAVED_NODE from NEW_ITEM and paste into DIFFERENT_FIELD of SAME_ITEM
            - CUT SAVED_NODE from NEW_ITEM and paste into DIFFERENT_FIELD of DIFFERENT_ITEM
        */

        const memory = _nodeIdMemory();
        const junctionField =
            m2aRelation.relationInfo.value!.junctionField.collection;

        // TODO: [Stage 2][flow chart] Place link to flow chart here
        editorNodes.forEach(({ node, pos, nodeId, mark, nodeIndex }, index) => {
            // NodeId does not exist in M2A store and the Node will display a warning because the related item is missing
            if (!m2aStore.itemExists(nodeId)) return;

            const storeItemIsActive = m2aStore.itemIsActive(nodeId);
            const nodeIdIsUnique = memory.nodeIdUniqueInEditor(nodeId);

            const nodeIdMatchesLastNode = () => {
                if (nodeIdIsUnique || !index) return false;
                return (
                    editorNodes[index - 1]?.nodeId === nodeId &&
                    editorNodes[index - 1]?.nodeIndex === nodeIndex - 1
                );
            };
            const nodeIdIsSplittedByMarks = nodeIdMatchesLastNode();

            const nodeFromDifferentEditor = m2aStore.itemFromDifferentEditor(
                nodeId,
                editorField
            );
            const nodeFromDifferentItem =
                m2aStore.itemFromDifferentItem(nodeId);

            // Nothing changed OR inserted a new node OR dragged and dropped an existing node
            if (
                storeItemIsActive &&
                (nodeIdIsUnique || nodeIdIsSplittedByMarks) &&
                !nodeFromDifferentEditor &&
                !nodeFromDifferentItem
            )
                return;

            let storeItemReactivated = false;

            if (storeItemIsActive || nodeFromDifferentItem) {
                nodeId = m2aStore.duplicateItem(nodeId, m2aRelation);
                _refreshRelationNode(nodeId, junctionField, node, pos, mark);
                memory.replaceLastItem(nodeId);
            } else {
                m2aStore.activateItem(nodeId);
                storeItemReactivated = true;
            }

            if (nodeFromDifferentEditor) m2aStore.setField(nodeId, editorField);

            const storeItemNotNew = !m2aStore.itemIsNew(nodeId);
            const storeItem = m2aStore.getItem(nodeId)!;

            if (storeItemNotNew && storeItemReactivated) {
                // TODO: [simplify] can we add the $index,$type fields while updating to the m2aStore? then this would be much simpler
                _reactivateRelatedItem(nodeId);

                if (storeItem.edits) {
                    _mergeUpdatedValues(storeItem, nodeId);
                    m2aRelation.update(storeItem.edits as Item[]);
                }

                return;
            }

            m2aRelation.create(storeItem.item);
        });
    }

    function _nodeIdMemory() {
        return {
            nodeIds: [] as UUID[],
            nodeIdUniqueInEditor(nodeId: UUID) {
                const isUnique = this.nodeIds.indexOf(nodeId) < 0;
                this.nodeIds.push(nodeId);
                return isUnique;
            },
            replaceLastItem(nodeId: UUID) {
                this.nodeIds.splice(this.nodeIds.length - 1, 1, nodeId);
            },
        };
    }

    function _getExistingEditorNodes() {
        const editorNodes: EditorNodes[] = [];

        editor.value!.state.doc.descendants((node, pos, _parent, nodeIndex) => {
            const isRelationBlock = node.type.name == "relation-block";
            const isRelationInlineBlock =
                node.type.name == "relation-inline-block";
            const relationMarkNode = node.marks?.find(
                (mark) => mark.type.name == "relation-mark"
            );

            if (!isRelationBlock && !isRelationInlineBlock && !relationMarkNode)
                return;

            const nodeId = relationMarkNode
                ? relationMarkNode.attrs.id
                : node.attrs.id;

            editorNodes.push({
                node,
                pos,
                nodeId,
                mark: relationMarkNode,
                nodeIndex,
            });
        });

        return editorNodes;
    }

    function _refreshRelationNode(
        nodeId: UUID,
        junction: string,
        node: ProseMirrorNode,
        pos: number,
        mark: Record<string, any> | undefined
    ) {
        if (!!mark) {
            _updateMarkAttrs(node, pos, {
                ...(mark.attrs ?? []),
                id: nodeId,
                junction,
            });
        } else {
            _updateNodeAttrs(node, pos, {
                ...node.attrs,
                id: nodeId,
                junction,
            });
        }
    }

    function _updateMarkAttrs(
        node: ProseMirrorNode,
        pos: number,
        updatedAttrs: ProseMirrorAttrs
    ) {
        const transaction = editor.value!.state.tr;
        const markType = editor.value!.schema.marks["relation-mark"];
        if (!markType) return;

        transaction.addMark(
            pos,
            pos + node.nodeSize,
            markType.create(updatedAttrs)
        );

        // Update the editor content without triggering an update
        transaction.setMeta("addToHistory", false);
        transaction.setMeta("preventUpdate", true);

        // Apply changes
        editor.value!.view.dispatch(transaction);

        // needs to be set after `setNodeMarkup`
        node.attrs = updatedAttrs;
    }

    function _updateNodeAttrs(
        node: ProseMirrorNode,
        pos: number,
        updatedAttrs: ProseMirrorAttrs
    ) {
        const transaction = editor.value!.state.tr;

        transaction.setNodeMarkup(pos, undefined, updatedAttrs);

        // Update the editor content without triggering an update
        transaction.setMeta("addToHistory", false);
        transaction.setMeta("preventUpdate", true);

        // Apply changes
        editor.value!.view.dispatch(transaction);

        // needs to be set after `setNodeMarkup`
        node.attrs = updatedAttrs;
    }

    function _mergeUpdatedValues(storeItem: M2AStoreItem, nodeId: UUID) {
        const item = m2aRelation.findDisplayItem(nodeId);
        if (!item) return;

        const { $type, $index, $edits } = item;
        storeItem.edits = {
            ...(storeItem.edits as Item),
            $type,
            $index,
            $edits,
        };
    }

    function _reactivateRelatedItem(nodeId: UUID) {
        const relatedItem = m2aRelation.findDisplayItem(nodeId)!;
        // `remove` reactivates a previously removed item
        m2aRelation.remove(relatedItem);
    }

    function syncRemovedNodes(editorNodes: EditorNodes[]) {
        const existingNodeIds = editorNodes.map(({ nodeId }) => nodeId);
        const inactiveNodeIds = m2aStore.deactivateUnusedItems(
            existingNodeIds,
            editorField
        );

        _removeRelatedItems(inactiveNodeIds);
    }

    function _removeRelatedItems(nodeIds: UUID[]) {
        if (!nodeIds.length) return;

        nodeIds.forEach((nodeId) => {
            const relatedItem = m2aRelation.findDisplayItem(nodeId);
            if (!relatedItem) return;
            m2aRelation.deleteItem(relatedItem);
        });
    }
}
