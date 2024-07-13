const express = require('express');
const https = require('https');
const fs = require('fs');
const SocketIO = require('socket.io');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const vehicleRoutes = require('./routers/vehicleRoutes');
const saccoRoutes = require('./routers/saccoRoutes');
const commuterRoutes = require('./routers/commuterRoutes');

dotenv.config();
connectDB();

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

app.use('/api',(res)=>{
  res.send('API is running');
})

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
httpsServer.listen(PORT, () => console.log(`Server running on https://MA3.co.ke:${PORT}`));
