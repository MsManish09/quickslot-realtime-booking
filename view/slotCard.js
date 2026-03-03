
export function slotCard(slots){
    
    let slotPills = ''
    slots.forEach((slot)=> {
        slotPills += slotCardCreation(slot)
    })

    return slotPills
    
}

function slotCardCreation(slot){
    return(`
        <div class="slot slot-booked-${slot.isBooked}" data-slot-time="${slot.time}">
            <span class="slotTime">${slot.time}</span>
            <span class="slotStatus">${slot.isBooked? 'Unavailable' : 'Available'}</span>
        </div>
        `)
    
}