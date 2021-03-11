'use strict'

var fs = require('fs')
var https = require('https')
var concat = require('concat-stream')
var unified = require('unified')
var parse = require('rehype-parse')
var $ = require('hast-util-select')
var toString = require('hast-util-to-string')

var headerToField = {
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

var booleanFields = ['ldc', 'lldc', 'sids']

// From big to small:
var types = ['global', 'region', 'subregion', 'intermediate', 'area']

https
  .request('https://unstats.un.org/unsd/methodology/m49/overview/', onrequest)
  .end()

function onrequest(response) {
  response.pipe(concat(onconcat)).on('error', console.error)
}

function onconcat(buf) {
  var tree = unified().use(parse).parse(buf)

  var table = $.select('#downloadTableEN', tree)
  var headers = $.selectAll('thead td', table).map((d) => toString(d).trim())
  var rows = $.selectAll('tbody tr', table)

  var fields = headers.map((d) => {
    if (!(d in headerToField)) {
      throw new Error('Cannot handle unknown column header: `' + d + '`')
    }

    return headerToField[d]
  })

  var records = rows.map((row) => {
    var record = {}
    var cells = $.selectAll('td', row)
    var index = -1
    var field
    var value

    while (++index < cells.length) {
      field = fields[index]
      value = toString(cells[index]).trim()

      if (!field) {
        throw new Error('Cannot handle superfluous cell: ', cells[index], index)
      }

      if (booleanFields.includes(field)) {
        value = /^x$/i.test(value)
      }

      record[field] = value
    }

    return record
  })

  var byCode = {}
  var index = -1
  var stack
  var record
  var kind
  var prefix
  var code
  var name

  while (++index < records.length) {
    record = records[index]
    stack = []
    kind = -1

    while (++kind < types.length) {
      prefix = types[kind]
      code = record[prefix]
      name = record[prefix + 'Name']

      // Sometimes, intermediate sizes aren’t available (e.g., for Antarctica).
      if (!code || !name) {
        continue
      }

      if (code in byCode) {
        byCode[code].stack = Object.assign([], byCode[code].stack, stack)
      } else {
        byCode[code] = {
          type: kind,
          name: name,
          code: code,
          iso3166: prefix === 'area' ? record.iso3166 : undefined,
          stack: stack.concat()
        }
      }

      stack[kind] = code
    }
  }

  var toIso = {}

  var codes = Object.keys(byCode)
    .sort()
    .map((code) => {
      var entry = byCode[code]

      entry.parent = entry.stack.pop()
      entry.stack = undefined

      if (entry.iso3166) {
        toIso[entry.code] = entry.iso3166
      }

      return entry
    })

  fs.writeFileSync('index.json', JSON.stringify(codes, null, 2) + '\n')
  fs.writeFileSync('to-iso-3166.json', JSON.stringify(toIso, null, 2) + '\n')
}
