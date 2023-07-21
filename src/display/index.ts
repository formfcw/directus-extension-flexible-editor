import { defineDisplay } from "@directus/extensions-sdk";
import component from "./display.vue";

export default defineDisplay({
    id: "flexible-editor-display",
    name: "Flexible Editor",
    icon: "description",
    description: "Display the content of Flexible Editor as plain text.",
    component,
    options: null,
    types: ["json"],
});
