# un-m49

[![Build][build-badge]][build]
[![Coverage][coverage-badge]][coverage]
[![Downloads][downloads-badge]][downloads]
[![Size][size-badge]][size]

Info on [UN M49][m49].

## Contents

*   [What is this?](#what-is-this)
*   [When should I use this?](#when-should-i-use-this)
*   [Install](#install)
*   [Use](#use)
*   [API](#api)
    *   [`unM49`](#unm49)
    *   [`toIso3166`](#toiso3166)
*   [Types](#types)
*   [Compatibility](#compatibility)
*   [Security](#security)
*   [Related](#related)
*   [Contribute](#contribute)
*   [License](#license)

## What is this?

This package contains info on UN M49 (Standard Country or Area Codes for
Statistical Use).
UN M49 is similar to ISO 3166 (the `GB` in `en-GB`).
The difference is that ISO 3166 uses alphabetical codes based on how a region is
called by a group of people, whereas UN M49 uses numerical codes.
Numerical codes are useful because they are resistant to changes and
geopolitical conflicts.
UN M49 also contains regions bigger than countries, such as (sub)continents.
That’s useful for example for `es-419` to describe Spanish as used in Latin
America and the Caribbean.

## When should I use this?

You can use this package any time you have to deal with regions or UN M49 in
particular.

## Install

This package is [ESM only][esm].
In Node.js (version 12.20+, 14.14+, or 16.0+), install with [npm][]:

```sh
npm install un-m49
```

In Deno with [Skypack][]:

```js
import {unM49, toIso3166} from 'https://cdn.skypack.dev/un-m49@2?dts'
```

In browsers with [Skypack][]:

```html
<script type="module">
  import {unM49, toIso3166} from 'https://cdn.skypack.dev/un-m49@2?min'
</script>
```

## Use

```js
import {unM49} from 'un-m49'

console.log(unM49.slice(0, 20))
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

This package exports the following identifiers: `unM49`, `toIso3166`.
There is no default export.

### `unM49`

List of [`Region`][region]s (`Array<Region>`).

#### `Region`

Object with the following properties:

*   `type` (`Type`)
    — [`Type`][type]
    (example: `4`)
*   `name` (`string`)
    — name
    (example: `'United Kingdom of Great Britain and Northern Ireland'`)
*   `code` (`string`)
    — three-character UN M49 code
    (example: `826`)
*   `iso3166` (`string?`)
    — ISO 3166-1 alpha-3 code, if `type` represents a country or area
    (example: `'GBR'`)
*   `parent` (`string?`)
    — code of parent region, if `type` does not represent the planet
    (example: `'154'`)

#### `Type`

`number`, one of the following:

*   `0` — global (example: `001` `World`)
*   `1` — region (example: `002` `Africa`)
*   `2` — subregion (example: `202` `Sub-Saharan Africa`)
*   `3` — intermediate region (example: `017` `Middle Africa`)
*   `4` — country or area (example: `024` `Angola`)

> 👉 **Note**: Regions can be “missing” between a region and its parent.
> For example, the parent of the “country or area” (`4`) `010` `Antarctica` is
> `001` `World` (`4`).
> Intermediate regions (`3`) aren’t used a lot.

### `toIso3166`

Map of UN M49 codes to ISO 3166-1 alpha-3 codes (`Record<string, string>`).

## Types

This package is fully typed with [TypeScript][].
It exports the types `Type` and `UNM49` that model these specific interfaces.

## Compatibility

This package is at least compatible with all maintained versions of Node.js.
As of now, that is Node.js 12.20+, 14.14+, and 16.0+.
It also works in Deno and modern browsers.

## Security

This package is safe.

## Related

*   [`wooorm/bcp-47`](https://github.com/wooorm/bcp-47)
    — parse and stringify BCP 47 language tags
*   [`wooorm/bcp-47-match`](https://github.com/wooorm/bcp-47-match)
    — match BCP 47 language tags with language ranges per RFC 4647
*   [`wooorm/bcp-47-normalize`](https://github.com/wooorm/bcp-47-normalize)
    — normalize, canonicalize, and format BCP 47 tags
*   [`wooorm/iso-3166`](https://github.com/wooorm/iso-3166)
    — ISO 3166 codes
*   [`wooorm/iso-639-2`](https://github.com/wooorm/iso-639-2)
    — ISO 639-2 codes
*   [`wooorm/iso-639-3`](https://github.com/wooorm/iso-639-3)
    — ISO 639-3 codes
*   [`wooorm/iso-15924`](https://github.com/wooorm/iso-15924)
    — ISO 15924 codes

## Contribute

Yes please!
See [How to Contribute to Open Source][contribute].

## License

[MIT][license] © [Titus Wormer][author]

<!-- Definition -->

[build-badge]: https://github.com/wooorm/un-m49/workflows/main/badge.svg

[build]: https://github.com/wooorm/un-m49/actions

[coverage-badge]: https://img.shields.io/codecov/c/github/wooorm/un-m49.svg

[coverage]: https://codecov.io/github/wooorm/un-m49

[downloads-badge]: https://img.shields.io/npm/dm/un-m49.svg

[downloads]: https://www.npmjs.com/package/un-m49

[size-badge]: https://img.shields.io/bundlephobia/minzip/un-m49.svg

[size]: https://bundlephobia.com/result?p=un-m49

[npm]: https://docs.npmjs.com/cli/install

[skypack]: https://www.skypack.dev

[license]: license

[author]: https://wooorm.com

[esm]: https://gist.github.com/sindresorhus/a39789f98801d908bbc7ff3ecc99d99c

[typescript]: https://www.typescriptlang.org

[contribute]: https://opensource.guide/how-to-contribute/

[m49]: https://unstats.un.org/unsd/methodology/m49/

[region]: #region

[type]: #type
