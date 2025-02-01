import express, { Request, Response } from "express";
import { MongoClient } from "mongodb";
import mongoose from "mongoose";
import cors from "cors";
import path from "path";
import dotenv from "dotenv";

import { CustomError } from "./interfaces/ierror";
import httpStatus from "./utils/httpStatusText";
import coursesRouter from "./routes/courses.router";
import usersRouter from "./routes/user.router";


dotenv.config();
const app = express();


app.use("/uploads", express.static(path.join(__dirname, "uploads")));

const port: number = parseInt(process.env.PORT || "3009");
const url: string = process.env.MONGO_URL || "your_default_mongo_url";

const client = new MongoClient(url);
const dbname = "TestNodeMongo";

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
  main();
});

app.use(cors());
app.use(express.json());

app.use("/api/courses", coursesRouter);
app.use("/api/users", usersRouter);

//global middleware for not found routes
// app.all("*", (req, res, next) => {
//   res
//     .status(404)
//     .json({
//       status: httpStatusText.ERROR,
//       message: "this resourse is not available ",
//     });
// });

//global error handler

app.use((error: CustomError, req: Request, res: Response) => {
  res.status(error.statusCode || 500).json({
    status: error.statusText || httpStatus.ERROR,
    message: error.message,
    code: error.statusCode || 500,
    data: null,
  });
});

mongoose
  .connect(url)
  .then(() => console.log("Connected to MongoDB"))
  .catch((error: Error) =>
    console.error("Could not connect to MongoDB :--> ", error)
  );

async function main() {
  try {
    await client.connect();
    console.log("Connected successfully to server");

    const db = client.db(dbname);
    const collection = db.collection("courses");

    // await collection.insertOne({
    //   name: "Next.js",
    //   price: 600,
    // })

    const data = await collection.find().toArray();
    console.log("data : ", data);
  } catch (error) {
    console.error("Error ==> ", error);
  }
}

// app.use(express.static('./views'))

// ==============    middleware   ================

// app.use('/form',(req, res, next) => {
//     console.log('method : ' , req.method, 'URL : ' , req.url);
//     next();
// })

// app.use(morgan ('dev') )

// app.get("/", (req, res) => {
//     res.send("<h1>home page </h1>");
// });
// app.get("/hello", (req, res) => {
//     res.send("hello in node js");
// });
// app.get("/test", (req, res) => {
//     res.send("hi in node js test");
// });
// app.get("/addcomment", (req, res) => {
//     res.send("post req on add comment");
// });

// ======  API all courses  =========
