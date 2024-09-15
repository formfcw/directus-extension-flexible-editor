# Flexible Editor Content

Serialize [Flexible Editor](https://github.com/ueberdosis/tiptap) JSON content with interactive components.

## Installation

Since it is included in the Flexible Editor package, you can install it the same way.

```sh
# Using npm
npm install directus-extension-flexible-editor
# Using yarn
yarn add directus-extension-flexible-editor
# Using pnpm
pnpm add directus-extension-flexible-editor
```

## Usage

The Flexible Editor Content tools are available via `directus-extension-flexible-editor/content`.

At the time of writing, this package only provides a Vue component to render your content. However, because it depends on [tiptap-render-view](https://github.com/formfcw/tiptap-render-view), it also provides types and tools to create components for your preferred JavaScript framework.

### Fetching and transforming the API data

This is for usage with relation nodes.

Since the editor field (e.g. `description`) and the corresponding “M2A Reference Field” (e.g. `editor_nodes`) are separate fields, add both fields (including the [related fields](https://docs.directus.io/reference/query.html#many-to-any-union-types)) to your Directus API request as usual.

With `injectDataIntoContent()` you can merge both fields:

```ts
import { injectDataIntoContent } from "directus-extension-flexible-editor/content";

const data = await fetchDirectusData();

injectDataIntoContent(data.editor_nodes, data.description);

// Optionally remove editor_nodes from the payload after injecting them into the description
delete data.editor_nodes;
```

> **Tip**: In Nuxt, you will call `injectDataIntoContent` in the [transform](https://nuxt.com/docs/getting-started/data-fetching#minimize-payload-size) callback to cache the result.

### Importing Flexible Editor extensions

It may be useful to import an array of all tiptap extensions used by Flexible Editor that are required for serialization.

```ts
import { serializers } from "directus-extension-flexible-editor/content";
```

> **Note**: When using the `FlexibleEditorContent` component, these extensions are added by default.

### Vue

Check out this [example on StackBlitz](https://stackblitz.com/github/formfcw/directus-extension-flexible-editor/tree/main/content/vue/example-app?file=src%2Fcontent.json,src%2FApp.vue)

```vue
<template>
    <FlexibleEditorContent
        :content="data.description"
        :component-serializers="componentSerializers"
        :relation-blocks="relationBlocks"
        :relation-inline-blocks="relationInlineBlocks"
        :relation-marks="relationMarks"
    />
</template>

<script setup lang="ts">
    import FlexibleEditorContent, {
        VueComponentSerializers,
        VueRelationNodeSerializers,
    } from "directus-extension-flexible-editor/content/vue";
    import { injectDataIntoContent } from "directus-extension-flexible-editor/content";
    import Textfield from "./components/Textfield.vue";
    import DefinitionList from "./components/DefinitionList.vue";
    import Video from "./components/Video.vue";
    import Color from "./components/Color.vue";
    import RelatedPost from "./components/RelatedPost.vue";

    // Fetch and transform the API data
    const data = await fetchDirectusData();
    injectDataIntoContent(data.editor_nodes, data.description);
    delete data.editor_nodes;

    // Define components to render the relation blocks, relation inline blocks or relation marks
    const relationBlocks: VueRelationNodeSerializers = [
        { collection: "definition_list", component: DefinitionList },
        { collection: "video", component: Video },
    ];
    const relationInlineBlocks: VueRelationNodeSerializers = [
        { collection: "color", component: Color },
    ];
    const relationMarks: VueRelationNodeSerializers = [
        { collection: "related_post", component: RelatedPost },
    ];

    // Define other components to render any editor content node
    const componentSerializers: VueComponentSerializers = [
        // marks with `type: 'mark'`
        { name: "italic", type: "mark", component: Textfield },
        {
            name: "bold",
            type: "mark",
            render: (attrs) => [
                Textfield,
                { ...attrs, style: "background:lightgreen" },
            ],
        },
        // blocks
        { name: "heading", render: (attrs) => ["textarea", attrs] },
    ];
</script>
```

Example of a component (`./components/DefinitionList.vue`) that renders a relation block:

```vue
<template>
    <dl>
        <template
            v-for="(item, key) in data.items"
            :key="key"
        >
            <dt>{{ item.term }}</dt>
            <dd>{{ item.definition }}</dd>
        </template>
    </dl>
</template>

<script setup lang="ts">
    import { defineProps } from "vue";
    import type { RelationNodeProps } from "directus-extension-flexible-editor/content";

    defineProps<{
        id: RelationNodeProps["id"];
        junction: RelationNodeProps["junction"];
        collection: RelationNodeProps["collection"];
        data?: RelationNodeProps["data"];
    }>();
</script>
```

### Other Frameworks

Feel free to contribute

## Contribution

Contributions are welcome. Be sure to open an issue for bugs or start a discussion for feature requests, before you start writing code!
