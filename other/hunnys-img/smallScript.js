import Jimp from 'jimp';
import * as fs from 'fs';
import * as path from 'path';

const inputFolder = 'scriptImages';
const outputFolder = 'compositeImages';
const resizeFolders = {
    '800x800': '800x800_png',
    '600x600': '600x600_png',
    '300x300': '300x300_jpg'
};
const baseLayerFile = 'Base_MergedBW.png';
const baseOutline = 'Base_L.png';
const RGBFolder = 'RGB';
const layerColors = ["#b531d4", "#ea00b7", "#5c38ff", "#bf6df9", "#fc6bff", "#ff4766"];

function ensureDirectoryExists(dir) {
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
        console.log(`Created directory: ${dir}`);
    }
}

function getFilesFromDirectory(directory, filterFunc = () => true) {
    return fs.readdirSync(directory).filter(file => {
        const filePath = path.join(directory, file);
        return fs.statSync(filePath).isFile() && filterFunc(file);
    });
}

async function resizeAndSaveImage(filePath, size, outputDir, format) {
    ensureDirectoryExists(outputDir);
    const newFileName = format ? path.basename(filePath).replace(path.extname(filePath), format) : path.basename(filePath);
    const outputPath = path.join(outputDir, newFileName);

    // Check if the file already exists in the output directory
    if (fs.existsSync(outputPath)) {
        console.log(`Skipping existing file: ${outputPath}`);
        return;
    }

    const image = await Jimp.read(filePath);
    await image.resize(size, size).writeAsync(outputPath);
    console.log(`Processed and saved: ${outputPath}`);
}

async function processImageFiles(files, folderPath, processFunc) {
    for (const file of files) {
        const filePath = path.join(folderPath, file);
        await processFunc(filePath);
    }
}

async function processFolder(folderPath, sizeKeys, processFunc) {
    const files = getFilesFromDirectory(folderPath);
    for (const sizeKey of sizeKeys) {
        const size = parseInt(sizeKey.split('x')[0]);
        const format = resizeFolders[sizeKey].endsWith('jpg') ? '.jpg' : null;
        const outputDir = path.join(resizeFolders[sizeKey], path.basename(folderPath));
        await processImageFiles(files, folderPath, async (filePath) => {
            await resizeAndSaveImage(filePath, size, outputDir, format);
            if (processFunc) {
                await processFunc(filePath, size, outputDir, format);
            }
        });
    }
}

async function processSpecialFolders() {
    const subfolders = fs.readdirSync(inputFolder).filter(subfolder => {
        return fs.statSync(path.join(inputFolder, subfolder)).isDirectory();
    });
    for (const subfolder of subfolders) {
        const folderPath = path.join(inputFolder, subfolder);
        switch (subfolder) {
            case 'Background':
            case 'Colors/ClothingAndHair/Solid':
            case 'Colors/SkinColors/Old':
            case 'Eyes':
            case 'Hair Style':
                await processFolder(folderPath, Object.keys(resizeFolders), null); // Replace 'null' with your specific processing function if needed
                break;
            default:
                // Default processing for other folders
                await processFolder(folderPath, Object.keys(resizeFolders), null); // Adjust as needed
        }
    }
}

async function init() {
    ensureDirectoryExists(inputFolder);
    ensureDirectoryExists(outputFolder);
    Object.values(resizeFolders).forEach(ensureDirectoryExists);
    ensureDirectoryExists(RGBFolder);

    try {
        await processSpecialFolders();
    } catch (error) {
        console.error("Error processing folders:", error);
    }
}

init();
