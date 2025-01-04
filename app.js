const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const axios = require('axios')
require('dotenv').config()


app.use(bodyParser.json())

// const token = process.env.META_DEV_TOKEN;
// const myToken = process.env.MY_TOKEN

const {META_DEV_TOKEN, MY_TOKEN} = process.env;


app.listen(process.env.PORT, () => {
    console.log(`Example webhook listening`)
})

//to verify the callback
app.get("/webhook", (req, res) => {
    const mode = req.query["hub.mode"];
    const token = req.query["hub.verify_token"];
    const challenge = req.query["hub.challenge"];
  
    if (mode === "subscribe" && token === MY_TOKEN) {
      res.status(200).send(challenge);
      console.log("Webhook verified successfully!");
    } else {
      res.sendStatus(403);
    }
  });

  app.post("/webhook", async (req, res) => {
    // log incoming messages
    console.log("Incoming webhook message:", JSON.stringify(req.body, null, 2));
  
    // check if the webhook request contains a message
    // details on WhatsApp text message payload: https://developers.facebook.com/docs/whatsapp/cloud-api/webhooks/payload-examples#text-messages
    const message = req.body.entry?.[0]?.changes[0]?.value?.messages?.[0];
    console.log('Message: ', message)

    if (
        req.body.entry &&
        req.body.entry[0].changes &&
        req.body.entry[0].changes[0] &&
        req.body.entry[0].changes[0].value.messages &&
        req.body.entry[0].changes[0].value.messages[0]
    ) {
        // let messageType = req.body.entry[0].changes[0].value.messages[0].type;
        let messageFrom = req.body.entry[0].changes[0].value.messages[0].from;
        // let messageTimeStamp = req.body.entry[0].changes[0].value.messages[0].timestamp;
        let ourNumberId = req.body.entry[0].changes[0].value.metadata.phone_number_id;
        // let status = req.body.entry[0].changes[0].statuses;
        let contactName = req.body.entry[0].changes[0].value.contacts[0].profile.name;
        let msgText = `Olá ${contactName}! Parece que não sou tão medíocre assim.`;

        
        console.log(msgText);
        console.log('contact name', contactName);

        await axios({
                method: "POST",
                url: `https://graph.facebook.com/v21.0/${ourNumberId}/messages`,
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${META_DEV_TOKEN}`,
                },
                data: {
                  messaging_product: "whatsapp",
                  to: messageFrom,
                  text: { body: msgText },
                },
              });
    }
  
    // check if the incoming message contains text
    // if (message?.type === "text") {
    //   // extract the business number to send the reply from it
    //   const business_phone_number_id =
    //     req.body.entry?.[0].changes?.[0].value?.metadata?.phone_number_id;
  
    //   // send a reply message as per the docs here https://developers.facebook.com/docs/whatsapp/cloud-api/reference/messages
    //   
  
    //   // mark incoming message as read
    //   await axios({
    //     method: "POST",
    //     url: `https://graph.facebook.com/v21.0/${business_phone_number_id}/messages`,
    //     headers: {
    //       Authorization: `Bearer ${META_DEV_TOKEN}`,
    //     },
    //     data: {
    //       messaging_product: "whatsapp",
    //       status: "read",
    //       message_id: message.id,
    //     },
    //   });
    // }
  
    res.sendStatus(200);
  });

app.get("/", (req, res) => {
    res.status(200).send("hello this is webhook setup")
})