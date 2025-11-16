
import React from 'react';
import type { GeneratedAd } from '../types';

interface AdPreviewProps {
  ad: GeneratedAd;
}

export const AdPreview: React.FC<AdPreviewProps> = ({ ad }) => {
  return (
    <div className="bg-slate-800/50 rounded-lg shadow-xl overflow-hidden w-full max-w-md mx-auto border border-slate-700">
      <div className="p-4 flex items-center space-x-3 border-b border-slate-700">
          <div className="h-10 w-10 bg-indigo-500 rounded-full flex-shrink-0"></div>
          <div>
              <p className="font-semibold text-white">Your Business</p>
              <p className="text-xs text-slate-400">Sponsored</p>
          </div>
      </div>
      <div className="p-4">
        <h3 className="text-lg font-semibold text-slate-100 mb-2">{ad.adCopy.headline}</h3>
        <p className="text-slate-300 text-sm mb-4">{ad.adCopy.body}</p>
      </div>
      <div className="aspect-square bg-slate-700">
        <img src={ad.imageUrl} alt="Generated Ad Visual" className="w-full h-full object-cover" />
      </div>
      <div className="p-4 bg-slate-800 flex justify-between items-center">
        <p className="text-xs text-slate-400 uppercase">www.google.com</p>
        <a href="www.google.com" className="bg-indigo-600 text-white text-sm font-bold py-2 px-4 rounded-md hover:bg-indigo-700 transition-colors">
            {ad.adCopy.imagePrompt.includes("Shop") ? "Shop Now" : "Learn More"}
        </a>
      </div>
    </div>
  );
};
