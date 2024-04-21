const mongoose = require('mongoose')

const password = "eDWj7N41VT6veTnq";
const url = `mongodb+srv://discordtemp15:${password}@cluster0.1tmf4ne.mongodb.net/testNoteApp?retryWrites=true&w=majority `;
mongoose.set('strictQuery', false);
mongoose.connect(url);

const noteSchema = new mongoose.Schema({
    content: String, 
    important: Boolean,
});

const Note = mongoose.model("Note", noteSchema);
const notes = [
    {
        content: "im not in the mood",
        important: false,
    },
    {
        content: "rn",
        important: true,
    },
];
const noteInstances = notes.map(noteData => new Note(noteData));
Note.insertMany(noteInstances);
Note.find({}).then(result => {
    result.forEach(note => {
      console.log(note)
    })
    mongoose.connection.close()
  })

