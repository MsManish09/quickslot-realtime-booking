
// dom selection

import { bookingCard } from "./bookingCard.js"
import { slotCard } from "./slotCard.js"

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

// bookings display
const bookingsDisplay = document.getElementById('bookingsDisplay')


// function ot render stats
export function renderStats(state){
    if(!state) return

    providerStat.innerText = state.providers.length
    bookedStat.innerText = state.bookings.length
    ClockStat.innerText = `${state.utcNow}`
    lastSync.innerText = `Last Sync ${state.utcNow}`
}

// render providers option insde provider Select
export function renderProviderOptions(providers){
    providers.forEach((provider)=>{

        let option = document.createElement('option')
        option.id = `${provider.id}`
        option.innerText =`${provider.name} - ${provider.speciality}`

        // append to select
        providerSelect.appendChild(option)
    })
}

// render slot display headline
export function setSlotsHeadline(providerName, date){
    slotsDisplayHeadline.innerText = `${providerName} | ${date}`
}

// render slot pills
export function renderSlots(slots){

    //generate pills
    const slotPills= slotCard(slots)
    // append to slots grid
    slotsGrid.innerHTML = slotPills
}

// render bookings funciton
export function renderBookings(bookings){
    bookingsDisplay.innerHTML = ''

    if(!bookings || bookings.length == 0){
        bookingsDisplay.innerText =` No Bookings yet!`
        return
    }

    bookings.forEach((booking, index)=>{
        bookingsDisplay.innerHTML += bookingCard(booking, index)
    })

}


// helpers for contrloller
export function getSelectedProviderValue(){
    return providerSelect.value
}

export function getSelectedDateValue(){
    return dateSelect.value
}

export function onSearchSlotClick(handler){
    searchSlotBtn.addEventListener('click', (e)=>{
        e.preventDefault()
        handler(e)
    })
}


// slot booking confirmation -> using event delegation
export function onSlotClick(handler){
    document.addEventListener('click', (e)=>{
        if(!e.target.classList.contains('slot')) return

        let slotTime = e.target.dataset.slotTime
        if (!slotTime) return

        handler(slotTime)
        
    })
}