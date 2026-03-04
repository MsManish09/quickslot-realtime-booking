import { generateSlots } from "./model/slotEngine.js";
import { deleteIndividaulBooking, getState, getTargetSlot, initState, setTargetSlot, StateSubscriber, updateBookings, updateProviders, updateUtcNow } from "./model/state.js";
import { fetchProviders, fetchUtcTime } from "./services/api.js";
import { slotCard } from "./view/slotCard.js";
import { closeModal, getSelectedDateValue, getSelectedProviderValue, individualBookingDelete, modalCloseViaClick, onBookingConfirmation, onSearchSlotClick, onSlotClick, renderBookings, renderProviderOptions, renderSlots, renderStats, setMinDateToday, setModalContent, setSlotsHeadline } from "./view/ui.js";

// function to render app ui
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
    console.log('Provider value: ', providerValue )
    

    // find provider name -> using slected provider value (name + speciality)
    const selectedProvider = getState().providers.find(p => p.id === Number(providerValue))
    if(!selectedProvider) return

    // update slot display headline
    setSlotsHeadline(selectedProvider.name, dateValue)
    
    // update state.targetslot
    setTargetSlot({
        providerName: selectedProvider.name,
        providerId : selectedProvider.id,
        date : dateValue
    })
    

    const slots = generateSlots(getTargetSlot())
    renderSlots(slots)

}


// slot click, open confirm modal -> using event delegation
onSlotClick((slotTime)=>{

    // update modal content
    setModalContent(getTargetSlot(), slotTime)

})

// booking confirmation
onBookingConfirmation((slotTime, slotNotes)=>{
    // update bookings in state
    updateBookings(getTargetSlot(), slotTime, slotNotes)

    // once booking is confirmed -> close modal
    closeModal()

    //re-render ui after booking confirm
    renderSlotPills()


})

// close modal functionality
modalCloseViaClick(()=>{
    closeModal()
})

// functionality to delete individaul booking
individualBookingDelete((id)=>{
    // console.log(id)
    deleteIndividaulBooking(id)
})


async function init(){
    console.log('Quick slot running')
    initState() 
    setMinDateToday()
    
    // update state utc now
    const UtcTime =  await fetchUtcTime()
        updateUtcNow(UtcTime)

    const providers = await fetchProviders()
        // update providers in state
        updateProviders(providers)
        // render provider options(view) inside select
        renderProviderOptions(providers)

    // StateSubscriber(updatedState)
    StateSubscriber(renderApp)

    // render app
    renderApp()
}

document.addEventListener('DOMContentLoaded', ()=>{
    init()
})