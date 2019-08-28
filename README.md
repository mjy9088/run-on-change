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
babel --plugins transform-react-jsx %1.jsx > %1.js
```

and create file `run-on-change.json`

```json
[
	[["test.bat", "1"], "1.jsx"]
]
```

and just run

```bash
npx run-on-change
```

It will automatically transplie the jsx file **on file changes**

Each array's first element is commands array, and rests are file's path.



## Release History

none

