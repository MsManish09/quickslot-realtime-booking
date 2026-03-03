import { getState } from "./state.js";

export function generateSlots(target){
    const {bookings} = getState()

    let slots = []
    for(let hour=9; hour <= 17; hour++){
        ['00', '30'].forEach((t)=>{
            const hourStr = String(hour).padStart(2, '0');
            const time= `${hourStr}:${t}`
            let slot ={
                providerId: target.providerId,
                date: target.date,
                time,
                isBooked: isBooked(target, time, bookings)
            }
            slots.push(slot)
        })
    }

    return slots
}

// function to check is slot is already booked
function isBooked(target, slotTime, bookings){


    // check is target + slotTime present in bookings
    let isBooked = bookings.some(b =>
        b.id == target.id &&
        b.date == target.date &&
        b.slotTime == slotTime
    )

    return isBooked

}