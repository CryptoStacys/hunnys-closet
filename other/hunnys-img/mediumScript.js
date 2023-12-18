import Jimp from 'jimp';
import * as fs from 'fs';
import * as path from 'path';

// Function to log messages to a file
function logToFile(message) {
    fs.appendFileSync('process_log.txt', message + '\n', 'utf8', (err) => {
        if (err) console.error("Error writing to log file", err);
    });
}


// Paths
const inputFolder = 'scriptImages';
const outputFolder800 = '800x800_png';
const outputFolder600 = '600x600_png';
const outputFolderComposite = 'compositeImages';
const outputFolderJpg = '300x300_jpg';

// Create output directories if they don't exist
function ensureOutputDirectoryExists(directory) {
    if (!fs.existsSync(directory)) {
        fs.mkdirSync(directory, { recursive: true });
    }
}

// Function to get all files from the input folder, including subdirectories
function getFilesFromDirectory(directory, subfolders) {
    let files = [];
    subfolders.forEach(subfolder => {
        const fullPath = path.join(directory, subfolder);
        fs.readdirSync(fullPath).forEach(file => {
            if (fs.statSync(path.join(fullPath, file)).isFile()) {
                files.push({ file: file, subfolder: subfolder });
            }
        });
    });
    return files;
}

// Function to resize images
async function resizeImages(files, size, outputDirectory) {
    for (const { file, subfolder } of files) {
        const outputPath = path.join(outputDirectory, subfolder, file);
        
        // Check if the output file already exists
        if (fs.existsSync(outputPath)) {
            logToFile(`Skipping existing file: ${outputPath}`);
            continue; // Skip if the output file exists
        }

        const imagePath = path.join(inputFolder, subfolder, file);
        logToFile(`Resizing image: ${imagePath} to ${size}x${size}`);
        try {
            const image = await Jimp.read(imagePath);
            const resizedImage = image.resize(size, size);
            const outputSubfolderPath = path.join(outputDirectory, subfolder);
            ensureOutputDirectoryExists(outputSubfolderPath);
            await resizedImage.writeAsync(outputPath);
            logToFile(`Resized image saved: ${outputPath}`);
        } catch (error) {
            console.error(`Error resizing image: ${imagePath}`, error);
            logToFile(`Error resizing image: ${imagePath}: ${error}`);
        }
    }
}

// Special rules for subfolders
const specialRules = {
    "Background": {
        includeBase: false
    },
    "Colors/ClothingAndHair/Solid": {
        noLayering: true,
        generateRGBJson: true
    },
    "Colors/SkinColors/Old": {
        mergeOnBaseWithColor: true
    },
    "Eyes": {
        handleEyesSeparately: true
    },
    "Hair Style": {
        handleFrontBackSeparately: true
    }
};

// Layer colors based on your provided mapping
const layerColors = [
    "#b531d4", // C1
    "#ea00b7", // C2
    "#5c38ff", // C3
    "#bf6df9", // C4
    "#fc6bff", // C5
    "#ff4766", // C6
];

// Function to process the 'Eyes' subfolder
async function processEyes(files, baseName, subfolder, baseImage) {
    let leftEyeComposite, rightEyeComposite;

    for (const { file } of files) {
        try {
        if (!file.startsWith(baseName)) continue;

        const imagePath = path.join(inputFolder, subfolder, file);
        
            let image = await Jimp.read(imagePath);

            if (file.includes('_Left_')) {
                if (!leftEyeComposite) {
                    leftEyeComposite = new Jimp(image.bitmap.width, image.bitmap.height);
                }
                leftEyeComposite.composite(image, 0, 0, {
                    mode: Jimp.BLEND_SOURCE_OVER,
                    opacitySource: 1,
                    opacityDest: 1
                });
            } else if (file.includes('_Right_')) {
                if (!rightEyeComposite) {
                    rightEyeComposite = baseImage.clone(); // Start with base image for right eye
                }
                rightEyeComposite.composite(image, 0, 0, {
                    mode: Jimp.BLEND_SOURCE_OVER,
                    opacitySource: 1,
                    opacityDest: 1
                });
            }
        } catch (error) {
            console.error(`Error processing eye file ${file}:`, error);
            // Continue to the next file
        }
    }

    if (leftEyeComposite && rightEyeComposite) {
        rightEyeComposite.composite(leftEyeComposite, 0, 0, {
            mode: Jimp.BLEND_SOURCE_OVER,
            opacitySource: 1,
            opacityDest: 1
        });
    }

    return rightEyeComposite || leftEyeComposite;
}


