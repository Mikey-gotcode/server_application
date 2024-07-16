const express = require('express');
const https = require('https');
const fs = require('fs');
const SocketIO = require('socket.io');
const cors = require('cors');
const dotenv = require('dotenv');
//const connectDB = require('./config/db');
const vehicleRoutes = require('./routers/vehicleRoutes');
const saccoRoutes = require('./routers/saccoRoutes');
const commuterRoutes = require('./routers/commuterRoutes');
const { default: mongoose } = require('mongoose');
const db=require('./config/keys')

dotenv.config();

const app = express();

const sslOptions = {
  key: fs.readFileSync('./server.key'),      // Update with actual path
  cert: fs.readFileSync('./server.cert')     // Update with actual path
};

const httpsServer = https.createServer(sslOptions, app);
const io = SocketIO(httpsServer, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

app.use(cors());
app.use(express.json());

app.use('/sacco', saccoRoutes);
app.use('/vehicle', vehicleRoutes);
app.use('/commuter', commuterRoutes);

app.use('/api', (_, res) => {
  res.json({ message: 'API is running' });
});

io.on('connection', (socket) => {
  console.log('New client connected:', socket.id);

  socket.on('sendLocation', (data) => {
    console.log('Location received:', data);
    socket.broadcast.emit('receiveLocation', data);
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

const PORT = process.env.PORT || 5000;

// Connect to the database before starting the server
mongoose
.connect(db)
.then(() => {
  httpsServer.listen(PORT, () => {
    console.log(`Server running on https://MA3.co.ke:${PORT}`);
  });
}).catch(error => {
  console.error('Failed to connect to the database:', error);
  process.exit(1);
});
