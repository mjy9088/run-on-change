#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const child_process = require('child_process');

function getListener(comm, args) {
    return () => {
        if(!comm instanceof Array)
        {
            console.log('ERROR : command must be an array');
            return;
        }
        var prev;
        for(let i = 0; i < comm.length; i++) {
            let command = comm[i];
            if(typeof command === 'string') {
                if(i == 0) {
                    prev = fs.createReadStream(command);
                }
                else {
                    if(comm[i + 1]) {
                        console.log('ERROR : file is allowed at first or last only');
                    }
                    prev.pipe(fs.createWriteStream(command));
                    return;
                }
            }
            else {
                command = command.map(value => {
                    if(typeof value === 'number')
                        switch(value) {
                            case 0:
                            case 1:
                                return args.fileName;
                            case 2:
                                return args.absolutePath;
                            }
                    return String(value);
                });
                let child = child_process.spawn(command.shift(), command, {
                    stdio: [prev ? 'pipe' : 'ignore', 'pipe', 'pipe'],
                    shell: true,
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
}

function processEntry(file, command) {
    if(typeof file === 'string') {
        processFile(file, command);
    }
    else {
        switch(file.type) {
            case 'text':
                processText(file.file, command);
                break;
            default:
                console.log('ERROR : Unknown type: ' + file.type);
                break;
        }
    }
}

function processFile(file, command) {
    try {
        fs.watch(file, getListener(command, {fileName: file, absolutePath: path.resolve(file)}));
    } catch (error) {
        console.log('ERROR : Failed to watch file: ' + file);
    }
}

function processText(file, command) {
    fs.readFile(file, (err, data) => {
        if (err) throw err;
        data.toString().split('\n').map(line => line.trim()).filter(line => !!line).forEach(line => processFile(line, command));
    })
}

function processInclude(file) {
    fs.readFile(file, (err, data) => {
        if (err) throw err;
        let list = JSON.parse(data);
        if(!list instanceof Array) throw 'Invalid run-on-change.json file';
        list.forEach(li => {
            if(!li instanceof Array) throw 'Invalid run-on-change.json file';
            let t = li.shift();
            li.forEach(l => processEntry(l, t));
        });
    });
}

processInclude('run-on-change.json');
