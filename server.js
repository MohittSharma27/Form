const express = require("express");
const mongoose = require("mongoose");
const path = require("path")


const app = express();
const port = 3000;

// ✅ Better way — serve static files from a 'public' or specific folder
app.use(express.static(path.join(__dirname, "public")));


// Define schema for user
const dbschema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
    },
    lastName: {
        type: String,
    },
    email: {
        type: String,
        required: true,
        unique: true,  // Enforce unique email
    },
    phoneNo: {
        type: Number,
        required: true,
        unique: true,  // Enforce unique phone number
    },
});

const User = mongoose.model("user", dbschema);

// Connect to MongoDB
mongoose.connect("mongodb://127.0.0.1:27017/formData", { // Fix: Port 27017 for MongoDB
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log("Connected to MongoDB successfully!");
}).catch((err) => {
    console.log("Error connecting to MongoDB", err);
});

// Middleware to parse form data
app.use(express.urlencoded({ extended: true}));
app.use(express.json());

app.get("/", (req, res)=>{
    res.sendFile(path.join(__dirname, "index.html"))
})

app.post("/submit", async (req, res) => {
    const body = req.body;

    // Validation: Check if required fields are provided
    if (!body.firstName || !body.email || !body.phoneNo) {
        return res.status(400).json({ message: "Please fill all required fields." });
    }

    try {
        // Create new user in the database
        const newUser = await User.create({
            firstName: body.firstName,
            lastName: body.lastName,
            email: body.email,
            phoneNo: body.phoneNo,
        });

        // Send success response with user data
        return res.status(201).json({ message: "User created successfully"});
    } catch (err) {
        console.error('Error during form submission:', err);  // Log the error details
        if (err.code === 11000) { // MongoDB duplicate key error
            return res.status(400).json({ message: "Email or Phone number already exists." });
        }
        return res.status(500).json({ message: "Internal Server Error", error: err.message });
    }
});


// Start the server
app.listen(port, () => {
    console.log(`Server started on http://localhost:${port}`);
});
