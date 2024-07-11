import express, { Request, Response, Application } from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./mongodb/connect";
import cookieParser from "cookie-parser";
import session from "express-session";

dotenv.config();

const app: Application = express();
const port = process.env.PORT || 8000;

app.use(cors());
// app.use(logger("dev"));
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
// app.use(express.static(path.join(__dirname, "public")));
// app.use(fileUpload());
app.use(
  session({ secret: "key", resave: true, saveUninitialized: true, cookie: { maxAge: 600000 } })
);

app.get("/", (req: Request, res: Response) => {
  res.send(`Welcome to "Shopping Bazaar" e-commerce web application api server`);
});
// app.use("/api/v1/users", userRouter);
// app.use("/users", userRouter);

(async () => {
  if (!process.env.MONGODB_URL) throw new Error("MongoDB url is missing");
  try {
    connectDB(process.env.MONGODB_URL);

    app.listen(port, () => console.log(`Server started on port http://localhost:${port}`));
  } catch (err) {
    console.log(err);
  }
})();
