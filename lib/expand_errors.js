const structuralCopy = (obj) => {
  if (Array.isArray(obj)) {
    return obj.map((entry) => structuralCopy(entry))
  } else if (typeof(obj) === 'object') {
    return Object.keys(obj).reduce((target, key) => {
      target[key] = structuralCopy(obj[key])
      return target
    }, {})
  } else {
    return false
  }
}

const setField = (obj, selector, val) => {
  if (selector.length > 1) {
    setField(obj[selector[0]], selector.splice(1), val)
  } else {
    obj[selector[0]] = val
  }
}

module.exports = (offer) => {
  let expanded = structuralCopy(offer)

  offer.errors.forEach((error) => {
    setField(expanded, error.bezugsFeld.split('.'), error)
  })

  return expanded
}

