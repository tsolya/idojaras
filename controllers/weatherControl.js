let weathers =[]
let editMode=false;
let selectedWeather=null;

//Mai dátum beállítása
function setDate(){
    let today =  new Date().toISOString().split('T')[0];
    let dateField = document.getElementById("dateField")
    dateField.setAttribute("min",today)
}

//Hozzáadás gomb függvénye
async function Add(){
let dateOccupied= false;
let weatherid=0;
let dateField=document.getElementById("dateField")
let minField=document.getElementById("minField")
let maxField= document.getElementById("maxField")
let select=document.getElementById("weatherField")

try{
    if(dateField.value=='' || minField.value=='' || maxField=='' || select=='') {
        ShowAlert('Nem adtál meg minden adatot','alert-danger')
        return
    }
    if(minField.value>maxField.value){
        ShowAlert('A minimum hőmérséklet nem lehet nagyobb a maximum hőmérsékletnél','alert-danger')
        return
    }
    weathers.forEach(weather=>{
        if(weather.date==dateField.value){
            dateOccupied=true
            weatherid=weather.id
        }
    })
    if(dateOccupied == false){
        const res=await fetch(`${API}/weathers`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                id: 0,
                uid: loggedUser.id,
                date : dateField.value.toString(),
                min : minField.value,
                max:maxField.value,
                type:select.value,

            })
            })
            const data =await res.json()
            if(res.status==200){
                dateField.value=''
                minField.value=''
                maxField.value=''
                select.value=''
                ShowAlert("Sikeres adatfelvitel!","alert-success")
                await FillTable()
                
            }
            else{
                const res = await fetch(`${API}/weathers/${weatherid}`, {
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        id: weatherid,
                        uid: loggedUser.id,
                        date : dateField.value.toString(),
                        min : minField.value,
                        max:maxField.value,
                        type:select.value,
                        
                    })
                    })
                    const data = await res.json()
                    if (res.status == 200){
                        dateField.value=''
                        minField.value=''
                        maxField.value=''
                        select.value=''
                        ShowAlert("Sikeres adatfrissítés!", "alert-success")
                        await FillTable()
                    }
                    else{
                        ShowAlert("Hiba az adatok frissítése során!", 'alert-danger')
                    }
            }
    }
}
catch(err){
    console.log("Hiba történt:" , err)
}
}
async function Del() {
    await Delete(selectedWeather)
}

