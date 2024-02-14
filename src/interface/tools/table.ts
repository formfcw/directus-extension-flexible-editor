import { Table } from "@tiptap/extension-table";
import { TableHeader } from "@tiptap/extension-table-header";
import { TableRow } from "@tiptap/extension-table-row";
import { TableCell } from "@tiptap/extension-table-cell";
import customMessages from "../i18n/custom-messages";
import ToolButtonTable from "../components/ToolButtonTable.vue";
import type { Editor } from "@tiptap/core";
import type { Tool } from "../types";

export default {
    key: "table",
    name: customMessages.tools.table,
    icon: "table",
    extension: [Table, TableHeader, TableRow, TableCell],
    toolbarButton: ToolButtonTable,
    action: (editor: Editor) => editor.chain().focus().insertTable().run(),
    disabled: (editor: Editor) =>
        !editor.can().chain().focus().insertTable().run(),
    active: (editor: Editor) => editor.isActive("table"),
} as Tool;
