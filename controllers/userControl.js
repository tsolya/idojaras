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


async function GetUserData(){
    let name = document.getElementById("nameField")
    let emaildat = document.getElementById("emailField")
 
    try{
        const res = await fetch(`${API}/users/${loggedUser.id}`)
        const data = await res.json()
 
        name.value = data.name
        emaildat.value = data.email
    }
    catch(err){
        console.log("Hiba!", err)
    }
}
 
//----------------------------------------
//Bejelentkeztetés
//----------------------------------------


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
        
        getLoggedUser()
    }
    catch(err){
        console.log("Hiba!", err)
    }
    
}
//----------------------------------------
//Profil lekérése
//----------------------------------------
async function getProfile(){
    let emailField = document.getElementById('emailField')
    let namefield = document.getElementById('nameField')
    
    const loggedUser = JSON.parse(sessionStorage.getItem('loggedUser'))


    try {
        const res = await fetch(`${API}/users/${loggedUser.id}`)
        if (!res.ok) {
            ShowAlert("Nem sikerült lekérni a profilt!", "alert-danger")
            return
        }
        const user = await res.json()
        emailField.value = user.email
        namefield.value = user.name
    } catch (err) {
        ShowAlert("Hiba történt a profil lekérésekor!", "alert-danger")
        console.log("Hiba!", err)
    }

}

//----------------------------------------
//Profil update
//----------------------------------------

async function UpdateProfile(){
        let emailField = document.getElementById('emailField')
        let nameField = document.getElementById('nameField')
        if(!emailRegExp.test(emailField.value)){
            ShowAlert("A megadott email cím nem megfelelő ", "alert-danger")
            return
        }
        try {
            
        const loggedUser = JSON.parse(sessionStorage.getItem('loggedUser'))
        const res = await fetch(`${API}/users/${loggedUser.id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email: emailField.value,
                name: nameField.value
            })
        })
        if (!res.ok) {
            const data = await res.json()
            console.log(data.msg)
            ShowAlert(data.msg, "alert-danger")
            return
        }
        const updatedUser = await res.json()
        sessionStorage.setItem('loggedUser', JSON.stringify(updatedUser.user))
        ShowAlert("Profil frissítve!", "alert-success")
    } catch (err) {
        ShowAlert("Hiba történt!", "alert-danger")
        console.log("Hiba!", err)
    }

}


//----------------------------------------
//jelszó módosítása
//----------------------------------------


async function ChangePass(){
    let OPField = document.getElementById('oldpassField')
    let NPField = document.getElementById('newpassField')
    let CNPField = document.getElementById('cnewconfirmpassField')

    if(OPField.value == "" || NPField.value == "" || CNPField.value == ""){
        ShowAlert("Nem adtál meg minden adatot!", "alert-danger")
        return
    }
    if(NPField.value != CNPField.value){
        ShowAlert("Az új jelszavak nem egyeznek!", "alert-danger")
        return
    }
    if(!passRegExp.test(NPField.value)){
        ShowAlert("Az új jelszó nem elég biztonságos!", "alert-danger")
        return
    }
    try {
        const loggedUser = JSON.parse(sessionStorage.getItem('loggedUser'))
        const res = await fetch(`${API}/users/changepass/${loggedUser.id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                oldpass: OPField.value,
                newpass: NPField.value
            })
        })
        if (!res.ok) {
            const data = await res.json()
            console.log(data.msg)
            ShowAlert(data.msg, "alert-danger")
            return
        }
        OPField.value = ''
        NPField.value = ''
        CNPField.value = ''
        const updatedUser = await res.json()
        sessionStorage.setItem('loggedUser', JSON.stringify(updatedUser.user))
        ShowAlert("Jelszó sikeresen megváltoztatva!", "alert-success")
    } catch (err) {
        ShowAlert("Hiba történt a jelszó megváltoztatásakor!", "alert-danger")
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