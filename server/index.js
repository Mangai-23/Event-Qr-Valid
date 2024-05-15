const express = require("express");
const cors = require("cors");
const Event = require("./models/event");
const userRegister = require("./models/userRegistration");
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

const mongoose = require("mongoose");
require("dotenv").config();

const mongoURI = process.env.MONGO_URI;

mongoose
    .connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log("Connected to MongoDB!");
    })
    .catch((error) => {
        console.error("Error connecting to MongoDB:", error.message);
    });

// Keep track of used QR codes
const usedQRCodes = new Set();

app.post("/eventfind", async (req, res) => {
    const { eventid } = req.body;
    console.log(eventid);
    try {
        const r = await Event.findOne({ eventid });
        res.json(r);
    } catch (err) {
        console.log(err);
    }
});

app.post("/personfind", async (req, res) => {
    const { participantid } = req.body;
    console.log(participantid);
    try {
        const user = await userRegister.findOne({ participantid });
        if (user) {
            res.json({ participantid: user.participantid, bool: user.bool });
        } else {
            res.status(404).json({ error: "Participant not found" });
        }
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

app.post("/valid", async (req, res) => {
    console.log("Inside Valid Func");
    const { participantid , eventid} = req.body;
    console.log("Valid Func: ", participantid);
    const updateUser = await userRegister.findOne({participantid: participantid,eventid: eventid});
    const toshow = updateUser.bool
    console.log("Toshow: ",toshow);
    try {
        if (!toshow) {
            // If QR code is already used, respond with error
            return res.json({ error: "QR code already used" });
        }
        const updatedUser = await userRegister.findOneAndUpdate(
            { participantid: participantid },
            { $set: { bool: "false" } },
            { new: true }
        );
        res.json(updatedUser);
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

app.listen(5000, () => {
    console.log("Running...");
});
