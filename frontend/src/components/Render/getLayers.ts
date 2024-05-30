import colorData from "../../data/colorNames";
import { Layer } from "../../data/global";
import { attributes, layersPath } from "../../data/config";

const colorMap: any = colorData;
const fileExtension = ".png";

type Color = {
    r: number;
    g: number;
    b: number;
};

type Token = {
    attribute: string;
    name: string;
    color?: Color;
    layers?: number;
    tags?: Array<string>;
};

async function fetchMetadata(id: number) {
    let res = await fetch(`https://hunnyscloset.s3.us-east-2.amazonaws.com/data/${id}`);
    let meta = await res.json();
    return meta.attributes;
}

function formatToken(token: any) {
    // if no initial token data, return empty token
    if (!token) {
        const output: any = [];
        attributes.forEach((attribute) => {
            output.push({
                attribute: attribute,
                name: "Empty",
                tags: [],
                colors: 0,
            });
        });
        return output;
    }
    return token;
}

function addLayer(layers: Layer[], trait: any, traitExtension: string = '') {
    if(trait.tags.includes("reverse")){
        layers.push({ src: `${trait.attribute}/${trait.name}${traitExtension}_L` });
    }

    for (let i = 1; i <= trait.colors; i++) {
        layers.push({
            pattern: `Colors/ClothingAndHair/Solid/${trait.colorsApplied[i - 1]}`,
            src: `${trait.attribute}/${trait.name}${traitExtension}_C${i}`,
        });
    }

    if (trait.tags.includes("effect")) {
        layers.push({ src: `${trait.attribute}/${trait.name}_L E` });
    }

    if(!trait.tags.includes("reverse")){
        layers.push({ src: `${trait.attribute}/${trait.name}${traitExtension}_L` });
    }

    return layers;
}

function addSkinLayer(layers: Layer[], trait: any, tattoTrait: any) {
    if (trait.tags.includes("ownBase")) {
        layers.push({
            pattern: `Colors/SkinColors/Old/${trait.name}`,
            src: `Base/${trait.name}Base_C1`,
        });

        if (tattoTrait && tattoTrait.tags.includes('bodyPaint')) {
            layers = addLayer(layers, tattoTrait);
        }

        layers.push({ src: `Base/${trait.name}Base_L` });
    } else {
        layers.push({
            pattern: `Colors/SkinColors/Old/${trait.name}`,
            src: `Base/Base_C1`,
        });

        if (tattoTrait && tattoTrait.tags.includes('bodyPaint')) {
            layers = addLayer(layers, tattoTrait);
        }

        layers.push({ src: `Base/Base_L` });
    }

    return layers;
}



