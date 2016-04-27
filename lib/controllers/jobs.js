const backend = require('../backend')

exports.index = (req, res) => {
  res.render('jobs/index', {
    title: `Berufssuche`,
  })
}

exports.results = (req, res) => {
  const query = req.query.query || req.query.q

  Promise.all([
    backend.jobs(query)
  ]).then((result) => {
    if (req.get('Accept').includes('json')) {
      const response = result[0].map((item) => {
        return {
          id: parseInt(item.berufId),
          text: item.name
        }
      })
      res.json({ results: response })
    } else {
      res.render('jobs/results', {
        results: result[0]
      })
    }
  }, (err) => {
    // TODO: Add an error page template
    res.send(`An error occurred: ${err}`)
  })
}

