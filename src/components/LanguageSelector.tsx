import { i18n } from '@/core/i18n';

export const LanguageSelector = () => {
  const languages = [
    { code: 'fr', name: 'Français', flag: '🇫🇷' },
    { code: 'oc', name: 'Occitan', flag: '🏴' },
    { code: 'en', name: 'English', flag: '🇬🇧' },
  ];

  return (
    <select
      value={i18n.language}
      onChange={(e) => i18n.changeLanguage(e.target.value)}
      className="px-3 py-2 border rounded-md"
    >
      {languages.map((lang) => (
        <option key={lang.code} value={lang.code}>
          {lang.flag} {lang.name}
        </option>
      ))}
    </select>
  );
};
