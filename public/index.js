
let notes = [];

window.onload = function () {
  var newNoteBtn = document.getElementById("newNote");
  var saveBtn = document.getElementById('save');
  var deleteBtn = document.getElementById('delete')
  var list = document.getElementById("notes").getElementsByTagName("li");
  var ul = document.getElementById("notes");
  var textArea = document.getElementsByClassName("text");
  var hasEventListener;


  newNoteListener();
  saveNoteListener();
  deleteNoteListener()

  function newNoteListener() {
    newNoteBtn.addEventListener("click", function () {
      var li = document.createElement('li');
      var textarea = document.createElement('textarea');
      textarea.innerHTML = "new note!";
      li.appendChild(textarea);
      ul.appendChild(li);
      //create new li and text area elements and add them to the ul to be used as a new note
    })
    //check if add new note button is clicked and adds note if so
  }

  function saveNoteListener() {
    saveBtn.addEventListener("click", function () {
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



  function deleteNoteListener() {
    deleteBtn.addEventListener("click",selectNotes);
  }
  //when delete btn clicked, function to select notes to delete is called




  function selectNotes() {
    if (!hasEventListener) {
      //check if event listener already added and prevent duplicates 
      hasEventListener = true;
      console.log("adding listener!")
      console.log("select an item now")

      ul.addEventListener("click", function removeSelected(e) {
        var selection = e.target;

        console.log(selection.parentNode);

        if (selection.type == "textarea") {
          //only allow textArea to be selected
          console.log("delete approved");

          selection.parentNode.remove();
          //delete both the textarea and its parent li element
          //!!!implement undo feature, save deleted element after deletion to recover, save multiple to array to cycle through multiple undo requests
          console.log("removing event")
          ul.removeEventListener("click", removeSelected);
          hasEventListener = false;
        }
      }, { once: true });
    } else {
      console.log("event listener detected, cancelling new listener");
    }
  }

}
//allows user to select items to delete

