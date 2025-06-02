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

         /**
         *  UIManager - Handles user interface interactions
         */
        class UIManager {
            constructor() {
                this.currentTheme = 'dark';
            }

            showStatus(message, type) {
                const statusDiv = document.getElementById('statusMessage');
                statusDiv.textContent = message;
                statusDiv.className = `status ${type}`;
                
                // Auto-hide after 3 seconds
                setTimeout(() => {
                    statusDiv.textContent = '';
                    statusDiv.className = '';
                }, 3000);
            }

            clearText() {
                document.getElementById('textInput').value = '';
                document.getElementById('morseOutput').value = '';
                this.showStatus('🗑️ Text fields cleared!', 'success');
            }

            clearMorse() {
                document.getElementById('morseInput').value = '';
                document.getElementById('textOutput').value = '';
                this.showStatus('🗑️ Morse fields cleared!', 'success');
            }

            toggleTheme() {
                this.currentTheme = this.currentTheme === 'dark' ? 'light' : 'dark';
                document.body.setAttribute('data-theme', this.currentTheme);
                this.showStatus(`🌓 Theme changed to ${this.currentTheme} mode!`, 'success');
            }

            createStarfield() {
                const starfield = document.getElementById('starfield');
                const numStars = 100;
                
                for (let i = 0; i < numStars; i++) {
                    const star = document.createElement('div');
                    star.className = 'star';
                    star.style.left = Math.random() * 100 + '%';
                    star.style.top = Math.random() * 100 + '%';
                    star.style.animationDelay = Math.random() * 3 + 's';
                    starfield.appendChild(star);
                }
            }

            createMorseChart() {
                const chartDiv = document.getElementById('morseChart');
                const morseData = new MorseCodeData();
                
                Object.entries(morseData.getAllMappings()).forEach(([letter, morse]) => {
                    const item = document.createElement('div');
                    item.className = 'chart-item';
                    item.innerHTML = `<span style="color: var(--text-accent);">${letter}</span><span style="color: var(--text-primary);">${morse}</span>`;
                    chartDiv.appendChild(item);
                });
            }

            initialize() {
                this.createStarfield();
                this.createMorseChart();
                
                // Add some sample data
                document.getElementById('textInput').value = "Help me Obi-Wan!";
                document.getElementById('morseInput').value = ".... . .-.. .--. / -- .";
                
                this.showStatus('🤖 R2-D2 is online and ready for galactic communications!', 'success');
            }
        }

        /**
         * 🧪 TestCase - Individual test case class
         */
        class TestCase {
            constructor(name, input, expected, testFunction) {
                this.name = name;
                this.input = input;
                this.expected = expected;
                this.testFunction = testFunction;
                this.passed = false;
                this.result = null;
                this.error = null;
            }

            run() {
                try {
                    this.result = this.testFunction(this.input);
                    this.passed = this.result === this.expected;
                } catch (error) {
                    this.error = error.message;
                    this.passed = false;
                }
                return this.passed;
            }

            getReport() {
                const status = this.passed ? '✅ PASS' : '❌ FAIL';
                const className = this.passed ? 'test-pass' : 'test-fail';
                
                let report = `<div class="${className}">${status} - ${this.name}</div>`;
                report += `<div>  Input: "${this.input}"</div>`;
                report += `<div>  Expected: "${this.expected}"</div>`;
                report += `<div>  Got: "${this.result || 'ERROR'}"</div>`;
                
                if (this.error) {
                    report += `<div>  Error: ${this.error}</div>`;
                }
                
                return report + '<br>';
            }
        }

        /**
         * TestSuite - Collection of related test cases
         */
        class TestSuite {
            constructor(name) {
                this.name = name;
                this.tests = [];
                this.passedCount = 0;
                this.totalCount = 0;
            }

            addTest(testCase) {
                this.tests.push(testCase);
            }

            run() {
                this.passedCount = 0;
                this.totalCount = this.tests.length;
                
                const results = this.tests.map(test => {
                    const passed = test.run();
                    if (passed) this.passedCount++;
                    return test.getReport();
                });

                return {
                    summary: ` ${this.name}: ${this.passedCount}/${this.totalCount} tests passed`,
                    details: results.join('')
                };
            }

            getSuccessRate() {
                return this.totalCount > 0 ? (this.passedCount / this.totalCount) * 100 : 0;
            }
        }

        /**
         *  TestRunner - Main testing orchestrator
         */
        class TestRunner {
            constructor(translator) {
                this.translator = translator;
                this.testSuites = new Map();
                this.setupTestSuites();
            }

            setupTestSuites() {
                // Encoding Tests
                const encodingSuite = new TestSuite('Encoding Tests');
                encodingSuite.addTest(new TestCase('Basic Hello', 'Hello', '.... . .-.. .-.. ---', (input) => this.translator.encode(input)));
                encodingSuite.addTest(new TestCase('SOS Emergency', 'SOS', '... --- ...', (input) => this.translator.encode(input)));
                encodingSuite.addTest(new TestCase('Numbers Test', '123', '.---- ..--- ...--', (input) => this.translator.encode(input)));
                encodingSuite.addTest(new TestCase('Phrase with Spaces', 'I like you', '.. / .-.. .. -.- . / -.-- --- ..-', (input) => this.translator.encode(input)));
                encodingSuite.addTest(new TestCase('Mixed Case', 'HeLLo', '.... . .-.. .-.. ---', (input) => this.translator.encode(input)));
                encodingSuite.addTest(new TestCase('With Punctuation', 'Help!', '.... . .-.. .--. -.-.--', (input) => this.translator.encode(input)));
                encodingSuite.addTest(new TestCase('Empty String', '', '', (input) => this.translator.encode(input)));
                
                // Decoding Tests
                const decodingSuite = new TestSuite('Decoding Tests');
                decodingSuite.addTest(new TestCase('Basic Morse', '.... . .-.. .-.. ---', 'HELLO', (input) => this.translator.decode(input)));
                decodingSuite.addTest(new TestCase('SOS Decode', '... --- ...', 'SOS', (input) => this.translator.decode(input)));
                decodingSuite.addTest(new TestCase('Numbers Decode', '.---- ..--- ...--', '123', (input) => this.translator.decode(input)));
                decodingSuite.addTest(new TestCase('Phrase Decode', '.. / .-.. .. -.- . / -.-- --- ..-', 'I LIKE YOU', (input) => this.translator.decode(input)));
                decodingSuite.addTest(new TestCase('With Punctuation Decode', '.... . .-.. .--. -.-.--', 'HELP!', (input) => this.translator.decode(input)));
                decodingSuite.addTest(new TestCase('Empty Morse', '', '', (input) => this.translator.decode(input)));
                
                // Edge Cases
                const edgeCaseSuite = new TestSuite('Edge Cases');
                edgeCaseSuite.addTest(new TestCase('Single Character', 'A', '.-', (input) => this.translator.encode(input)));
                edgeCaseSuite.addTest(new TestCase('Single Morse', '.-', 'A', (input) => this.translator.decode(input)));
                edgeCaseSuite.addTest(new TestCase('Multiple Spaces', 'A  B', '.- / -...', (input) => this.translator.encode(input)));
                edgeCaseSuite.addTest(new TestCase('Special Characters', 'A@B', '.- .--.-. -...', (input) => this.translator.encode(input)));
                
                this.testSuites.set('encoding', encodingSuite);
                this.testSuites.set('decoding', decodingSuite);
                this.testSuites.set('edgeCases', edgeCaseSuite);
            }

            runAllTests() {
                ui.showStatus(' Running comprehensive test suite...', 'success');
                
                let allResults = '<h4> R2-D2\'s Complete Test Report</h4>';
                let totalPassed = 0;
                let totalTests = 0;
                
                for (const [name, suite] of this.testSuites) {
                    const result = suite.run();
                    allResults += `<h5>${result.summary}</h5>`;
                    allResults += result.details;
                    totalPassed += suite.passedCount;
                    totalTests += suite.totalCount;
                }
                
                const overallRate = totalTests > 0 ? Math.round((totalPassed / totalTests) * 100) : 0;
                allResults = `<div class="test-${overallRate === 100 ? 'pass' : 'fail'}"> Overall: ${totalPassed}/${totalTests} tests passed (${overallRate}%)</div><br>` + allResults;
                
                this.displayResults(allResults);
                
                if (overallRate === 100) {
                    ui.showStatus(' All tests passed! R2-D2 is functioning perfectly!', 'success');
                } else {
                    ui.showStatus(`${totalTests - totalPassed} tests failed. R2-D2 needs some repairs!`, 'error');
                }
            }

            runEncodingTests() {
                ui.showStatus(' Running encoding tests...', 'success');
                const suite = this.testSuites.get('encoding');
                const result = suite.run();
                
                let output = `<h4> ${result.summary}</h4>`;
                output += result.details;
                
                this.displayResults(output);
                
                if (suite.getSuccessRate() === 100) {
                    ui.showStatus(' All encoding tests passed!', 'success');
                } else {
                    ui.showStatus('Some encoding tests failed!', 'error');
                }
            }

            runDecodingTests() {
                ui.showStatus(' Running decoding tests...', 'success');
                const suite = this.testSuites.get('decoding');
                const result = suite.run();
                
                let output = `<h4> ${result.summary}</h4>`;
                output += result.details;
                
                this.displayResults(output);
                
                if (suite.getSuccessRate() === 100) {
                    ui.showStatus('All decoding tests passed!', 'success');
                } else {
                    ui.showStatus('Some decoding tests failed!', 'error');
                }
            }

            displayResults(html) {
                const resultsDiv = document.getElementById('testResults');
                resultsDiv.innerHTML = html;
                resultsDiv.style.display = 'block';
                
                // Scroll to results
                resultsDiv.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            }

            // Public method for custom tests
            addCustomTest(suiteName, testCase) {
                if (!this.testSuites.has(suiteName)) {
                    this.testSuites.set(suiteName, new TestSuite(suiteName));
                }
                this.testSuites.get(suiteName).addTest(testCase);
            }
        }

        // Initialize R2-D2's Systems
        const morseData = new MorseCodeData();
        const translator = new MorseTranslator();
        const sound = new SoundManager();
        const ui = new UIManager();
        const testRunner = new TestRunner(translator);

        //  Event Listeners and Initialization
        document.addEventListener('DOMContentLoaded', function() {
            ui.initialize();
            
            // Keyboard shortcuts for power users
            document.addEventListener('keydown', function(e) {
                if (e.ctrlKey || e.metaKey) {
                    switch(e.key) {
                        case 'Enter':
                            e.preventDefault();
                            if (document.activeElement.id === 'textInput') {
                                translator.encodeToMorse();
                            } else if (document.activeElement.id === 'morseInput') {
                                translator.decodeFromMorse();
                            }
                            break;
                        case 't':
                            e.preventDefault();
                            testRunner.runAllTests();
                            break;
                        case 'd':
                            e.preventDefault();
                            ui.toggleTheme();
                            break;
                    }
                }
            });
        });

