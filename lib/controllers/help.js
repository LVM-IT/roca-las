exports.shortcuts = (req, res) => {
  res.render('help/shortcuts', {
    layout: false
  })
}

exports.example = (req, res) => {
  res.render('help/example', {
  })
}
