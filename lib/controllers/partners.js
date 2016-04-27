const backend = require('../backend')
const branches = require('../data/branches')
const enrichBranches = require('../enricher').enrichBranches
const enrichHousehold = require('../enricher').enrichHousehold
const enrichContracts = require('../enricher').enrichContracts
const enrichPartner = require('../enricher').enrichPartner
const enrichContacts = require('../enricher').enrichContacts
const enrichProposals = require('../enricher').enrichProposals
const enrichOffers = require('../enricher').enrichOffers

exports.get = (req, res) => {
  Promise.all([
    backend.household(req.params.id),
    backend.contracts(req.params.id),
    backend.partner(req.params.id),
    backend.contacts(req.params.id),
    backend.proposals(req.params.id),
    backend.offers(req.params.id)
  ]).then((result) => {
    let enrichedPartner = enrichPartner(result[2])

    res.render('partners', {
      title: `${enrichedPartner.firstName} ${enrichedPartner.name} - Deckblatt`,
      branches: enrichBranches(branches, result[1]),
      household: enrichHousehold(result[0]),
      contracts: enrichContracts(result[1]),
      partner: enrichedPartner,
      contacts: enrichContacts(result[3]),
      proposals: enrichProposals(result[4]),
      offers: enrichOffers(result[5])
    })
  }, (err) => {
    // TODO: Add an error page template
    res.send(`An error occurred: ${err}`)
  })
}
