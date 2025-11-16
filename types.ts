
export interface BusinessInfo {
  name: string;
  description: string;
  targetAudience: string;
  product: string;
  callToAction: string;
  tone: string;
}

export interface AdCopy {
  headline: string;
  body: string;
  imagePrompt: string;
}

export interface GeneratedAd {
    adCopy: AdCopy;
    imageUrl: string;
}
