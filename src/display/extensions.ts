import Document from "@tiptap/extension-document";
import Text from "@tiptap/extension-text";
import HardBreak from "@tiptap/extension-hard-break";
import Paragraph from "@tiptap/extension-paragraph";
import Heading from "@tiptap/extension-heading";
import CodeBlock from "@tiptap/extension-code-block";
import BulletList from "@tiptap/extension-bullet-list";
import OrderedList from "@tiptap/extension-ordered-list";
import ListItem from "@tiptap/extension-list-item";
import Blockquote from "@tiptap/extension-blockquote";
import HorizontalRule from "@tiptap/extension-horizontal-rule";
import Link from "@tiptap/extension-link";
import Bold from "@tiptap/extension-bold";
import Italic from "@tiptap/extension-italic";
import Strike from "@tiptap/extension-strike";
import Code from "@tiptap/extension-code";

import RelationBlock from "../interface/nodes/relation-block";

export default [
    Document,
    Text,
    HardBreak,
    Paragraph,
    Heading,
    CodeBlock,
    BulletList,
    OrderedList,
    ListItem,
    Blockquote,
    HorizontalRule,
    RelationBlock,
    Link,
    Bold,
    Italic,
    Strike,
    Code,
];