async function processHairStyle(files, baseName, subfolder, baseImage) {
    // Group files by their hair style name
    const hairStyleGroups = files.reduce((acc, { file }) => {
        const match = file.match(/^([a-zA-Z0-9\s-]+(?:\(.*\))?)[_]/);
        if (match) {
            const styleName = match[1]; // Capture the base style name before the first underscore
            acc[styleName] = acc[styleName] || [];
            acc[styleName].push(file);
        }
        return acc;
    }, {});

    // Define a function to apply the color based on the layer name
    const applyColorToLayer = async (image, fileName) => {
        const colorIndexMatch = fileName.match(/_C(\d)/);
        if (colorIndexMatch) {
            const colorIndex = parseInt(colorIndexMatch[1], 10) - 1;
            if (colorIndex >= 0 && colorIndex < layerColors.length) {
                const color = layerColors[colorIndex];
                image.color([{ apply: 'mix', params: [color, 100] }]);
            }
        }
        return image;
    };

    // Process each hair style group
    for (const styleName in hairStyleGroups) {
        let compositeImage = baseImage.clone(); // Start with a clone of the base image
        const styleFiles = hairStyleGroups[styleName];

        // Sort files to ensure correct layering order
        const sortedFiles = styleFiles.sort((a, b) => {
            if (a.includes('_Back') && !b.includes('_Back')) return -1;
            if (b.includes('_Back') && !a.includes('_Back')) return 1;
            if (a.includes('_Front') && !b.includes('_Front')) return 1;
            if (b.includes('_Front') && !a.includes('_Front')) return -1;
            return a.localeCompare(b); // Preserve original order for other files
        });

        // Composite all layers for the hair style
        for (const file of sortedFiles) {
            try {
                const imagePath = path.join(inputFolder, subfolder, file);
                let image = await Jimp.read(imagePath);
                image = await applyColorToLayer(image, file); // Apply color before compositing
                compositeImage.composite(image, 0, 0, {
                    mode: Jimp.BLEND_SOURCE_OVER,
                    opacitySource: 1,
                    opacityDest: 1
                });
            } catch (error) {
                console.error(`Error processing hair style file ${file}:`, error);
            }
        }

        // Resize the final composite image to 300x300
        const resizedCompositeImage = compositeImage.resize(300, 300);

        // Save the resized composite image to the compositeImages folder
        const compositeImagePath = path.join(outputFolderComposite, subfolder, `${styleName}.png`);
        ensureOutputDirectoryExists(path.dirname(compositeImagePath));
        await resizedCompositeImage.writeAsync(compositeImagePath);

        // Save the same resized image as a JPEG to the 300x300_jpg folder
        const jpgOutputPath = path.join(outputFolderJpg, subfolder, `${styleName}.jpg`);
        ensureOutputDirectoryExists(path.dirname(jpgOutputPath));
        await resizedCompositeImage.quality(80).writeAsync(jpgOutputPath); // Save with quality setting for JPG
    }
}

