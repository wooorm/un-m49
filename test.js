import assert from 'node:assert/strict'
import test from 'node:test'
import {unM49} from './index.js'

test('m49', function () {
  assert.ok(Array.isArray(unM49), 'should be an `array`')

  const gbr = unM49.find((d) => d.code === '826')
  assert(gbr)
  assert.deepEqual(
    gbr,
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
