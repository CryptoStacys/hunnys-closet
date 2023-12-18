import Jimp from 'jimp';
import * as fs from 'fs';
import * as path from 'path';

// Path to the images folder
const inputFolder = 'scriptImages';
const outputFolder = 'compositeImages';
const resize800Folder = '800x800_png';
const resize600Folder = '600x600_png';
const jpg300Folder = '300x300_jpg';
const baseLayerFile = 'Base_MergedBW.png';
const baseOutline = 'Base_L.png';
const subFolderPath = '';
const RGBFolder = 'RGB';

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
function ensureOutputDirectoryExists(folder) {
    console.log("Checking folder:", folder);
    if (!fs.existsSync(folder)){
        console.log("Creating folder:", folder);
        fs.mkdirSync(folder);
    }
}


// Function to get all files from the input folder
function getFilesFromDirectory(directory) {
    console.log("Getting files from directory:", directory);
    return fs.readdirSync(directory).filter(file => {
        return fs.statSync(path.join(directory, file)).isFile();
    });
}


// Function to resize images
async function resizeImages(files, directory, size, subFolderPath) {
    ensureOutputDirectoryExists(directory);
    for (const file of files) {
        const image = await Jimp.read(path.join(inputFolder, file));
        image.resize(size, size).write(path.join(directory, file));
    }
}

// Function to resize and save images
async function resizeAndSaveImage(file, directory, size, format, folderPath, subFolderPath = '') {
    // Correctly form the filePath considering subFolderPath
    const filePath = subFolderPath ? path.join(subFolderPath, folderPath) : path.join(folderPath, file);
    console.log("Resizing and saving file:", filePath);

    try {
        const image = await Jimp.read(filePath);
        // Ensure the output directory exists
        ensureOutputDirectoryExists(directory);
        image.resize(size, size).write(path.join(directory, file.replace('.png', format)));
    } catch (error) {
        console.error("Error processing file:", filePath, error);
    }
}


async function processImages(files, subFolderPath = '') {
    // Group files by their base name (before _C1, _C2, etc., _L, _S)
    const groupedFiles = files.reduce((acc, file) => {
        const baseName = file.split(/_C|_L|_S/)[0];
        acc[baseName] = acc[baseName] || [];
        acc[baseName].push(file);
        return acc;
    }, {});

    // Process each group of images
    for (const baseName in groupedFiles) {
        console.log("Loading base layer file:", path.join(inputFolder, baseLayerFile));
        let compositeImage = await Jimp.read(path.join(inputFolder, baseLayerFile));

        // Sort files to ensure layering order (_L before _C layers and _S)
        let sortedFiles = groupedFiles[baseName].sort((a, b) => {
            const layerOrder = ["_L", "_C", "_S"];
            return layerOrder.indexOf(a.split('.')[0].slice(-2)) - layerOrder.indexOf(b.split('.')[0].slice(-2));
        });

        // After sorting
        console.log("Sorted files for baseName", baseName, ": ", sortedFiles);

        for (const file of sortedFiles) {
            const filePath = path.join(folderPath, file, subFolderPath);
            console.log("Processing file:", filePath);
            const image = await Jimp.read(filePath);

            try {
                const image = await Jimp.read(filePath);

            // Check if the file is a line art layer (_L)
            if (file.includes('_L.png')) {
                // Do nothing, don't recolor line art layers
            } else if (file.includes('_S.png')) {
                // TODO: Adjust for skin color. For now, we'll skip recoloring, but this can be adjusted later.
            } else {
                // Recolor based on the _C1, _C2, etc. suffix
                const colorIndexMatch = file.match(/_C(\\d)/);
                if (colorIndexMatch) {
                    const colorIndex = parseInt(colorIndexMatch[1]) - 1;
                    if (colorIndex >= 0 && colorIndex < layerColors.length) {
                        image.color([{ apply: 'mix', params: [layerColors[colorIndex], 100] }]);
                    }
                }
            }

            // Merge with the composite image
            compositeImage.composite(image, 0, 0);
        } catch (error) {
            console.error("Error processing file:", filePath, error);
        }
    }

        // Resize and save
        compositeImage.resize(300, 300).write(path.join(outputFolder, baseName + '.png'));
    }
}


// Function to process the 'Background' subfolder
async function processBackground(folderPath) {
    const files = getFilesFromDirectory(folderPath);

    // Resize and save images in 800x800 and 600x600 formats
    for (const file of files) {
        const filePath = path.join(folderPath, file, subFolderPath);
        console.log("Processing background file:", filePath);
        await resizeAndSaveImage(file, path.join(resize800Folder, 'Background'), 800, '.png');
        await resizeAndSaveImage(file, path.join(resize600Folder, 'Background'), 600, '.png');
    }

    // Additional logic to save the images in any other formats or sizes as required
    // For example, saving a 300x300 jpg version
    for (const file of files) {
        await resizeAndSaveImage(file, path.join(jpg300Folder, 'Background'), 300, '.jpg');
    }
}


