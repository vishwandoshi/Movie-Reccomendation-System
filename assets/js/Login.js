const signUpButton = document.getElementById('signUp');
const signInButton = document.getElementById('signIn');
const container = document.getElementById('container');
const register = document.querySelector('.register');
const userId = document.getElementById('email_id');
const pass = document.getElementById('pass');
const cnf_pass = document.getElementById('cnf_pass');
const login_id = document.getElementById('login_id');
const login_password = document.getElementById('login_password');
const login_button = document.getElementById('login_button')


getUserData();
temp_getUserData_db = [] 
async function getUserData() {
  const get_url = 'http://127.0.0.1:5000/getUserData'
  const response = await fetch(get_url);
  const data = await response.json();
  temp_getUserData_db = data
  console.log(data)
}



signUpButton.addEventListener('click', () => {
	container.classList.add("right-panel-active");
});


signInButton.addEventListener('click', () => {
	container.classList.remove("right-panel-active")
});

register.addEventListener('click', () =>{
	userId_value = userId.value
	pass_value = pass.value;
	cnf_pass_value = cnf_pass.value;
	// console.log(userId_value, pass_value)
	// console.log("Registerd")

	for(let i=0; i<temp_getUserData_db.length; i++){
		if(temp_getUserData_db[i][0] === userId_value){
			alert("Account already exists, Plase sign in!")
			return;
		}
	}

	if(userId_value.length >= 10 && userId_value.includes("@") && userId_value.includes(".com") && pass_value.length >= 8 && pass_value === cnf_pass_value){
		var xhttp = new XMLHttpRequest();
		xhttp.open('POST', "http://127.0.0.1:5000/SignUp", true);
		xhttp.setRequestHeader('Content-type', "application/json;charset=UTF-8");
		let send = {user_id: userId.value, password: pass.value};
		var sendString = JSON.stringify(send);
		xhttp.send(sendString);
		alert("Account created successfully")
	}
	else{	
		alert("Error in email id or password ❌")
	}
})

login_button.addEventListener('click', (e) => {
	e.preventDefault();
	let login_id_value = login_id.value;
	let login_password_value = login_password.value;
	for(let i=0; i<temp_getUserData_db.length; i++){
		if(temp_getUserData_db[i][0] === login_id_value && temp_getUserData_db[i][1] === login_password_value){
			var xhttp2 = new XMLHttpRequest();
			xhttp2.open('POST', "http://127.0.0.1:5000/activeUser", true);
			xhttp2.setRequestHeader('Content-type', "application/json;charset=UTF-8");
			let send_data = {id: temp_getUserData_db[i][2]};
			var sendString_data = JSON.stringify(send_data);
			xhttp2.send(sendString_data);

			window.location.replace("assets/index.html");
			return
		}
	}
	alert("Wrong credentials, Please try again 🔁");
});
