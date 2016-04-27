let http

if (process.env.BACKEND_PROTOCOL === 'https') {
  http = require('https')
} else {
  http = require('http')
}

const defaults = {
  host: process.env.BACKEND_HOST || 'localhost',
  port: process.env.BACKEND_PORT || 8080,
  method: 'GET'
}

const request = (opts, postData) => {
  const options = Object.assign({}, defaults, opts)

  return new Promise((resolve, reject) => {
    let req = http.request(options, (res) => {
      if (res.statusCode.toString()[0] !== '5') {
        let data = []
        res.on('data', (b) => data.push(b))
        res.on('end', (b) => resolve(JSON.parse(Buffer.concat(data))))
      } else {
        reject(`Unexpected Status Code ${res.statusCode}`)
      }
    })

    req.setTimeout(1000, () => {
      reject('Timeout for backend service')
    })

    req.on('error', reject)

    if (postData) {
      req.write(postData)
    }

    req.end()
  })
}

exports.household = (id) => request({ path: `/partner/${id}/haushalt` })
exports.contracts = (id) => request({ path: `/vertraege?partnerId=${id}` })
exports.proposals = (id) => request({ path: `/antraege?partnerId=${id}` })
exports.offers = (id) => request({ path: `/angebote?partnerId=${id}` })
exports.offer = (id) => request({ path: `/angebot/${id}` })
exports.copyOffer = (id) => request({ path: `/angebot/${id}`, method: 'POST' })
exports.createOffer = (offer) => request({ path: '/angebot/', method: 'POST', headers: {'Content-Type': 'application/json'} }, offer)
exports.offerAllocation = (id) => request({ path: `/angebot/kraftfahrt/vorbelegung?partnerId=${id}` })
exports.offerCalculation = (offer) => request({ path: '/angebot/kraftfahrt/berechnen', method: 'POST', headers: {'Content-Type': 'application/json'} }, offer)
exports.findPartner = (query) => request({ path: `/partners?q=${query}` })
exports.partner = (id) => request({ path: `/partner/${id}` })
exports.contacts = (id) => request({ path: `/partner/${id}/kontakt` })
exports.contract = (id) => request({ path: `/vertrag/${id}` })
exports.jobs = (str) => request({ path: `/berufe?q=${str}` })
