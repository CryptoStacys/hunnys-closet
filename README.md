# staging-hunnys-closet-2

Explanation of some major areas of codebase:

Backend:
@api-service.js
This service handles API calls and image loading. Key functions include:

- getDataById: Fetches data for a specific token ID.
- loadAllImages: Loads images for all layers.
- getImageData: Retrieves image data from a specific path.
- saveChangedToken: Saves changes made to a token.
  The service primarily interacts with the WordPress backend at closetservices.hunnysnft.com.
  @chain-service.js
  This service interacts with blockchain contracts. Key features:
- Supports multiple collections (Hunnys 10k, Hunnys OG, Hunnys Seasonal, etc.).
- Uses Web3.js to interact with Ethereum and Polygon networks.
- getCollectionTokens: Retrieves tokens owned by a wallet for a specific collection.
- requestContract and requestSeasonsContract: Handle different contract interactions.
  @layer-service.js
  This service manages the layering of NFT traits. Key functions:
- createLayers: Builds the layer structure for a token.
- addLayer: Adds a specific layer to the structure.
- addSkinLayer: Handles the addition of skin layers, including tattoos.
- It processes various traits like background, skin, eyebrows, hat, eyes, etc., in a specific order to create the final NFT image.
  @token-service.js
  This service handles token data processing and trait management. Key functions:
- getCollectionData: Retrieves data for a specific collection.
- getSelectiveTraits and getAllTraits: Process traits based on collection type.
- mapTokenIds: Maps token IDs for collections with ID mapping.
- arregateResponse: Aggregates data from multiple collections.
- getStaticImageUrl and getDynamicImageUrl: Handle different types of image URLs.
- It also manages the reward status based on the number of Hunnys tokens owned.
- These services work together to handle the complex logic of NFT management, including blockchain interactions, trait layering, and data processing. They support multiple collections with different structures and requirements.
  @collections-config.json
  To add a new contract to the file and update the related services, follow these steps:
  Update @collections-config.json:

Add a new object to the "collections" array with the following structure:

    "collections" : [
        {
            "name": "Hunnys 10k",
            "originID" : 1,
            "contract" : "0x5DFEB75aBae11b138A16583E03A2bE17740EADeD",
            "tokenConfigPath": "hunnys-10k-token.json",
            "traitsConfigPath": "hunnys-10k-traits.json",
            "idMapping": false,
            "hasStaticMetaPath": true,
            "meta_url" : "https://hunnys.s3.us-east-2.amazonaws.com/data/",
            "chain": "mainnet"
        },
        {
            "name": "Hunnys OG",
            "originID" : 2,
            "contract" : "0x64Bd44Df5590CFE4F0395B05fa0e6F096734bb77",
            "tokenConfigPath": "hunnys-ogs-token.json",
            "traitsConfigPath": "hunnys-ogs-traits.json",
            "idMapping": true,
            "hasStaticMetaPath": true,
            "meta_url" : "https://stacys-v2.s3.us-east-2.amazonaws.com/hunnys-ogs/",
            "chain": "mainnet"
        },
        {
            "name": "Hunnys Seasonal",
            "originID" : 3,
            "contract" : "0x43668e306dba9172824524fd2c0c6924e710ea5b",
            "tokenConfigPath": "hunnys-season-token.json",
            "traitsConfigPath": "hunnys-season-traits.json",
            "idMapping": false,
            "hasStaticMetaPath": false,
            "meta_url" : "",
            "chain": "polygon"
        },
        {
            "name": "Hunnys Stacys",
            "originID" : 5,
            "contract" : "0x21aC5f6c96cCB174115b18318e3e340237A55606",
            "tokenConfigPath": "hunnys-stacys-token.json",
            "traitsConfigPath": "hunnys-stacys-traits.json",
            "idMapping": true,
            "hasStaticMetaPath": true,
            "meta_url" : "https://stacys-v2.s3.us-east-2.amazonaws.com/stacys/",
            "chain": "mainnet"
        },
        {
            "name": "Hunnys 10k All Holders",
            "originID" : 6,
            "contract" : "0x5DFEB75aBae11b138A16583E03A2bE17740EADeD",
            "tokenConfigPath": "hunnys-10k-all-holders-token.json",
            "traitsConfigPath": "hunnys-10k-all-holders-traits.json",
            "idMapping": false,
            "hasStaticMetaPath": true,
            "meta_url" : "https://hunnys.s3.us-east-2.amazonaws.com/data/",
            "chain": "mainnet"
        },
        {
            "name": "Hunnys Closet Shop",
            "originID" : 7,
            "contract" : "0x0b54fbd0139a2da92ff41fd9ed56adcf89d87001",
            "tokenConfigPath": "hunnys-closet-shop-token.json",
            "traitsConfigPath": "hunnys-closet-shop-traits.json",
            "idMapping": false,
            "hasStaticMetaPath": false,
            "meta_url" : "",
            "chain": "polygon"
        },
        {
            "name": "Fame Lady Society",
            "originID" : 8,
            "contract" : "0x6cf4328f1ea83b5d592474f9fcdc714faafd1574",
            "tokenConfigPath": "fame-lady-society-token.json",
            "traitsConfigPath": "fame-lady-society-traits.json",
            "idMapping": false,
            "hasStaticMetaPath": true,
            "meta_url" : "https://hunnys.s3.us-east-2.amazonaws.com/data/",
            "chain": "mainnet"
        },
        {
            "name": "New Hunnys Closet Shop",
            "originID" : 9,
            "contract" : "0x11bc733e719198e2b3746f6841d2818ca87af6da",
            "tokenConfigPath": "new-hunnys-closet-shop-token.json",
            "traitsConfigPath": "new-hunnys-closet-shop-traits.json",
            "idMapping": false,
            "hasStaticMetaPath": false,
            "meta_url" : "",
            "chain": "polygon"
        },
        {
            "name": "Metavixens",
            "originID" : 10,
            "contract" : "0xe1c7be9a91bb376acbb7c205f1f733a3468153b4",
            "tokenConfigPath": "metavixens-token.json",
            "traitsConfigPath": "metavixens-traits.json",
            "idMapping": false,
            "hasStaticMetaPath": true,
            "meta_url" : "https://hunnys.s3.us-east-2.amazonaws.com/data/",
            "chain": "polygon"
        }
    ]

