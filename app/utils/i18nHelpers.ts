/**
 * Internationalization helper utilities for dynamic content
 */

export type Language = 'pt' | 'en' | 'es';

/**
 * Get the localized name from an item that may have different naming formats.
 * Supports both new format (namePt, nameEn, nameEs) and old format (pt, en, es).
 */
export function getLocalizedName(item: any, language: Language): string {
    // Try new format first (namePt, nameEn, nameEs)
    const capitalizedLang = language.charAt(0).toUpperCase() + language.slice(1);
    const newKey = `name${capitalizedLang}`;
    if (item[newKey]) return item[newKey];

    // Fallback to old format (pt, en, es)
    if (item[language]) return item[language];

    // Final fallback to Portuguese (most complete)
    return item.namePt || item.pt || item.name || '';
}

/**
 * Get the audio URL for an item, checking for stored URLs first then falling back to local paths.
 */
export function getAudioUrl(item: any, language: Language): string | null {
    const capitalizedLang = language.charAt(0).toUpperCase() + language.slice(1);

    // Check for stored audio URL in database format
    const audioKey = `audio${capitalizedLang}`;
    const audioUrlKey = `audioUrl${capitalizedLang}`;

    if (item[audioKey]) return item[audioKey];
    if (item[audioUrlKey]) return item[audioUrlKey];

    return null;
}

/**
 * Audio file format types:
 * - 'lowercase': lowercase with underscore suffix (e.g., ball_.mp3, red_.mp3)
 * - 'capitalize': capitalized with underscore suffix (e.g., Dog_.mp3, Cat_.mp3)
 */
export type AudioFileFormat = 'lowercase' | 'capitalize';

/**
 * Build local audio path for an item.
 */
export function buildLocalAudioPath(
    item: any,
    language: Language,
    category: string,
    format: AudioFileFormat = 'capitalize'
): string {
    const langCodes: Record<Language, string> = { pt: 'pt', en: 'en', es: 'es' };
    const identifier = item.identifier || item.id;

    if (format === 'capitalize') {
        // Capitalize format: capitalize first letter of each word and add underscore suffix
        // e.g., dog -> Dog_, french_fries -> French_Fries_
        const formattedName = identifier
            .split('_')
            .map((word: string) => word.charAt(0).toUpperCase() + word.slice(1))
            .join('_');
        return `/audio/${langCodes[language]}/${category}/${formattedName}_.mp3`;
    }

    // Lowercase format: keep as-is with underscore suffix
    // e.g., ball -> ball_, red -> red_
    return `/audio/${langCodes[language]}/${category}/${identifier}_.mp3`;
}

/**
 * Get the TTS language code for speech synthesis.
 */
export function getTTSLanguageCode(language: Language): string {
    const codes: Record<Language, string> = {
        pt: 'pt-BR',
        en: 'en-US',
        es: 'es-ES'
    };
    return codes[language];
}

/**
 * Play audio for an item with fallback to TTS.
 */
export function playItemAudio(
    item: any,
    language: Language,
    category: string,
    format: AudioFileFormat = 'capitalize'
): void {
    // 1. Try stored audio URL from database
    const storedUrl = getAudioUrl(item, language);
    if (storedUrl) {
        const audio = new Audio(storedUrl);
        audio.play().catch(e => console.log('Stored audio URL failed:', e));
        return;
    }

    // 2. Try local audio file
    const localPath = buildLocalAudioPath(item, language, category, format);
    const audio = new Audio(localPath);

    audio.play().catch(() => {
        // 3. Fallback to TTS
        const name = getLocalizedName(item, language);
        console.log('Audio file not found, using TTS for:', name);

        if ('speechSynthesis' in window) {
            const utterance = new SpeechSynthesisUtterance(name);
            utterance.lang = getTTSLanguageCode(language);
            window.speechSynthesis.speak(utterance);
        }
    });
}
