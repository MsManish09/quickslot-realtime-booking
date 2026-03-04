
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

// confimr modal selection
const confirmModal = document.querySelector('.modalbackDrop')
const modalProviderNameDisplay = document.getElementById('m-Selected-provider-name')
const modalCloseBtn = document.getElementById('modalCloseBtn')
const modalSlotDetails = document.getElementById('m-slot-details')
const modalSlotNotes = document.getElementById('slotNotes')
const bookingConfirmBtn = document.getElementById('confirmBooking')

// local state
let slotTime= null

// function to set min date value
export function setMinDateToday(){
    const today = new Date().toISOString().split("T")[0]
    dateSelect.min = today
    dateSelect.value = today   // suto select todays date
}

// function ot render stats
export function renderStats(state){
    if(!state) return

    providerStat.innerText = state.providers.length
    bookedStat.innerText = state.bookings.length
    ClockStat.textContent = state.utcNow.toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    })

    lastSync.innerText =  `Last synced ${new Date().toLocaleTimeString(
      "en-IN",
    )}`
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

// update modal content
export function setModalContent(target, slotTime){
    modalProviderNameDisplay.innerText = `${target.providerName}`
    modalSlotDetails.innerText = `${target.date} | ${slotTime}`
}


// slot booking confirmation modal -> using event delegation
export function onSlotClick(handler){

    document.addEventListener('click', (e)=>{

        // click on anyelemnt of .slot is registed
        const slotEl = e.target.closest('.slot')
        if(!slotEl) return

        // extract slot time
        slotTime = slotEl.dataset.slotTime
        if (!slotTime) return

        // open confirm modal
        confirmModal.classList.remove('hidden')
        handler(slotTime)
        
    })
}

// booking confimration functionality
export function onBookingConfirmation(handler){
    bookingConfirmBtn.addEventListener('click', (e)=>{
        let slotNotes = modalSlotNotes.value || ''
        handler(slotTime, slotNotes)
    })
}

// once bookings is confirmed -> close modal
export function closeModal(){
    // 0.3 sec time gap 
    setTimeout(() => {
        confirmModal.classList.add('hidden')
    }, 300);
}

// functionality to close modal via closeBtn
export function modalCloseViaClick(handler){
    modalCloseBtn.addEventListener('click', ()=>{
        handler()
    })
}

// functionaliyt to delete individaul booking ->  eventdelegation
export function individualBookingDelete(handler){
    document.addEventListener('click', (e)=>{
        if(!e.target.classList.contains('bookingDeleteBtn')) return

        // console.log(e.target.dataset.id)
        handler(e.target.dataset.id)
    })
}