For example, to add a new collection called "New Collection":

    {
        "name": "New Collection",
        "originID": 11,
        "contract": "0x1234567890123456789012345678901234567890",
        "tokenConfigPath": "new-collection-token.json",
        "traitsConfigPath": "new-collection-traits.json",
        "idMapping": false,
        "hasStaticMetaPath": true,
        "meta_url": "https://example.com/metadata/",
        "chain": "mainnet"
    }

Update @chain-service.js:
Add a new case to the switch statement in the getCollectionData function:

            switch (collection.config.originID) {
                case 1:
                    //   "name": "Hunnys 10k",
                    result = TokenService.getSelectiveTraits(collection.config, collection.tokens, configTokenData, configTraitsData, defaultConfigTraitsData);
                    break;
                case 2:
                    //  "name": "Hunnys OG",
                    result = TokenService.getAllTraits(collection.config, collection.tokens, configTokenData, configTraitsData);
                    break;
                case 3:
                    //    "name": "Hunnys Seasonal",
                    result = TokenService.getSelectiveTraits(collection.config, collection.tokens, configTokenData, configTraitsData, defaultConfigTraitsData);
                    break;
                case 5:
                    // "name": "Hunnys Stacys",
                    result = TokenService.getAllTraits(collection.config, collection.tokens, configTokenData, configTraitsData);
                    break;
                case 6:
                    //   "name": "Hunnys 10k All Holders",
                    result = TokenService.getAllTraits(collection.config, collection.tokens, configTokenData, configTraitsData);
                    break;
                case 7:
                    //  "name": "Old Hunnys Closet Shop",
                    result = TokenService.getSelectiveTraits(collection.config, collection.tokens, configTokenData, configTraitsData, defaultConfigTraitsData);
                    break;
                case 8:
                    //   "name": "Fame Lady Society",
                    result = TokenService.getAllTraits(collection.config, collection.tokens, configTokenData, configTraitsData);
                    break;
                case 9:
                    //  "name": "New Hunnys Closet Shop",
                    result = TokenService.getSelectiveTraits(collection.config, collection.tokens, configTokenData, configTraitsData, defaultConfigTraitsData);
                    break;
                case 10:
                    //   "name": "MetaVixens",
                    result = TokenService.getAllTraits(collection.config, collection.tokens, configTokenData, configTraitsData);
                    break;
                default:
                    break;
            }

