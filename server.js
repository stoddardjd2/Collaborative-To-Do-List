const fs = require('fs');
const express = require('express');
const app = express();
const PORT = 3001;
const path = require('path');

app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.listen(PORT, () => {
  console.log("Server running on port: " + PORT)
});

app.get('/', (req, res) =>
  res.sendFile(path.join(__dirname, '/public/index.html'))
);

app.post('/save', (req, res) => {
  console.log(req.body);
  res.send("sending post response");
  fs.writeFile('notes.json', JSON.stringify(req.body), function(err){
    if(err)throw err;
    console.log("saved!");
  });
});

app.get('/loadNotes',(req,res)=>{
  res.sendFile(path.join(__dirname, 'notes.json'));



  /*fs.readFile('notes.json', 'utf-8', (err, data) => {
    if (err) {
        throw err;
    }
    console.log(data); // Display the file contents
    res.send(data);
});*/

});


//save current notes obtained from post request to a json file



//get js and css file to work