
const STATE_KEY = 'QuickSlot_bookings_key'

export const state ={
    providers: [],
    utcNow: null,
    bookings: [],
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
// c


// r
export function getState(){
    return state
}

// u
export function updateUtcNow(newUtc){
    state.utcNow = newUtc
    saveState()
}

export function updateProviders(providersList){
    state.providers = providersList
    saveState()
}


// d



