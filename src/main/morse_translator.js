 /**
         *  MorseCodeData - Singleton class to manage morse code mappings
         */
        class MorseCodeData {
            constructor() {
                if (MorseCodeData.instance) {
                    return MorseCodeData.instance;
                }

                this.MORSE_CODE_MAP = {
                    'A': '.-',    'B': '-...',  'C': '-.-.',  'D': '-..',   'E': '.',
                    'F': '..-.',  'G': '--.',   'H': '....',  'I': '..',    'J': '.---',
                    'K': '-.-',   'L': '.-..',  'M': '--',    'N': '-.',    'O': '---',
                    'P': '.--.',  'Q': '--.-',  'R': '.-.',   'S': '...',   'T': '-',
                    'U': '..-',   'V': '...-',  'W': '.--',   'X': '-..-',  'Y': '-.--',
                    'Z': '--..',
                    '0': '-----', '1': '.----', '2': '..---', '3': '...--', '4': '....-',
                    '5': '.....', '6': '-....', '7': '--...', '8': '---..', '9': '----.',
                    '.': '.-.-.-', ',': '--..--', '?': '..--..', "'": '.----.', '!': '-.-.--',
                    '/': '-..-.', '(': '-.--.', ')': '-.--.-', '&': '.-...', ':': '---...',
                    ';': '-.-.-.', '=': '-...-', '+': '.-.-.', '-': '-....-', '_': '..--.-',
                    '"': '.-..-.', '$': '...-..-', '@': '.--.-.'
                };

                this.REVERSE_MORSE_MAP = Object.fromEntries(
                    Object.entries(this.MORSE_CODE_MAP).map(([key, value]) => [value, key])
                );

                MorseCodeData.instance = this;
            }

            getMorseCode(char) {
                return this.MORSE_CODE_MAP[char.toUpperCase()];
            }

            getCharacter(morse) {
                return this.REVERSE_MORSE_MAP[morse];
            }

            getAllMappings() {
                return { ...this.MORSE_CODE_MAP };
            }
        }

        /**
         * MorseTranslator - Main translator orchestrator
         */
        class MorseTranslator {
            constructor() {
                this.morseData = new MorseCodeData();
                this.encoder = new MorseEncoder(this.morseData);
                this.decoder = new MorseDecoder(this.morseData);
            }

            encodeToMorse() {
                const input = document.getElementById('textInput').value;
                
                if (!this.encoder.validateInput(input)) {
                    ui.showStatus('⚠️ Please enter a message to encode!', 'error');
                    return;
                }

                const output = this.encoder.encode(input);
                document.getElementById('morseOutput').value = output;
                
                ui.showStatus(`🤖 R2-D2 says: Message encoded successfully! ${output.length} characters of galactic morse code generated.`, 'success');
            }

            decodeFromMorse() {
                const input = document.getElementById('morseInput').value;
                
                if (!this.decoder.validateInput(input)) {
                    ui.showStatus('⚠️ Please enter morse code to decode!', 'error');
                    return;
                }

                const output = this.decoder.decode(input);
                document.getElementById('textOutput').value = output;
                
                ui.showStatus(`🤖 R2-D2 says: Message decoded successfully! "${output}"`, 'success');
            }

            // Public methods for testing
            encode(text) {
                return this.encoder.encode(text);
            }

            decode(code) {
                return this.decoder.decode(code);
            }
        }
