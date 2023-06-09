import React, { useState, useEffect } from "react";
import {
  listAll,
  ref,
  uploadBytesResumable,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";
import storage from "../firebase";
import { Button } from "@mantine/core";
import { Document, Page } from "react-pdf";
import { pdfjs } from "react-pdf";
import { IconFileFilled } from "@tabler/icons-react";
import { IconBrandWhatsapp } from "@tabler/icons-react";

// Set worker path for PDF.js
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

const AddFile = () => {
  const [fileList, setFileList] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [hoveredFile, setHoveredFile] = useState(null);
  const [numPages, setNumPages] = useState(null);
  const [isMobileOrTablet, setIsMobileOrTablet] = useState(false);

  useEffect(() => {
    fetchFiles();
    checkMobileOrTablet();
    window.addEventListener("resize", checkMobileOrTablet);
    return () => window.removeEventListener("resize", checkMobileOrTablet);
  }, []);

  const checkMobileOrTablet = () => {
    const isMobileOrTablet =
      window.innerWidth <= 1024 && window.innerHeight <= 1024;
    setIsMobileOrTablet(isMobileOrTablet);
  };

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

    if (isMobileOrTablet) {
      window.open(file.url, "_blank");
    }
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

  const handleJoinCommunity = () => {
    // Add your logic to handle joining the Whatsapp community
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

  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
  };

  return (
    <div className="p-2">
      <div className="flex flex-row gap-3 justify-center items-center">
        <img
          src="/logo512.png"
          alt="Exam Sathi"
          className="w-14 h-14 m-0 rounded-md"
        />
        <h1 className="text-center text-3xl font-bold font-sans text-blue-900">
          EXAM SATHI
        </h1>
      </div>
      <h3 className="text-center my-2 underline text-lg text-purple-950 font-semibold">
        सर्व स्पर्धा परीक्षेचे important notes आणि PDF इथे मिळतील अगदी Free.
      </h3>
      <div className="flex items-center gap-2 mb-4">
        <input
          type="file"
          onChange={handleFileChange}
          className="rounded-md p-3"
          accept=".pdf"
        />
        <Button
          onClick={handleFileUpload}
          className="bg-blue-500 rounded-lg p-2"
        >
          Upload!
        </Button>
      </div>
      <div className="flex flex-col lg:flex-row">
        <div className="w-full lg:w-2/5">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 border">
            {fileList.map((file) => (
              <div
                key={file.filename}
                className="flex flex-col items-center relative text-center p-2"
                onClick={() => handleFileClick(file)}
                onMouseEnter={() => setHoveredFile(file)}
                onMouseLeave={() => setHoveredFile(null)}
              >
                <IconFileFilled className="w-24 h-24" />
                <span>{file.filename}</span>
                <button
                  onClick={() => handleshare(file)}
                  className="absolute top-0 right-0"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="icon icon-tabler icon-tabler-brand-whatsapp"
                    width="30"
                    height="30"
                    viewBox="0 0 24 24"
                    strokeWidth="2"
                    stroke="green"
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                    <path d="M3 21l1.65 -3.8a9 9 0 1 1 3.4 2.9l-5.05 .9"></path>
                    <path d="M9 10a.5 .5 0 0 0 1 0v-1a.5 .5 0 0 0 -1 0v1a5 5 0 0 0 5 5h1a.5 .5 0 0 0 0 -1h-1a.5 .5 0 0 0 0 1"></path>
                  </svg>
                </button>
              </div>
            ))}
          </div>
        </div>
        {!isMobileOrTablet && (
          <div className="w-full lg:w-3/5 mt-4 lg:mt-0">
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
        )}
      </div>
      <div className="flex flex-col md:flex-row">
        <div className="w-[100%] md:w-[25%] relative bg-green-500 text-white p-4 rounded-lg shadow-lg md:left-auto m-1 md:top-auto md:transform-none md:fixed md:right-0 z-20">
          <div className="flex items-center justify-center space-x-2">
            <IconBrandWhatsapp size={30} />
            <span>Whatsapp जॉईन करा</span>
          </div>
          {/* <Button onClick={handleJoinCommunity} variant="light" size="sm">
            Join Now
          </Button> */}
        </div>

        <div className="flex items-center justify-start space-x-2 bg-black bg-opacity-70 w-[100%] md:w-[50%] lg:w-[30%]   text-white p-4 rounded-lg shadow-lg md:fixed md:left-4 md:bottom-4 m-1">
          <img
            src="/logo512.png"
            alt="Exam Sathi"
            className="w-full h-10 m-0"
          />
          <Button className="">
            Daily Revision आणि आणखी PDF साठी App Download करा
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AddFile;
