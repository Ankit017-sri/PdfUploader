import React, { useState, useEffect } from "react";
import {
  listAll,
  ref,
  uploadBytesResumable,
  getDownloadURL,
  deleteObject, // Add this import statement
} from "firebase/storage";
import storage from "../firebase";
import { IconFileFilled } from "@tabler/icons-react";
import { Button } from "@mantine/core";

const AddFile = () => {
  const [fileList, setFileList] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [hoveredFile, setHoveredFile] = useState(null);

  useEffect(() => {
    fetchFiles();
  }, []);

  const fetchFiles = async () => {
    try {
      const storageRef = ref(storage, "community platform");
      const filesList = await listAll(storageRef);

      const files = await Promise.all(
        filesList.items.map(async (fileRef) => {
          const url = await getDownloadURL(fileRef);
          return {
            filename: fileRef.name,
            url: url,
          };
        })
      );

      setFileList(files);
    } catch (error) {
      console.error("Error fetching files: ", error);
    }
  };

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile && selectedFile.type !== "application/pdf") {
      alert("Please select a PDF file");
      return;
    }
    setSelectedFile(selectedFile);
  };

  const handleFileUpload = async () => {
    if (!selectedFile) {
      alert("Please select a file");
      return;
    }

    try {
      const storageRef = ref(
        storage,
        "community platform/" + selectedFile.name
      );
      await uploadBytesResumable(storageRef, selectedFile);
      alert("File uploaded successfully!");
      fetchFiles();
    } catch (error) {
      console.error("Error uploading file: ", error);
      alert("An error occurred while uploading the file.");
    }
  };

  const handleFileClick = (file) => {
    setSelectedFile(file);
  };

  const handleDeleteFile = async (filename) => {
    try {
      const storageRef = ref(storage, `community platform/${filename}`);
      await deleteObject(storageRef);
      console.log("File deleted successfully");
      setSelectedFile(null);
      fetchFiles();
    } catch (error) {
      console.error("Error deleting file: ", error);
      alert("An error occurred while deleting the file.");
    }
  };

const handleshare = (file) => {
  const message = `Check out this PDF: `;
  const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(
    `${message}[${file.filename}](${file.url})`
  )}`;
  const link = document.createElement("a");
  link.href = whatsappUrl;
  link.target = "_blank";
  link.click();
};








  return (
    <div>
      <div className="items-center p-2 flex gap-2">
        <input
          type="file"
          onChange={handleFileChange}
          className="rounded-md p-3"
          accept=".pdf"
        />
        <Button
          onClick={handleFileUpload}
          className="bg-blue-500 rounded-lg p-3"
        >
          Upload!
        </Button>
      </div>
      <div className="flex">
        <div className="w-[45%] h-[100vh] grid grid-cols-3 gap-4 border">
          {fileList.map((file) => (
            <div
              key={file.filename}
              className="flex flex-col items-center relative"
              onClick={() => handleFileClick(file)}
              onMouseEnter={() => setHoveredFile(file)}
              onMouseLeave={() => setHoveredFile(null)}
            >
              <IconFileFilled className="w-24 h-24" />
              <span>{file.filename}</span>
              <span className="truncate">
                {(file.size / 1048576).toFixed(2)} MB
              </span>
              {hoveredFile === file && (
                <div>
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
                      strokeWidth="2"
                      stroke="currentColor"
                      fill="red"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                      <path d="M18 6l-12 12" />
                      <path d="M6 6l12 12" />
                    </svg>
                  </button>
                  <button onClick={() =>handleshare(file)}>Share</button>{" "}
                </div>
              )}
            </div>
          ))}
        </div>
        <div className="w-[55%] m-2">
          {selectedFile ? (
            <div>
              <h3>Selected File: {selectedFile.filename}</h3>
              <embed
                src={selectedFile.url}
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