//táblázat feltöltése
async function FillTable() {
    let tbody=document.getElementById("tbody")
    tbody.innerHTML=''
    try{
        const res = await fetch(`${API}/weathers/user/${loggedUser.id}`)
        weathers = await res.json()
        
        weathers = weathers.sort((a,b) => new Date(b.date) - new Date(a.date))
        
        let idx = 1

        if(res.status == 200){
            for (let i = 0; i < weathers.length; i++) {
                
                
                let index=i;
                
                let td1 = document.createElement("td")
                let td2 = document.createElement("td")
                let td3 = document.createElement("td")
                let td4 = document.createElement("td")
                let td5 = document.createElement("td")
                let bt1 = document.createElement("button")
                let bt2 = document.createElement("button")
                let td6 = document.createElement("td")

                let tr = document.createElement("tr")

                td2.classList.add("text-end")
                td3.classList.add("text-end")
                td4.classList.add("text-end")
                td5.classList.add("text-end")

                bt1.classList.add("btn")
                bt1.classList.add("btn-warning")
                bt1.classList.add("mx-2")
                bt2.classList.add("btn")
                bt1.classList.add("btn-danger")
                bt1.classList.add("mx-2")

                bt1.type="button"
                bt2.type="button"

                bt1.innerHTML = '<i class="bi bi-pencil-fill"></i>'
                bt2.innerHTML = '<i class="bi bi-trash-fill"></i>'

                bt1.setAttribute('onClick', `editWeather(${index+1})`)
                bt2.setAttribute('onClick',`Delete(${weathers[i].id})`)

                td1.innerHTML=""
                td4.innerHTML=weathers[i].min +"C°"
                td5.innerHTML=weathers[i].max +"C°"
                td2.innerHTML=weathers[i].date
                switch (weathers[i].type){
                    case 'cloudy':
                        td3.innerHTML = '<i class="bi bi-clouds-fill"></i>'
                        break
                    case 'rainy':
                        td3.innerHTML = '<i class="bi bi-cloud-rain-fill"></i>'
                        break
                    case 'foggy':
                        td3.innerHTML = '<i class="bi bi-cloud-fog-fill"></i>'
                        break
                    case 'snowy':
                        td3.innerHTML = '<i class="bi bi-cloud-snow-fill"></i>'
                        break
                    case 'storm':
                        td3.innerHTML = '<i class="bi bi-cloud-lightning-rain-fill"></i>'
                        break
                    case 'sunny':
                        td3.innerHTML = '<i class="bi bi-sun-fill"></i>'
                       
                }
                td6.appendChild(bt1)
                td6.appendChild(bt2)
                tr.appendChild(td1)
                tr.appendChild(td2)
                tr.appendChild(td3)
                tr.appendChild(td4)
                tr.appendChild(td5)
                tr.appendChild(td6)

                tbody.appendChild(tr)

                
            };

           }   
        }
    catch(err){
        ShowAlert("Hiba az adatok lekérdezésében!", 'alert-danger')
        console.log("Hiba történt!", err)
    }
    }
    //adatok szerkeztese
    async function editWeather(index){
        let dateField=document.getElementById("dateField")
        let minField=document.getElementById("minField")
        let maxField= document.getElementById("maxField")
        let selectField=document.getElementById("weatherField")
        toggleEditMode(true)
        dateField.value = weathers[index-1].date
        minField.value = weathers[index-1].min
        maxField.value = weathers[index-1].max
        selectField.value = weathers[index-1].type

        selectedWeather=1
        selectedWeather = weathers[index-1]
        
    }
 //adatok torlese
    async function Delete(index){
        let dateField=document.getElementById("dateField")
        let minField=document.getElementById("minField")
        let maxField= document.getElementById("maxField")
        let selectField=document.getElementById("weatherField")
        if(confirm("Biztos törölni akarod?")){
        try{
            const res = await fetch(`${API}/weathers/${index}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                }
               
                })
                let data = await res.json()
                if (res.status == 200){
                    dateField.value = ''
                    minField.value=''
                    maxField.value=''
                    selectField.value=''
                    ShowAlert(data.msg, "alert-success")
                    Cancel()
                    await FillTable()
                }
                else{
                    ShowAlert("vlmi nm jou",'alert-danger')
                }
        }
        catch(err){
            ShowAlert("vlmi nagyon nem jou",'alert-danger')
            console.log(err)
        }
    }
    }
    //button elrejtes/megjelenes
    function toggleEditMode(mode){
        let addBtn = document.getElementById("addBtn")
        let updBtn = document.getElementById("updBtn")
        let delBtn = document.getElementById("delBtn")
        let cancelBtn = document.getElementById("cancelBtn")
        if(mode){
            addBtn.classList.add("d-none")
            updBtn.classList.remove("d-none")
            delBtn.classList.remove("d-none")
            cancelBtn.classList.remove("d-none")
        }
        else{
            addBtn.classList.remove("d-none")
            updBtn.classList.add("d-none")
            delBtn.classList.add("d-none")
            cancelBtn.classList.add("d-none")
        }
    }
    //mégse gomb
    function Cancel(){
        toggleEditMode(false)
        let dateField = document.getElementById("dateField")
        let minField = document.getElementById("minField")
        let maxField = document.getElementById("maxField")
        let select=document.getElementById("weatherField")
    
        dateField.value = null
        minField.value = null
        maxField.value = null
        select.value=null

        selectedWeather = null
    }




 //adatok frissitése
    async function Update(){
        let dateOccupied = false
        let weatherid = 0
        let dateField = document.getElementById("dateField")
        let minField = document.getElementById("minField")
        let maxField = document.getElementById("maxField")
        let select=document.getElementById("weatherField")
    
        if(selectedWeather.date == dateField.value){
            const res = await fetch(`${API}/weathers/${selectedWeather.id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    id: selectedWeather.id,
                    uid: loggedUser.id,
                    min: minField.value,
                    max: maxField.value,
                    type: select.value,
                    date: dateField.value.toString()
                })
                })
                const data = await res.json()
                if (res.status == 200){
                    dateField.value = ''
                    minField.value= ''
                    maxField.value= ''
                    select.value=''
                    ShowAlert("Sikeres adatfrissítés!", "alert-success")
                    await FillTable()
                }
                else{
                    ShowAlert("Hiba az adatok frissítése során!", 'alert-danger')
                }
        }
        else{
            
            weathers.forEach(weather => {
                if(weather.date == dateField.value){
                    dateOccupied = true
                    weatherid = weather.id
                }
            });
            if(dateOccupied == false){
                try{
                    const res = await fetch(`${API}/weathers`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            id: 0,
                            uid: loggedUser.id,
                            min: minField.value,
                            max: maxField.value,
                            type: select.value,
                            date: dateField.value.toString()
                        })
                        })
                        const data = await res.json()
                        if (res.status == 200){
                            dateField.value = ''
                            minField.value= ''
                            maxField.value= ''
                            select.value=''
                            ShowAlert("Sikeres adatfelvitel!", "alert-success")
                            Cancel()
                            await FillTable()
                        }
                        else{
                            ShowAlert("Hiba az adatok küldése során!", 'alert-danger')
                        }
                }
                catch(err){
                    console.log(err)
                }
            }
            else{
                try{
                    const res = await fetch(`${API}/weathers/${selectedWeather.id}`, {
                        method: 'DELETE',
                        headers: {
                            'Content-Type': 'application/json'
                        }
                       
                        })
                        let data = await res.json()
                        if (res.status == 200){
                            dateField.value = ''
                            minField.value=''
                            maxField.value=''
                            select.value=''
                            Cancel()
                            await FillTable()
                        }
                        else{
                            ShowAlert("A manoba",'alert-danger')
                        }
                }
                catch(err){
                    ShowAlert("A manoba^2",'alert-danger')
                    console.log(err)
                }
                try{
                const res = await fetch(`${API}/weathers/${weatherid}`, {
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        id: weatherid,
                        uid: loggedUser.id,
                        min:selectedWeather.min,
                        max: selectedWeather.max,
                        type: selectedWeather.type,
                        date: selectedWeather.date
                    })
                    })
                    const data = await res.json()
                    if (res.status == 200){
                        dateField.value = ''
                        minField.value= ''
                        maxField.value= ''
                        select.value=''
                        ShowAlert("Sikeres adatfrissítés!", "alert-success")
                        Cancel()
                        await FillTable()
                    }
                    else{
                        ShowAlert("Hiba az adatok frissítése során!", 'alert-danger')
                    }
                }
                catch(err){
                    console.log(err)
                }
            }
            
        }
    }