const branches = require('./data/branches')
const contactTypes = require('./data/contact_types')
const moment = require('moment')

const findIconForBranch = (label) => {
  return branches.find((branch) => branch.label === label).icon
}

exports.enrichHousehold = (people) => {
  return people.map((person) => {
    let name = person.name

    if (person.hasOwnProperty('vorname')) {
      name = `${person.vorname} ${person.name}`
    }
    return {
      dob: person.geburtsdatum,
      name: name,
      relationship: person.beziehung
    }
  })
}

const formatMoney = (amount) => {
  let euros = Math.floor(amount / 100)
  let cents = amount % 100
  if (cents < 10) {
    cents = `0${cents}`
  }
  return `${euros},${cents} €`
}

exports.enrichContracts = (contracts) => {
  return contracts.map((contract) => {
    return {
      id: contract.vsnr,
      branch: contract.sparte,
      fee: contract.beitragZent,
      formattedFee: formatMoney(contract.beitragZent),
      icon: findIconForBranch(contract.sparte),
      contractUri: `/partners/${contract.partnerId}/contracts/${contract.vsnr}`
    }
  })
}

exports.enrichContract = (contract) => {
  return {
    id: contract.vsnr,
    branch: contract.sparte,
    fee: contract.beitragZent,
    formattedFee: formatMoney(contract.beitragZent),
    icon: findIconForBranch(contract.sparte),
    contractUri: `/partners/${contract.partnerId}/contracts/${contract.vsnr}`,
    // TODO: translate later, I keep these keys because it could be
    // difficult with error marker on validation errors
    fahrzeugdaten: {
      fahrzeugart: contract.fahrzeugdaten.fahrzeugart,
      kennzeichen: contract.fahrzeugdaten.kennzeichen,
      hsn: contract.fahrzeugdaten.hsn,
      typschl: contract.fahrzeugdaten.typschl,
      erstzulassung: contract.fahrzeugdaten.erstzulassung,
      fahrgestell: contract.fahrzeugdaten.fahrgestell,
      fahrzeugstaerkePS: contract.fahrzeugdaten.fahrzeugstaerkePS,
      austauschmotor: ((contract.fahrzeugdaten.austauschmotor === true) ? 'Ja' : 'Nein'),
      kennzeichenart: contract.fahrzeugdaten.kennzeichenart,
      wechselkennzeichen: ((contract.fahrzeugdaten.wechselkennzeichen === true) ? 'Ja' : 'Nein')
    },
    nutzung: {
      beliebigeFahrer: contract.nutzung.beliebigeFahrer,
      nachtAbstellplatz: contract.nutzung.nachtAbstellplatz,
      fahrleistungKm: contract.nutzung.fahrleistungKm,
      kilometerstand: contract.nutzung.kilometerstand,
      abweichenderFahrzeughalter: ((contract.fahrzeugdaten.abweichenderFahrzeughalter === true) ? 'Ja' : 'Nein'),
      nutzung: contract.nutzung.nutzung,
      selbstGenEigentum: ((contract.fahrzeugdaten.selbstGenEigentum === true) ? 'Ja' : 'Nein'),
      wohneigentumart: contract.nutzung.wohneigentumart,
      people: [
        {
          id: 1,
          age: 40,
          dob: '05.05.1975',
          firstName: 'Udo',
          name: 'Unfall',
          personUri: `/partners/${contract.partnerId}/contracts/${contract.vsnr}/people/1`,
          personEditUri: `/partners/${contract.partnerId}/contracts/${contract.vsnr}/people/1/edit`
        },
        {
          id: 2,
          age: 40,
          dob: '05.05.1975',
          firstName: 'Uschi',
          name: 'Unfall',
          personUri: `/partners/${contract.partnerId}/contracts/${contract.vsnr}/people/2`,
          personEditUri: `/partners/${contract.partnerId}/contracts/${contract.vsnr}/people/2/edit`
        }
      ]
    },
    versSchutz: {
      haftpflichSFR: contract.versSchutz.haftpflichSFR,
      volkaskoSFR: contract.versSchutz.volkaskoSFR,
      tarifgruppe: contract.versSchutz.tarifgruppe,
      rahmenvertrag: contract.versSchutz.rahmenvertrag,
      versBeginn: contract.versSchutz.versBeginn,
      zahlungsweise: contract.versSchutz.zahlungsweise
    }
  }
}

exports.enrichProposals = (proposals) => {
  return proposals.map((proposal) => {
    return {
      branch: proposal.sparte,
      fee: proposal.beitragZent,
      formattedFee: formatMoney(proposal.beitragZent),
      icon: findIconForBranch(proposal.sparte),
      uri: proposal.antragURI
    }
  })
}

exports.enrichOffers = (offers) => {
  return offers.map((offer) => {
    return {
      id: offer.angebotId,
      agency: offer.agentur,
      branch: offer.sparte,
      claims: offer.schaeden,
      expire: offer.ablauf,
      fee: offer.beitragZent,
      formattedFee: formatMoney(offer.beitragZent),
      icon: findIconForBranch(offer.sparte),
      incident: offer.versichertist,
      paymentInterval: offer.zahlungsweise,
      role: offer.rolle,
      offerUri: `/partners/${offer.partnerId}/offers/${offer.angebotId}`
    }
  })
}

