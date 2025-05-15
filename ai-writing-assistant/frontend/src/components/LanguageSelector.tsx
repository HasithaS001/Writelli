"use client";

import React from 'react';
import Select from '@/components/ui/Select';

// List of common languages
const LANGUAGES = [
  { id: 'English', name: 'English' },
  { id: 'Spanish', name: 'Spanish' },
  { id: 'French', name: 'French' },
  { id: 'German', name: 'German' },
  { id: 'Italian', name: 'Italian' },
  { id: 'Portuguese', name: 'Portuguese' },
  { id: 'Russian', name: 'Russian' },
  { id: 'Japanese', name: 'Japanese' },
  { id: 'Korean', name: 'Korean' },
  { id: 'Chinese', name: 'Chinese (Simplified)' },
  { id: 'Arabic', name: 'Arabic' },
  { id: 'Hindi', name: 'Hindi' },
  { id: 'Bengali', name: 'Bengali' },
  { id: 'Dutch', name: 'Dutch' },
  { id: 'Greek', name: 'Greek' },
  { id: 'Swedish', name: 'Swedish' },
  { id: 'Turkish', name: 'Turkish' },
  { id: 'Thai', name: 'Thai' },
  { id: 'Vietnamese', name: 'Vietnamese' },
  { id: 'Indonesian', name: 'Indonesian' }
];

interface LanguageSelectorProps {
  selectedLanguage: string;
  onSelectLanguage: (language: string) => void;
}

const LanguageSelector: React.FC<LanguageSelectorProps> = ({
  selectedLanguage,
  onSelectLanguage
}) => {
  return (
    <div className="mb-5">
      <Select
        label="Target Language"
        options={LANGUAGES}
        value={selectedLanguage}
        onChange={onSelectLanguage}
        placeholder="Select a language"
        className="text-black"
      />
    </div>
  );
};

export default LanguageSelector;
