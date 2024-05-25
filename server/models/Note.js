const mongoose = require("mongoose");

const NoteSchema = new mongoose.Schema({
  text: {
    type: String,
    require: true,
  },
  content: {
    type: String,
    require: true,
  },
});

const NoteModel = mongoose.model("note", NoteSchema);

module.exports = NoteModel;
