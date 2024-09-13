<template>
    <ToolButton
        :title
        :icon
        :display
        :shortcut
        :active
        :disabled
        :editor
        :action="() => showDialog = true"
    />

    <v-dialog v-model="showDialog">
        <DialogLink
            :get="get"
            @set="set"
            @unset="unset"
            @close-dialog="showDialog = false"
        ></DialogLink>
    </v-dialog>
</template>



<script setup lang="ts">
    import { ref } from 'vue'
    import ToolButton from "../../components/ToolButton.vue";
    import DialogLink from "./DialogLink.vue";
    import type { CustomToolButtonProps } from "../../types";

    const props = defineProps<CustomToolButtonProps>();

    const { showDialog, get, set, unset } = useDialog();

    function useDialog() {
        type LinkAttributes = { href: string; target?: string | null }

        const showDialog = ref(false);

        const get = () => props.editor.getAttributes("link");
        const set = (attrs: LinkAttributes) =>
            props.editor
                .chain()
                .focus()
                .setLink(attrs)
                .run();
        const unset = () =>
            props.editor
                .chain()
                .focus()
                .unsetLink()
                .run();

        return { showDialog, get, set, unset };
    }
</script>
