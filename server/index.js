const express = require('express');
const app = express();
const http = require('http').createServer(app)
const io = require('socket.io')(http)
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const routesUrls = require('./routes/routes');
const cors = require('cors');
dotenv.config();


mongoose.connect(process.env.DATABASE,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
  }).then(() => {
    console.log("Database connected successfully!!!");
  });

app.use(express.json());
app.use(cors());
app.use('/app', routesUrls);

io.on('connection', socket => {
  socket.on('message', ({ name, message }) => {
    io.emit('message', { name, message })
  })
})

http.listen(4000, function () {
  console.log('listening on port 4000')
})
