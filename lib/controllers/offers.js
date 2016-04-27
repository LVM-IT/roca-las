const backend = require('../backend')
const branches = require('../data/branches')
const enrichBranches = require('../enricher').enrichBranches
const enrichPartner = require('../enricher').enrichPartner
const enrichOffers = require('../enricher').enrichOffers
const enrichOffer = require('../enricher').enrichOffer
const enrichProposals = require('../enricher').enrichProposals
const enrichContracts = require('../enricher').enrichContracts
const enrichOfferAllocation = require('../enricher').enrichOfferAllocation
const enrichOfferCalculation = require('../enricher').enrichOfferCalculation
const enrichOfferParams = require('../enricher').enrichOfferParams
const expandErrors = require('../expand_errors')

exports.index = (req, res) => {
  Promise.all([
    backend.contracts(req.params.id),
    backend.partner(req.params.id),
    backend.offers(req.params.id),
    backend.proposals(req.params.id),
    backend.contracts(req.params.id)
  ]).then((result) => {
    let enrichedPartner = enrichPartner(result[1])

    res.render('offers/index', {
      title: `${enrichedPartner.firstName} ${enrichedPartner.name} - Angebote`,
      branches: enrichBranches(branches, result[0]),
      partner: enrichedPartner,
      offers: enrichOffers(result[2]),
      proposals: enrichProposals(result[3]),
      contracts: enrichContracts(result[4])
    })
  }, (err) => {
    // TODO: Add an error page template
    res.send(`An error occurred: ${err}`)
  })
}

exports.show = (req, res) => {
  Promise.all([
    backend.contracts(req.params.id),
    backend.partner(req.params.id),
    backend.offers(req.params.id),
    backend.proposals(req.params.id),
    backend.contracts(req.params.id),
    backend.offer(req.params.offer_id)
  ]).then((result) => {
    let enrichedPartner = enrichPartner(result[1])
    let enrichedOffer = enrichOffer(result[5])

    res.render('offers/show', {
      title: `${enrichedPartner.firstName} ${enrichedPartner.name} - Angebot ${enrichedOffer.id}`,
      branches: enrichBranches(branches, result[0]),
      partner: enrichedPartner,
      offers: enrichedOffer,
      proposals: enrichProposals(result[3]),
      contracts: enrichContracts(result[4]),
      offer: enrichOffer(result[5])
    })
  }, (err) => {
    // TODO: Add an error page template
    res.send(`An error occurred: ${err}`)
  })
}

exports.edit = (req, res) => {
  Promise.all([
    backend.contracts(req.params.id),
    backend.partner(req.params.id),
    backend.offers(req.params.id),
    backend.proposals(req.params.id),
    backend.contracts(req.params.id),
    backend.offer(req.params.offer_id)
  ]).then((result) => {
    let enrichedPartner = enrichPartner(result[1])
    let enrichedOffer = enrichOffer(result[5])

    res.render('offers/edit', {
      title: `${enrichedPartner.firstName} ${enrichedPartner.name} - Angebot ${enrichedOffer.id} - Bearbeitungsmodus`,
      branches: enrichBranches(branches, result[0]),
      partner: enrichedPartner,
      offers: enrichOffers(result[2]),
      proposals: enrichProposals(result[3]),
      contracts: enrichContracts(result[4]),
      offer: enrichedOffer
    })
  }, (err) => {
    // TODO: Add an error page template
    res.send(`An error occurred: ${err}`)
  })
}

exports.new = (req, res) => {
  Promise.all([
    backend.contracts(req.params.id),
    backend.partner(req.params.id),
    backend.offers(req.params.id),
    backend.proposals(req.params.id),
    backend.contracts(req.params.id),
    backend.offerAllocation(req.params.id)
  ]).then((result) => {
    let enrichedPartner = enrichPartner(result[1])

    res.render('offers/new', {
      title: `${enrichedPartner.firstName} ${enrichedPartner.name} - Neues Angebot`,
      branches: enrichBranches(branches, result[0]),
      partner: enrichedPartner,
      offers: enrichOffers(result[2]),
      proposals: enrichProposals(result[3]),
      contracts: enrichContracts(result[4]),
      offer: enrichOfferAllocation(result[5])
    })
  }, (err) => {
    // TODO: Add an error page template
    res.send(`An error occurred: ${err}`)
  })
}

exports.calc = (req, res) => {
  let stringifiedReqBody = JSON.stringify(req.body)
  Promise.all([
    backend.contracts(req.params.id),
    backend.partner(req.params.id),
    backend.offers(req.params.id),
    backend.proposals(req.params.id),
    backend.contracts(req.params.id),
    backend.offerCalculation(stringifiedReqBody)
  ]).then((result) => {
    let enrichedPartner = enrichPartner(result[1])
    let offer = enrichOfferCalculation(result[5], req.body)

    res.render('offers/new', {
      title: `${enrichedPartner.firstName} ${enrichedPartner.name} - Angebotsberechnung`,
      errors: expandErrors(offer),
      branches: enrichBranches(branches, result[0]),
      partner: enrichedPartner,
      offers: enrichOffers(result[2]),
      proposals: enrichProposals(result[3]),
      contracts: enrichContracts(result[4]),
      offer: offer
    })
  }, (err) => {
    // TODO: Add an error page template
    res.send(`An error occurred: ${err}`)
  })
}

exports.copy = (req, res) => {
  backend.copyOffer(req.params.offer_id).then((result) => {
    let newOffer = enrichOffer(result)
    let newOfferUri = newOffer.offerEditUri
    res.redirect(303, newOfferUri)
  }, (err) => {
    // TODO: Add an error page template
    res.send(`An error occurred: ${err}`)
  })
}

exports.create = (req, res) => {
  let offerParams = enrichOfferParams(req.params.id, req.body)
  let stringifiedOfferParams = JSON.stringify(offerParams)
  backend.createOffer(stringifiedOfferParams).then((result) => {
    let newOffer = enrichOffer(result)
    let newOfferUri = newOffer.offerUri
    res.redirect(303, newOfferUri)
  }, (err) => {
    // TODO: Add an error page template
    res.send(`An error occurred: ${err}`)
  })
}
