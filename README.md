# run-on-change
Run something on file change



## Installation

```bash
npm install run-on-change
```



## Usage example

Create file `run-on-change.json`

```json
[
	[["cmd", "/c", "echo test"], "1.txt", "2.txt", "3.txt", "4.txt"],
	[["cmd", "/c", "echo File ", 0 , " has changed"], "test.txt"]
]
```

and just run

```bash
npx run-on-change
```

It will run `cmd /c echo hello world! test.txt` on `test.txt` changes

Each array's first element is commands array, and rests are file's path



## Release History

none

