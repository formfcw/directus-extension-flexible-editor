<template>
    <main>
        <p>JSON content</p>
        <pre><code>{{ content }}</code></pre>
        <hr />
        <p>
            Rendered result:
            <button @click="showRB = !showRB">Toggle Relation Blocks</button>
            <button @click="showCS = !showCS">Toggle component serializers</button>
        </p>
        <FlexibleEditorContent
            :content="content.description"
            :componentSerializers="showCS ? componentSerializers : []"
            :relationBlocks="showRB ? relationBlocks : []"
            class="result"
        />
    </main>
</template>

<script setup lang="ts">
    import { ref } from 'vue'
    import FlexibleEditorContent, {
        VueComponentSerializers,
        VueRelationBlockSerializers,
    } from 'directus-extension-flexible-editor/content/vue'
    import { injectDataIntoContent } from 'directus-extension-flexible-editor/content'
    import content from './content.json'
    import Textfield from './components/Textfield.vue'
    import DefinitionList from './components/DefinitionList.vue'
    import Video from './components/Video.vue'

    injectDataIntoContent(content.editor_nodes, content.description)
    delete content.editor_nodes

    const relationBlocks: VueRelationBlockSerializers = [
        { collection: 'definition_list', component: DefinitionList },
        { collection: 'video', component: Video },
    ]

    const componentSerializers: VueComponentSerializers = [
        // marks with `type: 'mark'`
        { name: 'italic', type: 'mark', component: Textfield },
        { name: 'bold', type: 'mark', render: (attrs) => [Textfield, { ...attrs, style: 'background:lightgreen' }] },
        // blocks
        { name: 'heading', render: (attrs) => ['textarea', attrs] },
    ]

    const showCS = ref(false)
    const showRB = ref(true)
</script>

<style>
    main {
        padding: 1rem;
    }

    pre {
        height: 12rem;
        overflow: auto;
    }

    pre,
    .result {
        padding: 0.5rem;
        background: #f2f2f2;
    }

    .result {
        margin-top: 0.5rem;
    }
</style>
