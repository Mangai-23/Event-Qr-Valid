const mongoose = require("mongoose");

const SignupSchema = new mongoose.Schema({
    fname: {
        type: String,
        required: true,
    },
    phone: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    pass: {
        type: String,
        required: true,
    }
});

const Signup = mongoose.model("signup", SignupSchema);
module.exports = Signup;