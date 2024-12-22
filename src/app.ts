import { createBot } from "@builderbot/bot";
import { MemoryDB as Database } from "@builderbot/bot";
import {provider} from "./provider";
import { config } from "./config";
import templates from "./templates";
import express from 'express';

const app = express();
const PORT = config.PORT;

app.get('/webhook', (req, res) => {
  const mode = req.query['hub.mode'];
  const token = req.query['hub.verify_token'];
  const challenge = req.query['hub.challenge'];

  if (mode && token === config.verifyToken) {
    res.status(200).send(challenge);
  } else {
    res.status(403).send('Forbidden');
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});



const main = async () => {
  const { handleCtx, httpServer } = await createBot({
    flow: templates,
    provider: provider,
    database: new Database(),
  });

  httpServer(+PORT);
};

main();