# Flexible Editor for Directus

<!-- NOTE: [extension-description] Sync description with GitHub, custom-messages.ts and package.json -->

A rich text editor (WYSIWYG) with JSON output that allows the integration of M2A relations to make it extremely flexible.

![](https://raw.githubusercontent.com/formfcw/directus-extension-flexible-editor/main/docs/teaser.png)

Under the hood, it integrates the [Tiptap](https://github.com/ueberdosis/tiptap) editor as an extension to the [Directus](https://github.com/directus/directus) app and uses an optional many-to-any (M2A) field to place and link relation nodes in the editor. This combination makes Flexible Editor a truly rich editor.

## Features

:rocket: **Composable Blocks**: Compose blocks as you would with the built-in builder interface and insert these referenced items directly into Flexible Editor as a “Relation Block”.

<details><summary>Show example</summary>

![](https://raw.githubusercontent.com/formfcw/directus-extension-flexible-editor/main/docs/feature-relation-blocks.gif)

</details>

:rocket: **Inline Blocks**: Use relation blocks inline by inserting them directly into the text flow as “Relation Inline Blocks”.

<details><summary>Show example</summary>

![](https://raw.githubusercontent.com/formfcw/directus-extension-flexible-editor/main/docs/feature-relation-inline-blocks.gif)

</details>

:rocket: **Internal Linking**: Create your own custom link collection(s) and apply it as “Relation Mark” to selected text within Flexible Editor.

<details><summary>Show example</summary>

![](https://raw.githubusercontent.com/formfcw/directus-extension-flexible-editor/main/docs/feature-relation-marks.gif)

</details>

:rocket: **Single Line Mode**: Turn Flexible Editor into an inline editor that only allows marks and inline blocks. This way, you can have a simple text input field that could contain a link or any other mark (including _Relation Marks_ and _Relation Inline Blocks_).

<details><summary>Show example</summary>

![](https://raw.githubusercontent.com/formfcw/directus-extension-flexible-editor/main/docs/feature-single-line-mode.png)

</details>

:rocket: **Adjustable Toolbar**: Choose between a static, sticky or floating toolbar.

<details><summary>Show example</summary>

![](https://raw.githubusercontent.com/formfcw/directus-extension-flexible-editor/main/docs/feature-toolbar-options.png)

</details>

:rocket: **Render Interactive Components**: On your front-end, you can render any node (especially “Relation Nodes”) with your own custom component using [Flexible Editor Content](https://github.com/formfcw/directus-extension-flexible-editor/tree/main/content).

## Installation

-   [Official Guide](https://docs.directus.io/extensions/installing-extensions.html)
-   [NPM Package](https://www.npmjs.com/package/directus-extension-flexible-editor)

## Basic Usage

In your Directus app simply click the `Create Field` button and select `Flexible Editor`.

<details><summary>Show example</summary>

![](https://raw.githubusercontent.com/formfcw/directus-extension-flexible-editor/main/docs/basic-usage.gif)

</details>

### Interface Options

Navigate to the interface tab to adjust the settings.

| Option                                                                                                     | Description                                                                                                                                                                                           |
| ---------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| M2A Reference Field<ul><li>Relation Blocks</li><li>Relation Inline Blocks</li><li>Relation Marks</li></ul> | Described in detail below _(Usage with relation nodes)_                                                                                                                                               |
| Placeholder                                                                                                | Display a placeholder text when empty                                                                                                                                                                 |
| Tools                                                                                                      | Select the editor tools you want to use                                                                                                                                                               |
| Toolbar                                                                                                    | _Static_ … The toolbar appears at the top of the editor<br>_Sticky_ … The toolbar stays at the top of the viewport as you scroll<br>_Floating_ … The toolbar floats above the current cursor position |
| Formats Button Appearance                                                                                  | Display the active format name instead of just an icon                                                                                                                                                |
| Input Mode                                                                                                 | _Multi-line text_ … Default behavior<br>_Single-line text_ … Turns into an inline editor that only allows marks and inline blocks                                                                     |
| Editor Height                                                                                              | _Grow till Overflow_ … The height grows with its content as long as it remains in the viewport<br>_Grow_ … The height grows with its content<br>_Fixed_ … The editor has a fixed height               |
| Font                                                                                                       | Font that is used in the editor                                                                                                                                                                       |
| Spellcheck                                                                                                 | Enable spell checking in the editor                                                                                                                                                                   |

### Display

Navigate to the `Display` tab and select `Flexible Editor` to display the editor content as plain text in the Directus app.

## Usage with relation nodes

<!-- Sync heading with link above `#usage-with-relation-nodes` -->

You can insert items from your Directus collections into Flexible Editor. This is optional but gives you extreme flexibility when creating rich content. To do this, you need to add a many-to-any (M2A) field, that the editor field can connect to. For Flexible Editor to work in this way, you must create the junction collection before adding a M2A field.

1. Create a new (junction) collection and give it a name like `xxxx_editor_nodes` and set the `Type` of the Primary Key to `Generate UUID`. Finish the setup to create the collection.

    <details><summary>Show example</summary>

    ![](https://raw.githubusercontent.com/formfcw/directus-extension-flexible-editor/main/docs/1-relation-nodes.gif)

    </details>

2. Open the data model of the collection to which you want to add Flexible Editor, click `Create Field in Advanced Mode`, and select `Many to Any Relationship`.

    <details><summary>Show example</summary>

    ![](https://raw.githubusercontent.com/formfcw/directus-extension-flexible-editor/main/docs/2-relation-nodes.gif)

    </details>

3. Enter a name for the field, such as `editor_nodes` and uncheck `Auto Fill` on the `Relationship` tab, so that you can manually select the junction collection you created earlier (such as `xxxx_editor_nodes`). Select the `Related Collections` you want to integrate into your Flexible Editor field. You don’t need to set a `sort` field, but you do want to set the `Relational Triggers` to `cascade` when an item is deleted or deselected.

    <details><summary>Show example</summary>

    ![](https://raw.githubusercontent.com/formfcw/directus-extension-flexible-editor/main/docs/3-relation-nodes.gif)

    </details>

4. On the `Field` tab, set the field to `Hidden on Detail` because we are managing the M2A items through Flexible Editor. Therefore, no interface is required for the M2A field.

    <details><summary>Show example</summary>

    ![](https://raw.githubusercontent.com/formfcw/directus-extension-flexible-editor/main/docs/4-relation-nodes.gif)

    </details>

    > **Note**: If you use Flexible Editor inside groups – especially inside nested groups –, make sure you put your `editor_nodes field` in the same group as your `Flexible Editor field`, otherwise they may lose their connection!

5. Now that you have created your M2A field, open the interface settings for your Flexible Editor field and connect to the M2A field by selecting it in the `M2A Reference Field`.

    <details><summary>Show example</summary>

    ![](https://raw.githubusercontent.com/formfcw/directus-extension-flexible-editor/main/docs/5-relation-nodes.gif)

    </details>

    Once you have selected a valid M2A field, three additional fields appear:

    - **Relation Block** … A block, you can insert in Flexible Editor, that references an item of a collection you can compose yourself.
        > Use Cases: gallery, video, related content, complex content structure, …
    - **Relation Inline Block** … Same as “Relation Block”, but appears inside text.
        > Use Cases: link to referenced item using item data for link text, inline image/icon, placeholders/variables for templates (e.g. email), …
    - **Relation Mark** … A mark, you can apply to selected text, that references an item of a collection you can compose yourself.
        > Use Cases: classic link (compose your own), link to referenced item, button that opens a modal/overlay/video, …

    All three fields have the same options, which correspond to the collections you selected in your M2A field. Here you can select which collection should appear as a `Relation Block`, `Relation Inline Block` or `Relation Mark` within Flexible Editor.

6. Set the `Item Duplication Fields` for your junction collection (`xxxx_editor_nodes`) in the data model settings. This is required for `copy & paste` or `drag & drop` to work.

    <details><summary>Show example</summary>

    ![](https://raw.githubusercontent.com/formfcw/directus-extension-flexible-editor/main/docs/6-relation-nodes.gif)

    </details>

    > **Tip**: If you set up Flexible Editor in the same way for different collections, you can copy and paste the duplication settings via `Copy Raw Value` from the field menu — by clicking on the “Item Duplication Fields” label.

### Things to keep in mind

You cannot use the same M2A junction collection for multiple collections (where you use Flexible Editor). This would only work with an any-to-any relationship, which Directus doesn't support at the time of writing.

You should not set `Item Duplication Fields` for nested Flexible Editor fields as they are managed by their own junction collections.

If you want to duplicate nested M2A items (e.g. a Related Content collection, that references several other collection items), you want to duplicate only the IDs (in the junction collection) without copying the whole item!

<!-- TODO: [Stage 2][docs] Duplication -->

Duplication currently only works within the same editor field or between Flexible Editor fields, that use the same `M2A Reference Field`. (This will be improved in [future releases](https://github.com/formfcw/directus-extension-flexible-editor/discussions/categories/feature-request).)

This also means that you can use the same `M2A Reference Field` for multiple Flexible Editor fields, although this is not recommended as this will change in [future releases](https://github.com/formfcw/directus-extension-flexible-editor/discussions/categories/feature-request).

The current implementation of duplicating relation nodes (M2A items) does not cover all use cases, but will be improved in [future releases](https://github.com/formfcw/directus-extension-flexible-editor/discussions/categories/feature-request). If the duplication fails, you should get a warning.

### Tutorial: Relation node with existing items

> https://github.com/user-attachments/assets/5a5fb034-ddff-4b50-ac1d-526dbee2d710
>
> _(Video tutorial about relation node with existing items)_

## Custom Editor Styles

To override the CSS of the editor content, you can add `Custom CSS` to your `Project Settings` in Directus. You can use the `.flexible-editor` & `.flexible-editor-wrapper` classes for the editor itself as well as `.relation-block`, `.relation-inline-block` and `.relation-mark` classes for the relation nodes.

## Rendering in the front-end

To render the JSON content generated by Flexible Editor you can follow the [official Tiptap guide](https://tiptap.dev/guide/output#option-2-generate-html-from-prosemirror-json) or you can use the [Flexible Editor Content](https://github.com/formfcw/directus-extension-flexible-editor/tree/main/content) tools included in this package (recommended).

### Rendering with interactive components

If you want to render your JSON content with interactive components, especially when using relation nodes, follow the [Flexible Editor Content](https://github.com/formfcw/directus-extension-flexible-editor/blob/main/content/README.md) guide.

### Rendering plain HTML or plain text

Tiptap provides official functions to [`generateText()`](https://github.com/ueberdosis/tiptap/pull/1875) or `generateHTML()` from the JSON output. Note that as of this writing, there are different versions of `generateHTML()`: one for client-side rendering (`import { generateHTML } from "@tiptap/core"`) and one for server-side rendering (`import { generateHTML } from "@tiptap/html"`)!

## Contribution

Contributions are welcome. Be sure to open an issue for bugs or start a discussion for feature requests, before you start writing code!
