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

app.get('/signup',(req,res)=>{
  res.sendFile(path.join(__dirname, '/public/signup.html'));
});


app.post('/signup',async(req, res)=>{
  const{username, password}=req.body;

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



var json = JSON.stringify(req.body);
var obj = JSON.parse(json);


/*

  fs.appendFile('users.json', JSON.stringify({username, password: hashedPassword}), function(err){
    if(err)throw err;
    console.log("user added!");
  });
*/
  res.status(201).send('User added!');

});

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
  res.status(200).send('Welcome to the dashboard, ' + req.body.username);

 // res.status(200).send('Welcome to the dashboard, ' + req.user.userId);
});


