const mongoose = require('mongoose');

async function connect() {
  try {
    await mongoose.connect(
      'mongodb+srv://jestUser:jestUser@jest-database-bempv.mongodb.net/test?retryWrites=true&w=majority',
      { useNewUrlParser: true, useUnifiedTopology: true },
    );
    console.log('[SERVER] - Connected on Database.');
  } catch (err) {
    console.error('[ERROR] - Connection mongoDB.');
    console.error(err);
  }
}

async function disconnect() {
  mongoose.disconnect();
  console.log('[SERVER] - Database disconnected.');
}

module.exports = {
  connect,
  disconnect,
};
