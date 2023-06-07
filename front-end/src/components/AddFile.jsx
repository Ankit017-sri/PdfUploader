import React, { useState, useEffect } from "react";
import axios from "axios";
import { IconFileFilled } from "@tabler/icons-react";
import { CloseButton, Button } from "@mantine/core";
const AddFile = () => {
  const [file, setFile] = useState(null);
  const [fileList, setFileList] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [hoveredFile, setHoveredFile] = useState(null);

  const onFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const onFileUpload = async () => {
    if (!file) {
      alert("Please select a file");
      return;
    }
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "zujqz4jk");
    formData.append("folder", "community platform");
    try {
      const response = await axios.post(
        "https://api.cloudinary.com/v1_1/dsfvveqm2/raw/upload",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      console.log(response);
      // fetchFiles(); // Refresh file list after upload
    } catch (error) {
      console.error("Error uploading file: ", error);
    }
  };

  const fetchFiles = async () => {
    try {
      const response = await axios.get(
        "https://api.cloudinary.com/v1_1/dsfvveqm2/resources",
        {
          params: {
            prefix: "community platform/", // Replace with your folder name if applicable
            max_results: 500, // number of resources to return, defaults to 10 without this parameter
          },
          headers: {
            "X-Cloudinary-Api-Key": "171128434423736", // Replace with your Cloudinary API Key
          },
        }
      );
      console.log(response);
      setFileList(response.data.resources);
    } catch (error) {
      console.error("Error fetching files: ", error);
    }
  };

  const handleFileClick = (filename) => {
    setSelectedFile(filename);
  };

  useEffect(() => {
    fetchFiles();
  }, []);

  const handleDeleteFile = async (filename) => {
    try {
      await axios.delete(`http://localhost:3000/api/files/${filename}`);
      console.log("File deleted successfully");
      setSelectedFile(null);
      fetchFiles();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <div className="items-center p-2 flex gap-2">
        <input
          type="file"
          onChange={onFileChange}
          className=" rounded-md p-3"
        />
        <Button onClick={onFileUpload} className="bg-blue-500 rounded-lg p-3">
          Upload!
        </Button>
      </div>
      <div className="flex">
        <div className="w-[45%] h-[100vh] grid grid-cols-3 gap-4 border">
          {fileList.map((file) => (
            <div
              key={file.filename}
              className="flex flex-col items-center relative"
              onClick={() => handleFileClick(file.filename)}
              onMouseEnter={() => setHoveredFile(file.filename)}
              onMouseLeave={() => setHoveredFile(null)}
            >
              <IconFileFilled className="w-24 h-24" />
              <span>{file.originalname || file.filename}</span>
              <span className="truncate">
                ({(file.size / 1048576).toFixed(2)} MB)
              </span>
              {hoveredFile === file.filename && (
                <button
                  className="absolute top-0 right-0 p-2 text-gray-500 hover:text-red-500"
                  onClick={() => handleDeleteFile(file.filename)}
                  aria-label="Delete file"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    stroke-width="2"
                    stroke="currentColor"
                    fill="red"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  >
                    <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                    <path d="M18 6l-12 12"></path>
                    <path d="M6 6l12 12"></path>
                  </svg>
                </button>
              )}
            </div>
          ))}
        </div>
        <div className="w-[55%] m-2">
          {selectedFile ? (
            <div>
              <h3>Selected File: {selectedFile}</h3>
              <embed
                src={`http://localhost:3000/api/files/${selectedFile}`}
                width="100%"
                height="900px"
                type="application/pdf"
                target="_blank"
              />
            </div>
          ) : (
            <div className="flex items-center justify-center h-full">
              <h1>No Preview</h1>
              <img src="/NoPreview.png" alt="No Preview" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AddFile;
