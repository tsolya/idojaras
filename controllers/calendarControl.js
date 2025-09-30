let calevents = []

async function getCalendarData(){
    try{
        calevents = []
        
        const res = await fetch(`${API}/weathers/user/${loggedUser.id}`)
        weathers = await res.json()
    
        for (let i = 0; i < weathers.length; i++) {
            calevents.push({
                title: "Min. Hőfok: " +weathers[i].min,
                start: weathers[i].date
                
            })
            calevents.push({
                title: "Min. Hőfok: " +weathers[i].max,
                start: weathers[i].date,
                backgroundColor:"#d834eb"
            })
            calevents.push({
                title: "Típus: " + weathers[i].type,
                start: weathers[i].date,
                backgroundColor:"#19b56f"
            })
        }
    }
    catch(err){
        console.log(err)
    }
}

function initCalendar(){
    var calendarEl = document.getElementById('calendar');
        var calendar = new FullCalendar.Calendar(calendarEl, {
          initialView: 'dayGridMonth',
          locale:'hu',
          headerToolbar:{
            left:'prev,today,next',
            center: 'title',
            right: 'multiMonthYear,dayGridMonth,timeGridWeek,listWeek,timeGridDay'
          },
          events: calevents
        });
        calendar.render();
}