const express = require("express");
const morgan = require("morgan");
const dotenv = require("dotenv");
const cors = require("cors");
const cookieParse = require("cookie-parser");

const { errorHandler, notFound } = require("./middlewares/errorMiddleware");

const AuthRouter = require("./routes/authRouter");
const UsersRouter = require("./routes/users");
const ServicesRouter = require("./routes/services");

const app = express();
dotenv.config();

app.use(express.json());
app.use(cookieParse());
app.use(morgan("dev"));
app.use(cors());

app.use("/api/v1/users", UsersRouter);
app.use("/api/v1/services", ServicesRouter);
app.use("/api/v1/auth", AuthRouter);

app.use(notFound);
app.use(errorHandler);

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server running on port ${port}`));
