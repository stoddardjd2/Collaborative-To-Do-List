
let notes = [];

window.onload = function () {
  var newNoteBtn = document.getElementById("newNote");
  var saveBtn = document.getElementById('save');
  var deleteBtn = document.getElementById('delete')
  var list = document.getElementById("notes").getElementsByTagName("li");
  var ul = document.getElementById("notes");
  var undoBtn = document.getElementById("undo");
  var hasEventListener;

  var undoTracker = [];

  loadNotes();
  newNoteListener();
  saveNoteListener();
  deleteNoteListener();
  undoListener();

  function newNoteListener() {
    newNoteBtn.addEventListener("click", function () {
      var li = document.createElement('li');
      var textarea = document.createElement('textarea');
      textarea.innerHTML = "new note!";
      li.appendChild(textarea);
      ul.appendChild(li);


      undoTracker.push({
        action: "remove",
        element: li
      });
      //track elements to undo 

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
    deleteBtn.addEventListener("click", selectNotes);
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
          console.log("removing event")
          ul.removeEventListener("click", removeSelected);

          undoTracker.push({
            action:"recover",
            element: selection.parentNode
          })

          console.log
          //track deleted elements to be used in undo feature

          hasEventListener = false;
        }
      }, { once: true });
    } else {
      console.log("event listener detected, cancelling new listener");
    }
  }
  //allows user to select items to delete


  function loadNotes() {
    fetch("/loadNotes", {
      method: "GET",
    }).then((response) => {
      if (response.ok) {
        return response.json();
      } else {
        throw new Error('no save file detected to load notes');

      }
    })
      .then((json) => {

        console.log(json.notes.length);
        for (i = 0; i < json.notes.length; i++) {
          var noteText = json.notes[i].noteText;
          createAndAppendList(noteText);
        }
        // Handle the successful response
      })
      .catch((error) => {
        console.log(error);
      });
  }



  //fetch notes document as json file

  function createAndAppendList(text) {
    var newLi = document.createElement("li");
    var newTextArea = document.createElement("textarea");
    newTextArea.innerHTML = text;

    newLi.appendChild(newTextArea);
    ul.appendChild(newLi);
  }

  function undoListener() {
    undoBtn.addEventListener("click", function () {
      undoTarget = undoTracker.pop();

      try{
      if (undoTarget.action == "remove") {
        console.log("removing");
        undoTarget.element.remove();
        //remove last added element
      } if(undoTarget.action=="recover"){
        console.log("recovering");
        ul.appendChild(undoTarget.element);

        //re-add last deleted element
      }
    }catch(err){
      console.log("nothing to undo!")
      }

    })

  }
  //iterates through an array of objects that store each posssible undo request. undo request then sorted based on action needed to be peformed to complete the undo request

}
