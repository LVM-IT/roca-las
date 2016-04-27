const backend = require('../backend')
const branches = require('../data/branches')
const enrichBranches = require('../enricher').enrichBranches
const enrichPartner = require('../enricher').enrichPartner
const enrichOffers = require('../enricher').enrichOffers
const enrichProposals = require('../enricher').enrichProposals
const enrichContracts = require('../enricher').enrichContracts
const enrichContract = require('../enricher').enrichContract

exports.edit = (req, res) => {
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
    let person = enrichedContract.nutzung.people[0]

    res.render('people/show', {
      title: `${enrichedPartner.firstName} ${enrichedPartner.name} - Vertrag ${enrichedContract.id}`,
      success: !!req.query.success,
      partnerId: req.params.id,
      contractId: req.params.contract_id,
      branches: enrichBranches(branches, result[0]),
      partner: enrichPartner(result[1]),
      offers: enrichOffers(result[2]),
      proposals: enrichProposals(result[3]),
      contracts: enrichContracts(result[4]),
      contract: enrichContract(result[5]),
      person: person
    })
  }, (err) => {
    // TODO: Add an error page template
    res.send(`An error occurred: ${err}`)
  })
}
