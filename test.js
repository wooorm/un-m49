import test from 'tape'
import {unM49} from './index.js'

test('m49', function (t) {
  t.plan(3)

  t.ok(Array.isArray(unM49), 'should be an `array`')

  let index = -1
  let found = false

  while (++index < unM49.length) {
    if (unM49[index].code !== '826') {
      continue
    }

    found = true
    t.deepEqual(
      unM49[index],
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

  t.equal(found, true, 'expected `826` in array')
})
