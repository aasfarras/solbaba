import React, { useState, useRef, useEffect } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css"; // Import Quill styles

const Desk = ({ description, setDescription }) => {
  const [editorHtml, setEditorHtml] = useState(description); // Initialize with description
  const quillRef = useRef(null); // Create a ref for ReactQuill

  const handleChange = (value) => {
    setEditorHtml(value);
    setDescription(value); // Update description when editor changes
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(editorHtml); // You can send this data to the server or use it as needed
  };

  // Optional: Use useEffect to set initial description
  useEffect(() => {
    setEditorHtml(description);
  }, [description]);

  return (
    <form onSubmit={handleSubmit}>
      <ReactQuill
        ref={quillRef} // Attach the ref
        value={editorHtml}
        onChange={handleChange}
        modules={MyCustomModules}
        placeholder="Deskripsi"
        style={{
          border: "1px solid #eee",
          borderRadius: "5px",
          overflow: "hidden",
          height: 400,
          paddingBottom: 30,
        }}
      />
    </form>
  );
};

// Optional: Define custom modules for toolbar or other features
const MyCustomModules = {
  toolbar: [
    [{ header: [1, 2, false] }],
    ["bold", "italic", "underline"],
    [{ list: "ordered" }, { list: "bullet" }],
  ],
};

export default Desk;
