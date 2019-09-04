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
babel --plugins transform-react-jsx %fn% > ../%fn:~0,-1%
```

and create file `run-on-change.json`

```json
[
	[["test.bat", "test.jsx"], "test.jsx"],
	[["test.bat", 0], "base.jsx", "ui.jsx", "script.jsx"]
]
```

and just run

```bash
npx run-on-change
```

It will automatically transplie the jsx file **on file changes**

Each array's first element is command array, and rests are files' path.

First element of command array is actual command, rests are parameters

To pass file's name as argument, pass number 0 as parameter



## Release History

none