exports.enrichOffer = (offer) => {
  return {
    id: offer.angebotId,
    agency: offer.agentur,
    branch: offer.sparte,
    claims: offer.schaeden,
    expire: offer.ablauf,
    fee: offer.beitragZent,
    formattedFee: formatMoney(offer.beitragZent),
    icon: findIconForBranch(offer.sparte),
    incident: offer.versichertist,
    paymentInterval: offer.zahlungsweise,
    role: offer.rolle,
    offerUri: `/partners/${offer.partnerId}/offers/${offer.angebotId}`,
    offerCopyUri: `/partners/${offer.partnerId}/offers/${offer.angebotId}/copy`,
    offerEditUri: `/partners/${offer.partnerId}/offers/${offer.angebotId}/edit`,
    vehicleData: {
      vehicleType: offer.fahrzeugdaten.fahrzeugart,
      licensePlate: offer.fahrzeugdaten.kennzeichen,
      manufacturerNo: offer.fahrzeugdaten.hsn,
      typeKey: offer.fahrzeugdaten.typschl,
      registrationDate: offer.fahrzeugdaten.erstzulassung,
      identificationNumber: offer.fahrzeugdaten.fahrgestell,
      horsepower: offer.fahrzeugdaten.fahrzeugstaerkePS,
      changeableEngine: ((offer.fahrzeugdaten.austauschmotor === true) ? 'Ja' : 'Nein'),
      licensePlateType: offer.fahrzeugdaten.kennzeichenart,
      changeableLicensePlate: ((offer.fahrzeugdaten.wechselkennzeichen === true) ? 'Ja' : 'Nein')
    },
    usage: {
      anyDriver: offer.nutzung.beliebigeFahrer,
      nightlyPound: offer.nutzung.nachtAbstellplatz,
      drivingPerformance: offer.nutzung.fahrleistungKm,
      mileage: offer.nutzung.kilometerstand,
      differentVehicleOwner: ((offer.fahrzeugdaten.abweichenderFahrzeughalter === true) ? 'Ja' : 'Nein'),
      usage: offer.nutzung.nutzung,
      ownerOccupiedHome: ((offer.fahrzeugdaten.selbstGenEigentum === true) ? 'Ja' : 'Nein'),
      homeOwnershipType: offer.nutzung.wohneigentumart
    },
    insuranceCover: {
      liabilityDiscount: offer.versSchutz.haftpflichSFR,
      comprehensiveCoverDiscount: offer.versSchutz.volkaskoSFR,
      wageGroup: offer.versSchutz.tarifgruppe,
      basicAgreement: offer.versSchutz.rahmenvertrag,
      start: offer.versSchutz.versBeginn,
      paymentMethod: offer.versSchutz.zahlungsweise
    }
  }
}

exports.enrichOfferAllocation = (offerAllocation) => {
  return {
    personal: {
      dob: offerAllocation.geburtsdatum,
      street: offerAllocation.anschrift.strasse,
      postcode: offerAllocation.anschrift.plz,
      city: offerAllocation.anschrift.ort,
      district: offerAllocation.anschrift.stadtteil
    },
    insuranceCover: {
      availablePaymentMethods: offerAllocation.zahlungsweise
    }
  }
}

exports.enrichOfferParams = (partnerId, offerParams) => {
  return {
    // default values which are not in form
    partnerId: partnerId,
    sparte: 'Kraftfahrt',
    rolle: 'Versicherungsnehmer',
    agentur: '2008/21',
    versichertist: 'M-RS 6',
    schaeden: 0,
    ablauf: '',
    zahlungsweise: 'jährlich',
    beitragZent: 9999,
    fahrzeugdaten: {
      // fahrzeugart: offerParams.vehicleData.vehicleType,
      kennzeichen: offerParams['vehicleData.licensePlate'],
      hsn: offerParams['vehicleData.manufacturerNo'],
      typschl: offerParams['vehicleData.typeKey'],
      erstzulassung: offerParams['vehicleData.registrationDate'],
      fahrgestell: offerParams['vehicleData.identificationNumber'],
      fahrzeugstaerkePS: offerParams['vehicleData.horsepower'],
      austauschmotor: (offerParams['vehicleData.changeableEngine'] === 'true'),
      kennzeichenart: offerParams['vehicleData.licensePlateType'],
      wechselkennzeichen: (offerParams['vehicleData.changeableLicensePlate'] === 'true')
    },
    nutzung: {
      beliebigeFahrer: offerParams['usage.anyDriver'],
      nachtAbstellplatz: offerParams['nightlyPound'],
      fahrleistungKm: offerParams['usage.drivingPerformance'],
      kilometerstand: offerParams['usage.mileage'],
      abweichenderFahrzeughalter: (offerParams['usage.differentVehicleOwner'] === 'true'),
      nutzung: offerParams['usage.usage'],
      selbstGenEigentum: (offerParams['usage.ownerOccupiedHome'] === 'true'),
      wohneigentumart: offerParams['usage.homeOwnershipType']

    },
    versSchutz: {
      haftpflichSFR: offerParams['liabilityDiscount'],
      volkaskoSFR: offerParams['comprehensiveCoverDiscount'],
      tarifgruppe: offerParams['insuranceCover.wageGroup'],
      rahmenvertrag: offerParams['insuranceCover.basicAgreement'],
      versBeginn: offerParams['insuranceCover.start'],
      zahlungsweise: offerParams['insuranceCover.paymentMethod']
    }
  }
}

