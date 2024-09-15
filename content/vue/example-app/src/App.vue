<template>
    <main>
        <p>JSON content</p>
        <pre><code>{{ content }}</code></pre>
        <hr />
        <p>
            Rendered result:
            <button @click="showRelationNodes = !showRelationNodes">Toggle Relation Nodes</button>
            <button @click="showComponentSerializers = !showComponentSerializers">Toggle component serializers</button>
        </p>
        <FlexibleEditorContent
            :content="content.description"
            :component-serializers="showComponentSerializers ? componentSerializers : []"
            :relation-blocks="showRelationNodes ? relationBlocks : []"
            :relation-inline-blocks="showRelationNodes ? relationInlineBlocks : []"
            :relation-marks="showRelationNodes ? relationMarks : []"
            class="result"
        />
    </main>
</template>

<script setup lang="ts">
    import { ref } from 'vue'
    import FlexibleEditorContent, {
        VueComponentSerializers,
        VueRelationNodeSerializers,
        JSONContent
    } from 'directus-extension-flexible-editor/content/vue'
    import { injectDataIntoContent } from 'directus-extension-flexible-editor/content'
    import jsonContent from './content.json'
    import Textfield from './components/Textfield.vue'
    import DefinitionList from './components/DefinitionList.vue'
    import Video from './components/Video.vue'
    import Color from './components/Color.vue'
    import RelatedPost from './components/RelatedPost.vue'

    const content: { description: JSONContent, editor_nodes?: Record<string, any>[] } = jsonContent;
    injectDataIntoContent(content.editor_nodes!, content.description);
    delete content.editor_nodes;

    const relationBlocks: VueRelationNodeSerializers = [
        { collection: 'definition_list', component: DefinitionList },
        { collection: 'video', component: Video },
    ];
    const relationInlineBlocks: VueRelationNodeSerializers = [
        { collection: 'color', component: Color },
    ];
    const relationMarks: VueRelationNodeSerializers = [
        { collection: 'related_post', component: RelatedPost },
    ];

    const componentSerializers: VueComponentSerializers = [
        // marks with `type: 'mark'`
        { name: 'italic', type: 'mark', component: Textfield },
        { name: 'bold', type: 'mark', render: (attrs) => [Textfield, { ...attrs, style: 'background:lightgreen' }] },
        // blocks
        { name: 'heading', render: (attrs) => ['textarea', attrs] },
    ];

    const showComponentSerializers = ref(false);
    const showRelationNodes = ref(true);
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
