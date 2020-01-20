# `un-m49`

[![Build][build-badge]][build]
[![Downloads][downloads-badge]][downloads]
[![Size][size-badge]][size]

[UN M49][m49] codes in an accessible format.

Also includes a pre-built index to map to ISO 3166 codes:

*   [`un-m49/to-iso-3166`][to-iso-3166]
    — Map UN M49 codes to ISO 3166-1 alpha-3 codes

## Install

[npm][]:

```sh
npm install un-m49
```

## Use

```js
var m49 = require('un-m49')

console.log(m49.slice(0, 20))
```

Yields:

```js
[
  {type: 0, name: 'World', code: '001'},
  {type: 1, name: 'Africa', code: '002', parent: '001'},
  {type: 4, name: 'Afghanistan', code: '004', iso3166: 'AFG', parent: '034'},
  {type: 3, name: 'South America', code: '005', parent: '419'},
  {type: 4, name: 'Albania', code: '008', iso3166: 'ALB', parent: '039'},
  {type: 1, name: 'Oceania', code: '009', parent: '001'},
  {type: 4, name: 'Antarctica', code: '010', iso3166: 'ATA', parent: '001'},
  {type: 3, name: 'Western Africa', code: '011', parent: '202'},
  {type: 4, name: 'Algeria', code: '012', iso3166: 'DZA', parent: '015'},
  {type: 3, name: 'Central America', code: '013', parent: '419'},
  {type: 3, name: 'Eastern Africa', code: '014', parent: '202'},
  {type: 2, name: 'Northern Africa', code: '015', parent: '002'},
  {type: 4, name: 'American Samoa', code: '016', iso3166: 'ASM', parent: '061'},
  {type: 3, name: 'Middle Africa', code: '017', parent: '202'},
  {type: 3, name: 'Southern Africa', code: '018', parent: '202'},
  {type: 1, name: 'Americas', code: '019', parent: '001'},
  {type: 4, name: 'Andorra', code: '020', iso3166: 'AND', parent: '039'},
  {type: 2, name: 'Northern America', code: '021', parent: '019'},
  {type: 4, name: 'Angola', code: '024', iso3166: 'AGO', parent: '017'},
  {type: 4, name: 'Antigua and Barbuda', code: '028', iso3166: 'ATG', parent: '029'}
]
```

## API

### `m49`

`Array.<Region>` — List of [`Region`][region]s.

### `Region`

Object with the following properties:

*   `type` (`Type`) — [`Type`][type]
    (example: `4`)
*   `name` (`string`) — Name
    (example: `'United Kingdom of Great Britain and Northern Ireland'`)
*   `code` (`string`) — Three-character UN M49 code
    (example: `826`)
*   `iso3166` (`string?`) — ISO 3166-1 alpha-3 code, if `type` represents a
    country or area
    (example: `'GBR'`)
*   `parent` (`string?`) — Code of parent region, if `type` does not represent
    the planet
    (example: `'154'`)

### `Type`

`number`, one of the following:

*   `0` — Global (example: `001` `World`)
*   `1` — Region (example: `002` `Africa`)
*   `2` — Subregion (example: `202` `Sub-Saharan Africa`)
*   `3` — Intermediate region (example: `017` `Middle Africa`)
*   `4` — Country or area (example: `024` `Angola`)

Note that there may be regions “missing” in the stack.
For example, the parent of the “country or area” `010` `Antarctica` is `001`
`World`.
Intermediate regions aren’t used a lot.

## Related

*   [`bcp-47`](https://github.com/wooorm/bcp-47)
    — Parse and stringify BCP 47 language tags
*   [`bcp-47-match`](https://github.com/wooorm/bcp-47-match)
    — Match BCP 47 language tags with language ranges per RFC 4647
*   [`iso-639-2`](https://github.com/wooorm/iso-639-2)
    — ISO 639-2 codes
*   [`iso-639-3`](https://github.com/wooorm/iso-639-3)
    — ISO 639-3 codes
*   [`iso-15924`](https://github.com/wooorm/iso-15924)
    — ISO 15924 codes

## License

[MIT][license] © [Titus Wormer][author]

<!-- Definition -->

[build-badge]: https://img.shields.io/travis/wooorm/un-m49.svg

[build]: https://travis-ci.org/wooorm/un-m49

[downloads-badge]: https://img.shields.io/npm/dm/un-m49.svg

[downloads]: https://www.npmjs.com/package/un-m49

[size-badge]: https://img.shields.io/bundlephobia/minzip/un-m49.svg

[size]: https://bundlephobia.com/result?p=un-m49

[npm]: https://docs.npmjs.com/cli/install

[license]: license

[author]: https://wooorm.com

[m49]: https://unstats.un.org/unsd/methodology/m49/

[region]: #region

[type]: #type

[to-iso-3166]: to-iso-3166.json
