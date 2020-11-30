const baseUrl = 'http://localhost:3000';

const api = {
    getAvailable(from, to, capacity, completion) {
        let url = `${baseUrl}/reservations/available?from=${from}&to=${to}`
        if (capacity !== 0) {
            url += `&capacity=${capacity}`
        }
        fetch(url)
        .then((res) => {
            if (res.status === 200 || res.status === 403) {
                res.json()
                .then(data => {
                    completion(data)
                })
            }
            else {
                // error 500 or no internet or else...
                completion()
            }
        })
    },

    addReservation(name, from, to, completion) {
        const body = JSON.stringify({ room: name, from, to })
        const headers = { 'Content-Type': 'application/json' }
        console.log(body)
        fetch(`${baseUrl}/reservations/new`, {
            method: "POST", headers, body: body
        })
        .then(res => {
            if (res.status === 200 || res.status === 403) {
                res.json()
                .then(data => {
                    completion(data)
                })
            }
            else {
                // error 500 or no internet or else...
                completion()
            }
        })
    }
}

export default api