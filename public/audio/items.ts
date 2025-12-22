import ANIMAL_AUDIO_FILES from './animals';
import OBJECT_AUDIO_FILES from './objects';
import FOOD_AUDIO_FILES  from './food';

const mergeAudioFiles = () => {
  const languages: ('en' | 'pt' | 'es')[] = ['en', 'pt', 'es'];

  const mergedAudioFiles: Record<'en' | 'pt' | 'es', Record<string, number>> = {} as any;

  languages.forEach((lang) => {
    mergedAudioFiles[lang] = {
      ...ANIMAL_AUDIO_FILES[lang],
      ...OBJECT_AUDIO_FILES[lang],
      ...FOOD_AUDIO_FILES[lang],
    };
  });

  return mergedAudioFiles;
};

const ITEM_AUDIO_FILES = mergeAudioFiles();

export default ITEM_AUDIO_FILES;
