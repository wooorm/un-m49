'use strict'

var test = require('tape')
var m49 = require('.')

test('m49', function (t) {
  var index = -1

  t.plan(2)

  t.ok(Array.isArray(m49), 'should be an `array`')

  while (++index < m49.length) {
    if (m49[index].code !== '826') {
      continue
    }

    t.deepEqual(
      m49[index],
      {
        type: 4,
        name: 'United Kingdom of Great Britain and Northern Ireland',
        code: '826',
        iso3166: 'GBR',
        parent: '154'
      },
      'should work'
    )
  }
})
