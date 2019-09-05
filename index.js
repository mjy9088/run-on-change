#!/usr/bin/env node

const fs = require('fs');
const child_process = require('child_process');

function getListener(comm, fileName) {
    return () => {
        let command = comm.map(value => {
            if(typeof value === 'number')
                switch(value) {
                    case 0:
                        return fileName;
                }
            return String(value);
        });
        let child = child_process.spawn(command.shift(), command, {
            stdio: ['ignore', 'pipe', 'pipe'],
            shell: true,
            windowsHide: true
        });
        child.on('error', function(err) {
            console.log('ERROR : Failed to run: ' + err);
        });
        child.stdout.on('data', (data) => console.log(fileName + " : " + data));
        child.stderr.on('data', (data) => console.log(fileName + " : " + data));
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
        fs.watch(file, getListener(command, file));
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
