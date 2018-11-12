const Nexmo = require('nexmo')


const nexmo = new Nexmo({
    apiKey: 'c1dc1405',
    apiSecret: 'o7dbxhoXhmbOKeqY'
})

module.exports = function sendingSMS(to, text) {
    const from = 'Nexmo'
    nexmo.message.sendSms(from, to, text)
}
