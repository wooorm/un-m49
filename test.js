'use strict'

var test = require('tape')
var m49 = require('.')

test('m49', function(t) {
  t.plan(2)

  t.ok(Array.isArray(m49), 'should be an `array`')

  m49.forEach(function(d) {
    if (d.code !== '826') {
      return
    }

    t.deepEqual(
      d,
      {
        type: 4,
        name: 'United Kingdom of Great Britain and Northern Ireland',
        code: '826',
        iso3166: 'GBR',
        parent: '154'
      },
      'should work'
    )
  })
})
