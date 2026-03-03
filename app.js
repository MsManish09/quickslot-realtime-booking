import { generateSlots } from "./model/slotEngine.js";
import { getState, initState, StateSubscriber, updateBookings, updateProviders, updateUtcNow } from "./model/state.js";
import { slotCard } from "./view/slotCard.js";
import { getSelectedDateValue, getSelectedProviderValue, onSearchSlotClick, onSlotClick, renderBookings, renderProviderOptions, renderSlots, renderStats, setSlotsHeadline } from "./view/ui.js";

const rosterUrl = "https://jsonplaceholder.typicode.com/users?_limit=10";
// Fake API to fetch 10 random providers

const clockUrl = 'https://time.now/developer/api/timezone/Asia/Kolkata';
// Real time API to sync with internet clock (IST)

// local states
const targetSlot = {}
const pendingSlot =  null



// app state -> tp store state data from state.js
let stateData ;

function getStateData(){
    stateData = getState()
    console.log('State data: ', stateData)
}

// function to fetch providersList
async function fetchProviders(){
    try {
        let res = await fetch(rosterUrl)
        let data  = await res.json()
        let providers = data.map(p =>{
            return{
                id: p.id,
                name: p.name,
                website: p.website,
                speciality: p.company.bs
            }
        })

        // update providers in state
        updateProviders(providers)
        // render provider options(view) inside select
        renderProviderOptions(providers)

    } catch (error) {
        console.error('Error loading providers: ', error)
    }
}

// function to fetch now UTC time
async function fetchUtcTime(){
    try {
        const res = await fetch(clockUrl)
        let data = await res.json()
        
        data = extractUtcTime(data.utc_datetime)

        // updateUtcNow in state.js
        updateUtcNow(data)
        
    } catch (error) {
        console.log('UTC time fetch failed, falling back to client time. ', error)
        updateUtcNow(getUserLocalTime())
    }
}

// extract UTC time from api response
function extractUtcTime(time){
    const date =  new Date(time)
    const utc = date.toLocaleTimeString('en-GB', {
        timeZone: 'UTC',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true,
        timeZoneName: "short"
    })
    return utc
}

// extract user local time
function getUserLocalTime() {
  let now = new Date();

    now =  now.toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
    timeZoneName: "short"
  })
  return now
}

function renderApp(){

    let state = getState()

    renderStats(state) // ui.js
    renderBookings(state.bookings)
}

// search slot functionaliyt
onSearchSlotClick(()=>{
    renderSlotPills()
})

// functionality to render slotpills
function renderSlotPills(){

    const providerValue = getSelectedProviderValue()
    const dateValue = getSelectedDateValue()

    if(!providerValue || !dateValue){
        alert('Select provider and date')
        return
    }
    
    let providerName = providerValue.split('-')[0].trim()

    // find provider date -> using provider name
    const selectedProvider = stateData.providers.find(p => p.name == providerName)

    if(!selectedProvider) return

    // update slot display headline
    setSlotsHeadline(selectedProvider.name, dateValue)
    
    targetSlot.providerName= providerName
    targetSlot.providerId = selectedProvider.id
    targetSlot.date = dateValue

    const slots = generateSlots(targetSlot)

    renderSlots(slots)

}


// slot booking confirmation -> using event delegation
onSlotClick((slotTime)=>{

    const confirmed = confirm(`Are you sure you want to book the slot: ${slotTime}`)

    if(confirmed){
        updateBookings(targetSlot, slotTime )

        //update slots ui -> after booking re-render slot display 
        renderSlotPills()
        renderBookings(getState().bookings)
    }

    
})


async function init(){
    console.log('Quick slot running')
    initState() 
    // StateSubscriber(updatedState)
    StateSubscriber(renderApp)
    StateSubscriber(getStateData)

    await fetchProviders()
    await fetchUtcTime()
    getStateData()
    renderApp()
}

document.addEventListener('DOMContentLoaded', ()=>{
    init()
})