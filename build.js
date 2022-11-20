/**
 * @typedef {0|1|2|3|4} Type
 *   *   `0` — Global (example: `001` `World`)
 *   *   `1` — Region (example: `002` `Africa`)
 *   *   `2` — Subregion (example: `202` `Sub-Saharan Africa`)
 *   *   `3` — Intermediate region (example: `017` `Middle Africa`)
 *   *   `4` — Country or area (example: `024` `Angola`)
 *
 * @typedef UNM49
 *   Region.
 * @property {Type} type
 *   Type of region (example: `4`).
 * @property {string} name
 *   Name of region (example: `'United Kingdom of Great Britain and Northern Ireland'`).
 * @property {string} code
 *   Three-character UN M49 code (example: `826`).
 * @property {string|undefined} [iso3166]
 *   ISO 3166-1 alpha-3 code, if `type` represents a country or area (example: `'GBR'`).
 * @property {string|undefined} [parent]
 *   Code of parent region, if `type` does not represent the planet (example: `'154'`).
 */

import assert from 'node:assert/strict'
import fs from 'node:fs/promises'
import fetch from 'node-fetch'
import {fromHtml} from 'hast-util-from-html'
import {select, selectAll} from 'hast-util-select'
import {toString} from 'hast-util-to-string'

/** @type {Record<string, string>} */
const headerToField = {
  'Global Code': 'global',
  'Global Name': 'globalName',
  'Region Code': 'region',
  'Region Name': 'regionName',
  'Sub-region Code': 'subregion',
  'Sub-region Name': 'subregionName',
  'Intermediate Region Code': 'intermediate',
  'Intermediate Region Name': 'intermediateName',
  'Country or Area': 'areaName',
  'M49 Code': 'area',
  'ISO-alpha2 Code': 'iso3166Alpha2',
  'ISO-alpha3 Code': 'iso3166',
  'Least Developed Countries (LDC)': 'ldc',
  'Land Locked Developing Countries (LLDC)': 'lldc',
  'Small Island Developing States (SIDS)': 'sids',
  'Developed / Developing Countries': 'status'
}

// From big to small:
const types = ['global', 'region', 'subregion', 'intermediate', 'area']
const overview = 'https://unstats.un.org/unsd/methodology/m49/overview/'

const response = await fetch(overview)
const text = await response.text()
const tree = await fromHtml(text)

const table = select('#downloadTableEN', tree)
assert(table, 'expected table to exist')
const headers = selectAll('thead td', table).map((d) => toString(d).trim())
const rows = selectAll('tbody tr', table)

const fields = headers.map((d) => {
  assert(d in headerToField, 'expected known column, not `' + d + '`')
  return headerToField[d]
})

const records = rows.map((row) => {
  /** @type {Record<string, string|boolean>} */
  const record = {}
  const cells = selectAll('td', row)
  let index = -1

  while (++index < cells.length) {
    const field = fields[index]
    /** @type {string|boolean} */
    let value = toString(cells[index]).trim()
    assert(field, 'expected known cell, not `' + value + '`')

    if (field === 'ldc' || field === 'lldc' || field === 'sids') {
      value = /^x$/i.test(value)
    }

    record[field] = value
  }

  return record
})

/** @type {Record<string, UNM49 & {stack: Array<string>}>} */
const byCode = {}
let index = -1

while (++index < records.length) {
  const record = records[index]
  /** @type {Array<string>} */
  const stack = []
  let kind = -1

  while (++kind < types.length) {
    const prefix = types[kind]
    const code = record[prefix]
    const name = record[prefix + 'Name']

    // Sometimes, intermediate sizes aren’t available (e.g., for Antarctica).
    if (!code || !name) {
      continue
    }

    assert(typeof code === 'string', 'expected `' + code + '` to be a string')
    assert(typeof name === 'string', 'expected `' + name + '` to be a string')

    if (code in byCode) {
      byCode[code].stack = Object.assign([], byCode[code].stack, stack)
    } else {
      byCode[code] = {
        // @ts-expect-error: `kind` is a correct type.
        type: kind,
        name,
        code,
        iso3166:
          prefix === 'area' && typeof record.iso3166 === 'string'
            ? record.iso3166
            : undefined,
        stack: stack.concat()
      }
    }

    stack[kind] = code
  }
}

/** @type {Record<string, string>} */
const toIso = {}

/** @type {Array<UNM49>} */
const codes = Object.keys(byCode)
  .sort()
  .map((code) => {
    const {stack, ...entry} = byCode[code]
    const clean = {...entry, parent: stack.pop()}

    if (clean.iso3166) {
      toIso[clean.code] = clean.iso3166
    }

    return clean
  })

await fs.writeFile(
  'index.js',
  [
    '/**',
    ' * @typedef {0|1|2|3|4} Type',
    ' *   *   `0` — Global (example: `001` `World`)',
    ' *   *   `1` — Region (example: `002` `Africa`)',
    ' *   *   `2` — Subregion (example: `202` `Sub-Saharan Africa`)',
    ' *   *   `3` — Intermediate region (example: `017` `Middle Africa`)',
    ' *   *   `4` — Country or area (example: `024` `Angola`)',
    ' *',
    ' * @typedef UNM49',
    ' *   Region.',
    ' * @property {Type} type',
    ' *   Type of region (example: `4`).',
    ' * @property {string} name',
    " *   Name of region (example: `'United Kingdom of Great Britain and Northern Ireland'`).",
    ' * @property {string} code',
    ' *   Three-character UN M49 code (example: `826`).',
    ' * @property {string|undefined} [iso3166]',
    " *   ISO 3166-1 alpha-3 code, if `type` represents a country or area (example: `'GBR'`).",
    ' * @property {string|undefined} [parent]',
    " *   Code of parent region, if `type` does not represent the planet (example: `'154'`).",
    ' */',
    '',
    '/**',
    ' * List of `Region`s.',
    ' *',
    ' * @type {Array<UNM49>}',
    ' */',
    'export const unM49 = ' + JSON.stringify(codes, null, 2),
    '',
    '/**',
    ' * Map of UN M49 codes to ISO 3166-1 alpha-3 codes.',
    ' *',
    ' * @type {Record<string, string>}',
    ' */',
    'export const toIso3166 = ' + JSON.stringify(toIso, null, 2),
    ''
  ].join('\n')
)
