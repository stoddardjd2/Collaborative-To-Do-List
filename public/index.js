
let notes = [];

window.onload = function () {
  var newNoteBtn = document.getElementById("newNote");
  var saveBtn = document.getElementById('save');

  newNoteBtn.addEventListener("click", function () {
    var ul = document.getElementById("notes");
    var li = document.createElement('li');
    var textarea = document.createElement('textarea');
    textarea.innerHTML="new note!";
    li.appendChild(textarea);
    ul.appendChild(li);
    //create new li and text area elements and add them to the ul to be used as a new note
  })
  //check if add new note button is clicked and adds note if so

  saveBtn.addEventListener("click", function () {
    var list = document.getElementById("notes").getElementsByTagName("li");
    notes = [];
    //clear notes before adding current notes to object
    for (i = 0; i <= list.length - 1; i++) {
      var text = list[i].getElementsByTagName("textarea")[0].value;

      console.log("text:");
      console.log(text);
      notes.push({
        id: i,
        noteText: text
      })
    }
    //save innerText of each li to an object to be sent as a post request

    console.log(notes)

    saveReq();
    //get text value of each li to be sent to server and saved in database

    //add feature to detect which notes were changed and save only what is needed



  });
}






function saveReq() {
  fetch('/save', {
    method: "POST",
    body: JSON.stringify({
      notes
    }),
    headers: {
      "Content-type": "application/json; charset=UTF-8"
    }
  })
}

