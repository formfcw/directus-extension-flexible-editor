<template>
  <v-menu offset-y v-model="menuOpen">
    <template #activator="{ toggle }">
      <ToolButton
        :title="t(`tools.text_align`)"
        :icon="`format_align_${currentAlignment}`"
        :action="toggle"
        :active="active"
        :disabled="disabled"
        :editor="editor"
        />
    </template>
    <v-list>
      <v-list-item
        clickable
        v-for="option in alignmentOptions"
        :key="option.alignment"
        @click="setAlignment(option.alignment)"
        :disabled="disabled"
      >
        <v-list-item-content>
          <v-text-overflow :text="t(option.label)" />
        </v-list-item-content>
        <v-list-item-hint>{{ translateShortcut(option.shortcut) }}</v-list-item-hint>
      </v-list-item>
    </v-list>
  </v-menu>
</template>

<script setup lang="ts">
import { ref, watchEffect } from 'vue';
import { useI18n } from "vue-i18n";
import { useI18nFallback } from "../composables/use-i18n-fallback";
import ToolButton from "./ToolButton.vue";
import { translateShortcut } from "../directus-core/utils/translate-shortcut";
import type { Editor } from '@tiptap/core';

const props = defineProps<{
  editor: Editor;
  disabled: boolean;
}>();

const { t } = useI18nFallback(useI18n());

const alignmentOptions = [
  { label: 'text_align.align_left', alignment: 'left', shortcut: ['meta', 'shift', 'L'] },
  { label: 'text_align.align_center', alignment: 'center', shortcut: ['meta', 'shift', 'E'] },
  { label: 'text_align.align_right', alignment: 'right', shortcut: ['meta', 'shift', 'R'] },
  { label: 'text_align.align_justify', alignment: 'justify', shortcut: ['meta', 'shift', 'J'] }
];

const currentAlignment = ref('left');
const menuOpen = ref(false);

watchEffect(() => {
  const activeAlignment = alignmentOptions.find(option =>
    props.editor.isActive({ textAlign: option.alignment })
  );
  currentAlignment.value = activeAlignment ? activeAlignment.alignment : 'left';
});

const setAlignment = (alignment: string) => {
  props.editor.chain().focus().setTextAlign(alignment).run();
  menuOpen.value = false;
};
</script>
