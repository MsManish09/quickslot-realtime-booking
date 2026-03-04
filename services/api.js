const rosterUrl = "https://jsonplaceholder.typicode.com/users?_limit=10";
// Fake API to fetch 10 random providers

const clockUrl = 'https://time.now/developer/api/timezone/Asia/Kolkata';
// Real time API to sync with internet clock (IST)



// function to fetch providersList
export async function fetchProviders(){
    try {
        let res = await fetch(rosterUrl)
        let data  = await res.json()
        let providers = data.map(p =>{
            return{
                id: p.id,
                name: p.name,
                website: p.website,
                speciality: p.company.bs
            }
        })

        return providers


    } catch (error) {
        console.error('Error loading providers: ', error)
        return []
    }
}

// function to fetch now UTC time
export async function fetchUtcTime(){
    try {
        const res = await fetch(clockUrl)
        let data = await res.json()
        
        // data = extractUtcTime(data.utc_datetime)
        data = new Date(data.datetime)
        console.log('fetch utcTime Fn: date: ', data)
        return data
        
    } catch (error) {
        console.log('UTC time fetch failed, falling back to client time. ', error)
        let time = getUserLocalTime()
        return time
    }
}

// // extract UTC time from api response
// function extractUtcTime(time){
//     const date =  new Date(time)
//     const utc = date.toLocaleTimeString('en-GB', {
//         timeZone: 'UTC',
//         hour: '2-digit',
//         minute: '2-digit',
//         second: '2-digit',
//         hour12: true,
//         timeZoneName: "short"
//     })
//     return utc
// }

// // extract user local time
// export function getUserLocalTime() {
//   let now = new Date();

//     now =  now.toLocaleTimeString("en-GB", {
//     hour: "2-digit",
//     minute: "2-digit",
//     second: "2-digit",
//     hour12: true,
//     timeZoneName: "short"
//   })
//   return now
// }