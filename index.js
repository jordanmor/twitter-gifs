const express = require('express');
const path = require('path');

const app = express();

// Serve static files from the React app
app.use(express.static(path.join(__dirname, 'client/build')));

app.get('/api/colors', (req, res) => {
  const colors = ['Green', 'Blue', 'Red', 'Orange', 'Yellow', 'Purple'];
  res.json(colors);
});

const port = process.env.PORT || 5000;
app.listen(port);

console.log(`App listening on ${port}`);