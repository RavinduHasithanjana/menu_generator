const X = require("./gen.js");
const {
  inputFormat,
  inputFormatStyle,
  outputFormat,
  categoryList,
  styleList,
  modelList,
  readJsonFile,
  formatPrompt,
  loadPrompt,
} = X;
const express = require("express");
const cors = require("cors");
const multer = require("multer");
const app = express();
const upload = multer({
  dest: "./uploads/",
  filename: (req, file, cb) => {
    const uniqueName = `${uuid.v4()}.${file.originalname.split(".").pop()}`;
    cb(null, uniqueName);
  },
});
app.use(express.json());
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    maxAge: 3600,
  })
);

process.on("uncaughtException", (error) => {
  console.error("Uncaught:", error);
});

// curl -X POST http://localhost:3005/gen -H 'Content-Type: application/json' -d '{"dishName": "Ginger Ale" , "styleName": null, "language": "English" }'
// curl -X POST -F "image=@/home/user/Desktop/2249538.png" http://localhost:3005/api/upload-image

app.post("/gen", async (req, res) => {
  const {
    dishName,
    styleName,
    language,
    model,
    userPrompt,
    styleList,
    categoryList,
  } = req.body;
  console.log(
    dishName,
    styleName,
    language,
    model,
    userPrompt,
    styleList,
    categoryList
  );
  if (!dishName) {
    res.status(400).send({ error: "Dish name is required" });
  } else {
    ans = await X.generateDishDescription(
      dishName,
      styleName,
      language,
      model,
      userPrompt,
      styleList,
      categoryList
    );
    res.send(ans);
  }
});

app.post("/api/upload-image", upload.single("image"), async (req, res) => {
  try {
    // Process image upload
    const imagePath = req.file.path;
    console.log(imagePath);

    res.json({
      message: `Image uploaded: ${req.file.filename}`,
      id: req.file.filename,
    });
    //res.json({ message: 'Image uploaded successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error uploading image" });
  }
});

app.get("/image_recognition_url/:url", async (req, res) => {
  try {
    const imageURL = req.params.url;

    //await new Promise(resolve => setTimeout(resolve, 2000));

    modelAnswer = `Can't recognize food on item / or error`;
    try {
      modelAnswer = await X.imageRecognitionOpenai(`${imageURL}`);
      console.log(JSON.stringify(modelAnswer, null, 2));
    } catch (e) {
      console.log(e);
    }

    res.json({ url: imageURL, modelAnswer: modelAnswer });
    //res.json({ message: 'Image uploaded successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error uploading image" });
  }
});

app.get("/image_recognition/:name", async (req, res) => {
  try {
    const imageName = req.params.name;

    console.log(imageName);

    //await new Promise(resolve => setTimeout(resolve, 2000));

    modelAnswer=`Can't recognize food on item / or error`
    try {
      modelAnswer = await X.imageRecognitionOpenai(
        `${X.JS_SERVER_URL}image/${imageName}`
      );

      console.log(JSON.stringify(modelAnswer, null, 2));
    } catch (e) {
      console.log(e);
    }

    res.json({
      message: `Image uploaded: ${imageName}`,
      id: imageName,
      modelAnswer: modelAnswer,
    });
    //res.json({ message: 'Image uploaded successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error uploading image" });
  }
});

app.get("/image/:name", (req, res) => {
  const imageName = req.params.name;
  const imagePath = `./uploads/${imageName}`;
  res.sendFile(imagePath, { root: "." });
});

app.get("/get_info", (req, res) => {
  //const styles=['-']+[...styleList]
  res.json({ styleList, categoryList, modelList });
});

const port = 3005;
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
