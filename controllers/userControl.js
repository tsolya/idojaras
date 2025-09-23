const passRegExp = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/
const emailRegExp = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const API = 'http://localhost:3000'
let menu = document.getElementById("menu")
let menu1 = document.getElementById("menu1")
let menu2 = document.getElementById("menu2")
let menu3 = document.getElementById("menu3")
let menu4 = document.getElementById("menu4")
let menu5 = document.getElementById("menu5")
//----------------------------------------
//Új felhasználó adatainak felvétele
//----------------------------------------

async function Registration(){
    //await fetch('http://localhost:3000/users').then(res => res.json().then(data => console.log(data)))
    let passfield = document.getElementById('passField')
    let nameField = document.getElementById('nameField')
    let emailField = document.getElementById('emailField')
    let confirmpassField = document.getElementById('confirmpassField')

    if(nameField.value == "" || passfield.value == "" || emailField.value == "" || confirmpassField.value == ""){
        ShowAlert("Nem adtál meg minden adatot!", "alert-danger")
        return
    }

    if(!emailRegExp.test(emailField.value)){
        ShowAlert("A megadott email cím nem megfelelő formátumú", "alert-danger")
        return
    }

    if(passfield.value != confirmpassField.value){
        ShowAlert("A megadott jelszavak nem egyeznek!", "alert-danger")
        return
    }

    if(!passRegExp.test(passfield.value)){
        ShowAlert("A megadott jelszó nem elég biztonságos!", "alert-danger")
        return
    }

    try{
        const res = await fetch(`${API}/users`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
    
            },
            body: JSON.stringify({
                id: 0,
                name: nameField.value,
                email: emailField.value,
                password: passfield.value
            })
        })

        const data = await res.json()
        if(String(data.msg) == "bademail"){
            ShowAlert("Ez az email cím már regisztrált", "alert-danger")
        }
        if (res.status == 200){
            nameField.value = ''
            emailField.value = ''
            passfield.value = ''
            confirmpassField.value = ''
            ShowAlert("Sikeres regisztráció!", "alert-success")
        }
        

    }
    catch(err){
        console.log('Hiba történt: ', err)
    }
}

//----------------------------------------
//Bejelentkeztetés
//----------------------------------------

let men
async function Login() {
    let passfield = document.getElementById('passField')
    let emailField = document.getElementById('emailField')

    if( passfield.value == "" || emailField.value == "" ){
        ShowAlert("Nem adtál meg minden adatot!", "alert-danger")
        return
    }

    if(!emailRegExp.test(emailField.value)){
        ShowAlert("A megadott email cím nem megfelelő formátumú", "alert-danger")
        return
    }
    let user={}
    try{
        const res = await fetch(`${API}/users/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
    
            },
            body: JSON.stringify({
                email: emailField.value,
                password: passfield.value
            })
        })

        ShowAlert("Sikeres belépés!","alert-success")
        
       
        user = await res.json()

        if(user.id != undefined){
            loggedUser = user;
            
        }
        
        
        if(!loggedUser){
            ShowAlert("Hibás belépési adatok!", "alert-danger")
            return
        }
        
        sessionStorage.setItem('loggedUser', JSON.stringify(loggedUser))
        await Render("weatherdata") 
       
    }
    catch(err){
        console.log("Hiba!", err)
    }
    
}




//----------------------------------------
//Felhasználó kijelentkeztetése
//----------------------------------------

function Logout(){
    sessionStorage.removeItem('loggedUser')
    getLoggedUser()
    Render("login")
}

//----------------------------------------
//felugró ablak
//----------------------------------------

function ShowAlert(message, alerttype){
    let alertReg = document.getElementById("alertReg")
    alertReg.classList.remove("hide")
    alertReg.classList.add(alerttype)
    alertReg.innerText= message

    setTimeout(()=>{
        alertReg.classList.remove(alerttype)
        alertReg.innerHTML= ''
        alertReg.classList.add("hide")
    },3000)
}