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
async function getLoggedUser(){
    if(sessionStorage.getItem('loggedUser')){
        loggedUser = JSON.parse(sessionStorage.getItem('loggedUser'))
        menu.classList.add="hide"
        menu1.classList.add="hide"
        menu2.classList.remove="hide"
        menu3.classList.remove="hide"
        menu4.classList.remove="hide"
        menu5.classList.remove="hide"
        
        await Render('weatherdata')
    }
    else{
        loggedUser = null
        menu.classList.remove="hide"
        menu1.classList.remove="hide"
        menu2.classList.add="hide"
        menu3.classList.add="hide"
        menu4.classList.add="hide"
        menu5.classList.add="hide"
        
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
   }




loadTheme()
getLoggedUser()