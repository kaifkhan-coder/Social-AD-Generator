
import React, { useState } from 'react';
import type { BusinessInfo } from '../types';
import { LoadingSpinner, SparklesIcon } from './Icons';

interface BusinessInfoFormProps {
  onSubmit: (data: BusinessInfo) => void;
  isLoading: boolean;
}

const InputField: React.FC<{ id: keyof BusinessInfo, label: string, value: string, onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void, type?: string, required?: boolean, isTextArea?: boolean }> = ({ id, label, value, onChange, type = "text", required = true, isTextArea = false }) => {
    const commonProps = {
        id,
        name: id,
        value,
        onChange,
        required,
        className: "mt-1 block w-full bg-slate-800/50 border-slate-700 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm py-2 px-3 transition-colors duration-200"
    };
    return (
        <div>
            <label htmlFor={id} className="block text-sm font-medium text-slate-300">{label}</label>
            {isTextArea ? <textarea {...commonProps} rows={3} /> : <input {...commonProps} type={type} />}
        </div>
    );
};

const SelectField: React.FC<{ id: keyof BusinessInfo, label: string, value: string, onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void, options: string[] }> = ({ id, label, value, onChange, options }) => (
    <div>
        <label htmlFor={id} className="block text-sm font-medium text-slate-300">{label}</label>
        <select id={id} name={id} value={value} onChange={onChange} className="mt-1 block w-full bg-slate-800/50 border-slate-700 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm py-2 px-3 transition-colors duration-200">
            {options.map(option => <option key={option} value={option}>{option}</option>)}
        </select>
    </div>
);


export const BusinessInfoForm: React.FC<BusinessInfoFormProps> = ({ onSubmit, isLoading }) => {
  const [formData, setFormData] = useState<BusinessInfo>({
    name: '',
    description: '',
    targetAudience: '',
    product: '',
    callToAction: 'Learn More',
    tone: 'Professional',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const tones = ["Professional", "Friendly", "Humorous", "Luxurious", "Adventurous", "Minimalist"];
  const ctas = ["Learn More", "Shop Now", "Sign Up", "Contact Us", "Get Started", "Book Now"];

  return (
    <form onSubmit={handleSubmit} className="space-y-6 w-full max-w-lg mx-auto">
      <InputField id="name" label="Business Name" value={formData.name} onChange={handleChange} />
      <InputField id="description" label="Business Description" value={formData.description} onChange={handleChange} isTextArea />
      <InputField id="product" label="Product/Service to Advertise" value={formData.product} onChange={handleChange} />
      <InputField id="targetAudience" label="Target Audience" value={formData.targetAudience} onChange={handleChange} />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <SelectField id="tone" label="Ad Tone" value={formData.tone} onChange={handleChange} options={tones} />
        <SelectField id="callToAction" label="Call to Action" value={formData.callToAction} onChange={handleChange} options={ctas} />
      </div>
      <div>
        <button
          type="submit"
          disabled={isLoading}
          className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-400 disabled:cursor-not-allowed transition-all duration-200 group"
        >
          {isLoading ? (
            <>
              <LoadingSpinner className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" />
              Generating...
            </>
          ) : (
            <>
              <SparklesIcon className="group-hover:scale-110 -ml-1 mr-2 h-5 w-5 transition-transform" />
              Generate Ad
            </>
          )}
        </button>
      </div>
    </form>
  );
};
