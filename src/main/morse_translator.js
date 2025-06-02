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

          /**
         * SoundManager - Handles audio playback
         */
        class SoundManager {
            constructor() {
                this.audioContext = null;
                this.dotDuration = 0.1;
                this.dashDuration = 0.3;
                this.pauseDuration = 0.1;
            }

            initAudioContext() {
                if (!this.audioContext) {
                    this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
                }
                return this.audioContext;
            }

            playMorseSound(textareaId) {
                const morseText = document.getElementById(textareaId).value;
                if (!morseText) {
                    ui.showStatus('⚠️ No morse code to play!', 'error');
                    return;
                }

                ui.showStatus('🔊 R2-D2 is beeping your message...', 'success');
                
                const audioContext = this.initAudioContext();
                let currentTime = audioContext.currentTime;
                
                for (let i = 0; i < morseText.length; i++) {
                    const char = morseText[i];
                    if (char === '.') {
                        this.playBeep(audioContext, currentTime, 800, this.dotDuration);
                        currentTime += this.dotDuration + this.pauseDuration;
                    } else if (char === '-') {
                        this.playBeep(audioContext, currentTime, 800, this.dashDuration);
                        currentTime += this.dashDuration + this.pauseDuration;
                    } else if (char === ' ') {
                        currentTime += this.pauseDuration * 2;
                    } else if (char === '/') {
                        currentTime += this.pauseDuration * 4;
                    }
                }
            }

            playBeep(audioContext, startTime, frequency, duration) {
                const oscillator = audioContext.createOscillator();
                const gainNode = audioContext.createGain();
                
                oscillator.connect(gainNode);
                gainNode.connect(audioContext.destination);
                
                oscillator.frequency.value = frequency;
                oscillator.type = 'sine';
                
                gainNode.gain.setValueAtTime(0.3, startTime);
                gainNode.gain.exponentialRampToValueAtTime(0.01, startTime + duration);
                
                oscillator.start(startTime);
                oscillator.stop(startTime + duration);
            }
        }
