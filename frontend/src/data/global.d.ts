export type Trait = {
  isDiscounted?: boolean | any;
  isOwned?: boolean | any;
  isEligibleForMinting?: boolean | string[]; // Updated to be optional
  mintPrice?: ethers.BigNumber | null; // Updated to be optional
  id: number;
  origin_id: number;
  origin_name?: string;
  name: string;
  attribute: string;
  tags?: string[];
  token_id?: string;
  colors: any;
  rarity?: string;
  colorsApplied: string[];
};

export type UUID = string;

export type Achievement = {
  id: string; // Unique identifier for each achievement
  challenge: string;
  description: string;
  descriptionBullets?: string;
  cupcakePoints: number;
  cupcakePointsReward?: string;
  achievementsReward1?: string;
  achievementsReward2?: string;
  achievementsReward3?: string;
  achievementsReward4?: string;
  achievementsReward5?: string;
  achievementsReward6?: string;
  title?: string;
  eligibilityCriteria?: (user: User) => boolean;
}

export type Levels = {
  src?: string;
  id: string;
  levelsName: string;
  description: string;
  levelsReward1: string;
  levelsReward2?: string;
  levelsReward3?: string;
  levelsReward4?: string;
  levelsReward5?: string;
  levelsReward6?: string;
  title: string;
}

export type ApiResponse = {
  success: boolean;
  data: User;
};


export type User = {
  achievements?: any,
  wallet: any;
  dollyCount: number;
  UUID: string;
  address: string;
  dollys: Dolly[];
  colors: string[];
  traits: any[];
  skin_colors: string[];
  tokens: Token[];
  hideSaveChangesModal: boolean;
  profile_name: string;
  profile_image_url: string;
  tier: string;
  titles: string[];
  wallet_type: string;
  token?: string;
  cupcake_points: number;
  level: number;
  birthday_month?: string;
  birthday_day?: string;
  twitter_handle?: string;
  discord_handle?: string;
  bunny_club?: boolean;
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

type UserOwnedTraits = {
  [key: string]: boolean;
};

export type Token = {
  trait_type: string;
  isOwned?: boolean | any;
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
