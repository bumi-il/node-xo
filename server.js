const express = require("express")
const app = express()
const mongoose = require("mongoose")

const mongoUri ="mongodb+srv://th8322281:th8322281@cluster0.ez3nz.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
mongoose.connect(mongoUri)

app.use(express.json())

app.listen(3000,console.log("Server is running on http://localhost:3000"));