async function processSkinColorsOld() {
    const skinColorPath = path.join(inputFolder, 'Colors/SkinColors/Old');
    const files = fs.readdirSync(skinColorPath);
    const baseImagePath = path.join(inputFolder, 'Base_Skin.png');
    const baseLayerPath = path.join(inputFolder, 'Base_L.png');
    const baseImage = await Jimp.read(baseImagePath);
    const baseLayerImage = await Jimp.read(baseLayerPath);

    for (const file of files) {
        const filePath = path.join(skinColorPath, file);
        if (fs.statSync(filePath).isFile()) {
            try {
                let skinImage = await Jimp.read(filePath);

                // Resize for different outputs
                const skinImage800 = skinImage.clone().resize(800, 800);
                const skinImage600 = skinImage.clone().resize(600, 600);
                const skinImage300 = skinImage.clone().resize(300, 300);

                // Define output paths
                const outputPath800 = path.join(outputFolder800, 'Colors/SkinColors/Old', file);
                const outputPath600 = path.join(outputFolder600, 'Colors/SkinColors/Old', file);
                const outputPath300 = path.join(outputFolderComposite, 'Colors/SkinColors/Old', file);
                const outputPath300Jpg = path.join(outputFolderJpg, 'Colors/SkinColors/Old', path.basename(file, path.extname(file)) + '.jpg');

                // Ensure output directories exist
                ensureOutputDirectoryExists(path.dirname(outputPath800));
                ensureOutputDirectoryExists(path.dirname(outputPath600));
                ensureOutputDirectoryExists(path.dirname(outputPath300));
                ensureOutputDirectoryExists(path.dirname(outputPath300Jpg));

                // Write the image files
                await skinImage800.writeAsync(outputPath800);
                await skinImage600.writeAsync(outputPath600);
                await skinImage300.writeAsync(outputPath300);
                await skinImage300.quality(80).writeAsync(outputPath300Jpg);

                logToFile(`Processed and saved skin color trait: ${file}`);
                skinImage.resize(baseImage.bitmap.width, baseImage.bitmap.height);

                // Use the base image as a mask to confine the skin color within the line art
                let maskedSkinImage = skinImage.mask(baseImage, 0, 0);

                // Merge the masked skin color image with the base layer image
                let mergedWithBaseLayer = new Jimp(baseImage.bitmap.width, baseImage.bitmap.height, 0x00000000);
                mergedWithBaseLayer.composite(maskedSkinImage, 0, 0).composite(baseLayerImage, 0, 0);

                // New code to process the image and make the outside of the silhouette white
                mergedWithBaseLayer.scan(0, 0, mergedWithBaseLayer.bitmap.width, mergedWithBaseLayer.bitmap.height, function(x, y, idx) {
                    let alpha = this.bitmap.data[idx + 3];
                    if (alpha === 0) { // If the pixel is completely transparent
                        this.setPixelColor(Jimp.rgbaToInt(255, 255, 255, 255), x, y); // Set to white
                    }
                });

                // Define the output paths for PNG and JPG
                const outputPathPNG = path.join(outputFolderComposite, 'Skin', file);
                const outputPathJPG = path.join(outputFolderJpg, 'Skin', path.basename(file, path.extname(file)) + '.jpg');

                // Ensure the output directories exist
                ensureOutputDirectoryExists(path.dirname(outputPathPNG));
                ensureOutputDirectoryExists(path.dirname(outputPathJPG));

                // Write the 300x300 PNG and JPG files
                await mergedWithBaseLayer.resize(300, 300).writeAsync(outputPathPNG);
                await mergedWithBaseLayer.resize(300, 300).quality(80).writeAsync(outputPathJPG);

                logToFile(`Processed skin color: ${file}`);
            } catch (error) {
                console.error(`Error processing skin color file ${file}:`, error);
                logToFile(`Error processing skin color file ${file}: ${error}`);
            }
        }
    }
}



