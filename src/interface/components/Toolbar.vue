<template>
    <component
        :is="mode == 'floating' ? FloatingMenu : 'div'"
        class="toolbar"
        :class="mode"
        v-bind="mode == 'floating' ? floatingMenuProps : null"
    >
        <v-menu
            v-if="formatTools.length"
            show-arrow
            placement="bottom-start"
            :fullHeight="true"
        >
            <template #activator="{ toggle }">
                <v-button
                    v-if="displayFormat"
                    @click="toggle"
                    tabindex="-1"
                    v-tooltip="t('formats')"
                    :aria-label="t('formats')"
                    :disabled="formatToolsDisabled"
                    :aria-disabled="formatToolsDisabled"
                    small
                    class="toolbar-dropdown-button"
                >
                    {{ formatToolsDisplay }}
                    <v-icon name="arrow_drop_down" />
                </v-button>
                <ToolButton
                    v-else
                    :title="t('formats')"
                    icon="format_paragraph"
                    :action="toggle"
                    :disabled="formatToolsDisabled"
                />
            </template>
            <v-list class="toolbar-dropdown">
                <v-list-item
                    v-for="tool in formatTools"
                    :key="tool.key"
                    clickable
                    @click="tool.action?.(editor)"
                    :active="tool.active?.(editor)"
                    :aria-pressed="tool.active?.(editor)"
                    :disabled="tool.disabled?.(editor) || (singleLineMode && tool.disabledInSingleLineMode)"
                >
                    <v-list-item-icon v-if="tool.icon">
                        <v-icon :name="tool.icon" />
                    </v-list-item-icon>
                    <v-list-item-content>
                        <v-text-overflow :text="tool.name" />
                    </v-list-item-content>
                    <v-list-item-hint>{{ translateShortcut(tool.shortcut as string[]) }}</v-list-item-hint>
                </v-list-item>
            </v-list>
        </v-menu>

        <component
            v-for="tool in buttonTools"
            :key="tool.key"
            :is="tool.toolbarButton ?? ToolButton"
            :title="tool.name"
            :icon="tool.icon"
            :display="tool.display"
            :shortcut="tool.shortcut"
            :action="(attrs = null) => tool.action?.(editor, attrs)"
            :active="editor.isFocused && tool.active?.(editor)"
            :disabled="tool.disabled?.(editor) || (singleLineMode && tool.disabledInSingleLineMode)"
            :editor="editor"
        />
    </component>
</template>



<script setup lang="ts">
    import { ref, computed } from 'vue';
    import { FloatingMenu, type Editor } from '@tiptap/vue-3';
    import ToolButton from './ToolButton.vue';
    import { translateShortcut } from '../directus-core/utils/translate-shortcut';
    import { useI18n } from "vue-i18n";
    import { useI18nFallback } from '../composables/use-i18n-fallback'
    import type { FloatingMenuPluginProps } from '@tiptap/extension-floating-menu';
    import type { Tool, ToolbarMode } from '../types';


    // Props
    interface Props {
        tools: Tool[];
        editor: Editor;
        displayFormat: boolean;
        singleLineMode: boolean;
        mode: ToolbarMode
    }
    const props = withDefaults(defineProps<Props>(), {
        displayFormat: false
    });


    // I18n
    const { t, $t } = useI18nFallback(useI18n());


    // Split up tools to types
    const buttonTools = ref<Tool[]>([]);
    const formatTools = ref<Tool[]>([]);
    props.tools.forEach((tool) => {
        if (tool.excludeFromToolbar) {
            return;
        }

        tool.name = $t(tool.name);

        if (tool.groups && tool.groups.indexOf('format') >= 0) {
            formatTools.value.push(tool);
            return;
        }

        buttonTools.value.push(tool);
    });
    const formatToolsDisabled = computed(() => formatTools.value.every((tool) => tool.disabled?.(props.editor)));
    const formatToolsDisplay = computed(() => {
        const activeFormat: Tool[] = formatTools.value.filter((tool: Tool) => tool.active?.(props.editor));

        if (activeFormat.length)
            return activeFormat.map(tool => tool.name)[0];

        return t('tools.paragraph');
    });

    const { floatingMenuProps } = useFloatingMenu();

    function useFloatingMenu() {
        const padding = parseInt(getComputedStyle(document.body)?.getPropertyValue('--theme--popover--menu--border-radius')?.replace('px', ''), 10) ?? 6;

        type FloatingMenuProps = {
            editor: FloatingMenuPluginProps['editor'];
            shouldShow: FloatingMenuPluginProps['shouldShow'];
            tippyOptions: FloatingMenuPluginProps['tippyOptions'];
        };

        const floatingMenuProps: FloatingMenuProps = {
            editor: props.editor,
            shouldShow: ({ editor }) => editor.isFocused,
            tippyOptions: {
                placement: 'top',
                maxWidth: 'none',
                zIndex: 500,
                arrow: true,
                popperOptions: {
                    modifiers: [
                        { name: 'arrow', options: { padding } },
                        { name: 'preventOverflow', options: { boundary: props.editor.view.dom } },
                    ],
                },
            },
        };

        return { floatingMenuProps };
    }
