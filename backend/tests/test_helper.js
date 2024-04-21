

const Note = require("../models/note");
const initialNotes = [
    {content:"the 4 hrs thing", important:false},
    {content: "sounds to be the right thing", important: true}
  ];
const nonExistingId = async ()=> {
    const note = new Note({content:"tamweeh mesh aktar"});
    await note.save();
    await note.deleteOne();
    return note._id.toString();
};
const notesInDb = async ()=> {
    const notes = await Note.find({});
    return notes.map(note => note.toJSON());
}; 

module.exports = {initialNotes, nonExistingId, notesInDb}