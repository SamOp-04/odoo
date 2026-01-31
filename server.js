require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./src/config/database');
const errorHandler = require('./src/middleware/errorHandler');

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

connectDB();

app.use('/api/auth', require('./src/routes/auth'));
app.use('/api/products', require('./src/routes/products'));
app.use('/api/quotations', require('./src/routes/quotations'));
app.use('/api/orders', require('./src/routes/orders'));
app.use('/api/invoices', require('./src/routes/invoices'));
app.use('/api/payments', require('./src/routes/payments'));
app.use('/api/dashboard', require('./src/routes/dashboard'));
app.use('/api/reports', require('./src/routes/reports'));
app.use('/api/users', require('./src/routes/users'));
app.use('/api/settings', require('./src/routes/settings'));
app.use('/api/notifications', require('./src/routes/notifications'));

app.get('/', (req, res) => {
  res.json({ 
    message: 'Rental Management API',
    status: 'running',
    timestamp: new Date()
  });
});

app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});