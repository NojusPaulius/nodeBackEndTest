const mongoose = require("mongoose");

const serviceSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Service name cannot be left empty"]
    },
    address: {
        type: String,
        required: [true, "Address cannot be left empty"]
    },
    owner: {
        type: String,
        required: [true, "You must type in an owner"]
    },
    createdAt: {
        type: Date,
        default: Date.now()
    }
})

const Service = mongoose.model("Service", serviceSchema);

module.exports = Service;