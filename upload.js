'use strict';

const program = require('commander');

let YandexDisk = require('yandex-disk').YandexDisk;

program
    .option('-s, --size <size>', 'Chunk size')
    .option('-f, --file <path>', 'Source file')
    .option('-d, --destination <path>', 'Yandex.Disk destination path')
    .option('-u, --username <user>', 'Yandex.Disk user name')
    .option('-p, --password <password>', 'Yandex.Disk password')
    .parse(process.argv);



try {

    let errors = [];
    
    let fileName = program.file;
    if (!fileName) errors.push( new Error('<file> required') );
    
    let dstPath = program.destination;
    if (!dstPath) errors.push( new Error('<destination> required') );
    
    let chunkSize = Number(program.size);
    if (!chunkSize) errors.push( new Error('<size> required') );
    
    let user = program.username;
    if (!user) errors.push( new Error('<username> required') );
    
    let password = program.password;
    if (!password) errors.push( new Error('<password> required') );

    if ( errors.length > 0 ) throw errors;
    let disk = new YandexDisk(user, password);
    
    disk.mkdir( dstPath, function(err) {
	if (err) {
	    console.log(err);
	}
	else {
            (function next() {
                disk.uploadSplitFile(fileName, dstPath, chunkSize, function(err, res) {
                    if (err) {
                        console.log(err);
                        setTimeout(next, 10000);
                    };
                });
            })();
	};
    });
}
catch (errors) {
    errors.forEach(function(error, i, arr) {
	console.log("" + error);
    });
    program.outputHelp();
};
