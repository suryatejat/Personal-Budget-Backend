// Budget API
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const compression = require('compression');

const budgetRoute = require("./Routes/budgetRoute");
const expenseRoute = require("./Routes/expenseRoute");
const userRoute = require("./Routes/userRoute");

const app = express();
const port = process.env.PORT || 3000;
const mongoURL = "mongodb+srv://admin:admin@nbad.ur6szqh.mongodb.net/personalBudget?retryWrites=true&w=majority&appName=NBAD";

// Middleware
app.use(cors({
    origin: '', // Allow requests from localhost:4200
    credentials: true  // Enable CORS with credentials
}));
app.options('*', cors());

app.use(compression()); // gzip Compression
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true}));

app.use("/api/budget", budgetRoute);
app.use("/api/expense", expenseRoute);
app.use("/api/user", userRoute);

app.use((req, res, next) => {
    res.status(400).send("Invalid Route!");
})

try {
    mongoose.connect(mongoURL);
    console.log("Connected to Mongo-Database");
    app.listen(port, () => {
        console.log(`API served at Port ${port}`)
    });
} catch (error) {
    console.error("Error Connecting to Mongo-Database", error);
}