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
	[["cmd", "/c", "echo Hello World!"], "test.txt"],
	[["cmd", "/c", "echo Hello"], "hello.txt", "world.txt"]
]
```



and just run

```bash
npx run-on-change
```



## Release History

none

