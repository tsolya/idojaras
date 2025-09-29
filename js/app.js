let theme = 'light';
let main =document.querySelector('main')



//------------------------------------------
//Dark-light mode
//------------------------------------------


let darkBtn=document.getElementById("darkBtn")
let lightBtn=document.getElementById("lightBtn")



lightBtn.addEventListener('click', ()=>{
    setTheme("light")
    saveTheme("light")
    
    
})
darkBtn.addEventListener('click', ()=>{
    setTheme("dark")
    saveTheme("dark")
})

function loadTheme(){
    theme="light"
    if(localStorage.getItem('SCTheme')){
        theme =localStorage.getItem('SCTheme')
    }
    setTheme(theme)

}
function saveTheme(theme){
    localStorage.setItem('SCTheme', theme)
}
function setTheme(theme){
    document.documentElement.setAttribute('data-bs-theme',theme)
    setThemeBtn(theme)
    
}
function setThemeBtn(theme){
    if(theme=='light'){
        lightBtn.classList.remove('bi-brightness-high')
        lightBtn.classList.add('bi-brightness-high-fill')
        darkBtn.classList.remove('bi-moon-stars-fill')
        darkBtn.classList.add('bi-moon-stars')

    }
    else{
        lightBtn.classList.add('bi-brightness-high')
        lightBtn.classList.remove('bi-brightness-high-fill')
        darkBtn.classList.add('bi-moon-stars-fill')
        darkBtn.classList.remove('bi-moon-stars')
    }
}
//------------------------------------------
//Bejelentkezett user lekérése és menüpontok eltüntetése fapados módon
//------------------------------------------

async function getLoggedUser(){
    if(sessionStorage.getItem('loggedUser')){
        loggedUser = JSON.parse(sessionStorage.getItem('loggedUser'))
        
        menu.classList.add("d-none")
        menu1.classList.add("d-none")
        menu2.classList.remove("d-none")
        menu3.classList.remove("d-none")
        menu4.classList.remove("d-none")
        menu5.classList.remove("d-none")
        menu6.classList.remove("d-none")
       
        
        await Render('weatherdata')
    }
    else{
        loggedUser = null
        menu.classList.remove("d-none")
        menu1.classList.remove("d-none")
        menu2.classList.add("d-none")
        menu3.classList.add("d-none")
        menu4.classList.add("d-none")
        menu5.classList.add("d-none")
        menu6.classList.add("d-none")
        
        await Render('login')
    }
    return loggedUser
}



//------------------------------------------
//App author, company beállítása
//------------------------------------------
const Author="13A Szoft."
const Company= "Bajai SZC Türr István Technikum"

let author=document.getElementById("Author")
let company=document.getElementById("Company")

author.innerHTML=Author;
company.innerHTML=Company;

//------------------------------------------
//Oldalak be Rendelelése
//------------------------------------------

async function Render(view){
    main.innerHTML =await (await fetch(`views/${view}.html`)).text()
    switch(view){
        case 'profile': 
        getProfile()
        break
        case 'weatherdata':
        await setDate()
        
        break
    } 
   }




loadTheme()
getLoggedUser()