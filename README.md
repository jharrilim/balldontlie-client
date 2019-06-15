# balldontlie-client

[![Build Status]](https://dev.azure.com/josephharrisonlim/josephharrisonlim/_build/latest?definitionId=2&branchName=master)
[![NPM Badge]](https://www.npmjs.com/package/@jharrilim/balldontlie-client)

Javascript client for [Balldontlie](https://github.com/ynnadkrap/balldontlie). 

API Docs for this client can be found [here](https://jharrilim.github.io/balldontlie-client/classes/_api_v1_index_.v1client.html).

![Rasheed Wallace - Ball Dont Lie](https://media.giphy.com/media/Jm2hosNfVeNjy/giphy.gif)

[Build Status]: https://dev.azure.com/josephharrisonlim/josephharrisonlim/_apis/build/status/jharrilim.balldontlie-client?branchName=master

[NPM Badge]: https://img.shields.io/npm/v/@jharrilim/balldontlie-client.svg

## API Implementation Status

|                                                            API | Status |
| -------------------------------------------------------------: | :----- |
|                 [Players](https://www.balldontlie.io/#players) | ✅      |
|                     [Teams](https://www.balldontlie.io/#teams) | ✅      |
|                     [Games](https://www.balldontlie.io/#games) | ✅      |
|                     [Stats](https://www.balldontlie.io/#stats) | ✅      |
| [Season Averages](https://www.balldontlie.io/#season-averages) | ✅      |

## Install

```sh
npm i @jharrilim/balldontlie-client
```

## Usage

This library uses async generators for handling pagination. You may use this in conjunction with
[for-await-of](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/for-await...of)
to make multiple API requests. You may also request for one page at a time by awaiting `.next()`.

Axios is used interally, and axios configuration options may be passed into `.v1()` if needed.

> Warning: This API is rate limited. You may only make up to [60 requests per minute](http://www.balldontlie.io/#getting-started).

### Example with for-await-of

```js
import { BallDontLie } from '@jharrilim/balldontlie-client';

void async function main() {
    const v1Client = BallDontLie.v1();
    for await(const teams of v1Client.teams(0)) {
        // paginate through all the teams
        for(const team of teams) {
            console.log(team.full_name);
        }
    }
}().catch(console.error);
```

### Example with .next()

```js
import { BallDontLie } from '@jharrilim/balldontlie-client';

void async function main() {
    const v1Client = BallDontLie.v1();
    const teamGenerator = v1Client.teams(0, 10); // starting from 0, 10 per page
    
    const teams1 = (await teamGenerator.next()).value; // get the first 10 teams
    teams1.forEach(team => console.log(team.full_name));

    const teams2 = (await teamGenerator.next()).value; // get the next 10 teams after the first 10
    teams2.forEach(team => console.log(team.full_name));

}().catch(console.error);
```

More examples can be found in the [tests](./test/integration/api.test.ts).
