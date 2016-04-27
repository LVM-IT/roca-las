const backend = require('../backend')
const branches = require('../data/branches')
const enrichBranches = require('../enricher').enrichBranches
const enrichPartner = require('../enricher').enrichPartner
const enrichOffers = require('../enricher').enrichOffers
const enrichProposals = require('../enricher').enrichProposals
const enrichContracts = require('../enricher').enrichContracts

exports.show = (req, res) => {
  Promise.all([
    backend.contracts(req.params.id),
    backend.partner(req.params.id),
    backend.offers(req.params.id),
    backend.proposals(req.params.id),
    backend.contracts(req.params.id)
  ]).then((result) => {
    let enrichedPartner = enrichPartner(result[1])

    res.render('branches/kfz', {
      title: `${enrichedPartner.firstName} ${enrichedPartner.name} - KFZ Produktauswahl`,
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
