const mongoose = require('mongoose');
const dotenv = require('dotenv');

process.on('uncaughtException', (err) => {
  console.log('Uncaught Exception, shutting down...');
  console.log(err.name, err.message);
  process.exit(1);
});

dotenv.config({ path: './config.env' });
const app = require('./app');

mongoose
  .connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  })
  .then(() => {
    console.log('DB connection established');
  });

// Port
const port = process.env.PORT || 4000;

const server = app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});

process.on('unhandledRejection', (err) => {
  console.log('Unhandled Rejection, shutting down...');
  console.log(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});
