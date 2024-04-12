const fs = require('fs');
const path = require('path');
const archiver = require('archiver');

const archiveAndSend = (res) => {
    const folderPath = 'downloads'; // Relative path to your folder
    const zipFileName = `archive-${Date.now()}.zip`;
    const zipFilePath = path.join(__dirname, zipFileName);

    // Create a ZIP archive
    const archive = archiver('zip', {
        zlib: { level: 9 } // Set compression level
    });

    // Pipe the ZIP archive to a writable stream
    const output = fs.createWriteStream(zipFilePath);
    output.on('close', () => {
        console.log(`${archive.pointer()} total bytes`);
        console.log('archiver has been finalized and the output file descriptor has closed.');
        // Set response headers to indicate that the response is a downloadable file
        res.setHeader('Content-Disposition', `attachment; filename=${zipFileName}`);
        res.setHeader('Content-Type', 'application/zip');

        // Stream the ZIP file to the client
        fs.createReadStream(zipFilePath).pipe(res);
    });
    archive.pipe(output);

    // Add the contents of the folder to the ZIP archive
    archive.directory(folderPath, false);

    // Finalize the ZIP archive
    archive.finalize();
};

module.exports = archiveAndSend;