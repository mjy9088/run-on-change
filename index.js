#!/usr/bin/env node

const fs = require('fs');
const child_process = require('child_process');

var fn2d = new Map();

function listener(eventType, fileName) {
    let command = fn2d.get(fileName);
    if(!command) console.log('An error has occurred.');
    command = fn2d.get(fileName).map(value => typeof value === 'number' ? fileName : String(value));
    let child = child_process.spawn(command.shift(), command, {
        stdio: ['ignore', 'pipe', 'pipe'],
        windowsHide: true
    });
    child.on('error', function(err) {
        console.log('ERROR : Failed to run: ' + err);
    });
    child.stdout.on('data', (data) => console.log(fileName + " : " + data));
    child.stderr.on('data', (data) => console.log(fileName + " : " + data));
}

fs.readFile('run-on-change.json', (err, data) => {
    if (err) throw err;
    let list = JSON.parse(data);
    if(!list instanceof Array) throw 'Invalid run-on-change.json file';
    for(let i = 0; i < list.length; i++) {
        if(!list[i] instanceof Array) throw 'Invalid run-on-change.json file';
        for(let j = 1; j < list[i].length; j++) {
            fn2d.set(list[i][j], list[i][0]);
            try {
                fs.watch(list[i][j], listener);
            } catch (error) {
                console.log('ERROR : Failed to watch file: ' + list[i][j]);
            }
        }
    }
});
