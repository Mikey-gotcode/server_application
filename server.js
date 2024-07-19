const express = require('express');
const https = require('https');
const fs = require('fs');
const SocketIO = require('socket.io');
const cors = require('cors');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const vehicleRoutes = require('./routers/vehicleRoutes');
const saccoRoutes = require('./routers/saccoRoutes');
const commuterRoutes = require('./routers/commuterRoutes');
const { mongoURI } = require('./config/keys');
const {getVehicleID}=require('./controllers/vehicleController')

dotenv.config();

const app = express();

// CORS configuration for Express routes
app.use(cors())
// app.use(cors({
//   origin: '[https://ma3sacco.netlify.app]',  // Replace with your frontend URL
//   methods: ['GET', 'POST'],  // Specify allowed HTTP methods
//   allowedHeaders: ['Content-Type'],
//   credentials:true  // Specify allowed headers
// }));
// app.use((req, res, next) => {
//   res.setHeader("Access-Control-Allow-Origin", "*");
//   res.setHeader("Access-Control-Allow-Methods", "POST, GET, PUT");
//   res.setHeader("Access-Control-Allow-Headers", "Content-Type");
//   next();
// })

app.use(express.json());

app.use('/sacco', saccoRoutes);
app.use('/vehicle', vehicleRoutes);
app.use('/commuter', commuterRoutes);

app.use('/api', (_, res) => {
  res.json({ message: 'API is running' });
});

const sslOptions = {
  key: fs.readFileSync('./server.key'),      // Update with actual path
  cert: fs.readFileSync('./server.cert')     // Update with actual path
};

const httpsServer = https.createServer(sslOptions, app);
// const io = SocketIO(httpsServer, {
//   cors: {
//     origin: ['https://ma3sacco.netlify.app'],
//     methods: ["GET", "POST"],
//     allowedHeaders: ["Content-Type", "Authorization"]

//   }
// });
const io = SocketIO(httpsServer, {
  cors: {
    origin: '*',
    methods: ["GET", "POST"]

  }
});

io.on('connection', (socket) => {
  console.log('New client connected:', socket.id);

  socket.on('sendLocation', (data) => {
    const vehicleID = getVehicleID();
    console.log('Location received from vehicle:', vehicleID, data);
    // Emit data with vehicleID
    socket.broadcast.emit('receiveLocation', { ...data, vehicleID });
});

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

const PORT = process.env.PORT || 5000;

// Connect to the database before starting the server
mongoose.connect(mongoURI)
  .then(() => {
    httpsServer.listen(PORT, () => {
      console.log(`Server running on https://MA3.co.ke:${PORT}`);
    });
  }).catch(error => {
    console.error('Failed to connect to the database:', error);
    process.exit(1);
  });
