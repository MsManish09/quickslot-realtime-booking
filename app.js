import { generateSlots } from "./model/slotEngine.js";
import { getState, initState, StateSubscriber, updateBookings, updateProviders, updateUtcNow } from "./model/state.js";
import { slotCard } from "./view/slotCard.js";

const rosterUrl = "https://jsonplaceholder.typicode.com/users?_limit=10";
// Fake API to fetch 10 random providers

const clockUrl = 'https://time.now/developer/api/timezone/Asia/Kolkata';
// Real time API to sync with internet clock (IST)

// local states
const targetSlot = {}
const pendingSlot =  null

// dom selection

// stats
const providerStat = document.getElementById('providerStat')
const bookedStat  = document.getElementById('bookedStat')
const ClockStat = document.getElementById('ClockStat')

// last sync
const lastSync = document.getElementById('lastSync')

// select provider + date
const providerSelect = document.getElementById('providerSelect')
const dateSelect = document.getElementById('dateSelect')
const searchSlotBtn = document.getElementById('searchSlot')
const slotsGrid = document.getElementById('slotsGrid')
const slotsDisplayHeadline =  document.getElementById('selectedProvider-date')

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
        updateProvidersSelect(providers)

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

    renderStats(state)
}

function renderStats(state){
    if(!state) return

    providerStat.innerText = state.providers.length
    bookedStat.innerText = state.bookings.length
    ClockStat.innerText = `${state.utcNow}`
    lastSync.innerText = `Last Sync ${state.utcNow}`
}

// search slot functionaliyt
searchSlotBtn.addEventListener('click', (e)=>{
    e.preventDefault()
    renderSlotPills()
})

// functionality to render slotpills
function renderSlotPills(){
    // generate slots
    if(!providerSelect.value || !dateSelect.value){
        alert('Select provider and date')
        return
    }
    console.log('providerSelect.value: ', providerSelect.value)
    console.log('dateSelect: ', dateSelect.value)

    let provider = providerSelect.value.split('-')[0].trim()

    // find provider id
    const selectedProvider = stateData.providers.find(p => p.name == provider)

    if(!selectedProvider) return

    slotsDisplayHeadline.innerText = ''
    slotsDisplayHeadline.innerText = `${selectedProvider.name} | ${dateSelect.value}`
    
    targetSlot.providerId = selectedProvider.id
    targetSlot.date = dateSelect.value
    console.log('Target slots: ', targetSlot)

    const slots = generateSlots(targetSlot)
    console.log(slots)

    //generate pills
    const slotPills= slotCard(slots)

    // append to slots grid
    slotsGrid.innerHTML = slotPills

}

// slot booking confirmation -> using event delegation
document.addEventListener('click', (e)=>{
    if(!e.target.classList.contains('slot')) return

    let slotTime = e.target.dataset.slotTime

    alert(`Are you sure you want to booking the slot: ${slotTime}`)
    updateBookings(targetSlot, slotTime )
})


// render providers option insde provider Select
function updateProvidersSelect(providers){
    providers.forEach((provider)=>{

        let option = document.createElement('option')
        option.id = `${provider.id}`
        option.innerText =`${provider.name} - ${provider.speciality}`

        // append to select
        providerSelect.appendChild(option)
    })
}



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