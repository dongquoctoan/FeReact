import React, { Component } from "react";
import ReactQuill, { Quill } from "react-quill";
// #1 import quill-image-uploader
import ImageUploader from "quill-image-uploader";
import ImageResize from "quill-image-resize-module-react";
import "react-quill/dist/quill.snow.css";

// #2 register module
Quill.register("modules/imageUploader", ImageUploader);
Quill.register("modules/imageResize", ImageResize);

class Editor extends Component {
  constructor(props) {
    super(props);
  }

  handleChangeContent = (content) => {
    this.props.onChange(content);
  };

  modules = {
    // #3 Add "image" to the toolbar
    toolbar: [
      [{ header: [1, 2, false] }],
      ["bold", "italic", "underline", "strike", "blockquote"],
      [{ align: [] }],
      [{ list: "ordered" }, { list: "bullet" }],
      ["link", "image"],
    ],
    // # 4 Add module and upload function
    imageUploader: {
      upload: (file) => {
        return new Promise((resolve, reject) => {
          const formData = new FormData();
          formData.append("file", file);

          fetch("/api/images", {
            method: "POST",
            body: formData,
          })
            .then((response) => response.json())
            .then((data) => {
              resolve(data.result.publicUrl);
            })
            .catch(() => {
              reject("Upload failed");
            });
        });
      },
    },
    imageResize: {
      parchment: Quill.import("parchment"),
      modules: ["Resize", "DisplaySize", "Toolbar"],
    },
  };

  render() {
    return (
      <ReactQuill
        theme="snow"
        modules={this.modules}
        value={this.props.value}
        onChange={this.handleChangeContent}
      />
    );
  }
}

export default React.memo(Editor);
