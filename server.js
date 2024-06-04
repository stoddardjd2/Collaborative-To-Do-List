const fs = require('fs');
const express = require('express');
const app = express();
const PORT = 3001;
const path = require('path');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const secretKey = 'secret!';
var usersObj;

//temporary arrary to store users in server for developmental purposes.
//add database later


//Middleware:
app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

loadUsers();

  //loads all user data and saves as an object. Passwords have been previously hashed
function loadUsers(){
  fs.readFile('./users.json','utf-8',(err, data)=>{
    if (err) {
      throw err;
  }
  usersObj = JSON.parse(data);
  });
}

const authenticateToken = (req,res, next)=>{

  const authHeader = req.headers['authorization'];

  if(!authHeader) return res.status(401).send("Token required");

  const token = authHeader.replaceAll('"', '');
//remove "" from string 

  jwt.verify(token, secretKey,(err, user)=>{
    if(err) return res.status(403).send('Invalid or expired token');
    req.user = user;
    next();
    console.log("verified token")
  });
};


app.listen(PORT, () => {
  console.log("Server running on port: " + PORT)
});

app.get('/notes',authenticateToken, (req, res) =>{
  console.log("test");
  res.sendFile(path.join(__dirname, '/public/index.html'))
}
);

app.post('/save',authenticateToken, (req, res) => {
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

app.get('/signup',(req,res)=>{
  res.sendFile(path.join(__dirname, '/public/signup.html'));
});


app.post('/signup',async(req, res)=>{
  console.log("debug");
  console.log(req.body);
  const{username, password}=req.body;

  
  if(usersObj.users.find(o => o.name === username)){
    console.log("duplicate username!");
    res.status(401).send('Username already taken');
    return;
  }
  console.log("continuing");

//fix this. users.json keeps getting wiped

  //convert password to hash
  const hashedPassword = await bcrypt.hash(password,8);

//add new user info to usersObject 
  usersObj.users.push({name: username, password: hashedPassword});

  //save changes to local json to be stored for other sessions
  fs.writeFile('users.json', JSON.stringify(usersObj), function(err){
    if(err)throw err;
    console.log("updated user file!");
  });

  //convert array of objects to json

  // Write cars object to file

  res.status(201).send('User added!');

});


//recieve post req, validate user, and create token
app.get('/login',(req,res)=>{
  res.sendFile(path.join(__dirname, '/public/login.html'))
})


app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  console.log(req.body);
  var currentUser = usersObj.users.find(o => o.name === username);

//  const user = usersObj.find(u => u.username === username);

  if (!currentUser || !(await bcrypt.compare(password, currentUser.password))) {
    return res.status(401).send('Invalid credentials');
  }

  // Generate token
  const token = jwt.sign({ userId: currentUser.name }, secretKey, { expiresIn: '1h' });
  
  res.status(201).send({ token });

});

//generating JWT

app.get('/dashboard', authenticateToken, (req, res) => {
  res.status(200).send('Welcome to the dashboard, ' + req.body.username);

 // res.status(200).send('Welcome to the dashboard, ' + req.user.userId);
});


