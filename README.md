# run-on-change
Run something on file change



## Installation

```bash
npm install --save-dev run-on-change
```



## Usage example

Make some file like below (Let's name it `test.bat`)

```shell
@echo off
setlocal
set fn=%1
babel --plugins transform-react-jsx %fn% > %fn:~0,-1%
```

and create file `run-on-change.json`

```json
[
	[[["babel", "--plugins", "transform-react-jsx", 0], "sss.js"], "s.jsx"],
	[[["test.bat", 0]], "script.jsx", {"type": "text", "file": "list.txt"}]
]
```

and just run

```bash
npx run-on-change
```

It will automatically transplie the jsx file **on file changes** (s.jsx and listed in list.txt)

Each array's first element is commands array, and rests are files.

If file is object with `{type: "text"}`, It will watch all files listed in the `file`.

Each elements of commands array are command array or file.

First element of command array is actual command, rests are parameters

To pass file name or etc..., pass number instead of string as parameter

0 to specified file name, 1 to actual file name, 2 to absolute path, ...



## Release History

none

