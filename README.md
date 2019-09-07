# run-on-change
Run something on file change



## Installation

```bash
npm install --save-dev run-on-change
```



## Usage example

Just create file `run-on-change.json ` for project

```json
[
    [
        [["babel", "--plugins", "transform-react-jsx", 1], 0],
        {
            "type": "text",
            "file": "list.txt",
            "filter" : ["%sx", 0]
        }
    ]
]
```

and run

```bash
npx run-on-change
```

It will automatically transpile the jsx file **on file changes** (listed in `list.txt`)

When you want to **run all once** without file changes, use `--init` option.

```bash
git clone (URL)
npm install
npx run-on-change --init
```

it's useful when each script folder's `.gitignore` lists js files



## run-on-change.json

`run-on-change.json` specifies what to run on which file changes.

The `run-on-changing.json` file consists of a single array of array.

Each array's first element is commands array, and rests are files.
If file is object with `{type: "text"}`, It will watch all files listed in the `file`.

Each elements of commands array are command array or file.
First element of command array is actual command, rests are parameters

To pass file name or etc..., pass number instead of string as parameter.
0 to specified file name, 1 to actual file name, 2 to absolute path, ...

String formatting is also supported. pass array instead of string as parameter.
First element is format, rests are arguments. It uses `util.format`.



## Release History

Please don't use `0.1.1` and `0.1.3`

There are no plans to document & support older versions *under `1.0.0`*

