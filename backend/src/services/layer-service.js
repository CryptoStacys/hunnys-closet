const LayerService = {
    createLayers: function (token, renderBackgroud = true) {
        let layers = [];

        const background = token.find((ele) => { return ele.attribute === 'Background' });
        const skin = token.find((ele) => { return ele.attribute === 'Skin' });
        const eyebrows = token.find((ele) => { return ele.attribute === 'Eyebrows' });
        const hat = token.find((ele) => { return ele.attribute === 'Hat' });
        const eyes = token.find((ele) => { return ele.attribute === 'Eyes' });
        const facesticker = token.find((ele) => { return ele.attribute === 'Face Sticker' });
        const piercing = token.find((ele) => { return ele.attribute === 'Piercing' });
        const mouth = token.find((ele) => { return ele.attribute === 'Mouth' });
        const hairstyle = token.find((ele) => { return ele.attribute === 'Hair Style' });
        const accessory = token.find((ele) => { return ele.attribute === 'Accessory' });
        const outfit = token.find((ele) => { return ele.attribute === 'Outfit' });
        const hand = token.find((ele) => { return ele.attribute === 'Hand' });
        const tattoo = token.find((ele) => { return ele.attribute === 'Tattoo' });
        const bodysuit = token.find((ele) => { return ele.attribute === 'Bodysuit' });
        const frame = token.find((ele) => { return ele.attribute === 'Frame' });
        const undergarment = token.find((ele) => { return ele.attribute === 'Undergarment' });

        if (token.length < 1) {
            return [];
        }

        // layers.push({ src: `Background/SnowWhite` });

        // BACKGROUND
        if (background) {
            layers = LayerService.addLayer(layers, background);
        }
    
        // ACCESSORY TWOPARTS BACK
        if (accessory && accessory.tags.includes("twoParts")) {
            layers = LayerService.addLayer(layers, accessory, '_Back');
        }
    
        // ACCESSORY - ONBACK
        if (accessory && accessory.tags.includes("onBack")) {
            layers = LayerService.addLayer(layers, accessory);
        }

        // HAND - ONBACK
        if (hand && hand.tags.includes("onBack")) {
            if (hand.tags.includes("skin")) {
                layers.push({
                    pattern: `Colors/SkinColors/Old/${skin.name}`,
                    src: `Hand/${hand.name}_S`,
                });
            }
    
            layers = LayerService.addLayer(layers, hand);
        }
    
        // HAT (BACK)
        if ((!bodysuit || bodysuit.name === "Empty") && hat && hat.tags.includes("twoParts")) {
            layers = LayerService.addLayer(layers, hat, '_Back');
        }
    
        // grey base skin so something renders no matter what
        // layers.push({ src: `Body/Base_Merged_BW` });
    
        // SKIN (BASE)
        if (skin && skin.name !== "Empty") {
            layers = LayerService.addSkinLayer(layers, skin, tattoo);
        }
    
        // Tattoo
        if (tattoo && !tattoo.tags.includes("bodyPaint")) {
            layers = LayerService.addLayer(layers, tattoo);
        }
    
        // HAIR (BACK)
        if ((!bodysuit || bodysuit.name === "Empty") && (!hat || hat.name !== "FLS Balaclava" || hat.name !== "FLS Balaclava (Shop)") && hairstyle && hairstyle.parts > 1) {
            layers = LayerService.addLayer(layers, hairstyle, '_Back');
        }
    
        // BACKPACK TWOSIDES BACK (ACCESSORY)
        if (accessory && accessory.tags.includes("backpack") && accessory.tags.includes("twoSides")) {
            layers = LayerService.addLayer(layers, accessory, '_Back');
        }
    
        // BACKPACK STRAPS RIGHT (ACCESSORY)
        if (accessory && accessory.tags.includes("backpack")) {
            if (accessory.tags.includes("ownStripes")) {
                layers = LayerService.addLayer(layers, accessory, '_Straps_Right');
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
            layers = LayerService.addLayer(layers, facesticker);
        }
    
        // EYEBROWS
        if (eyebrows) {
            layers = LayerService.addLayer(layers, eyebrows);
        }
    
        // EYE LEFT
        if (eyes) {
            layers = LayerService.addLayer(layers, eyes, '_Left');
        }
    
        // ACCESSORY (BACKPACK)
        if (accessory && accessory.tags.includes("backpack")) {
            if (accessory.tags.includes("twoSides")) {
                layers = LayerService.addLayer(layers, accessory, '_Front');
            } else {
                layers = LayerService.addLayer(layers, accessory);
            }
        }
    
        // ACCESSORY - ONBODY (NECKS)
        if (accessory && accessory.tags.includes("onBody")) {
            layers = LayerService.addLayer(layers, accessory);
        }
    
        // BODYSUIT
        if (bodysuit && bodysuit.name !== "Empty") {
            layers = LayerService.addLayer(layers, bodysuit);
        }
    
        // OUTFIT
        if ((!bodysuit || bodysuit.name === "Empty") && outfit) {
            layers = LayerService.addLayer(layers, outfit);
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
            layers = LayerService.addLayer(layers, accessory);
        }
    
        // BACKPACK STRAPS LEFT (ACCESSORY)
        if (accessory && accessory.tags.includes("backpack")) {
            if (accessory.tags.includes("ownStripes")) {
                layers = LayerService.addLayer(layers, accessory, '_Straps_Left');
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
    
        // HAIR (FRONT / DEFAULT)
        if ((!bodysuit || bodysuit.name === "Empty") && (!hat || hat.name !== "FLS Balaclava" || hat.name !== "FLS Balaclava (Shop)") && hairstyle) {
            let front = "";
            
            if (hairstyle.parts > 1) {
                front = "_Front";
            }
    
                layers = LayerService.addLayer(layers, hairstyle, front);
            }

        // ACCESSORY - (EARRINGS)
        if (accessory && accessory.tags.includes("earrings")) {
            layers = LayerService.addLayer(layers, accessory);
        }
    
        // HAT (FRONT / DEFAULT)
        if ((!bodysuit || bodysuit.name === "Empty") && hat) {
            let front = "";
    
            if (hat.tags.includes("twoParts")) {
                front = "_Front";
            }
    
            layers = LayerService.addLayer(layers, hat, front);
        }
    
        // ACCESSORY (ON TOP)
        if (accessory && accessory.tags.includes("onTop")) {
            layers = LayerService.addLayer(layers, accessory);
        }

        // UNDERGARMENT (ON TOP)
        if (undergarment && undergarment.tags.includes("onTop")) {
            layers = LayerService.addLayer(layers, undergarment);
        }
    
        // PIERCING DEFAULT
        if (piercing && piercing.name !== "SeptumPiercing") {
            layers = LayerService.addLayer(layers, piercing);
        }
    
        // MOUTH
        if (mouth) {
            layers = LayerService.addLayer(layers, mouth);
        }
    
        // PIERCING (SEPTUM)
        if (piercing && piercing.name === "SeptumPiercing" || "Septum Ring") {
            layers = LayerService.addLayer(layers, piercing);
        }
    
        // EYE RIGHT
        if (eyes) {
            layers = LayerService.addLayer(layers, eyes, '_Right');
        }
    
        // ACCESSORY - GLASSES
        if (accessory && accessory.tags.includes('glasses')) {
            layers = LayerService.addLayer(layers, accessory);
        }

        // UNDERGARMENT
        if ((!outfit || outfit.name === "Empty") && (!bodysuit || bodysuit.name === "Empty")) {
            if (!undergarment || undergarment.name === "Empty") {
                undergarment.name = "Frilly Bra";
                undergarment.colors = 1;
                undergarment.origin_id = 0;
                undergarment.colorsApplied = ["HunnysPurple1"];
            }
    
            layers = LayerService.addLayer(layers, undergarment);

        }
    
        // HAND
        if (hand && !hand.tags.includes("onBack")) {
            if (hand.tags.includes("skin")) {
                layers.push({
                    pattern: `Colors/SkinColors/Old/${skin.name}`,
                    src: `Hand/${hand.name}_S`,
                });
            }
    
            layers = LayerService.addLayer(layers, hand);
        }
    
        // ACCESSORY TWOPARTS FRONT
        if (accessory && accessory.tags.includes("twoParts")) {
            layers = LayerService.addLayer(layers, accessory, '_Front');
        }
    
        // ACCESSORY COMPANIONS
        if (accessory && accessory.tags.includes("companion")) {
            layers = LayerService.addLayer(layers, accessory);
        }
    
        // FRAME
        if (frame) {
            layers = LayerService.addLayer(layers, frame);
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
        // for (const layer of layers) {
        //     layer.src = `${layersPath}${layer.src}${fileExtension}`;
        //     if (layer.pattern) {
        //         layer.pattern = `${layersPath}${layer.pattern}${fileExtension}`;
        //     }
        // }

        return layers;
    },
    addLayer: function(layers, trait, traitExtension = '') {
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
    },
    addSkinLayer: function(layers, trait, tattoTrait) {
        if(trait.tags.includes("ownBase")) {
            layers.push({
                pattern: `Colors/SkinColors/Old/${trait.name}`,
                src: `Base/${trait.name}Base_C1`,
            });

            if(tattoTrait && tattoTrait.tags.includes('bodyPaint')) {
                layers = LayerService.addLayer(layers, tattoTrait);
            }

            layers.push({ src: `Base/${trait.name}Base_L` });
        } else {
            layers.push({
                pattern: `Colors/SkinColors/Old/${trait.name}`,
                src: `Base/Base_C1`,
            });

            if(tattoTrait && tattoTrait.tags.includes('bodyPaint')) {
                layers = LayerService.addLayer(layers, tattoTrait);
            }

            layers.push({ src: `Base/Base_L` });
        }
        
        return layers;
    }


};

export default LayerService;