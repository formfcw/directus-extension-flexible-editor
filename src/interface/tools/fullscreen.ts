import customMessages from "../i18n/custom-messages";
import ToolButtonFullscreen from "../components/ToolButtonFullscreen.vue";
import type { Tool } from "../types";

export default {
    key: "fullscreen",
    name: customMessages.tools.fullscreen,
    extension: [],
    toolbarButton: ToolButtonFullscreen,
    disabledInSingleLineMode: true,
} as Tool;
