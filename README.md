# balldontlie-client

[![Build Status]](https://dev.azure.com/josephharrisonlim/josephharrisonlim/_build/latest?definitionId=2&branchName=master)
[![NPM Badge]](https://www.npmjs.com/package/@jharrilim/balldontlie-client)

Javascript client for https://github.com/ynnadkrap/balldontlie

![Rasheed Wallace - Ball Dont Lie](https://media.giphy.com/media/Jm2hosNfVeNjy/giphy.gif)

[Build Status]: https://dev.azure.com/josephharrisonlim/josephharrisonlim/_apis/build/status/jharrilim.balldontlie-client?branchName=master

[NPM Badge]: https://img.shields.io/npm/v/@jharrilim/balldontlie-client.svg

## API Implementation Status

| API | Status |
| --: | :-- |
| [Players](https://www.balldontlie.io/#players) | ✅ |
| [Teams](https://www.balldontlie.io/#teams) | ✅ |
| [Games](https://www.balldontlie.io/#games) | ❌ |
| [Stats](https://www.balldontlie.io/#stats) | ❌ |
| [Season Averages](https://www.balldontlie.io/#season-averages) | ❌ |

## Install

```sh
npm i @jharrilim/balldontlie-client
```

## Usage

```js
import { BallDontLie } from '@jharrilim/balldontlie-client';

void async function main() {
    const v1Client = BallDontLie.v1();
    for await(let team of v1Client.teams()) {
        console.log(team.full_name);
    }

}().catch(console.error);
```
