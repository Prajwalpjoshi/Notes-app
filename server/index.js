const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const NoteModel = require("./models/Note");
const dotenv = require("dotenv");
const path = require("path");

// Load environment variables from .env file
dotenv.config();

const port = process.env.PORT || 3001;
const app = express();

// Database connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Middleware
app.use(express.json());
app.use(cors());

// static file access
app.use(express.static(path.join(__dirname, "../client/build")));

app.get("*", function (req, res) {
  res.sendFile(path.join(__dirname, "../client/build/index.html"));
});

// Get notes
app.get("/getNote", async (req, res) => {
  try {
    const notes = await NoteModel.find({});
    res.json(notes);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Modify note
app.post("/modifyNote", async (req, res) => {
  const { _id, text, content } = req.body;
  try {
    const updatedNote = await NoteModel.findByIdAndUpdate(
      _id,
      { text, content },
      { new: true }
    );
    res.json(updatedNote);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete note
app.post("/deleteNote", async (req, res) => {
  const id = req.body._id;
  try {
    const result = await NoteModel.deleteOne({ _id: id });
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create note
app.post("/createNote", async (req, res) => {
  const note = req.body;
  try {
    const newNote = new NoteModel(note);
    await newNote.save();
    res.json(note);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Start server
app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
