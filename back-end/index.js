const express = require("express");
const cors = require("cors");
const app = express();
const fileRoute = require("./route");
app.use(cors());
app.use(express.json());

app.use("/api", fileRoute);
app.use(express.static("uploads")); 
app.use(express.static("files")); 

app.listen(3000, () => {
  console.log("Server started on port 3000");
});