Add the following case:

                case 11:
                // "name": "New Collection",
                result = TokenService.getAllTraits(collection.config, collection.tokens, configTokenData, configTraitsData);
                break;

Also, update the getAllCollectionData function:

            formattedUrl = path.replace("ipfs://", "https://rarity.mypinata.cloud/ipfs/");
        } else if(path.includes('/ipfs/')) {
            formattedUrl = path.split("/ipfs/").pop();
            formattedUrl = "https://rarity.mypinata.cloud/ipfs/" + formattedUrl;
        }

        return formattedUrl;
    },
    filterImageData: function(tokens) {
        for (let i = 0; i < tokens.length; i++) {
            let url = tokens[i].data;
            if(tokens[i].data.includes('"image"')){
                url = tokens[i].data.split('"image":"').pop().split('",')[0];
            }

            tokens[i].data = url;
        }

        return tokens;
    },
    filterMappedMeta: function(config, tokens) {
        for (let i = 0; i < tokens.length; i++) {
            let mappedId;
            if(config.hasStaticMetaPath){
                mappedId = tokens[i].data.original_token_id;
            } else {
                mappedId = tokens[i].data.split('"original_token_id":"').pop().split('",')[0];
            }

            tokens[i].mappedId = mappedId;
        }

        return tokens;
    },
    arregateTokenData: function(config, tokens) {
        return new Promise(async function (resolve) {
            let result = [];

            if(config.hasStaticMetaPath) {
                result = await TokenService.getStaticImageUrl(tokens, config)
            } else {
                result = await TokenService.getDynamicImageUrl(tokens)
            }

            if(config.idMapping) {
                result = await TokenService.mapTokenIds(result, config);
            }

            resolve(result);

Add the following case:

            case 11:
            // "name": "New Collection",
            result = TokenService.getTraits(collection, configTraitsData);
            break;

Update @token-service.js:
Add a new case to the switch statement in the getCollectionTokens function:

            switch (config.originID) {
                case 1:
                 //   "name": "Hunnys 10k",
                    abi = await ChainService.loadAbi(`src/abis/hunnys-10k-abi.json`);
                    tokens = await ChainService.requestContract(config.contract, wallet, abi, infuraUrl);
                    break;
                case 2:
                //  "name": "Hunnys OG",
                    abi = await ChainService.loadAbi(`src/abis/hunnys-ogs-abi.json`);
                    tokens = await ChainService.requestContract(config.contract, wallet, abi, infuraUrl);
                    break;
                case 3:
                //    "name": "Hunnys Seasonal",
                    abi = await ChainService.loadAbi(`src/abis/hunnys-seasons-abi.json`);
                    tokens = await ChainService.requestSeasonsContract(config.contract, wallet, abi, infuraUrl);
                    tokens = await ChainService.arregateMetaPathToToken(tokens, config);
                    break;
                case 5:
                    // "name": "Hunnys Stacys",
                    abi = await ChainService.loadAbi(`src/abis/hunnys-stacys-abi.json`);
                    tokens = await ChainService.requestContract(config.contract, wallet, abi, infuraUrl);
                    break;
                case 6:
                //   "name": "Hunnys 10k All Holders",
                    abi = await ChainService.loadAbi(`src/abis/hunnys-10k-all-holders-abi.json`);
                    tokens = await ChainService.requestContract(config.contract, wallet, abi, infuraUrl);
                    break;
                case 7:
                //  "name": "Hunnys Closet Shop",
                    abi = await ChainService.loadAbi(`src/abis/hunnys-closet-shop-abi.json`);
                    tokens = await ChainService.requestSeasonsContract(config.contract, wallet, abi, infuraUrl);
                    tokens = await ChainService.arregateMetaPathToToken(tokens, config);
                    break;
                case 8:
                //  "name": "Fame Lady Society",
                    abi = await ChainService.loadAbi(`src/abis/fame-lady-society-abi.json`);
                    tokens = await ChainService.requestContract(config.contract, wallet, abi, infuraUrl, config.originID);
                    break;
                case 9:
                //  "name": "Hunnys Closet Shop",

Add the following case:

            case 11:
            // "name": "New Collection",
            abi = await ChainService.loadAbi(`src/abis/new-collection-abi.json`);
            tokens = await ChainService.requestContract(config.contract, wallet, abi, infuraUrl);
            break;

- Create the new ABI file (new-collection-abi.json) in the src/abis/ directory.
- Create the new token config file (new-collection-token.json) in the src/configs/ directory.
- Create the new traits config file (new-collection-traits.json) in the src/configs/ directory.
- These updates will integrate the new collection into the existing system, allowing it to be processed alongside the other collections. The specific implementation (getAllTraits vs getSelectiveTraits) can be adjusted based on the collection's requirements.
  EXAMPLE:
  For @new-collection-token.json:

            [ {
            "tokenId": 1,
            "name": "New Collection Character 1",
            "attributes": [
            {
            "trait_type": "Background",
            "value": "Starry Night"
            },
            {
            "trait_type": "Outfit",
            "value": "Cosmic Suit"
            }
            ],
            "metaPath": "https://newcollection.example.com/metadata/1"
            },
            {
            "tokenId": 2,
            "name": "New Collection Character 2",
            "attributes": [
            {
            "trait_type": "Hair Style",
            "value": "Neon Mohawk"
            },
            {
            "trait_type": "Accessory",
            "value": "Holographic Visor"
            }
            ],
            "metaPath": "https://newcollection.example.com/metadata/2"
            },
            {
            "tokenId": 3,
            "name": "New Collection Character 3",
            "attributes": [
            {
            "trait_type": "Skin",
            "value": "Cybernetic"
            },
            {
            "trait_type": "Hand",
            "value": "Plasma Cannon"
            }
            ],
            "metaPath": "https://newcollection.example.com/metadata/3"
            } ]

  For @new-collection-traits.json:

            {
            "attributes": [
            {
            "name": "Background",
            "traits": [
            {
            "name": "Starry Night",
            "colors": 3,
            "rarity": "Uncommon",
            "tags": ["space"],
            "token_id": 1
            },
            {
            "name": "Neon City",
            "colors": 5,
            "rarity": "Rare",
            "tags": ["urban"],
            "token_id": 2
            }
            ]
            },
            {
            "name": "Outfit",
            "traits": [
            {
            "name": "Cosmic Suit",
            "colors": 4,
            "rarity": "Epic",
            "tags": ["space", "futuristic"],
            "token_id": 1
            },
            {
            "name": "Cyber Armor",
            "colors": 3,
            "rarity": "Legendary",
            "tags": ["tech", "protection"],
            "token_id": 3
            }
            ]
            },
            {
            "name": "Hair Style",
            "traits": [
            {
            "name": "Neon Mohawk",
            "colors": 2,
            "rarity": "Rare",
            "tags": ["punk"],
            "token_id": 2
            }
            ]
            },
            {
            "name": "Accessory",
            "traits": [
            {
            "name": "Holographic Visor",
            "colors": 1,
            "rarity": "Epic",
            "tags": ["tech", "glasses"],
            "token_id": 2
            },
            {
            "name": "Plasma Cannon",
            "colors": 2,
            "rarity": "Legendary",
            "tags": ["weapon", "tech"],
            "token_id": 3
            }
            ]
            },
            {
            "name": "Skin",
            "traits": [
            {
            "name": "Cybernetic",
            "colors": 3,
            "rarity": "Mythic",
            "tags": ["tech", "augmented"],
            "token_id": 3
            }
            ]
            }
            ]
            }

## Layer Service

The LayerService.createLayers function is responsible for building the layers of an NFT in a specific order. Each attribute (like background, skin, eyebrows, etc.) is added to the layers array in a particular sequence to ensure proper rendering.
To update layering for certain attributes:
Find the section for the attribute you want to update in the createLayers function.
Move the code block for that attribute to a different position in the function to change its layering order.
For example, if you wanted to move the "ACCESSORY - GLASSES" layer above the "HAND" layer, you would move this block:

        // ACCESSORY - GLASSES
        if (accessory && accessory.tags.includes('glasses')) {
            layers = LayerService.addLayer(layers, accessory);
        }

to a position before the "HAND" section (around line 254).
To make exceptions for certain items, you can add conditional statements within the attribute's section. There are several examples of this in the code:

Example of making a special exception for a single item, like the Football Helmet:

        // Special handling for Football Helmet to place it above Eyes and Mouth
        if (hat && hat.name === "Football Helmet") {
        layers = LayerService.addLayer(layers, hat);
        }

Exception for Backpack accessories:

        // ACCESSORY (BACKPACK)
        if (accessory && accessory.tags.includes("backpack")) {
            if (accessory.tags.includes("twoSides")) {
                layers = LayerService.addLayer(layers, accessory, '_Front');
            } else {
                layers = LayerService.addLayer(layers, accessory);
            }
        }

This handles backpack accessories differently based on whether they have two sides or not.

Exception for Skin color in Hand attribute:

            if (hand.tags.includes("skin")) {
                layers.push({
                    pattern: `Colors/SkinColors/Old/${skin.name}`,
                    src: `Hand/${hand.name}_S`,
                });
            }

This adds a skin color layer for hands that include the "skin" tag.
To add a new exception, you would follow a similar pattern. For example, if you wanted to add an exception for a new hat type called "Special Hat":

    // HAT (FRONT / DEFAULT)
    if ((!bodysuit || bodysuit.name === "Empty") && hat) {
    let front = "";

    if (hat.tags.includes("twoParts")) {
        front = "_Front";
    }

    // Exception for Special Hat
    if (hat.name === "Special Hat") {
        // Add special handling here
        layers.push({ src: `Hat/SpecialHat_Unique` });
    } else {
        layers = LayerService.addLayer(layers, hat, front);
    }}

## DollEditor

The DollEditor is a key component that handles the visual editing interface for NFTs. It manages:

1. Canvas Setup and Rendering:

- Initializes the canvas for NFT editing
- Handles zoom and pan controls
- Manages layer visibility and ordering

2. Color Management:

- Processes color changes for different traits
- Handles color picker interface
- Maintains color history and presets

3. Layer Controls:

- Toggle layer visibility
- Reorder layers
- Handle layer-specific properties

4. Special Features:

- Tattoo placement and scaling
- Pattern overlays
- Special trait combinations

### Key Functions:

- `initializeCanvas`: Sets up the editing canvas with proper dimensions and settings
- `updateTraitColors`: Handles color updates for specific traits
- `handleLayerToggle`: Manages layer visibility states
- `saveEdits`: Processes and saves changes to the NFT

## Dashboard Component

The Dashboard serves as the main navigation hub for the application, managing different views and user states. Located at `frontend/src/components/Dashboard/Dashboard.tsx`, it handles:

1. View Management:

- Controls which view is currently displayed
- Manages URL hash-based navigation
- Maintains view state using Jotai atoms

2. Available Views:

- Profile
- Inventory
- Shop
- Achievements
- News
- Events

### Common Customizations:

1.  Adding a New View:

        // 1. Import your new view component
        import NewView from '../DashboardViews/NewView';
        // 2. Add to renderView switch statement
        case 'newview':
        return <NewView />;

2.  Modifying Navigation:

        // In ProfileButtons component
        const navigationItems = [
        { view: 'profile', label: 'Profile' },
        { view: 'inventory', label: 'Inventory' },
        // Add new navigation item
        { view: 'newview', label: 'New View' }
        ];

3.  Updating Layout:

        // Modify the main container classes
        <div className="xs:p-0 xs:mb-24 md:p-4 max-w-7xl mx-auto md:my-8
        // Add new classes here
        new-custom-class">

4.  Adding View-Specific Logic:

        // Add new state or effects
        const [viewSpecificState, setViewSpecificState] = useState(null);
        useEffect(() => {
        // Handle view-specific initialization
        if (currentView === 'newview') {
        // Initialize view-specific logic
        }
        }, [currentView]);

### State Management:

The Dashboard uses Jotai for state management. To add new state:

        // In data/store.ts
        export const newViewAtom = atom({
        // view-specific state
        });
        // In Dashboard.tsx
        const [newViewState, setNewViewState] = useAtom(newViewAtom);

### URL Hash Navigation:

The component listens for hash changes in the URL to update the current view. Format:
`https://closet.hunnys.io/#viewname`

To add new hash navigation:

1. Update the hash when changing views
2. Handle the new hash in the onHashChange listener
