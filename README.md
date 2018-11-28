# Write to File

[![Build Status](https://flat.badgen.net/travis/risan/write-to-file)](https://travis-ci.org/risan/write-to-file)
[![Test Coverage](https://flat.badgen.net/codeclimate/coverage/risan/write-to-file)](https://codeclimate.com/github/risan/write-to-file)
[![Maintainability](https://flat.badgen.net/codeclimate/maintainability/risan/write-to-file)](https://codeclimate.com/github/risan/write-to-file)
[![Latest Stable Version](https://flat.badgen.net/npm/v/write-to-file)](https://www.npmjs.com/package/write-to-file)
[![Node Version](https://flat.badgen.net/npm/node/write-to-file)](https://www.npmjs.com/package/write-to-file)
[![Code Style: Prettier](https://flat.badgen.net/badge/code%20style/prettier/ff69b4)](https://github.com/prettier/prettier)
[![License](https://flat.badgen.net/npm/license/write-to-file)](https://github.com/risan/send-request/blob/master/LICENSE)

Writes data to file and automatically create its directories if not exists.

## Install

```bash
$ npm install write-to-file

# Or if you use Yarn
$ yarn add write-to-file
```

## Quick Start

```js
const writeToFile = require("write-to-file");

(async () => {
  try {
    await writeToFile("foo/bar/baz.txt", "Hello World!");
  } catch(error) {
    console.error(error.message);
  }
})();
```

If `foo/bar` directory does not exist, it will be created automatically.

## Recipe

### Set the Character Encoding

You can pass the character encoding as the third argument. Default to `utf8`.

```js
const writeToFile = require("write-to-file");

(async () => {
  const buff = Buffer.from("Hello World!");

  try {
    await writeToFile("foo.txt", buff.toString("hex"), "hex");
  } catch(error) {
    console.error(error.message);
  }
})();
```

You can also pass an object:

```js
writeToFile("foo.txt", buff.toString("hex"), {
  encoding: "hex"
});
```

### Appending Data to a File

By default, if the file already exists, it will be overwritten. For appending data to a file, you may pass the `flag` option:

```js
const writeToFile = require("write-to-file");

(async () => {
  try {
    await writeToFile("foo.txt", "bar", {
      flag: "a"
    });
  } catch(error) {
    console.error(error.message);
  }
})();
```

## API

```js
writeToFile(file, data, [options])
```

### Parameters

* `file` (`String`): The file path to write to.
* `data` (`String`|`Buffer`): Data to write.
* `options` (Optional `Object`|`String`): You may pass the encoding as the third argument. You may also pass an object:
    * `encoding` (`String`): The character encoding to use, default to `utf8`.
    * `mode` (`Number`): The file permission to set, default to `0o666`.
    * `flag` (`String`): The [file system](https://nodejs.org/dist/latest-v11.x/docs/api/fs.html#fs_file_system_flags) flag, default to `w`.
    * `createDirMode` (`Number`): The directory permission to set when creating the parent directory that does not exist, default to `0o777`.

### Returns

It returns a `Promise` which when resolved contains a `true` value.

## Related

* [create-dir](https://github.com/risan/create-dir): Module to create directory recursively.

## License

MIT © [Risan Bagja Pradana](https://bagja.net)
