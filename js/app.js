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