// function (token) {
export async function getLayers(token: any): Promise<Layer[]> {
    let layers: Layer[] = [];

    token = formatToken(token);
    // console.log("token?", token);

    const background = token.find((ele: Token) => ele.attribute === "Background");
    const skin = token.find((ele: Token) => ele.attribute === "Skin");
    const eyebrows = token.find((ele: Token) => ele.attribute === "Eyebrows");
    const hat = token.find((ele: Token) => ele.attribute === "Hat");
    const eyes = token.find((ele: Token) => ele.attribute === "Eyes");
    const facesticker = token.find((ele: Token) => ele.attribute === "Face Sticker"); // prettier-ignore
    const piercing = token.find((ele: Token) => ele.attribute === "Piercing");
    const mouth = token.find((ele: Token) => ele.attribute === "Mouth");
    const hairstyle = token.find((ele: Token) => ele.attribute === "Hair Style");
    const accessory = token.find((ele: Token) => ele.attribute === "Accessory");
    const outfit = token.find((ele: Token) => ele.attribute === "Outfit");
    const hand = token.find((ele: Token) => ele.attribute === "Hand");
    const tattoo = token.find((ele: Token) => ele.attribute === "Tattoo");
    const bodysuit = token.find((ele: Token) => ele.attribute === "Bodysuit");
    const frame = token.find((ele: Token) => ele.attribute === "Frame");
    const undergarment = token.find((ele: Token) => ele.attribute === "Undergarment"); // prettier-ignore

    if (token.length < 1) {
        return [];
    }

    // const bodysuit = { name: "Empty" };
    // Default white background if there isn't any
    // layers.push({ src: `Background/SnowWhite` });

    // BACKGROUND
    if (background) {
        layers = addLayer(layers, background);
    }

    // ACCESSORY TWOPARTS BACK
    if (accessory && accessory.tags.includes("twoParts")) {
        layers = addLayer(layers, accessory, '_Back');
    }

    // ACCESSORY - ONBACK
    if (accessory && accessory.tags.includes("onBack")) {
        layers = addLayer(layers, accessory);
    }

    // HAND
    if (hand && hand.tags.includes("onBack")) {
        if (hand.tags.includes("skin")) {
            layers.push({
                pattern: `Colors/SkinColors/Old/${skin.name}`,
                src: `Hand/${hand.name}_S`,
            });
        }

        layers = addLayer(layers, hand);
    }

    // HAT (BACK)
    if ((!bodysuit || bodysuit.name === "Empty") && hat && hat.tags.includes("twoParts")) {
        layers = addLayer(layers, hat, '_Back');
    }

    // grey base skin so something renders no matter what
    if((!skin || skin.name === "Empty")){
        layers.push({ src: `Body/Base_Merged_BW` });
    }

    // SKIN (BASE)
    if (skin && skin.name !== "Empty") {
        layers = addSkinLayer(layers, skin, tattoo);
    }

    // Tattoo
    if (tattoo && !tattoo.tags.includes("bodyPaint")) {
        layers = addLayer(layers, tattoo);
    }

    // HAIR (BACK)
    if ((!bodysuit || bodysuit.name === "Empty") && (!hat || hat.name !== "FLS Balaclava" || hat.name !== "FLS Balaclava (Shop)") && hairstyle && hairstyle.parts > 1) {
        layers = addLayer(layers, hairstyle, '_Back');
    }

    // UNDERGARMENT
    if ((!outfit || outfit.name === "Empty") && (!bodysuit || bodysuit.name === "Empty")) {
        
        if (!undergarment || undergarment.name === "Empty") {
            undergarment.name = "Frilly Bra";
            undergarment.colors = 1;
            undergarment.origin_id = 0;
            undergarment.colorsApplied = ["HunnysPurple1"];
        }

        layers = addLayer(layers, undergarment);
    }

    // BACKPACK TWOSIDES BACK (ACCESSORY)
    if (accessory && accessory.tags.includes("backpack") && accessory.tags.includes("twoSides")) {
        layers = addLayer(layers, accessory, '_Back');
    }

    // BACKPACK STRAPS RIGHT (ACCESSORY)
    if (accessory && accessory.tags.includes("backpack")) {
        if (accessory.tags.includes("ownStripes")) {
            layers = addLayer(layers, accessory, '_Straps_Right');
        } else {
            for (let i = 1; i <= 2; i++) {
                layers.push({
                    pattern: `Colors/ClothingAndHair/Solid/${accessory.colorsApplied[i - 1]}`,
                    src: `Accessory/BackpackStraps/BackpackStrap_Right_C${i}`,
                });
            }

            layers.push({ src: `Accessory/BackpackStraps/BackpackStrap_Right_L` });
        }
    }

    // FACE STICKERS
    if (facesticker) {
        layers = addLayer(layers, facesticker);
    }

    // EYEBROWS
    if (eyebrows) {
        layers = addLayer(layers, eyebrows);
    }

    // EYE LEFT
    if (eyes) {
        layers = addLayer(layers, eyes, '_Left');
    }

    // ACCESSORY (BACKPACK)
    if (accessory && accessory.tags.includes("backpack")) {
        if (accessory.tags.includes("twoSides")) {
            layers = addLayer(layers, accessory, '_Front');
        } else {
            layers = addLayer(layers, accessory);
        }
    }

    // ACCESSORY - ONBODY (NECKS)
    if (accessory && accessory.tags.includes("onBody")) {
        layers = addLayer(layers, accessory);
    }

    // BODYSUIT
    if (bodysuit && bodysuit.name !== "Empty") {
        layers = addLayer(layers, bodysuit);
    }

    // OUTFIT
    if ((!bodysuit || bodysuit.name === "Empty") && outfit) {
        if (outfit.tags.includes("skin")) {
            layers.push({
                pattern: `Colors/SkinColors/Old/${skin.name}`,
                src: `Outfit/${outfit.name}_S`,
            });
        }

        layers = addLayer(layers, outfit);
    }
    
    // ACCESSORY (DEFAULT)
    if (
        accessory &&
        !accessory.tags.includes("onTop") &&
        !accessory.tags.includes("onBack") &&
        !accessory.tags.includes("twoParts") &&
        !accessory.tags.includes("onBody") &&
        !accessory.tags.includes("companion") &&
        !accessory.tags.includes("glasses") &&
        !accessory.tags.includes("backpack")
    ) {
        layers = addLayer(layers, accessory);
    }

    // BACKPACK STRAPS LEFT (ACCESSORY)
    if (accessory && accessory.tags.includes("backpack")) {
        if (accessory.tags.includes("ownStripes")) {
            layers = addLayer(layers, accessory, '_Straps_Left');
        } else {
            for (let i = 1; i <= 2; i++) {
                layers.push({
                    pattern: `Colors/ClothingAndHair/Solid/${accessory.colorsApplied[i - 1]}`,
                    src: `Accessory/BackpackStraps/BackpackStrap_Left_C${i}`,
                });
            }
            layers.push({ src: `Accessory/BackpackStraps/BackpackStrap_Left_L` });
        }
    }

    // EYE RIGHT
    if (eyes) {
        layers = addLayer(layers, eyes, '_Right');
    }

    // HAIR (FRONT / DEFAULT)
    if ((!bodysuit || bodysuit.name === "Empty") && (!hat || hat.name !== "FLS Balaclava" || hat.name !== "FLS Balaclava (Shop)") && hairstyle) {
        let front = "";
        
        if (hairstyle.parts > 1) {
            front = "_Front";
        }

            layers = addLayer(layers, hairstyle, front);
        }

    // ACCESSORY - (EARRINGS)
    if (accessory && accessory.tags.includes("earrings")) {
        layers = addLayer(layers, accessory);
    }

    // HAT (FRONT / DEFAULT)
    if ((!bodysuit || bodysuit.name === "Empty") && hat) {
        let front = "";

        if (hat.tags.includes("twoParts")) {
            front = "_Front";
        }

        layers = addLayer(layers, hat, front);
    }

    // ACCESSORY (ON TOP)
    if (accessory && accessory.tags.includes("onTop")) {
        layers = addLayer(layers, accessory);
    }

    // PIERCING DEFAULT
    if (piercing && piercing.name !== "SeptumPiercing") {
        layers = addLayer(layers, piercing);
    }

    // MOUTH
    if (mouth) {
        layers = addLayer(layers, mouth);
    }

    // PIERCING (SEPTUM)
    if (piercing && piercing.name === "SeptumPiercing" || "Septum Ring") {
        layers = addLayer(layers, piercing);
    }

    // Special handling for Football Helmet to place it above Eyes and Mouth
    if (hat && hat.name === "Football Helmet") {
        layers = addLayer(layers, hat);
    }
    
    // ACCESSORY - GLASSES
    if (accessory && accessory.tags.includes('glasses')) {
        layers = addLayer(layers, accessory);
    }

    // HAND
    if (hand && !hand.tags.includes("onBack")) {
        if (hand.tags.includes("skin")) {
            layers.push({
                pattern: `Colors/SkinColors/Old/${skin.name}`,
                src: `Hand/${hand.name}_S`,
            });
        }

        layers = addLayer(layers, hand);
    }

    // ACCESSORY TWOPARTS FRONT
    if (accessory && accessory.tags.includes("twoParts")) {
        layers = addLayer(layers, accessory, '_Front');
    }

    // ACCESSORY COMPANIONS
    if (accessory && accessory.tags.includes("companion")) {
        layers = addLayer(layers, accessory);
    }

    // FRAME
    if (frame) {
        layers = addLayer(layers, frame);
    }



    // Add FLS Laser C2 layers above all others if the eyes trait is FLS Laser
if (eyes && eyes.name === "FLS Laser") {
    layers.push({
        pattern: `Colors/ClothingAndHair/Solid/${eyes.colorsApplied[1]}`,
        src: `Eyes/${eyes.name}_Left_C2`
    });
    layers.push({
        pattern: `Colors/ClothingAndHair/Solid/${eyes.colorsApplied[1]}`,
        src: `Eyes/${eyes.name}_Right_C2`
    });
}

// Add FLS Laser C2 layers above all others if the eyes trait is FLS Laser
if (eyes && eyes.name === "FLS Laser (Shop)") {
    layers.push({
        pattern: `Colors/ClothingAndHair/Solid/${eyes.colorsApplied[1]}`,
        src: `Eyes/${eyes.name}_Left_C2`
    });
    layers.push({
        pattern: `Colors/ClothingAndHair/Solid/${eyes.colorsApplied[1]}`,
        src: `Eyes/${eyes.name}_Right_C2`
    });
}

    // add base path and file extensions
    for (const layer of layers) {
        layer.src = `${layersPath}${layer.src}${fileExtension}`;
        if (layer.pattern) {
            layer.pattern = `${layersPath}${layer.pattern}${fileExtension}`;
        }
    }

    return layers;
}
