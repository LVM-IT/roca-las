const backend = require('../backend')
const branches = require('../data/branches')
const enrichBranches = require('../enricher').enrichBranches
const enrichPartner = require('../enricher').enrichPartner
const enrichOffers = require('../enricher').enrichOffers
const enrichProposals = require('../enricher').enrichProposals
const enrichContracts = require('../enricher').enrichContracts
const enrichContract = require('../enricher').enrichContract

exports.index = (req, res) => {
  Promise.all([
    backend.contracts(req.params.id),
    backend.partner(req.params.id),
    backend.offers(req.params.id),
    backend.proposals(req.params.id),
    backend.contracts(req.params.id)
  ]).then((result) => {
    let enrichedPartner = enrichPartner(result[1])
    res.render('contracts/index', {
      title: `${enrichedPartner.firstName} ${enrichedPartner.name} - Verträge`,
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
    backend.contract(req.params.contract_id)
  ]).then((result) => {
    let enrichedPartner = enrichPartner(result[1])
    let enrichedContract = enrichContract(result[5])

    res.render('contracts/show', {
      title: `${enrichedPartner.firstName} ${enrichedPartner.name} - Vertrag ${enrichedContract.id}`,
      success: !!req.query.success,
      partnerId: req.params.id,
      contractId: req.params.contract_id,
      branches: enrichBranches(branches, result[0]),
      partner: enrichPartner(result[1]),
      offers: enrichOffers(result[2]),
      proposals: enrichProposals(result[3]),
      contracts: enrichContracts(result[4]),
      contract: enrichContract(result[5])
    })
  }, (err) => {
    // TODO: Add an error page template
    res.send(`An error occurred: ${err}`)
  })
}
