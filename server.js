const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

// Enable CORS
app.use(cors());
app.use(express.json()); // Parse JSON request bodies

// Define a schema that matches the structure of the existing "movie_list" collection
const movieNameSchema = new mongoose.Schema({
  name: String,
  // Add other fields as needed
}, { collection: 'movie_list' });

const historySchema = new mongoose.Schema({
  name: String,
  // Add other fields as needed
}, { collection: 'avengers' });

// Create a model for the schema
const MovieName = mongoose.model('MovieName', movieNameSchema);
const History = mongoose.model('History', historySchema);

// Define a schema for selected seats
const selectedSeatSchema = new mongoose.Schema({
  seatNumber: Number,
  rowIndex: Number,
  theatre: String, // Add theatre field
}, { collection: 'selectedseats' });



// Define a schema and model for your data
const itemSchema = new mongoose.Schema({
  
  username: String,
  password: String,
  email: String,
  
});

const Item = mongoose.model('Details', itemSchema);


// Create a model for selected seats
const SelectedSeat = mongoose.model('SelectedSeat', selectedSeatSchema);

// Connect to MongoDB
mongoose
  .connect('mongodb+srv://Gowsikkan:2001@cluster0.7gb3jez.mongodb.net/movies', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB:', error);
  });

//Login API
app.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await Item.findOne({ username, password });
    if (user) {
      res.send('Login successful');
    } else {
      res.status(401).send('Invalid credentials');
    }
  } catch (error) {
    res.status(500).send('An error occurred');
  }
});

// Signup API
app.post('/signup', (req, res) => {
  const { username, password, email } = req.body;

  if (!username || !password || !email) {
    // Check if required fields are provided
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const user = new Item({ username, password, email });

  user.save()
    .then(() => {
      res.status(201).json({ message: 'User created successfully' });
    })
    .catch((error) => {
      res.status(500).json({ error: 'An error occurred' });
    });
});



// Define a route to access data from the existing "movie_list" collection
app.get('/data', (req, res) => {
  MovieName.find()
    .then((data) => {
      res.json(data);
    })
    .catch((error) => {
      console.error('Error fetching data:', error);
      res.status(500).json({ error: 'Internal server error' });
    });
});

app.get('/history', (req, res) => {
  History.find()
    .then((data) => {
      res.json(data);
    })
    .catch((error) => {
      console.error('Error fetching data:', error);
      res.status(500).json({ error: 'Internal server error' });
    });
});

// Define a route to store selected seats
// app.post('/selected-seats', async (req, res) => {
//   try {
//     const { seatNumber, rowIndex } = req.body;
    
//     // Create a new instance of the SelectedSeat model with the correct data
//     const selectedSeat = new SelectedSeat({
//       seatNumber: seatNumber,
//       rowIndex: rowIndex,
    
//     });
//     console.log(selectedSeat.seatNumber)
//     console.log(req.body)
//     // Save the selected seat document
//     await selectedSeat.save();

//     // Log a success message
//     console.log('Saved selected seat:', selectedSeat);

//     res.status(201).json(selectedSeat);
//   } catch (error) {
//     console.error('Error storing selected seat:', error);
//     res.status(500).json({ error: 'Error storing selected seat' });
//   }
// });

app.post('/selected-seats', async (req, res) => {
  try {
    const requestData = req.body;
    const theaterName = req.query.theatre; // Get the theater name from the query parameters

    const seatsWithTheater = requestData.map(seat => ({ ...seat, theatre: theaterName }));

    const savedSeats = await SelectedSeat.insertMany(seatsWithTheater);

    console.log('Saved selected seats:', savedSeats);

    res.status(201).json(savedSeats);
  } catch (error) {
    console.error('Error storing selected seats:', error);
    res.status(500).json({ error: 'Error storing selected seats' });
  }
});


// Define a route to retrieve selected seats
app.get('/booked-seats', async (req, res) => {
  try {
    const { theatre } = req.query;
    const bookedSeats = await SelectedSeat.find({ theatre });
    res.json(bookedSeats);
  } catch (error) {
    console.error('Error fetching booked seats:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});


app.listen(5000, () => {
  console.log('Server is running on port 5000');
});
