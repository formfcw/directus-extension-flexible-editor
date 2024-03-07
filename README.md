# Flexible Editor for Directus

<!-- NOTE: [extension-description] Sync description with GitHub, custom-messages.ts and package.json -->

A Rich Text Editor (WYSIWYG) with JSON output, that allows to integrate M2A relations to make it extremely flexible.

> https://github.com/formfcw/directus-extension-flexible-editor/assets/78852214/b418c9a7-44c0-43b1-b5ad-6673d09a9066
>
> _(Demo Video)_

Under the hood, it integrates the [Tiptap](https://github.com/ueberdosis/tiptap) editor as an extension into the [Directus](https://github.com/directus/directus) app and utilizes an optional many-to-any (M2A) field to place and link related nodes in the editor. This combination makes Flexible Editor a truely rich editor.

## Installation

-   [Official Guide](https://docs.directus.io/extensions/installing-extensions.html)
-   [NPM Package](https://www.npmjs.com/package/directus-extension-flexible-editor)

## Basic Usage

In your Directus app simply click the `Create Field` button and choose `Flexible Editor`.

> https://github.com/formfcw/directus-extension-flexible-editor/assets/78852214/62592c31-498f-4879-b231-fb2f2802777c
>
> _(Video about basic usage)_

### Interface Options

Navigate to the interface tab to adjust the settings.

| Option                    | Description                                                                                                                                                                                |
| ------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| M2A Reference Field       | Described in detail below _(Usage with relation nodes)_                                                                                                                                    |
| Placeholder               | Display a placeholder text when empty                                                                                                                                                      |
| Tools                     | Select the editor tools you want to use                                                                                                                                                    |
| Formats Button Appearance | Display the active format name instead of just an icon                                                                                                                                     |
| Font                      | Font that is used in the editor                                                                                                                                                            |
| Spellcheck                | Enable spell checking in the editor                                                                                                                                                        |
| Editor Height             | _Grow till Overflow_ … The height grows with its content as long as it remains in the viewport.<br>_Grow_ … The height grows with its content.<br>_Fixed_ … The editor has a fixed height. |

### Display

Navigate to the `Display` tab and select `Flexible Editor` to display the editor content as plain text inside the Directus app.

## Usage with relation nodes

<!-- Sync heading with link above `#usage-with-relation-nodes` -->

You can insert items from your Directus collections into the Flexible Editor. This is optional but gives you extreme flexibility when creating rich content. Therefore, you need to add a many-to-any (M2A) field, the editor field can connect to. For Flexible Editor to work this way, you must create the junction collection before adding a M2A field.

> https://github.com/formfcw/directus-extension-flexible-editor/assets/78852214/986ce5b1-cdda-4607-bea9-26412f942938
>
> _(Video about usage with relation nodes)_

1. Create a new (junction) collection and give it a name like `xxxx_editor_nodes` and set the `Type` of the Primary Key to `Generate UUID`. Finish the setup to create the collection.

2. Open the data model of the collection you want to add Flexible Editor to and click `Create Field in Advanced Mode` and select `Many to Any Relationship`.

3. Give the field a name like `editor_nodes` and on the `Relationship` tab, uncheck the `Auto Fill` option, so you can select the junction collection you created earlier manually (like `xxxx_editor_nodes`). Select the `Related Collections` you want to integrate into your Flexible Editor field. You don’t need to set a `sort` field, but you want to set the `Relational Triggers` to `cascade` when deleting or deselecting an item.

4. On the `Field` tab, set the field `Hidden on Detail` as we manage the M2A items via Flexible Editor. Therefore no interface is required for the M2A field.

5. Now that you have created your M2A field, open the interface settings for your Flexible Editor field and connect to the M2A field by selecting it in the `M2A Reference Field`.

6. Set the `Item Duplication Fields` for your junction collection (`xxxx_editor_nodes`) in the data model settings. This is required to make `copy & paste` or `drag & drop` work.

    > **Tip**: If you setup Flexible Editor the same way on different collections, you can copy & paste the duplication settings via `Copy Raw Value` from the field menu — by clicking the “Item Duplication Fields” label.

### Things to keep in mind

You cannot use the same M2A junction collection for multiple collections (in which you use Flexible Editor). This would only work with an any-to-any relationship, which Directus doesn't support at the time of writing.

You should not set `Item Duplication Fields` for nested Flexible Editor fields as they are managed by their own junction collections.

If you want to duplicate nested M2A items (e.g. a Related Content collection, that relates to multiple other collection items) you only want to duplicate the IDs (in the junction collection) without copying the whole item!

<!-- TODO: [Stage 2][docs] Duplication -->

Duplication currently only works within the same editor field or between Flexible Editor fields, that use the same `M2A Reference Field`. (This will be improved in [future releases](https://github.com/formfcw/directus-extension-flexible-editor/discussions/categories/feature-request).)

This also means that you can use the same `M2A Reference Field` for multiple Flexible Editor fields, although this is not recommended as this will change in [future releases](https://github.com/formfcw/directus-extension-flexible-editor/discussions/categories/feature-request).

The current implementation of duplicating relation nodes (M2A items) does not cover all use cases, but will be improved in [future releases](https://github.com/formfcw/directus-extension-flexible-editor/discussions/categories/feature-request). If duplication fails you should get a warning.

### Tutorial: Relation node with existing items

> https://github.com/formfcw/directus-extension-flexible-editor/assets/78852214/1c357db7-582e-462f-aada-606c0c7197e4
>
> _(Video tutorial about relation node with existing items)_

## Custom Editor Styles

For overwriting CSS of the editor content, you can add `Custom CSS` to your `Project Settings` inside Directus. You can use the `.flexible-editor` class for the editor itself as well as a `.relation-block` class for the relation nodes.

## Rendering in the front-end

To render the JSON content generated by Flexible Editor you can follow the [official Tiptap guide](https://tiptap.dev/guide/output#option-2-generate-html-from-prosemirror-json) or you can use the [Flexible Editor Content](./content) tools included in this package (recommended).

### Rendering with interactive components

If you want to render your JSON content with interactive components, especially when using relation nodes, follow this [Flexible Editor Content](./content/README.md) guide.

### Rendering plain HTML or plain text

Tiptap provides official functions to [`generateText()`](https://github.com/ueberdosis/tiptap/pull/1875) or `generateHTML()` from the JSON output. Note that as of this writing, there are different versions of `generateHTML()`: one for client side (`import { generateHTML } from "@tiptap/core"`) and one for server side (`import { generateHTML } from "@tiptap/html"`) rendering!

## Contribution

Contributions are welcome. Make sure to open an issue for bugs or start a discussion for feature requests, before you start writing code!
