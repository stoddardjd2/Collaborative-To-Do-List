window.onload = function () {
    const registerBtn = document.getElementById("register");
    const usernameInput = document.getElementById("username");
    const passwordInput = document.getElementById("password");

//assign dom elements to variable 


    registerBtn.addEventListener("click",register);
//event listeners

    function register(){
        var object = {
            username:usernameInput.value,
            password:passwordInput.value
        }

        console.log(object);





        fetch('/signup',{
            method:"POST",
            body:JSON.stringify(object),
            headers: {
                "Content-type": "application/json; charset=UTF-8"
              }
        })
    }
}