async function processImages(files) {
    const baseMergedBWPath = path.join(inputFolder, 'Base_Composite.png'); // Path to the base layer image
    const baseMergedBWImage = await Jimp.read(baseMergedBWPath);

    // Group files by their base name (before _C1, _C2, etc., _L, _S)
    const groupedFiles = files.reduce((acc, {file, subfolder}) => {
        const baseName = file.split(/_C|_L|_S/)[0];
        acc[baseName] = acc[baseName] || [];
        acc[baseName].push({file, subfolder});
        return acc;
    }, {});

    // Process each group of images
    for (const baseName in groupedFiles) {
        let compositeImage;
        logToFile(`Processing image group: ${baseName}`);

        // Sort files to ensure layering order (_L before _C layers and _S)
        const sortedFiles = groupedFiles[baseName].sort((a, b) => {
            const layerOrder = ["_L", "_C", "_S"];
            return layerOrder.indexOf(a.file.split('.')[0].slice(-2)) - layerOrder.indexOf(b.file.split('.')[0].slice(-2));
        });

        for (const {file, subfolder} of sortedFiles) {
            try {
            const rules = specialRules[subfolder] || {};
            const imagePath = path.join(inputFolder, subfolder, file);
            const image = await Jimp.read(imagePath);
            logToFile(`Processing file: ${file} in subfolder: ${subfolder}`);
            // Initialize composite image with Base_Composite based on rules
            if (!compositeImage && rules.includeBase !== false) {
                compositeImage = baseMergedBWImage.clone(); // Use a cloned base image for each composite
            }

            // Apply special processing based on subfolder rules
            if (subfolder === "Eyes") {
                compositeImage = await processEyes(files, baseName, subfolder, baseMergedBWImage);
            } else if (subfolder === "Hair Style") {
                compositeImage = await processHairStyle(files, baseName, subfolder, baseMergedBWImage);
            } else if (subfolder === "Colors/SkinColors/Old" && rules.mergeOnBaseWithColor) {
                compositeImage = await processSkinColorsOld(files, baseName, subfolder);
            } else {
                // Standard processing for other subfolders
                if (file.includes('_L.png')) {
                    // Do nothing, don't recolor line art layers
                } else if (file.includes('_S.png')) {
                    // ... [Skin color adjustment logic, if any] ...
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
                if (compositeImage) {
                    compositeImage.composite(image, 0, 0, {
                        mode: Jimp.BLEND_SOURCE_OVER,
                        opacitySource: 1,
                        opacityDest: 1
                    });
                } else {
                    compositeImage = image;
                }
            }
        } catch (error) {
            console.error(`Error processing file ${file} in subfolder ${subfolder}:`, error);
            logToFile(`Error processing file ${file} in subfolder ${subfolder}: ${error}`);
        }
    }

        // Modify output paths to include subfolder information
        const groupSubfolder = groupedFiles[baseName][0].subfolder;
        const outputPathPNG = path.join(outputFolderComposite, groupSubfolder, `${baseName}.png`);
        const outputPathJPG = path.join(outputFolderJpg, groupSubfolder, `${baseName}.jpg`);
        logToFile(`Checking existence of PNG: ${outputPathPNG}`);
        logToFile(`Checking existence of JPG: ${outputPathJPG}`);
    
        // Check if both PNG and JPG files already exist
    if (fs.existsSync(outputPathPNG) && fs.existsSync(outputPathJPG)) {
        logToFile(`Skipping existing files: PNG - ${outputPathPNG}, JPG - ${outputPathJPG}`);
        continue; // Skip if both output files exist
    } else {
        logToFile(`Files not found, processing: PNG - ${outputPathPNG}, JPG - ${outputPathJPG}`);
    }
    
        // Resize and save the composite image
    if (compositeImage) {
        const resizedComposite = compositeImage.resize(300, 300);

        // Save as PNG
        ensureOutputDirectoryExists(path.dirname(outputPathPNG));
        await resizedComposite.writeAsync(outputPathPNG);
        logToFile(`Saved: ${outputPathPNG}`);

        // Save as JPG
        ensureOutputDirectoryExists(path.dirname(outputPathJPG));
        await resizedComposite.quality(80).writeAsync(outputPathJPG);
        logToFile(`Saved: ${outputPathJPG}`);
        }
    }   
}

// Function to calculate the average RGB values of an image
async function calculateAverageRGB(imagePath) {
    console.log(`Calculating average RGB for image: ${imagePath}`);
    const image = await Jimp.read(imagePath);
    let total = { r: 0, g: 0, b: 0, count: 0 };

    image.scan(0, 0, image.bitmap.width, image.bitmap.height, function (x, y, idx) {
        total.r += this.bitmap.data[idx + 0];
        total.g += this.bitmap.data[idx + 1];
        total.b += this.bitmap.data[idx + 2];
        total.count++;
    });

    return {
        r: Math.round(total.r / total.count),
        g: Math.round(total.g / total.count),
        b: Math.round(total.b / total.count)
    };
}

async function processSolidColors() {
    const solidColorPath = path.join(inputFolder, 'Colors/ClothingAndHair/Solid');
    const files = fs.readdirSync(solidColorPath);
    const rgbValues = {};

    for (const file of files) {
        const filePath = path.join(solidColorPath, file);
        if (fs.statSync(filePath).isFile()) {
            try {
                const baseName = path.basename(file, path.extname(file));

                // Define output paths
                const outputPath800 = path.join(outputFolder800, 'Colors/ClothingAndHair/Solid', file);
                const outputPath600 = path.join(outputFolder600, 'Colors/ClothingAndHair/Solid', file);
                const outputPathComposite = path.join(outputFolderComposite, 'Colors/ClothingAndHair/Solid', file);
                const outputPathJpg = path.join(outputFolderJpg, 'Colors/ClothingAndHair/Solid', `${baseName}.jpg`);

                // Check if files already exist
                if (fs.existsSync(outputPath800) && fs.existsSync(outputPath600) && fs.existsSync(outputPathComposite) && fs.existsSync(outputPathJpg)) {
                    logToFile(`Skipping already processed solid color: ${file}`);
                    continue;
                }

                // Process the file
                const image = await Jimp.read(filePath);
                const averageRGB = await calculateAverageRGB(filePath);
                rgbValues[baseName] = averageRGB;

                // Resize and save the image to the different sizes and formats
                ensureOutputDirectoryExists(path.dirname(outputPath800));
                ensureOutputDirectoryExists(path.dirname(outputPath600));
                ensureOutputDirectoryExists(path.dirname(outputPathComposite));
                ensureOutputDirectoryExists(path.dirname(outputPathJpg));

                await image.resize(800, 800).writeAsync(outputPath800);
                await image.resize(600, 600).writeAsync(outputPath600);
                await image.resize(300, 300).writeAsync(outputPathComposite);
                await image.resize(300, 300).quality(80).writeAsync(outputPathJpg);

                logToFile(`Processed and saved solid color: ${file}`);
            } catch (error) {
                console.error(`Error processing solid color file ${file}:`, error);
                logToFile(`Error processing solid color file ${file}: ${error}`);
            }
        }
    }

    fs.writeFileSync(path.join('RGB', 'colors.json'), JSON.stringify(rgbValues, null, 2));
    logToFile('Solid colors RGB values saved to colors.json');
}


// Call this function in init after processing other images
// processSolidColors();

// Initialize and start processing
function init() {
    console.log("Script started");
    logToFile("Script started");
    const subfolders = fs.readdirSync(inputFolder).filter(entry => fs.statSync(path.join(inputFolder, entry)).isDirectory());
    logToFile(`Subfolders found: ${subfolders.join(', ')}`);
    const files = getFilesFromDirectory(inputFolder, subfolders);
    logToFile(`Files found: ${files.length}`);

    ensureOutputDirectoryExists(outputFolder800);
    ensureOutputDirectoryExists(outputFolder600);
    processImages(files);
 //   processSolidColors(files);
    resizeImages(files, 800, outputFolder800);
    resizeImages(files, 600, outputFolder600);
  //  processSolidColors();
    processSkinColorsOld();
}

// Start the script
init();
