
const Note = ({note, toggleImportance}) => { 
  const label = note.important ? 'de-importanize' : "make important"
    return (
      <li className="note">
       {note.content} 
       <button onClick={toggleImportance}>{label}</button>
      </li>
    )
  }

export default Note 

//git add .
//git commit -m "Your meaningful commit message here"
//git push origin <branch>
