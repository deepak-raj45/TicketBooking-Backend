const axios = require('axios');

const dataToSend = {
  seatNumber: 5, // Replace with the actual seat number
  rowIndex: 2,   // Replace with the actual row index
  userId: "user123" // Replace with the actual user ID or leave it out if it's optional
};

axios.post('http://localhost:5000/selected-seats', dataToSend)
  .then((response) => {
    // Handle the server response here
    console.log('Server response:', response.data);
  })
  .catch((error) => {
    // Handle any errors here
    console.error('Error:', error.response.data); // Log the response from the server
  });