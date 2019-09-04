#!/usr/bin/env node

const fs = require('fs');
const child_process = require('child_process');

function getListener(fileName, comm) {
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

fs.readFile('run-on-change.json', (err, data) => {
    if (err) throw err;
    let list = JSON.parse(data);
    if(!list instanceof Array) throw 'Invalid run-on-change.json file';
    list.forEach(li => {
        if(!li instanceof Array) throw 'Invalid run-on-change.json file';
        let t = li.shift();
        li.forEach(l => {
            try {
                fs.watch(l, getListener(l, t));
            } catch (error) {
                console.log('ERROR : Failed to watch file: ' + l);
            }
        });
    });
});
