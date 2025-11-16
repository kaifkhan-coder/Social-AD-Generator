
import { GoogleGenAI, Type } from "@google/genai";
import type { BusinessInfo, AdCopy, GeneratedAd } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });

export const generateAd = async (info: BusinessInfo): Promise<GeneratedAd> => {
  try {
    // Step 1: Generate ad copy and a creative image prompt
    const adCopyPrompt = `
      Based on the following business information, generate compelling ad copy and a highly detailed, visually striking image prompt for a social media ad.

      Business Name: ${info.name}
      Business Description: ${info.description}
      Product/Service to Advertise: ${info.product}
      Target Audience: ${info.targetAudience}
      Call to Action: ${info.callToAction}
      Ad Tone: ${info.tone}

      The image prompt should be descriptive and artistic, suitable for a text-to-image AI model to create a captivating visual.
      Return ONLY a JSON object that follows the provided schema.
    `;

    const adCopySchema = {
      type: Type.OBJECT,
      properties: {
        headline: {
          type: Type.STRING,
          description: "A catchy headline for the ad (max 10 words)."
        },
        body: {
          type: Type.STRING,
          description: "The main body text of the ad (2-3 sentences)."
        },
        imagePrompt: {
          type: Type.STRING,
          description: "A detailed, creative prompt for an image generation model. Example: 'A vibrant, photorealistic image of a person joyfully using [product] in a sun-drenched, modern setting, with a shallow depth of field.'"
        }
      },
      required: ["headline", "body", "imagePrompt"]
    };

    const adCopyResponse = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: adCopyPrompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: adCopySchema,
      },
    });

    const adCopy = JSON.parse(adCopyResponse.text) as AdCopy;

    // Step 2: Generate the image using the prompt from Step 1
    const imageResponse = await ai.models.generateImages({
        model: 'imagen-4.0-generate-001',
        prompt: adCopy.imagePrompt,
        config: {
          numberOfImages: 1,
          outputMimeType: 'image/jpeg',
          aspectRatio: '1:1', // Common aspect ratio for social media feeds
        },
    });

    if (!imageResponse.generatedImages || imageResponse.generatedImages.length === 0) {
        throw new Error("Image generation failed.");
    }
    
    const base64ImageBytes = imageResponse.generatedImages[0].image.imageBytes;
    const imageUrl = `data:image/jpeg;base64,${base64ImageBytes}`;

    return { adCopy, imageUrl };
  } catch (error) {
    console.error("Error generating ad:", error);
    throw new Error("Failed to generate ad. Please check your inputs or try again later.");
  }
};
