console.log("javascript running!");

let notes = [];

window.onload = function () {
    var btn = document.getElementById('btn');
    btn.addEventListener("click", function confirm() {
        var list = document.getElementById("notes").getElementsByTagName("li");
        notes = [];
        //clear notes before adding current notes to object
        for(i=0;i<=list.length-1;i++){
            var text = list[i].getElementsByTagName("textarea")[0].value;
            
            console.log("text:");
            console.log(text);
            notes.push({
              id:i,
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


function saveReq(){
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

