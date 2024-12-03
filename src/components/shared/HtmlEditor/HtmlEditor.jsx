import { Editor } from "@tinymce/tinymce-react";

const HtmlEditor = ({ name, value, onChange, disabled }) => {
    const changeHandler = (data) => {
        onChange({ target: { name: name, value: data } });
    };
    return (
        <>
            <Editor
                value={value}
                disabled={disabled}
                onEditorChange={changeHandler}
                tinymceScriptSrc={process.env.PUBLIC_URL + "/js/tinymce/tinymce.min.js"}
                init={{
                    height: 500,
                    menubar: false,
                    plugins: "advlist autolink lists link image charmap preview anchor searchreplace visualblocks code fullscreen insertdatetime media table code help wordcount",
                    toolbar:
                        "undo redo |h1 h2 h3 h4 h5 h6 | p  | formatselect | bold italic backcolor | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | removeformat | link unlink | code fullscreen | help",
                    content_style: "body { font-family:Helvetica,Arial,sans-serif; font-size:14px }",
                    link_rel_list: [
                        { title: "None", value: "" },
                        { title: "Alternate", value: "alternate" },
                        { title: "Author", value: "author" },
                        { title: "Bookmark", value: "bookmark" },
                        { title: "External", value: "external" },
                        { title: "Help", value: "help" },
                        { title: "License", value: "license" },
                        { title: "Next", value: "next" },
                        { title: "No Follow", value: "nofollow" },
                        { title: "No Opener", value: "noopener" },
                        { title: "No Referrer", value: "noreferrer" },
                        { title: "Previous", value: "prev" },
                        { title: "Search", value: "search" },
                        { title: "Tag", value: "tag" },
                    ],
                }}
            />
        </>
    );
};

export default HtmlEditor;
