const mongoose = require("mongoose");

const masterSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: [true, "You must put in first name"]
    },
    lastName:{
        type: String,
        required: [true, "You must put in last name"]
    },
    specialization: {
        type: String,
        required: [true, "Specialization field cannot be left empty"]
    },
    picture:{
        type: String,
        required: [true, "You must put in an image url"]
    },
    city: {
        type: String,
        required: [true, "You must type in a city"]
    },
    service:{
        type: String,
        required: [true, "You must select a service"]
    },
    createdAt: {
        type: Date,
        default: Date.now()
    },
    // toJson: {virtuals: true},
    // toObject: {virtuals: true}
})




const Master = mongoose.model("Master", masterSchema);

module.exports = Master;