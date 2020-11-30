const express = require('express'),
      router = express.Router(),
      fs = require('fs')

router.get('/reservations/available', (req, res) => {
    const from = parseInt(req.query.from)
    const to = parseInt(req.query.to)

    if (from && to) {
        let reservations = require('../reservations.json').reservations;
        let rooms = require('../rooms.json').rooms;

        for (let i = 0; i < reservations.length; i++) {
            const resa = reservations[i];

            // if a reservation starts or ends in the time choosen to book the room, room is not available
            if (resa.from >= from && resa.from < to || resa.to >= from && resa.to < to) {

                // iterate on every room to remove the one not available
                for (let j = 0; j < rooms.length; j++) {
                    if (rooms[j].name === resa.room) {
                        rooms.splice(j, 1)
                        break
                    }
                }

            }

            if (rooms.length === 0) {
                break
            }
        }

        // if capacity filter is passed, iterate over available rooms and remove the ones with smaller capacities
        const capacity = parseInt(req.query.capacity) || 0
        rooms = rooms.filter(room => room.capacity >= capacity)

        res.status(200).json({ rooms })
    }
    else {
        res.status(403).json({'error': 'missing from timestamp field or to timestamp field'})
    }
})

router.post('/reservations/new', (req, res) => {
    const name = req.body.room
    const from = parseInt(req.body.from)
    const to = parseInt(req.body.to)

    if (from && to && name) {
        let reservations = require('../reservations.json').reservations;
        let rooms = require('../rooms.json').rooms;

        // checks if room exists
        let roomExists = false
        for (let i = 0; i < rooms.length; i++) {
            if (rooms[i].name === name) {
                roomExists = true
                break
            }
        }

        if (!roomExists) {
            res.status(403).json({'error': 'Room does not exist'})
        }

        for (let j = 0; j < reservations.length; j++) {
            const resa = reservations[j];

            if (resa.room === name) {
                // if a reservation for the same starts or ends in the time choosen to book the room, room is not available
                if (resa.from >= from && resa.from < to || resa.to >= from && resa.to < to) {
                    res.status(200).json({ 'result': 'Room is not available' })
                }
            }
        }

        reservations.push({
            room: name,
            from: from,
            to: to
        })

        let data = JSON.stringify({"reservations": reservations});
        fs.writeFileSync('reservations.json', data);

        res.status(200).json({ 'result': 'done' })
    }
    else {
        res.status(403).json({'error': 'missing name field or from timestamp field or to timestamp field'})
    }
})

module.exports = router