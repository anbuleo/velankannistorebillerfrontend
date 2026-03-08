import { useState, useEffect, useCallback, useRef } from 'react';
import { toast } from 'react-toastify';

const useVoiceCommand = (setFieldValue, values, submitForm, onNameChange, categories = []) => {
    const [isListening, setIsListening] = useState(false);
    const [recognition, setRecognition] = useState(null);
    const [lastUpdatedField, setLastUpdatedField] = useState(null);
    const [transcript, setTranscript] = useState('');
    const [lang, setLang] = useState('en-US');

    useEffect(() => {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (SpeechRecognition) {
            const recognitionInstance = new SpeechRecognition();
            recognitionInstance.continuous = true;
            recognitionInstance.interimResults = true;
            recognitionInstance.lang = lang;

            recognitionInstance.onresult = (event) => {
                const current = event.results[event.results.length - 1];
                const text = current[0].transcript.toLowerCase().trim();
                setTranscript(text);

                if (current.isFinal) {
                    console.log('Final Transcript:', text);
                    parseCommand(text);
                }
            };

            recognitionInstance.onerror = (event) => {
                if (event.error === 'no-speech') return;
                console.error('Speech error:', event.error);
            };

            recognitionInstance.onend = () => {
                if (isListening) {
                    try { recognitionInstance.start(); } catch (e) { }
                }
            };

            setRecognition(recognitionInstance);
        }
    }, [isListening, lang]);

    const updateField = (field, value, label) => {
        setFieldValue(field, value);
        setLastUpdatedField(field);
        toast.info(`${label}: ${value}`, { autoClose: 2000, icon: '🎤' });
        setTimeout(() => setLastUpdatedField(null), 1500);
        setTranscript(`Setting ${label} to ${value}...`);
    };

    const generateBarcode = () => {
        const genId = 'VB' + Math.random().toString(36).substring(2, 7).toUpperCase() + Date.now().toString().slice(-4);
        updateField('productCode', genId, lang === 'ta-IN' ? 'பார்கோடு' : 'Barcode');
    };

    const parseCommand = (text) => {
        const numberMatch = text.match(/\d+/);
        const number = numberMatch ? numberMatch[0] : null;

        // ENGLISH COMMANDS
        if (lang === 'en-US') {
            if (text.startsWith('name') || text.startsWith('product')) {
                const val = text.replace('name', '').replace('product', '').trim();
                if (val) {
                    updateField('tanglishName', val, 'Name');
                    if (onNameChange) onNameChange(val);
                }
            }
            else if (text.includes('price') && number) updateField('productPrice', number, 'Sale Price');
            else if ((text.includes('cost') || text.includes('buy')) && number) updateField('productCost', number, 'Buy Price');
            else if (text.includes('mrp') && number) updateField('MRP', number, 'MRP');
            else if ((text.includes('stock') || text.includes('quantity')) && number) updateField('stockQuantity', number, 'Stock');
            else if (text.includes('unit') && number) updateField('unitValue', number, 'Unit Value');

            // Barcode Generate (English)
            else if (text.includes('generate') || text.includes('create code') || text.includes('new code')) {
                generateBarcode();
            }

            // Dictated Barcode
            else if (text.includes('barcode') || text.includes('code is')) {
                const val = text.replace('barcode', '').replace('code is', '').trim().toUpperCase().replace(/\s/g, '');
                if (val) updateField('productCode', val, 'Barcode');
            }

            // Category Selection (English)
            else if (text.includes('category') || text.includes('type')) {
                const search = text.replace('category', '').replace('type', '').trim();
                const matchedCat = categories.find(c => c.name.toLowerCase().includes(search));
                if (matchedCat) updateField('productType', matchedCat.name, 'Category');
            }

            // Measure Mode (English)
            else if (text.includes('measure') || text.includes('kg') || text.includes('gram') || text.includes('piece') || text.includes('liter')) {
                if (text.includes('kg') || text.includes('kilo')) updateField('qantityType', 'KG', 'Measure');
                else if (text.includes('gram') || text.includes(' g ')) updateField('qantityType', 'G', 'Measure');
                else if (text.includes('piece') || text.includes(' pcs')) updateField('qantityType', 'PCS', 'Measure');
                else if (text.includes('liter') || text.includes(' litre')) updateField('qantityType', 'L', 'Measure');
                else if (text.includes(' milli')) updateField('qantityType', 'ML', 'Measure');
            }

            else if (text.includes('save') || text.includes('finish')) {
                submitForm();
            }
            else if (text.includes('stop listening') || text.includes('turn off')) {
                toggleListening();
            }
        }

        // TAMIL COMMANDS
        else if (lang === 'ta-IN') {
            if (text.includes('பெயர்') || text.includes('பொருள்')) {
                const val = text.replace('பெயர்', '').replace('பொருள்', '').trim();
                if (val) {
                    updateField('productName', val, 'பெயர்');
                    setFieldValue('tanglishName', val);
                }
            }
            else if (text.includes('விலை') && number) updateField('productPrice', number, 'விற்பனை விலை');
            else if (text.includes('அடக்கம்') && number) updateField('productCost', number, 'அடக்க விலை');
            else if (text.includes('இருப்பு') && number) updateField('stockQuantity', number, 'இருப்பு');
            else if (text.includes('அலகு') && number) updateField('unitValue', number, 'அளவு'); // Unit Value

            // Barcode Generate (Tamil)
            else if (text.includes('உருவாக்கு') || text.includes('புதிய கோடு')) {
                generateBarcode();
            }

            // Dictated Barcode (Tamil)
            else if (text.includes('பார்கோடு') || text.includes('குறியீடு')) {
                const val = text.replace('பார்கோடு', '').replace('குறியீடு', '').trim().toUpperCase().replace(/\s/g, '');
                if (val) updateField('productCode', val, 'பார்கோடு');
            }

            // Category Selection (Tamil matching)
            else if (text.includes('வகை')) {
                const search = text.replace('வகை', '').trim();
                const matchedCat = categories.find(c => c.name.toLowerCase().includes(search));
                if (matchedCat) updateField('productType', matchedCat.name, 'வகை');
            }

            // Measure Mode (Tamil Mapping)
            else if (text.includes('அளவீடு') || text.includes('கிலோ') || text.includes('கிராம்') || text.includes('லிட்டர்')) {
                if (text.includes('கிலோ')) updateField('qantityType', 'KG', 'அளவீடு');
                else if (text.includes('கிராம்')) updateField('qantityType', 'G', 'அளவீடு');
                else if (text.includes('லிட்டர்')) updateField('qantityType', 'L', 'அளவீடு');
                else if (text.includes('பீஸ்') || text.includes('எண்ணிக்கை')) updateField('qantityType', 'PCS', 'அளவீடு');
            }

            else if (text.includes('சேமி') || text.includes('முடி')) {
                submitForm();
            }
            else if (text.includes('நிப்பாட்டு') || text.includes('நிறுத்து')) {
                toggleListening();
            }
        }
    };

    const toggleListening = () => {
        if (isListening) {
            recognition?.stop();
            setIsListening(false);
            setTranscript('');
        } else {
            recognition?.start();
            setIsListening(true);
            setTranscript(lang === 'ta-IN' ? 'பேசுங்கள்...' : 'Listening...');
        }
    };

    const toggleLang = () => {
        const newLang = lang === 'en-US' ? 'ta-IN' : 'en-US';
        setLang(newLang);
        setIsListening(false);
        toast.success(newLang === 'ta-IN' ? 'தமிழ் மொழி மாற்றப்பட்டது' : 'Switched to English');
    };

    return { isListening, toggleListening, lastUpdatedField, transcript, lang, toggleLang };
};

export default useVoiceCommand;
