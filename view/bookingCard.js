
export function bookingCard(booking, index){
    
    return(
        `<div class="bookingCard" data-id="${booking.id}">
            
            <button class="bookingDeleteBtn" data-id="${booking.id}" >✕</button >

            <div class="bookingIndex">${index + 1}</div>
            <div class="bookingProvider">${booking.providerName}</div>
            <div class="bookingDate">${booking.date}</div>
            <div class="bookingTime">${booking.time}</div>

        </div>`
    )
}