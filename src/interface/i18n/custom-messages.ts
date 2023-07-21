// NOTE: Translation strings that start with `$t:` are available in directus itself
// TODO: [Stage 2][i18n] Improve implementation. Add interface option for translation strings, with defaults as placeholder? Or use own messages (scope) and do not use directus internal messages?

export default {
    // NOTE: [extension-description] Sync description with GitHub, README.md and package.json
    extension_description:
        "A Rich Text Editor (WYSIWYG) with JSON output, that allows to integrate M2A relations to make it extremely flexible.",
    tools_title: "Tools",
    m2a_field: "M2A Reference Field",
    formats_appearance: "Formats Button Appearance",
    formats_as_button: "Show name of active format",
    spellcheck: "Spellcheck",
    editor_height: {
        title: "Editor Height",
        grow_till_overflow: "Grow till Overflow",
        grow: "Grow",
        fixed: "Fixed",
    },
    tools: {
        relation_block: "Blocks",
        paragraph: "Paragraph",
        code_block: "Code Block",
        h1: "$t:wysiwyg_options.h1",
        h2: "$t:wysiwyg_options.h2",
        h3: "$t:wysiwyg_options.h3",
        h4: "$t:wysiwyg_options.h4",
        h5: "$t:wysiwyg_options.h5",
        h6: "$t:wysiwyg_options.h6",
        bold: "$t:wysiwyg_options.bold",
        italic: "$t:wysiwyg_options.italic",
        strike: "$t:wysiwyg_options.strikethrough",
        code: "Code",
        link: "$t:field_options.directus_roles.fields.link_name",
        unlink: "$t:wysiwyg_options.unlink",
        autolink: "Autolink",
        hard_break: "Hard Break",
        hr: "$t:wysiwyg_options.hr",
        bullet_list: "$t:wysiwyg_options.bullist",
        ordered_list: "$t:wysiwyg_options.numlist",
        blockquote: "$t:wysiwyg_options.blockquote",
        undo: "$t:wysiwyg_options.undo",
        redo: "$t:wysiwyg_options.redo",
    },
    formats: "Formats",
    add_edit_link: "$t:wysiwyg_options.link",
    type: "$t:type",
    link_types: {
        link: "External Link",
        internal_link: "Internal Link",
        email: "$t:email",
        phone_number: "Phone number",
        other: "$t:other",
    },
    url: "$t:url",
    open_link_in: "$t:open_link_in",
    new_tab: "$t:new_tab",
    validation_errors_notice: "$t:validation_errors_notice",
    validation_error_link_no_protocol:
        "Link must start with http:// or https://",
    validation_error_link_no_slash: "Link must start with a /",
    validation_error_link: "Invalid link format",
    validation_error_email: "Invalid e-mail format",
    validation_error_phone: "Invalid phone number: use only numbers & spaces",
    cancel: "$t:cancel",
    remove: "$t:remove",
    save: "$t:save",
    related_item_missing: "The related item does not exist!",
    duplication_warning:
        "Not all nested data could be duplicated, probably because an already saved item was edited before it was duplicated. This can be solved by saving the edited item with the rest of the content before duplicating it.",
    errors: {
        type_of_junction_primary_key_field_not_uuid:
            "Primary key of the editors junction collection must be of type UUID!",
        duplication_fields_not_set:
            "Duplication fields for the editors junction collection must be set!",
    },
};
