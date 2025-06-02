 /**
         *  MorseDecoder - Handles morse to text conversion
         */
        class MorseDecoder {
            constructor(morseData) {
                this.morseData = morseData;
            }

            decode(code) {
                if (!code || typeof code !== 'string') {
                    return '';
                }

                return code
                    .trim()
                    .split('/')  
                    .map(word => {
                        return word
                            .trim()
                            .split(' ') 
                            .map(morseChar => {
                                if (!morseChar) return '';
                                return this.morseData.getCharacter(morseChar) || morseChar;
                            })
                            .join('');
                    })
                    .join(' ')
                    .replace(/\s+/g, ' ') 
                    .trim();
            }

            validateInput(code) {
                return code && typeof code === 'string' && /[.\-\/\s]/.test(code);
            }
        }