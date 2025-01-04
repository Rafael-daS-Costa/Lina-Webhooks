const express = require('express')
const app = express()
const port = 3000

app.use(express.static('public'))

app.get('/',(req, res) => {
    res.send('Hello World')
})

app.post('/',(req, res) => {
    res.send('Hello World')
})

app.get('/about/:teste', (req, res) => {
    res.send(`Meu nome é ${req.params.teste}`)
})

app.listen(port, () => {
    console.log('Example app listening on ${port}')
})