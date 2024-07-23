const express = require("express");

const masterRouter = require("./routes/masterRoutes");
const UserRoutes = require("./routes/userRoutes");
const serviceRouter = require("./routes/serviceRoutes");


const app = express();
app.use(express.json()) 


app.use('/api/v1/masters', masterRouter);
app.use("/api/v1/services", serviceRouter);
app.use('/api/v1/users', UserRoutes);




module.exports = app