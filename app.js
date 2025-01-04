const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const axios = require('axios')
require('dotenv').config()


app.use(bodyParser.json())

const token = process.env.META_DEV_TOKEN;
const myToken = process.env.MY_TOKEN


app.listen(process.env.PORT, () => {
    console.log(`Example webhook listening`)
})

//to verify the callback
app.get('/webhook', function(req, res) {
    if (
      req.query['hub.mode'] == 'subscribe' &&
      req.query['hub.verify_token'] == myToken
    ) {
      res.send(req.query['hub.challenge']);
      console.log("Facebook verificou a URL");
    } else {
      res.sendStatus(400);
    }
  });

app.post("/webhook", (req, res) => {
    let body_param = req.body;

    console.log(JSON.stringify(body_param, null, 2))

    if (body_param.object) {
        console.log('inside body_param')
        if (body_param.entry &&
            body_param.entry[0].changes[0].value.messages &&
            body_param.entry[0].changes[0].value.messages[0]
        ) {
            let phon_no_id = body_param.entry[0].changes[0].value.metadata.phone_number_id;
            let from = body_param.entry[0].changes[0].value.messages[0].from;
            let msg_body = body_param.entry[0].changes[0].value.messages[0].text.body;

            console.log("phone number "+phon_no_id);
            console.log("from "+from);
            console.log("boady param "+msg_body);

            axios({
                method: "POST",
                url: `https://graph.facebook.com/v21.0/${phon_no_id}/messages?access_token=${token}`,
                data: {
                  messaging_product: "whatsapp",
                  to: from,
                  text: {
                    body: "Hello, TiaBette"
                  }
                },
                headers: {
                  "Content-Type": "application/json"
                }
              })
              .then(response => {
                console.log('Message sent successfully', response.data);
              })
              .catch(error => {
                console.error('Error sending message', error);
              });

            res.sendStatus(200);
        } else {
            res.sendStatus(404);
        }
    }
});

app.get("/", (req, res) => {
    res.status(200).send("hello this is webhook setup")
})