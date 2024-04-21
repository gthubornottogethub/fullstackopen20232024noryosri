

const mongoose = require("mongoose");
const supertest = require("supertest");
const helper = require("./test_helper");
const bcrypt = require("bcrypt");
const app = require("../app");
const api = supertest(app);
const Note = require("../models/note");
const User = require("../models/user");

beforeEach(async () => {
  await Note.deleteMany({})

  const noteObjects = helper.initialNotes
    .map(note => new Note(note))
  const promiseArray = noteObjects.map(note => note.save())
  await Promise.all(promiseArray)
})

test("notes are returned as json, as they should", async ()=> {
    await api.get('/api/notes').expect(200).expect('Content-Type', /application\/json/); 
});
test('all notes are returned', async () => {
    const response = await api.get('/api/notes'); 
    expect(response.body).toHaveLength(helper.initialNotes.length);});

test('a specific note is within the returned notes', async () => {  
  const response = await api.get('/api/notes');
  const contents = response.body.map(r => r.content) ; 
  expect(contents).toContain('sounds to be the right thing')});

test("addition of a new note", async ()=> { 
  const newNote = {content:"i be on discord", important: true};
  await api
  .post("/api/notes")
  .send(newNote)
  .expect(201)
  .expect("Content-Type", /application\/json/);

  const notesAtEnd = await helper.notesInDb();
  expect(notesAtEnd).toHaveLength(helper.initialNotes.length + 1);
  const contents = notesAtEnd.map(n => n.content);
  expect(contents).toContain("i be on discord");
});

/*Let's also write a test that verifies that a note 
without content will not be saved into the database. */

test("a note without content will not be saved", async ()=>{
  const newNote = {important:true};
  await api
  .post("/api/notes")
  .send(newNote)
  .expect(400); 

  const notesAtEnd = await helper.notesInDb();
  expect(notesAtEnd).toHaveLength(helper.initialNotes.length);
});

test('a specific note can be viewed', async () => {
  const notesAtStart = await helper.notesInDb()
  const noteToView = notesAtStart[0]
  const resultNote = await api
  .get(`/api/notes/${noteToView.id}`)
  .expect(200)
  .expect('Content-Type', /application\/json/);

  expect(resultNote.body).toEqual(noteToView)
})

test('a note can be deleted', async () => {
  const notesAtStart = await helper.notesInDb()
  const noteToDelete = notesAtStart[0]

  await api
  .delete(`/api/notes/${noteToDelete.id}`)
  .expect(204);

  const notesAtEnd = await helper.notesInDb()

  expect(notesAtEnd).toHaveLength(
    helper.initialNotes.length - 1
  )

  const contents = notesAtEnd.map(r => r.content)

  expect(contents).not.toContain(noteToDelete.content)
});

describe("when there is initially one user in the database", ()=>{
   beforeEach( async ()=>{
      await User.deleteMany({});
      const passwordHash = await bcrypt.hash("sekret", 10);
      const user = new User({username: "root", passwordHash});
      await user.save(); });

   test("creation succeeds with a fresh username", async ()=>{
       const usersAtStart = await helper.usersInDb();
       const newUser = {
           username: "therealmrest",
           name: "cornel west",
           password: "nocap11",
             };
        await apit.post("/api/users").send(newUser).expect(201)
        .expect("Content-Type", /application\/json/ );

        const usersAtEnd = await helper.usersInDb();
        assert.strictEqual(usersAtEnd.length, usersAtStart.length + 1)
        const usernames = usersAtEnd.map(u => u.username);
        assert(usernames.includes(newUser.username))
 })
  
afterAll(async ()=> {
    await mongoose.connection.close();
});