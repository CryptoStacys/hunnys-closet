
import Jimp from 'jimp';
import * as fs from 'fs';
import * as path from 'path';

// Path to the images folder
const inputFolder = 'scriptImages';
const outputFolder = 'compositeImages';

// Layer colors based on your provided mapping
const layerColors = [
    "#b531d4", // C1
    "#ea00b7", // C2
    "#5c38ff", // C3
    "#bf6df9", // C4
    "#fc6bff", // C5
    "#ff4766", // C6
];

// Function to create the output folder if it doesn't exist
function ensureOutputDirectoryExists() {
    if (!fs.existsSync(outputFolder)){
        fs.mkdirSync(outputFolder);
    }
}

// Function to get all files from the input folder
function getFilesFromDirectory(directory) {
    return fs.readdirSync(directory).filter(file => {
        return fs.statSync(path.join(directory, file)).isFile();
    });
}



async function processImages(files) {
    // Group files by their base name (before _C1, _C2, etc., _L, _S)
    const groupedFiles = files.reduce((acc, file) => {
        const baseName = file.split(/_C|_L|_S/)[0];
        acc[baseName] = acc[baseName] || [];
        acc[baseName].push(file);
        return acc;
    }, {});

    // Process each group of images
    for (const baseName in groupedFiles) {
        let compositeImage;

        // Sort files to ensure layering order (_L before _C layers and _S)
        const sortedFiles = groupedFiles[baseName].sort((a, b) => {
            const layerOrder = ["_L", "_C", "_S"];
            return layerOrder.indexOf(a.split('.')[0].slice(-2)) - layerOrder.indexOf(b.split('.')[0].slice(-2));
        });

        for (const file of sortedFiles) {
            const image = await Jimp.read(path.join(inputFolder, file));

            // Check if the file is a line art layer (_L)
            if (file.includes('_L.png')) {
                // Do nothing, don't recolor line art layers
            } else if (file.includes('_S.png')) {
                // TODO: Adjust for skin color. For now, we'll skip recoloring, but this can be adjusted later.
            } else {
                // Recolor based on the _C1, _C2, etc. suffix
                const colorIndexMatch = file.match(/_C(\d)/);
                if (colorIndexMatch) {
                    const colorIndex = parseInt(colorIndexMatch[1]) - 1;
                    if (colorIndex >= 0 && colorIndex < layerColors.length) {
                        image.color([{ apply: 'mix', params: [layerColors[colorIndex], 100] }]);
                    }
                }
            }

            // Merge with the composite image
            if (!compositeImage) {
                compositeImage = image;
            } else {
                compositeImage.composite(image, 0, 0);
            }
        }

        // Resize and save
        compositeImage.resize(300, 300).write(path.join(outputFolder, baseName + '.png'));
    }
}


// Initialize
function init() {
    ensureOutputDirectoryExists();
    const files = getFilesFromDirectory(inputFolder);
    processImages(files);
}

// Start the script
init();
