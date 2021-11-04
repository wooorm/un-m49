import test from 'tape'
import {unM49} from './index.js'

test('m49', function (t) {
  let index = -1

  t.plan(2)

  t.ok(Array.isArray(unM49), 'should be an `array`')

  while (++index < unM49.length) {
    if (unM49[index].code !== '826') {
      continue
    }

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
})
