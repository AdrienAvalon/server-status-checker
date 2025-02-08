const express = require('express');
const cors = require('cors');
const { exec } = require('child_process');

const app = express();
app.use(cors());

const port = 3000;

app.get('/ping', (req, res) => {
  const ip = req.query.ip;
  if (!ip) {
    return res.status(400).json({ error: 'IP address is required' });
  }
  exec(`ping -c 1 ${ip}`, error => {
    if (error) {
      return res.json({ ip, status: false });
    }
    res.json({ ip, status: true });
  });
});

app.listen(port, () => {
  console.log(`Backend running at http://localhost:${port}`);
});