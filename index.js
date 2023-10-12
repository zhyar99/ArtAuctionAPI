const express = require('express');
const { default: mongoose } = require('mongoose');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const userRoute = require("./routes/userRoute");
const artistRoute = require("./routes/artistRoute");
const auctionRoute = require("./routes/auctionRoute");
const artworkRoute = require("./routes/artworkRoute");
const bidRoute = require("./routes/bidRoute");
const uploadFileRoute = require("./routes/uploadFileRoute");
const bodyParser = require("body-parser");
const socketIo = require('socket.io');
const http = require('http');
const Artwork = require('./Models/artwork');
const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: 'https://6527ae6249182411efcdbd86--chic-pie-348ac1.netlify.app/', // Adjust this to your React app's URL
    methods: ['GET', 'POST'],
  },
});

mongoose.connect('mongodb+srv://zhyar9991:Zhyar9991@cluster0.mz9arc7.mongodb.net/?retryWrites=true&w=majority', {useNewUrlParser: true});

app.use(express.json());
app.use(cookieParser());
app.use(cors({
    credentials: true,
    origin: 'https://6527ae6249182411efcdbd86--chic-pie-348ac1.netlify.app/',
    
}));

app.use(bodyParser.urlencoded({ extended: true }));


io.on('connection', (socket) => {
  console.log('A user connected');

  socket.on('joinAuction', (artwok_id, startDate, endDate, userId) => {
    socket.join(`product-${artwok_id}`);
    console.log(`User joined product room for product ID: ${artwok_id}`);

    const currentTime = new Date();
    if (currentTime >= startDate) {
      const duration = endDate - startDate;
      
      if (duration > 0) {
        auctionTimer = setTimeout(() => {
          io.to(`product-${artwork_id}`).emit('auctionEnded');

          console.log("auction ended");
          clearTimeout(auctionTimer);
        }, duration);
      }
    }

    socket.on('bidValue', (bidAmount) => {
      Artwork.findByIdAndUpdate(artwok_id, {
        $set: {
          currentHighestBid: bidAmount,
          last_bidder: userId,
        },
      }).exec();
      
      io.to(`product-${artwok_id}`).emit('bidUpdated', bidAmount);
    });
  });
  
  socket.join('clock-room')
  socket.on('disconnect', () => {
    console.log('A user disconnected');
  });
});

setInterval(()=>{
  io.to('clock-room').emit('time', new Date())
 
},1000)



app.use('/api/user', userRoute);
app.use('/api/artist', artistRoute);
app.use('/api/auction', auctionRoute);
app.use('/api/artwork', artworkRoute);
app.use('/api/bid', bidRoute);
app.use('/api/upload', uploadFileRoute);
app.use('/uploads', express.static('uploads'));
server.listen(3000, () => {
  console.log(`Server is running on port 3000`);
});