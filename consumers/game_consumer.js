const kafka = require('kafka-node');
const config = require('../config/config');
const db = require('../config/db.config');

const EndGame = require('../schedulers/endgame');

try {

  let count = 0;
  const Consumer = kafka.Consumer;
  const client = new kafka.KafkaClient({kafkaHost: config.kafka_server});
  let consumer = new Consumer(
    client,
    [{ topic: config.kafka_topic_endgame, partition: 0 }],
    {
      autoCommit: true,
      fetchMaxWaitMs: 1000,
      fetchMaxBytes: 1024 * 1024,
      encoding: 'utf8',
      fromOffset: false
    }
  );
  console.log("End game initialized");
  consumer.on('message', EndGame.endGameComputation);
  consumer.on('error', function(err) {
    console.log('error', err);
  });
}
catch(e) {
  console.log(e);
}