// Function to calculate the average RGB values of an image
async function calculateAverageRGB(imagePath) {
    const image = await Jimp.read(imagePath);
    let total = { r: 0, g: 0, b: 0 };
    let count = 0;

    image.scan(0, 0, image.bitmap.width, image.bitmap.height, function(x, y, idx) {
        total.r += this.bitmap.data[idx + 0];
        total.g += this.bitmap.data[idx + 1];
        total.b += this.bitmap.data[idx + 2];
        count++;
    });

    return {
        r: Math.round(total.r / count),
        g: Math.round(total.g / count),
        b: Math.round(total.b / count)
    };
}

// Function to process the 'Colors/ClothingAndHair/Solid' subfolder
async function processClothingAndHairSolid(folderPath) {
    const files = getFilesFromDirectory(folderPath);
    const colorData = {};

    for (const file of files) {
        const avgRGB = await calculateAverageRGB(path.join(folderPath, file));
        colorData[path.basename(file, '.png')] = avgRGB;
    }

    // Write color data to a JSON file in the RGB folder
    fs.writeFileSync(path.join(RGBFolder, 'colors.json'), JSON.stringify(colorData, null, 2));
}


// Function to create a composite image with Base_MergedBW and Base_L
async function createCompositeWithBase(imagePath, baseImagePath, baseOutlinePath, outputFolderPath, outputFileName) {
    const baseImage = await Jimp.read(baseImagePath);
    const textureImage = await Jimp.read(imagePath);
    const baseOutlineImage = await Jimp.read(baseOutlinePath);

    // Resize the texture to match the base image size
    textureImage.resize(baseImage.bitmap.width, baseImage.bitmap.height);

    // Composite the texture within the confines of the silhouette of Base_MergedBW
    const mergedImage = baseImage.clone().composite(textureImage, 0, 0, {
        mode: Jimp.BLEND_SOURCE_OVER,
        opacitySource: 0.5 // Adjust opacity as needed
    });

    // Lay Base_L on top of the composite
    mergedImage.composite(baseOutlineImage, 0, 0, {
        mode: Jimp.BLEND_SOURCE_OVER,
        opacityDest: 1 // Ensure Base_L is fully visible
    });

    // Save the final composite image
    await mergedImage.writeAsync(path.join(outputFolderPath, outputFileName + '.png'));
}

// Function to process the 'Colors/SkinColors/Old' subfolder
async function processSkinColorsOld(folderPath) {
    const files = getFilesFromDirectory(folderPath);

    // First set: Simple resizing and saving
    for (const file of files) {
        await resizeAndSaveImage(file, path.join(resize800Folder, 'Colors/SkinColors/Old'), 800, '.png');
        await resizeAndSaveImage(file, path.join(resize600Folder, 'Colors/SkinColors/Old'), 600, '.png');
        await resizeAndSaveImage(file, path.join(jpg300Folder, 'Colors/SkinColors/Old'), 300, '.jpg');
    }

    // Second set: Merging with Base_MergedBW and Base_L
    for (const file of files) {
        const baseName = path.basename(file, '.png');
        await createCompositeWithBase(
            path.join(folderPath, file),
            path.join(inputFolder, baseLayerFile),
            path.join(inputFolder, baseOutline),
            path.join(outputFolder, 'Colors/SkinColors/Old'),
            baseName
        );
    }
}


// Function to process the 'Eyes' subfolder
async function processEyes(folderPath) {
    const files = getFilesFromDirectory(folderPath);
    let groupedFiles = {};

    // Group files by base name (excluding 'Left' or 'Right')
    files.forEach(file => {
        const baseName = file.split('_')[0]; // Assumes baseName is before the first underscore
        groupedFiles[baseName] = groupedFiles[baseName] || { left: [], right: [] };
        if (file.includes('Left')) {
            groupedFiles[baseName].left.push(file);
        } else if (file.includes('Right')) {
            groupedFiles[baseName].right.push(file);
        }
    });

    // Process each group of eyes
    for (const baseName in groupedFiles) {
        let leftComposite = new Jimp(800, 800, 0x0); // Assuming default size; adjust as needed
        let rightComposite = await Jimp.read(path.join(inputFolder, baseLayerFile));

        // Process left eye layers (without Base_MergedBW)
        for (const file of groupedFiles[baseName].left) {
            const image = await Jimp.read(path.join(folderPath, file));
            leftComposite.composite(image, 0, 0);
        }

        // Process right eye layers (with Base_MergedBW)
        for (const file of groupedFiles[baseName].right) {
            const image = await Jimp.read(path.join(folderPath, file));
            rightComposite.composite(image, 0, 0);
        }

        // Composite left eye on top of right eye + base
        rightComposite.composite(leftComposite, 0, 0);

        // Save the final composite image
        await rightComposite.resize(300, 300).writeAsync(path.join(outputFolder, 'Eyes', baseName + '.png'));
        await rightComposite.writeAsync(path.join(jpg300Folder, 'Eyes', baseName + '.jpg'));
    }
}


