const express = require('express'),
      bodyParser = require('body-parser'),
      cors = require('cors'),
      reservationsRoutes = require('./routes/reservations');

const app = express(),
      server = require('http').createServer(app);

app.use(cors())
app.use(bodyParser.json())
app.use(reservationsRoutes)

server.listen(3000)