exports.enrichOfferCalculation = (offerCalculation, offerParams) => {
  return {
    vehicleData: {
      vehicleType: offerParams['vehicleData.vehicleType'],
      licensePlate: offerParams['vehicleData.licensePlate'],
      manufacturerNo: offerParams['vehicleData.manufacturerNo'],
      typeKey: offerParams['vehicleData.typeKey'],
      registrationDate: offerParams['vehicleData.registrationDate'],
      identificationNumber: offerParams['vehicleData.identificationNumber'],
      horsepower: offerParams['vehicleData.horsepower'],
      changeableEngine: ((offerParams['vehicleData.changeableEngine'] === true) ? 'Ja' : 'Nein'),
      licensePlateType: offerParams['vehicleData.licensePlateType'],
      changeableLicensePlate: ((offerParams['vehicleData.changeableLicensePlate'] === true) ? 'Ja' : 'Nein')
    },
    usage: {
      anyDriver: offerParams['usage.anyDriver'],
      nightlyPound: offerParams['usage.nightlyPound'],
      drivingPerformance: offerParams['usage.drivingPerformance'],
      mileage: offerParams['usage.mileage'],
      differentVehicleOwner: ((offerParams['usage.differentVehicleOwner'] === true) ? 'Ja' : 'Nein'),
      usage: offerParams['usage.usage'],
      ownerOccupiedHome: ((offerParams['usage.ownerOccupiedHome'] === true) ? 'Ja' : 'Nein'),
      homeOwnershipType: offerParams['usage.homeOwnershipType']
    },
    insuranceCover: {
      liabilityDiscount: offerParams['insuranceCover.liabilityDiscount'],
      comprehensiveCoverDiscount: offerParams['insuranceCover.comprehensiveCoverDiscount'],
      wageGroup: offerParams['insuranceCover.wageGroup'],
      basicAgreement: offerParams['insuranceCover.basicAgreement'],
      start: offerParams['insuranceCover.start'],
      paymentMethod: offerParams['insuranceCover.paymentMethod']
    },
    errors: offerCalculation
  }
}

exports.enrichContacts = (contacts) => {
  return contacts.map((contact) => {
    return {
      advisor: contact.sachbearbeiter,
      date: contact.zeit,
      formattedDate: parseDate(contact.zeit, 'YYYY-MM-DD h:mm', 'de').format('LLLL'),
      icon: contactTypes[contact.kontaktart],
      title: contact.titel,
      type: contact.kontaktart
    }
  })
}

const parseDate = (dateString, pattern, locale) => {
  moment.locale('de')
  return moment(dateString, pattern)
}

exports.enrichBranches = (branches, contracts) => {
  return branches.map((branch) => {
    let contractsForBranch = contracts.filter((contract) => contract.sparte === branch.label)
    return Object.assign({}, branch, {
      numberOfContracts: contractsForBranch.length
    })
  })
}

const formatAddress = (address) => `${address.strasse}, ${address.plz} ${address.ort} ${address.stadtteil}`

exports.enrichPartners = (partners) => {
  return partners.map((partner) => {
    return {
      address: formatAddress(partner.anschrift),
      age: calculateAge(partner.geburtsdatum, 'DD.MM.YYYY', 'de'),
      dob: partner.geburtsdatum,
      honorific: partner.anrede,
      firstname: partner.vorname,
      name: partner.name,
      url: `/partners/${partner.partnerId}`
    }
  })
}

const calculateAge = (dateString, pattern, locale) => {
  let dob = parseDate(dateString, pattern, locale) // locale doesnt matter
  return moment().diff(dob, 'years')
}

exports.enrichPartner = (partner) => {
  return {
    address: {
      street: partner.anschrift.strasse,
      city: partner.anschrift.ort,
      postcode: partner.anschrift.plz,
      district: partner.anschrift.stadtteil
    },
    age: partner.alter,
    childrenCount: partner.anzahlKinder,
    dob: partner.geburtsdatum,
    firstName: partner.vorname,
    honorific: partner.anrede,
    job: partner.beruf,
    name: partner.name,
    phone: partner.telnummer,
    nationality: partner.familienstand,
    personalStatus: partner.familienstand,
    _links: {
      self: {href: `/partners/${partner.partnerId}`},
      offers: {href: `/partners/${partner.partnerId}/offers`},
      proposals: {href: `/partners/${partner.partnerId}/proposals`},
      contracts: {href: `/partners/${partner.partnerId}/contracts`}
    }
  }
}
