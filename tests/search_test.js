const test = require('tape')
const helper = require('./test_helper')

helper.setup((browser) => {
  test('Search for customer Peter Meyer', (t) => {
    t.plan(1)

    browser.visit('/').then(() => {
      browser.assert.success()
      return browser.fill('Suche', 'Meyer')
        .pressButton('Suchen')
    }).then(() => {
      browser.assert.success()
      browser.assert.url({
        pathname: '/result',
        query: { query: 'Meyer' }
      })
      browser.assert.text('h1', "Suchergebnisse für 'Meyer'")
      let link = browser.queryAll('.onebox-results a').find((el) => {
        return browser.text('h3', el) === 'Herr Peter Meyer'
      })
      return browser.click(link)
    }).then(() => {
      browser.assert.success()
      browser.assert.url({ pathname: '/partners/4711' })
      browser.assert.text('.p-name', 'Herr Peter Meyer')
      t.pass('Found correct partner page')
    })
  })
})

test.onFinish(helper.teardown)