// Function to process the 'Hair Style' subfolder
async function processHairStyle(folderPath) {
    const files = getFilesFromDirectory(folderPath);
    let groupedFiles = {};

    // Group files by base name (excluding 'Front' or 'Back')
    files.forEach(file => {
        const baseName = file.split('_')[0]; // Assumes baseName is before the first underscore
        groupedFiles[baseName] = groupedFiles[baseName] || { front: [], back: [] };
        if (file.includes('Front')) {
            groupedFiles[baseName].front.push(file);
        } else if (file.includes('Back')) {
            groupedFiles[baseName].back.push(file);
        }
    });

    // Process each group of hair styles
    for (const baseName in groupedFiles) {
        let frontComposite = new Jimp(800, 800, 0x0); // Assuming default size; adjust as needed
        let backComposite = new Jimp(800, 800, 0x0); // Create an empty image for back layers

        // Process front hair style layers
        for (const file of groupedFiles[baseName].front) {
            const image = await Jimp.read(path.join(folderPath, file));
            frontComposite.composite(image, 0, 0);
        }

        // Process back hair style layers
        for (const file of groupedFiles[baseName].back) {
            const image = await Jimp.read(path.join(folderPath, file));
            backComposite.composite(image, 0, 0);
        }

        // Composite front on top of back
        backComposite.composite(frontComposite, 0, 0);

        // Save the final composite image
        await backComposite.resize(300, 300).writeAsync(path.join(outputFolder, 'Hair Style', baseName + '.png'));
        await backComposite.writeAsync(path.join(jpg300Folder, 'Hair Style', baseName + '.jpg'));
    }
}


// Modified processSpecialFolder function to handle specific subfolders
async function processSpecialFolder(folderPath, folderName) {
    switch (folderName) {
        case 'Background':
            await processBackground(folderPath);
            break;
        case 'Colors/ClothingAndHair/Solid':
            await processClothingAndHairSolid(folderPath);
            break;
        case 'Colors/SkinColors/Old':
            await processSkinColorsOld(folderPath);
            break;
        case 'Eyes':
            await processEyes(folderPath);
            break;
        case 'Hair Style':
            await processHairStyle(folderPath);
            break;
        default:
            // Default processing for folders without special rules
    }
}

// Function to process and save images in subfolders
async function processSubfolders() {
    const subfolders = fs.readdirSync(inputFolder).filter(subfolder => {
        return fs.statSync(path.join(inputFolder, subfolder)).isDirectory();
    });

    for (const subfolder of subfolders) {
        console.log("Found subfolder:", subfolder);
        const subFolderPath = path.join(inputFolder, subfolder);
        console.log("Processing subfolder:", subFolderPath);
        const files = getFilesFromDirectory(subFolderPath);
            files.forEach(file => {
            const filePath = path.join(inputFolder, file, subFolderPath);
            ;});

        // Resize and save 800x800 and 600x600 images
        for (const file of files) {
            // Correctly pass the subFolderPath
//            await resizeAndSaveImage(file, path.join(resize800Folder, subfolder), 800, '.png', path.join(inputFolder, subfolder));
//            await resizeAndSaveImage(file, path.join(resize600Folder, subfolder), 600, '.png', path.join(inputFolder, subfolder));
        }

        // Process special rules and images for each subfolder
            await processSpecialFolder(subFolderPath, subfolder);
            await processImages(files, path.join(inputFolder, subfolder)); // Correctly call processImages for subfolders
    
    }
}

// Initialize
async function init() {
    ensureOutputDirectoryExists(inputFolder);
    ensureOutputDirectoryExists(outputFolder);
    ensureOutputDirectoryExists(resize800Folder);
    ensureOutputDirectoryExists(resize600Folder);
    ensureOutputDirectoryExists(jpg300Folder);
    ensureOutputDirectoryExists(RGBFolder);
    const files = getFilesFromDirectory(inputFolder);
    try {
    await resizeImages(files, resize800Folder, 800);
    } catch (error) {
        console.error("Error in resizeImages800:", error);
    }
    try {
    await resizeImages(files, resize600Folder, 600);
    } catch (error) {
        console.error("Error in resizeImages600:", error);
    }
    try {
        await processImages(files);
    } catch (error) {
        console.error("Error in processImages:", error);
    }    
    await processSubfolders();
    
}

// Start the script
init();