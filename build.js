import fs from 'node:fs'
import https from 'node:https'
import concatStream from 'concat-stream'
import {unified} from 'unified'
import parse from 'rehype-parse'
import {select, selectAll} from 'hast-util-select'
import {toString} from 'hast-util-to-string'

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

https
  .request(overview, (response) => {
    response
      .pipe(
        concatStream((buf) => {
          const tree = unified().use(parse).parse(buf)

          const table = select('#downloadTableEN', tree)
          const headers = selectAll('thead td', table).map((d) =>
            toString(d).trim()
          )
          const rows = selectAll('tbody tr', table)

          const fields = headers.map((d) => {
            if (!(d in headerToField)) {
              throw new Error(
                'Cannot handle unknown column header: `' + d + '`'
              )
            }

            return headerToField[d]
          })

          const records = rows.map((row) => {
            const record = {}
            const cells = selectAll('td', row)
            let index = -1

            while (++index < cells.length) {
              const field = fields[index]
              /** @type {string|boolean} */
              let value = toString(cells[index]).trim()

              if (!field) {
                throw new Error(
                  'Cannot handle superfluous cell: `' +
                    value +
                    '` (' +
                    index +
                    ')'
                )
              }

              if (field === 'ldc' || field === 'lldc' || field === 'sids') {
                value = /^x$/i.test(value)
              }

              record[field] = value
            }

            return record
          })

          const byCode = {}
          let index = -1

          while (++index < records.length) {
            const record = records[index]
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

              if (code in byCode) {
                byCode[code].stack = Object.assign(
                  [],
                  byCode[code].stack,
                  stack
                )
              } else {
                byCode[code] = {
                  type: kind,
                  name,
                  code,
                  iso3166: prefix === 'area' ? record.iso3166 : undefined,
                  stack: stack.concat()
                }
              }

              stack[kind] = code
            }
          }

          const toIso = {}

          const codes = Object.keys(byCode)
            .sort()
            .map((code) => {
              const entry = byCode[code]

              entry.parent = entry.stack.pop()
              entry.stack = undefined

              if (entry.iso3166) {
                toIso[entry.code] = entry.iso3166
              }

              return entry
            })

          fs.writeFileSync(
            'index.js',
            'export const unM49 = ' +
              JSON.stringify(codes, null, 2) +
              '\n\nexport const toIso3166 = ' +
              JSON.stringify(toIso, null, 2) +
              '\n'
          )
        })
      )
      .on('error', console.error)
  })
  .end()
