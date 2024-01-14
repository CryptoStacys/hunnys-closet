export type Trait = {
  isOwned: boolean;
  isEligibleForMinting: any;
  id: number;
  origin_id: number;
  name: string;
  attribute: string;
  tags?: string[];
  token_id?: string;
  colors: any;
  rarity?: string;
  colorsApplied: string[];
  mintPrice?: ethers.BigNumber | null; // Add this line
};

export type User = {
  address: string;
  dollys: Dolly[];
  colors: string[];
  traits: any[];
  skin_colors: string[];
  tokens: Token[];
  hideSaveChangesModal: boolean;
};

type OwnedTraitsResponse = {
  traits: Trait[];
};

export type Dolly = {
  token_id: string;
  attributes: Attribute[];
};

export type Attribute = {
  name: string;
  rarity: string;
  baseColor: string[];
  colors: any[];
  colorsApplied: string[];
  tags: string[];
  token_id: string;
};

export type Layer = {
  src?: string;
  color?: Color;
  pattern?: string;
  mask?: string;
};

export type Color = {
  r: number;
  g: number;
  b: number;
};

export type Token = {
  trait_type: string;
  name: string;
  colors?: Color[];
  layers?: number;
  token_id?: string | number;
  origin_id?: string | number;
  origin_name?: string;
  img_url?: string;
  attributes?: Attributes;
  tags?: Array<string>;
};