</script>



<style scoped>
    .toolbar {
        --v-button-background-color: transparent;
        --v-button-color: var(--theme--foreground, var(--foreground-normal));
        --v-button-background-color-hover: var(--theme--border-color, var(--border-normal));
        --v-button-color-hover: var(--theme--foreground, var(--foreground-normal));
        --v-button-background-color-active: var(--theme--border-color, var(--border-normal));
        --v-button-color-active: var(--theme--foreground, var(--foreground-normal));
        --v-button-background-color-disabled: transparent;
        --v-button-color-disabled: var(--theme--foreground-subdued, var(--foreground-subdued));

        --toolbar-item-m: 1px;
        --toolbar-dropdown-p: 2px;

        display: flex;
        flex-wrap: wrap;
        padding: var(--toolbar-item-m);
        background: var(--theme--form--field--input--background-subdued);
    }

    .toolbar-dropdown-button :deep(.button) {
        --v-button-min-width: 0;
        padding-left: calc(var(--theme--form--field--input--padding, var(--input-padding)) - var(--toolbar-dropdown-p) * 2);
        padding-right: 4px;
    }

    .toolbar-dropdown {
        --v-list-item-background-color-active: var(--theme--border-color, var(--border-normal));
    }

    .toolbar :deep(> *:not(.v-dialog)) {
        display: block;
        margin: var(--toolbar-item-m);
    }

    .toolbar.sticky {
        position: sticky;
        top: calc(var(--header-bar-height) - 1px + var(--theme--header--border-width));
        z-index: 1;
    }

    .toolbar.floating {
        padding: 0 4px;
        border: none;
        border-radius: var(--theme--popover--menu--border-radius);
        box-shadow: var(--theme--popover--menu--box-shadow);
        padding: 1px 4px;
    }
</style>



<style>

    .flexible-editor-wrapper .tippy-arrow,
    .flexible-editor-wrapper .tippy-arrow::after {
        position: absolute;
        z-index: 1;
        width: 10px;
        height: 10px;
        overflow: hidden;
        border-radius: 2px;
    }

    .flexible-editor-wrapper .tippy-arrow {
        height: 7px;
    }

    .flexible-editor-wrapper .tippy-arrow::after {
        height: 10px;
    }

    .flexible-editor-wrapper .tippy-arrow::after {
        background: var(--theme--popover--menu--background);
        transform: rotate(45deg) scale(1);
        transition-delay: 0;
        content: '';
    }

    .flexible-editor-wrapper [data-placement^='top'] .tippy-arrow {
        bottom: -6px;
    }

    .flexible-editor-wrapper [data-placement^='top'] .tippy-arrow::after {
        bottom: 3px;
    }

    .flexible-editor-wrapper [data-placement^='bottom'] .tippy-arrow {
        top: -6px;
    }

    .flexible-editor-wrapper [data-placement^='bottom'] .tippy-arrow::after {
        top: 3px;
    }

    .flexible-editor-wrapper [data-placement^='right'] .tippy-arrow {
        left: -6px;
    }

    .flexible-editor-wrapper [data-placement^='right'] .tippy-arrow::after {
        left: 4px;
    }

    .flexible-editor-wrapper [data-placement^='left'] .tippy-arrow {
        right: -6px;
    }

    .flexible-editor-wrapper [data-placement^='left'] .tippy-arrow::after {
        right: 4px;
    }
</style>