
import React, { useState } from 'react';
import type { BusinessInfo, GeneratedAd } from './types';
import { BusinessInfoForm } from './components/BusinessInfoForm';
import { AdPreview } from './components/AdPreview';
import { generateAd } from './services/geminiService';
import { SparklesIcon, FacebookIcon, InstagramIcon, TwitterIcon, LinkedInIcon, LoadingSpinner } from './components/Icons';

type AppState = 'form' | 'loading' | 'preview' | 'error';

const SocialButton: React.FC<{ icon: React.ReactNode; platform: string }> = ({ icon, platform }) => (
    <button onClick={() => alert(`Uploading to ${platform}... (demo)`)} className="flex-1 flex items-center justify-center gap-2 py-2 px-4 bg-slate-700/50 hover:bg-slate-600/50 rounded-md transition-colors duration-200">
        {icon}
        <span className="hidden sm:inline">{platform}</span>
    </button>
);

export default function App() {
  const [appState, setAppState] = useState<AppState>('form');
  const [generatedAd, setGeneratedAd] = useState<GeneratedAd | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleGenerateAd = async (data: BusinessInfo) => {
    setAppState('loading');
    setError(null);
    try {
      const ad = await generateAd(data);
      setGeneratedAd(ad);
      setAppState('preview');
    } catch (err: any) {
      setError(err.message || 'An unknown error occurred.');
      setAppState('error');
    }
  };

  const handleRegenerate = () => {
    setGeneratedAd(null);
    setAppState('form');
  };
  
  const renderContent = () => {
    switch (appState) {
      case 'loading':
        return (
            <div className="text-center">
                <LoadingSpinner className="mx-auto h-12 w-12 animate-spin text-indigo-400" />
                <h2 className="mt-4 text-xl font-semibold">Generating your masterpiece...</h2>
                <p className="mt-2 text-slate-400">The AI is crafting the perfect ad. This might take a moment.</p>
            </div>
        );
      case 'preview':
        if (!generatedAd) return null;
        return (
          <div className="w-full flex flex-col items-center gap-8">
            <AdPreview ad={generatedAd} />
            <div className="w-full max-w-md mx-auto space-y-4">
                 <h3 className="text-center font-semibold text-lg text-slate-200">Upload to Social Media</h3>
                 <div className="flex items-center gap-2 sm:gap-4">
                     <SocialButton icon={<FacebookIcon className="h-5 w-5"/>} platform="Facebook" />
                     <SocialButton icon={<InstagramIcon className="h-5 w-5"/>} platform="Instagram" />
                     <SocialButton icon={<TwitterIcon className="h-5 w-5"/>} platform="X" />
                     <SocialButton icon={<LinkedInIcon className="h-5 w-5"/>} platform="LinkedIn" />
                 </div>
                 <button onClick={handleRegenerate} className="w-full mt-4 py-3 px-4 border border-slate-600 rounded-md shadow-sm text-sm font-medium text-slate-200 bg-slate-800 hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-500 focus:ring-offset-slate-900 transition-colors">
                     Create a New Ad
                 </button>
            </div>
          </div>
        );
      case 'error':
        return (
            <div className="text-center p-6 bg-red-900/20 border border-red-500 rounded-lg max-w-lg mx-auto">
                <h2 className="text-xl font-semibold text-red-300">An Error Occurred</h2>
                <p className="mt-2 text-red-200">{error}</p>
                <button onClick={handleRegenerate} className="mt-4 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 focus:ring-offset-slate-900">
                    Try Again
                </button>
            </div>
        );
      case 'form':
      default:
        return <BusinessInfoForm onSubmit={handleGenerateAd} isLoading={false} />;
    }
  }

  return (
    <div className="min-h-screen bg-slate-900 text-white p-4 sm:p-8 flex flex-col items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 z-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.3),rgba(255,255,255,0))]"></div>
        <main className="z-10 w-full flex flex-col items-center">
            <header className="text-center mb-10">
                <div className="inline-flex items-center gap-3">
                    <SparklesIcon className="h-8 w-8 text-indigo-400" />
                    <h1 className="text-3xl sm:text-4xl font-bold tracking-tight bg-gradient-to-r from-slate-200 to-slate-400 text-transparent bg-clip-text">
                        Social Ad Generator AI
                    </h1>
                </div>
                <p className="mt-2 text-slate-400 max-w-2xl mx-auto">
                    Fill in your business details and let our AI create the perfect social media ad for you in seconds.
                </p>
            </header>
            
            <div className="w-full transition-all duration-500">
                {appState === 'form' && <BusinessInfoForm onSubmit={handleGenerateAd} isLoading={false} />}
                {appState === 'loading' && renderContent()}
                {appState === 'preview' && renderContent()}
                {appState === 'error' && renderContent()}
            </div>
        </main>
    </div>
  );
}
