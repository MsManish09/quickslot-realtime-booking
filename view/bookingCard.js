
export function bookingCard(booking, index){
    
    return(
        `<div class="bookingCard">
            <div class="bookingIndex">${index + 1}</div>

            <div class="bookingContent">
                <div class="bookingHeader">
                    <span class="bookingProvider">${booking.providerName}</span>
                    <span class="bookingDate">${booking.date}</span>
                </div>

                <div class="bookingTime">
                    ${booking.time}
                </div>
            </div>
        </div>`
    )
}