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
  img_url?: string;
};

export type NftItem = {
  id: string;
  image: string;
  name: string;
  attribute?: string;
  parentImage?: string;
  parentName?: string;
  isOwned?: boolean;
  buttonURL?: string;
};

export type UUID = string;

export type Achievement = {
  id: string; // Unique identifier for each achievement
  challenge: string;
  description: string;
  descriptionBullets?: string;
  cupcakePoints: number;
  cupcakePointsReward?: string;
  achievementsCover?: string;
  achievementsReward1?: string;
  achievementsReward2?: string;
  achievementsReward3?: string;
  achievementsReward4?: string;
  achievementsReward5?: string;
  achievementsReward6?: string;
  callToAction?: string;
  title?: string;
  eligibilityCriteria?: (user: User) => boolean;
  freeClaimTokenId?: number;
}

export type Dailys = {
  id: string; // Unique identifier for each achievement
  challenge: string;
  description: string;
  descriptionBullets?: string;
  cupcakePoints: number;
  cupcakePointsReward?: string;
  dailysReward1?: string;
  dailysReward2?: string;
  dailysReward3?: string;
  dailysReward4?: string;
  dailysReward5?: string;
  dailysReward6?: string;
  title?: string;
  eligibilityCriteria?: (user: User) => boolean;
}

export type Levels = {
  src?: string;
  id: string;
  levelsName: string;
  description: string;
  description2?: string;
  description3?: string;
  description4?: string;
  description5?: string;
  levelsCover?: string;
  levelsReward1: string;
  levelsReward2?: string;
  levelsReward3?: string;
  levelsReward4?: string;
  levelsReward5?: string;
  levelsReward6?: string;
  title: string;
  freeClaimTokenId?: number;
}

export type ApiResponse = {
  success: boolean;
  data: User;
};


export type User = {
  id?: number;
  email?: string;
  username?: string;
  achievements?: any;
  free_claim?: any;
  dollyCount?: number;
  dailys?: any;
  dollys?: Dolly[];
  colors?: string[];
  traits?: any[];
  skin_colors?: string[];
  tokens?: Token[];
  hideSaveChangesModal?: boolean;
  profile_name?: string;
  profile_image_url?: string;
  tier?: string;
  titles?: string[];
  token?: string;
  cupcake_points?: number;
  level?: any;
  birthday_month?: string;
  birthday_day?: string;
  twitter_handle?: string;
  discord_handle?: string;
  bunny_club?: number;
  linksClicked?: any;
};

export type LinkClick = {
  url: string;
  eventId: string;
  trackId: string;
  clickedAt: string;
};

type OwnedTraitsResponse = {
  traits: Trait[];
};

interface FreeClaimType {
  claimed: boolean;
  token_id: string;
  date_claimed: string;
  transaction_hash: string;
}

export type Dolly = {
  token_id: string;
  attributes: Attribute[];
};

export type ModalState = {
  active: boolean;
  title: string;
  body: React.ReactNode;
  footer?: React.ReactNode; // Optional footer property
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
