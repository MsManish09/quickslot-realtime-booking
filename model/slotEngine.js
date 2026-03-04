import { getState } from "./state.js";

export function generateSlots(target){
    const {utcNow,bookings } = getState()

    let slots = []
    for(let hour=9; hour <= 17; hour++){
        ['00', '30'].forEach((t)=>{
            const hourStr = String(hour).padStart(2, '0');
            const time= `${hourStr}:${t}`
            let slot ={
                providerId: target.providerId,
                date: target.date,
                time,
                isBooked: isBooked(target, time, bookings, utcNow)
            }
            slots.push(slot)
        })
    }

    return slots
}

// function to check is slot is already booked
function isBooked(target, slotTime, bookings, utcNow){


    const targetDate = new Date(`${target.date}T${slotTime}:00`);

    if(utcNow >= targetDate ){
        return true
    }


    // check is target + slotTime present in bookings
    return bookings.some(b =>
        b.providerId == target.providerId &&
        b.date == target.date &&
        b.time == slotTime
    )

}