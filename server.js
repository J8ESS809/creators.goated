const express = require('express');
const nodemailer = require('nodemailer');
const { MongoClient } = require('mongodb');
const bodyParser = require('body-parser');
const app = express();

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// MongoDB Connection
const uri = 'your_mongodb_connection_string'; // Replace with your MongoDB connection string
let db;

MongoClient.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(client => {
    db = client.db('email_accounts');
    console.log('Connected to Database');
  })
  .catch(error => console.error(error));

// Create SMTP transporter
const transporter = nodemailer.createTransport({
  host: 'smtp.your-email-provider.com',
  port: 587,
  secure: false,
  auth: {
    user: 'username@creators.goated', // Email address
    pass: 'your_email_password' // Password or OAuth2 code
  },
});

// Send Email
app.post('/send', (req, res) => {
  const { to, subject, text } = req.body;

  transporter.sendMail({
    from: 'username@creators.goated',
    to,
    subject,
    text,
  })
  .then(info => res.send(`Email sent: ${info.response}`))
  .catch(error => res.status(500).send(error.toString()));
});

// Email account management (CRUD operations)
app.post('/account', (req, res) => {
  const { email, password } = req.body;
  db.collection('users').insertOne({ email, password })
    .then(result => res.status(201).send(result))
    .catch(error => res.status(400).send(error));
});

// Start Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
