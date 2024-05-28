console.log("javascript running!");


window.onload = function () {
    var btn = document.getElementById('btn');
    btn.addEventListener("click", function confirm() {
        var list = document.getElementById("notes").getElementsByTagName("li");

        for(i=0;i<=list.length-1;i++){
            var liText = list[i].innerText;
        }

        saveReq();
        //get text value of each li to be sent to server and saved in database

        //add feature to detect which notes were changed and save only what is needed
        console.log("running!");
        console.log("stringify: "+JSON.stringify("plase works!", "more data", 123));
    });
}

function saveReq(){
    fetch('/save', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          body: JSON.stringify('testing!') 
        }
      })
}
