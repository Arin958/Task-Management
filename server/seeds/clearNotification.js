require("dotenv").config(
    {
        path: "../.env"
    }
);
const mongoose = require("mongoose");

const Notification = require("../models/Notification");

const mongodbUrl = process.env.MONGODB_URI;




const connectDb = async () => {
    try {
        const conn = await mongoose.connect(mongodbUrl);
        console.log(`MongoDB connected: ${conn.connection.host}`);
    } catch (error) {
        console.log(`Error: ${error.message}`);
        process.exit(1);
    }
};

connectDb().then(() => {
    Notification.deleteMany({}).then(() => {
        console.log("Notifications cleared");
        process.exit(0);
    });
});



