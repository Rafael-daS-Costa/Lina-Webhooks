const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const axios = require('axios')
require('dotenv').config()


app.use(bodyParser.json())

const token = process.env.META_DEV_TOKEN;
const myToken = process.env.MY_TOKEN


app.listen(3000 || process.env.PORT, () => {
    console.log(`Example webhook listening`)
})

//to verify the callback
app.get('/webhook', (req, res) => {
    let mode = req.query["hub.mode"];
    let challange = req.query["hub.challange"];
    let token = req.query["hub.verify_token"];

    if (mode && token) {

        if (mode === "subscribe" && token === myToken ) {
            res.status(200).send(challange);
        } else {
            res.status(403);
        }

    }
});

app.post("/webhook", (req, res) => {
    let body_param = req.body;

    console.log(JSON.stringify(body_param, null, 2))

    if (body_param.object) {
        if (body_param.entry &&
            body_param.entry[0].changes[0].value.message &&
            body_param.entry[0].changes[0].value.message[0]
        ) {
            let phon_no_id = body.entry[0].changes[0].value.metadata.phone_number_id;
            let from = body.entry[0].changes[0].value.messages[0].from;
            let msg_body = body.entry[0].changes[0].value.messages[0].text.body;


            axios({
                method: "POST",
                url: "https://graph.facebook.com/v21.0/"+phon_no_id+"/messages?access_token="+token,
                data: {
                    messaging_product: "whatsapp",
                    to: from,
                    text: {
                        body: "Hello, TiaBette"
                    }
                },
                headers: {
                    "Content-Type":"application/json"
                }
            })

            res.sendStatus(200);
        } else {
            res.sendStatus(404);
        }
    }
});

app.get("/", (req, res) => {
    res.status(200).send("hello this is webhook setup")
})