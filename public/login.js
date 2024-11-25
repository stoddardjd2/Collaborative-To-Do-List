
window.onload = function () {
    const loginBtn = document.getElementById('login');
    const createAccBtn = document.getElementById('signup');


    loginBtn.addEventListener("click",login);
    createAccBtn.addEventListener("click",createAccount);
    function login(){
        var username = document.getElementById("username").value;
        var password = document.getElementById("password").value;

        fetch('/login',{
            method: 'POST',
            body:JSON.stringify({
                username: username,
                password: password
            }
              ),
            headers: {
                "Content-type": "application/json; charset=UTF-8"
              }
        }).then(async (response)=>{
            if(response.status===401){
                console.log("Incorrect username/password")
            }if(response.status===201){
                var response = await response.json();
               // console.log(await response.json());
                console.log(response);
                console.log("Logging in, and token generated");
                addToken(response.token);
                //call function to add token to local storage

                window.location.href = "http://localhost:3001/"; 
            }
        });
    }

function addToken(token){
    localStorage.setItem("token", token);
    var token = localStorage.getItem("token", token);
    console.log(token);
}


function createAccount() {
const username = document.getElementById("username").value;
const password = document.getElementById("password").value;


//
    fetch('/signup', {
      method: "POST",
      body: JSON.stringify({
        username: username,password: password
      }),
      headers: {
        "Content-type": "application/json; charset=UTF-8"
      }
    }).then((response)=>{
        if(response.status===201){
            console.log("User added!");
        }if(response.status==401){
            console.log("Username already taken!")
        }
    });

    

}

}