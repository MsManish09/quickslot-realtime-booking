
const STATE_KEY = 'QuickSlot_bookings_key'

export const state ={
    providers: [],
    utcNow: null,
    bookings: [],
    targetSlot: {providerId: null, providerName: null, date: null, notes: null }
}

export function initState(){
    // load bookings from local Storage
    state.bookings = JSON.parse(localStorage.getItem(STATE_KEY)) || []
    notify()
}

/* ============================
            Pub - Sub
=============================== */
const listeners = []

export function StateSubscriber(fn){
    listeners.push(fn)
}

function notify(){
    listeners.forEach((listenerFn)=> listenerFn() )
}

// only stored books in localStorage
function saveState(){
    localStorage.setItem(STATE_KEY, JSON.stringify(state.bookings))
    console.log('New state: ', state)
    notify()
}


/* ================================
        state CRUD Api's
===================================*/

export function getState(){
    return state
}

export function updateUtcNow(newUtc){
    state.utcNow = newUtc
    saveState()
}

export function updateProviders(providersList){
    state.providers = providersList
    saveState()
}

export function updateBookings(target, slotTime, slotNotes){
    const id = crypto.randomUUID()
    let providerId = target.providerId
    let date = target.date
    let time = slotTime
    let providerName= target.providerName
    let notes = slotNotes

    state.bookings.push({
        id,
        providerName,
        providerId,
        date,
        time,
        notes
    })
    saveState()
}

export function deleteIndividaulBooking(id){
    state.bookings = state.bookings.filter(b => b.id !== id)
    saveState()
}

// function to update target slot
export function setTargetSlot({ providerId, providerName, date }) {
  state.targetSlot = { providerId, providerName, date }
//   saveState()
    notify()
}

// Function to get target slot
export function getTargetSlot(){
    return state.targetSlot
}

// clear target slot
export function clearTargetSlot(){
    state.targetSlot = {providerId: null, providerName: null, date: null }
    saveState()
}





