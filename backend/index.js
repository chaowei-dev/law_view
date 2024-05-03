import express from "express";
import session from "express-session";
import passport from "passport";
import cors from "cors";
import initializePassport from "./config/passport.js";
import booksRouter from "./routes/books.js";
import usersRouter from "./routes/users.js";
import casesRouter from "./routes/cases.js";

const app = express();

app.use(express.json());
app.use(
  session({
    secret: "secret_key",
    resave: false,
    saveUninitialized: false,
  })
);

// CORS
const corsOptions = {
  origin: "*", // Allow all origins
  credentials: true, // Needed for sites hosted on a different domain to send cookies
};
app.use(cors(corsOptions));

// Initialize Passport with configured strategies
initializePassport(passport);
app.use(passport.initialize());
app.use(passport.session());

// Routes
app.use("/api/books", booksRouter);
app.use("/api/users", usersRouter);
app.use("/api/cases", casesRouter);

const PORT = process.env.PORT || 3001;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});
