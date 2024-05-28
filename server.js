const express = require('express');
const app = express();
const PORT = 3001;


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
})

//get js and css file to work