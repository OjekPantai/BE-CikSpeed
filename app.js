const express = require("express");
const morgan = require("morgan");
const dotenv = require("dotenv");
const cors = require("cors");
const cookieParse = require("cookie-parser");

const { errorHandler, notFound } = require("./middlewares/errorMiddleware");

const AuthRouter = require("./routes/authRouter");
const OrderRouter = require("./routes/orderRouter");
const UsersRouter = require("./routes/userRouter");
const ServicesRouter = require("./routes/serviceRouter");

const app = express();
dotenv.config();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParse());
app.use(morgan("dev"));
app.use(cors());

app.use("/api/v1/users", UsersRouter);
app.use("/api/v1/services", ServicesRouter);
app.use("/api/v1/auth", AuthRouter);
app.use("/api/v1/orders", OrderRouter);

app.use(notFound);
app.use(errorHandler);

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server running 🚀 on port ${port}`));
