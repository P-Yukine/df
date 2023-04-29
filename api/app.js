const express = require('express');
const tf = require('@tensorflow/tfjs');
const tfn = require('@tensorflow/tfjs-node');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const modelPath = path.join(__dirname, '../node/model.json');

let model;

app.use(bodyParser.json());

app.post('/speech-to-text', async (req, res) => {
  try {
    const mfcc = req.body.mfcc;
    const input = tf.tensor(mfcc);
    const output = model.predict(input.expandDims(0));
    const predictedIndex = output.argMax(1).dataSync()[0];
    const predictedLabel = encoder.labels_[predictedIndex];
    res.json({ text: predictedLabel });
  } catch (error) {
    console.error(error);
    res.status(500).send('Error processing the request');
  }
});

(async () => {
  model = await tf.loadLayersModel(`file://${modelPath}`);
  app.listen(8080, () => {
    console.log('Server started on port 8080');
  });
})();
