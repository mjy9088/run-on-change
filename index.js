#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const util = require('util');
const child_process = require('child_process');

const argv = require('minimist')(process.argv.slice(2));

function etc2string(id, args) {
    switch(id) {
        case 0:
            if(args.original) return args.original;
        case 1:
            return args.fileName;
        case 2:
            return args.absolutePath;
    }
}

function arr2string(arr, args) {
    return util.format.apply(null, [arr[0]].concat(arr.filter((el, idx) => idx != 0).map(v => etc2string(v, args))));
}

function getListener(comm, args) {
    const ret = () => {
        console.log("running!");
        if(!(comm instanceof Array))
        {
            console.log('ERROR : command must be an array');
            return;
        }
        var prev;
        for(let i = 0; i < comm.length; i++) {
            let command = comm[i];
            if(!Array.isArray(command)) {
                if(i == 0) {
                    let fileName = typeof command === 'number' ? etc2string(command, args) : command;
                    prev = fs.createReadStream(args.cwd ? path.join(args.cwd, fileName) : fileName);
                }
                else {
                    if(comm[i + 1]) {
                        console.log('ERROR : file is allowed at first or last only');
                    }
                    prev.pipe(fs.createWriteStream(typeof command === 'number' ? etc2string(command, args) : command));
                    return;
                }
            }
            else {
                command = command.map(value => {
                    if(value instanceof Array) {
                        return arr2string(value);
                    }
                    else if(typeof value === 'number') {
                        return etc2string(value, args);
                    }
                    else {
                        return String(value);
                    }
                });
                let child = child_process.spawn(command.shift(), command, {
                    stdio: [prev ? 'pipe' : 'ignore', 'pipe', 'pipe'],
                    shell: true,
                    cwd: args.cwd,
                    windowsHide: true
                });
                child.on('error', function(err) {
                    console.log('ERROR : Failed to run: ' + err);
                });
                if(prev) {
                    prev.pipe(child.stdin);
                }
                prev = child.stdout;
                child.stderr.on('data', (data) => console.log(`${args.fileName}[${i}] : ` + data));
            }
        }
        if(prev) {
            prev.on('data', (data) => console.log(args.fileName + " : " + data));
        }
    };
    if(argv.init) {
        ret.call();
    }
    return ret;
}

function processEntry(file, command, args) {
    if(typeof file === 'string') {
        processFile(file, command, args);
    }
    else {
        switch(file.type) {
            case 'text':
                    file.cwd = args.cwd;
                    processText(file, command);
                break;
            case 'include':
                processInclude(file.file);
                break;
            default:
                console.log('ERROR : Unknown type: ' + file.type);
                break;
        }
    }
}

function processFile(file, command, args) {
    let attrs = {
        fileName: file,
        absolutePath: path.resolve(file),
        cwd: args.cwd
    };
    if(args) {
        attrs.original = args.original;
    }
    try {
        fs.watch(file, getListener(command, attrs));
    } catch (error) {
        console.log('ERROR : Failed to watch file: ' + file);
    }
}

function processText(args, command) {
    args.file = args.cwd ? path.join(args.cwd, args.file) : args.file;
    fs.readFile(args.file, (err, data) => {
        if (err) throw err;
        data.toString().split('\n').map(line => line.trim()).filter(line => !!line).forEach(line => {
            let fileName = args.filter ? arr2string(args.filter, {fileName: line, absolutePath: path.resolve(line)}) : line;
            return processFile(args.cwd ? path.join(args.cwd, fileName) : fileName, command, {original: line});
        });
    })
}

function processInclude(file) {
    fs.readFile(file, (err, data) => {
        if (err) throw err;
        let list = JSON.parse(data);
        if(!(list instanceof Array)) throw 'Invalid run-on-change.json file';
        list.forEach(li => {
            if(!(li instanceof Array)) throw 'Invalid run-on-change.json file';
            let t = li.shift();
            li.forEach(l => processEntry(l, t, {cwd: path.dirname(path.resolve(file))}));
        });
    });
}

processInclude('run-on-change.json');
