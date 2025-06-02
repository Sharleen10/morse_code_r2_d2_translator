/**
         *  MorseEncoder - Handles text to morse conversion
         */
        class MorseEncoder {
            constructor(morseData) {
                this.morseData = morseData;
            }

            encode(text) {
                if (!text || typeof text !== 'string') {
                    return '';
                }

                return text
                    .toUpperCase()
                    .split('')
                    .map(char => {
                        if (char === ' ') {
                            return '/';  // Use / to separate words in morse
                        }
                        return this.morseData.getMorseCode(char) || char;  // Keep unknown chars as-is
                    })
                    .join(' ')
                    .replace(/\s+/g, ' ')  // Clean up multiple spaces
                    .trim();
            }

            validateInput(text) {
                return text && typeof text === 'string' && text.trim().length > 0;
            }
        }