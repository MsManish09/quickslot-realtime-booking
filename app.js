import { generateSlots } from "./model/slotEngine.js";
import { deleteIndividaulBooking, getState, getTargetSlot, initState, setTargetSlot, StateSubscriber, updateBookings, updateProviders, updateUtcNow } from "./model/state.js";
import { fetchProviders, fetchUtcTime } from "./services/api.js";
import { slotCard } from "./view/slotCard.js";
import { getSelectedDateValue, getSelectedProviderValue, individualBookingDelete, onSearchSlotClick, onSlotClick, renderBookings, renderProviderOptions, renderSlots, renderStats, setSlotsHeadline } from "./view/ui.js";

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
    
    let providerName = providerValue.split('-')[0].trim()

    // find provider date -> using provider name

    const selectedProvider = getState().providers.find(p => p.name == providerName)

    if(!selectedProvider) return

    // update slot display headline
    setSlotsHeadline(selectedProvider.name, dateValue)
    
    // update state.targetslot
    setTargetSlot({
        providerName: providerName,
        providerId : selectedProvider.id,
        date : dateValue
    })
    

    const slots = generateSlots(getTargetSlot())
    renderSlots(slots)

}


// slot booking confirmation -> using event delegation
onSlotClick((slotTime)=>{

    const confirmed = confirm(`Are you sure you want to book the slot: ${slotTime}`)

    if(confirmed){
        updateBookings(getTargetSlot(), slotTime )

        //update slots ui -> after booking re-render slot display 
        renderSlotPills()
        renderBookings(getState().bookings)
    }

})

// functionality to delete individaul booking
individualBookingDelete((id)=>{
    // console.log(id)
    deleteIndividaulBooking(id)
})


async function init(){
    console.log('Quick slot running')
    initState() 
    // StateSubscriber(updatedState)
    StateSubscriber(renderApp)

    // present ins services
        const providers = await fetchProviders()
            // update providers in state
            updateProviders(providers)
            // render provider options(view) inside select
            renderProviderOptions(providers)

        const UtcTime =  await fetchUtcTime()
        updateUtcNow(UtcTime)

    // render app
    renderApp()
}

document.addEventListener('DOMContentLoaded', ()=>{
    init()
})