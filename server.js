const fs = require('fs');
const express = require('express');
const app = express();
const PORT = 3001;
const path = require('path');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const secretKey = 'secret!';


let users= [];
//temporary arrary to store users in server for developmental purposes.
//add database later


//Middleware:
app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


const authenticateToken = (req,res, next)=>{
  const authHeader = req.headers['authorization'];
  console.log(authHeader);

  const token = authHeader.replaceAll('"', '');
//remove "" from string 

  console.log("i am here")
  console.log(token);


  if(!token) return res.status(401).send('Token required');

  jwt.verify(token, secretKey,(err, user)=>{
    if(err) return res.status(403).send('Invalid or expired token');
    req.user = user;
    next();
  });
};


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

});

app.post('/signup',async(req, res)=>{
  const{username, password}=req.body;

  const hashedPassword = await bcrypt.hash(password,8);
  //convert password to hash

  users.push({username, password: hashedPassword});
  res.status(201).send('User added!');

});
//why async???

//login, validate user, and create token
app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  const user = users.find(u => u.username === username);

  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(401).send('Invalid credentials');
  }

  // Generate token
  const token = jwt.sign({ userId: user.username }, secretKey, { expiresIn: '1h' });

  res.status(200).send({ token });
});

//generating JWT

app.get('/dashboard', authenticateToken, (req, res) => {
  console.log(req);
  res.status(200).send('Welcome to the dashboard, ' + req.body.username);

 // res.status(200).send('Welcome to the dashboard, ' + req.user.userId);
});


