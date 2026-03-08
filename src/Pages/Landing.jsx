import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
    MdLocationOn, MdPhone, MdAccessTime, MdShoppingBag,
    MdCheckCircle, MdLocalShipping, MdKeyboardArrowRight,
    MdLogin, MdOutlineStars, MdVerified, MdSupportAgent,
    MdStorefront, MdOutlineFastfood, MdCleaningServices, MdQuestionAnswer,
    MdLanguage, MdTranslate, MdMenu, MdClose
} from 'react-icons/md';
import { FaWhatsapp } from 'react-icons/fa';

/**
 * Landing Page: Modern Public Presence for Vellankanni Stores
 * SEO & Specialist Edition:
 * 1. Dynamic Bilingual (EN/TA) 
 * 2. Mobile-First Architecture
 * 3. LocalBusiness Schema & SEO Meta Management
 */
function Landing() {
    const [scrolled, setScrolled] = useState(false);
    const [lang, setLang] = useState('en');
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 50);
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // SEO Dynamic Meta Management
    useEffect(() => {
        const descriptions = {
            en: "Shop fresh groceries, organic produce, and premium home essentials at Vellankanni Stores, Dharapuram. Serving quality since 1989.",
            ta: "தாராபுரத்தில் புதிய காய்கறிகள் மற்றும் தரமான மளிகைப் பொருட்கள் வாங்க வெள்ளக்கண்ணி ஸ்டோர்ஸ்க்கு வாருங்கள். 1989 முதல் உங்கள் சேவையில்."
        };
        const titles = {
            en: "Vellankanni Stores | Premium Grocery & Fresh Produce Dharapuram",
            ta: "வெள்ளக்கண்ணி ஸ்டோர்ஸ் | தாராபுரத்தின் சிறந்த மளிகை மற்றும் காய்கறி கடை"
        };

        document.title = titles[lang];
        const metaDesc = document.querySelector('meta[name="description"]');
        if (metaDesc) metaDesc.setAttribute('content', descriptions[lang]);
    }, [lang]);

    // Prevent scroll when mobile menu is open
    useEffect(() => {
        if (mobileMenuOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
    }, [mobileMenuOpen]);

    const whatsappNumber = "919095774352";
    const whatsappLink = `https://wa.me/${whatsappNumber}?text=Hi Vellankanni Stores, I'd like to inquire about your products.`;

    const content = {
        en: {
            brand: "Vellankanni",
            tag: "Retail Excellence Since 1989",
            heroTitle: "Quality Groceries Trusted Service.",
            heroDesc: "Experience fresh produce, premium essentials, and warm community service right here in Dharapuram.",
            visitBtn: "Visit Our Store",
            learnBtn: "Learn More",
            navAbout: "About",
            navProducts: "Products",
            navLocation: "Location",
            navContact: "Contact",
            whyTitle: "Why shop with us?",
            whyQuote: "\"We don't just sell groceries, we deliver confidence and health to your kitchen.\"",
            features: [
                { title: "Premium Selection", text: "Hand-picked items ranging from local farm produce to global food brands." },
                { title: "Quality Guaranteed", text: "Rigorous quality checks for every item on our shelves. Freshness you can feel." },
                { title: "Doorstep Delivery", text: "Shopping from home? We bring the store to your doorstep across Dharapuram." }
            ],
            deptTitle: "Curated Departments",
            deptSub: "What's on our shelves?",
            deptText: "Everything you need for a healthy lifestyle, carefully organized across our departments.",
            depts: [
                { title: "Grocery & Staples", desc: "Rice, Pulses, Grains & Specialty Oils" },
                { title: "Farm Fresh", desc: "Seasonal Fruits & Local Farm Vegetables" },
                { title: "Home Essentials", desc: "Personal Care, Cleaning & Laundry" },
                { title: "Gourmet Corner", desc: "Snacks, Spices & International Delights" }
            ],
            stats: [
                { label: "Years of Trust", value: "35+" },
                { label: "Daily Customers", value: "200+" },
                { label: "Premium SKUs", value: "5000+" },
                { label: "Locations", value: "Dharapuram" }
            ],
            voicesTitle: "Voices of our Community",
            voicesSub: "What our customers say",
            testimonials: [
                { name: "Nandhini R.", role: "Regular Customer", text: "Vellankanni Stores has been our family's first choice for decades. The quality of rice and pulses is unmatched in Dharapuram." },
                { name: "Suresh Kumar", role: "Local Business Owner", text: "Exceptional service and very organized. Their billing is always accurate, and the home delivery is a lifesaver for my busy schedule." },
                { name: "Priya Lakshmi", role: "Healthcare Professional", text: "I appreciate the cleanliness and the logical arrangement of products. It makes shopping quick and efficient, exactly what I need." }
            ],
            bannerTitle: "Fresh from the Farm to your Table.",
            bannerDesc: "Daily arrivals of organic vegetables and seasonal fruits sourced directly from local farmers.",
            bannerBadges: ["Pesticide Tested", "7AM Fresh Stock"],
            faqTitle: "Common Questions",
            faqDesc: "Clear answers to help you have the best experience with our store.",
            faqItems: [
                { q: "Do you offer home delivery?", a: "Yes! We offer free delivery within Dharapuram town for orders above ₹500. Delivery window is typically 2-4 hours." },
                { q: "What are your payment modes?", a: "We accept Cash, UPI (GPay/PhonePe), Credit Cards, and Debit Cards. We offer digital receipts for all transactions." },
                { q: "Do you have wholesale options?", a: "We provide bulk supplies for hotels, cafes and local events. Please contact the manager for custom pricing." },
                { q: "Is there a loyalty program?", a: "Every purchase is recorded under your mobile number. Frequent shoppers enjoy exclusive festival discounts and reward points." }
            ],
            locTitle: "Find Us in Dharapuram",
            locSub: "Your Neighborhood Store",
            addrLabel: "Official Address",
            addr: "Upputhuraipalayam, Dharapuram, Tamil Nadu - 638656",
            hoursLabel: "Business Hours",
            hours: "Mon - Sun: 7:00 AM - 10:00 PM",
            hoursNote: "Open 365 Days a Year",
            mapBtn: "Open in Google Maps",
            footerMsg: "Serving the Upputhuraipalayam community since 1989 with dedication and fresh supplies.",
            staffLogin: "Staff Login"
        },
        ta: {
            brand: "வெள்ளக்கண்ணி",
            tag: "1989 முதல் சிறந்த விற்பனை சேவை",
            heroTitle: "தரமான மளிகை பொருட்கள், நம்பகமான சேவை.",
            heroDesc: "புதிய காய்கறிகள், உயர்தர பொருட்கள் மற்றும் சிறந்த சேவையை தாராபுரத்தில் எங்களிடம் அனுபவியுங்கள்.",
            visitBtn: "ஸ்டோருக்கு வரவும்",
            learnBtn: "மேலும் அறிய",
            navAbout: "எங்களைப் பற்றி",
            navProducts: "பொருட்கள்",
            navLocation: "இருப்பிடம்",
            navContact: "தொடர்பு",
            whyTitle: "ஏன் எங்களிடம் வாங்க வேண்டும்?",
            whyQuote: "\"நாங்கள் மளிகைப் பொருட்களை மட்டும் விற்பனை செய்வதில்லை, உங்கள் ஆரோக்கியத்திற்கான நம்பிக்கையை வழங்குகிறோம்.\"",
            features: [
                { title: "சிறந்த தயாரிப்புகள்", text: "உள்ளூர் பண்ணைகள் முதல் சர்வதேச பிராண்டுகள் வரை தேர்ந்தெடுக்கப்பட்ட பொருட்கள்." },
                { title: "உத்தரவாதமான தரம்", text: "ஒவ்வொரு பொருளும் தரப் பரிசோதனை செய்யப்பட்ட பின்னரே விற்பனைக்கு வரும்." },
                { title: "டோர் டெலிவரி", text: "வீட்டிலிருந்தே ஆர்டர் செய்யுங்கள்! தாராபுரம் முழுவதும் உங்கள் வீட்டிற்கே கொண்டு வருகிறோம்." }
            ],
            deptTitle: "பிரிவுகள்",
            deptSub: "எங்களிடம் என்ன உள்ளது?",
            deptText: "ஆரோக்கியமான வாழ்க்கை முறைக்குத் தேவையான அனைத்தும் எங்களிடம் சிறப்பாக வரிசைப்படுத்தப்பட்டுள்ளன.",
            depts: [
                { title: "மளிகை பொருட்கள்", desc: "அரிசி, பருப்பு வகைகள் மற்றும் எண்ணெய்கள்" },
                { title: "புதிய காய்கறிகள்", desc: "பண்ணையிலிருந்து நேரடியாக வந்த பழங்கள் மற்றும் காயறிகள்" },
                { title: "வீட்டு உபயோகம்", desc: "சுத்தம் மற்றும் துப்புரவு பொருட்கள்" },
                { title: "திண்பண்டங்கள்", desc: "நொறுக்குத் தீனிகள், மசாலா மற்றும் இனிப்புகள்" }
            ],
            stats: [
                { label: "வருட நம்பிக்கை", value: "35+" },
                { label: "தினசரி வாடிக்கையாளர்கள்", value: "200+" },
                { label: "மொத்த பொருட்கள்", value: "5000+" },
                { label: "கிளைகள்", value: "தாராபுரம்" }
            ],
            voicesTitle: "மக்களின் கருத்துக்கள்",
            voicesSub: "வாடிக்கையாளர்கள் கூறுவது",
            testimonials: [
                { name: "நந்தினி R.", role: "வாடிக்கையாளர்", text: "பல தசாப்தங்களாக வெள்ளக்கண்ணி ஸ்டோர்ஸ் எங்கள் குடும்பத்தின் முதல் விருப்பமாகும். தரம் மிகச் சிறப்பாக உள்ளது." },
                { name: "சுரேஷ் குமார்", role: "வணிக உரிமையாளர்", text: "சிறந்த சேவை மற்றும் நேர்த்தியான நிர்வாகம். பில்லிங் எப்போதும் சரியாக இருக்கும்." },
                { name: "பிரியா லட்சுமி", role: "மருத்துவ நிபுணர்", text: "பொருட்கள் வரிசைப்படுத்தப்பட்ட விதம் அருமை. இது ஷாப்பிங்கை வேகமாகவும் எளிதாகவும் மாற்றுகிறது." }
            ],
            bannerTitle: "பண்ணையிலிருந்து நேரடியாக உங்கள் மேசைக்கு.",
            bannerDesc: "உள்ளூர் விவசாயிகளிடமிருந்து நேரடியாக வரவழைக்கப்படும் புதிய காயறிகள் மற்றும் பழங்கள்.",
            bannerBadges: ["தர சோதனை", "காலை 7 மணி வரத்து"],
            faqTitle: "பொதுவான கேள்விகள்",
            faqDesc: "எங்கள் ஸ்டோர் பற்றிய தெளிவான பதில்கள்.",
            faqItems: [
                { q: "ஹோம் டெலிவரி உண்டா?", a: "ஆம்! ₹500-க்கு மேல் ஆர்டர் செய்தால் தாராபுரம் நகரத்திற்குள் இலவச டெலிவரி." },
                { q: "பணம் செலுத்தும் முறைகள்?", a: "ரொக்கம், UPI (GPay/PhonePe), கிரெடிட்/டெபிட் கார்டுகளை நாங்கள் ஏற்றுக்கொள்கிறோம்." },
                { q: "மொத்த விற்பனை உண்டா?", a: "நிச்சயமாக! ஹோட்டல்கள் மற்றும் விழாக்களுக்கு மொத்த விற்பனை செய்கிறோம்." },
                { q: "சலுகைகள் உண்டா?", a: "உங்கள் மொபைல் எண் மூலம் அனைத்து வாங்குதல்களும் பதிவு செய்யப்படும், சிறப்பு தள்ளுபடிகள் உண்டு." }
            ],
            locTitle: "தாராபுரத்தில் எங்களை அடைய",
            locSub: "உங்கள் அருகிலுள்ள கடை",
            addrLabel: "முகவரி",
            addr: "உப்புத்துறைப்பாளையம், தாராபுரம், தமிழ்நாடு - 638656",
            hoursLabel: "நேரம்",
            hours: "திங்கள் - ஞாயிறு: காலை 7:00 - இரவு 10:00",
            hoursNote: "ஆண்டு முழுவதும் திறந்திருக்கும்",
            mapBtn: "பயண வழிகாட்டி (Maps)",
            footerMsg: "1989 முதல் உப்புத்துறைப்பாளையம் மக்களுக்கு மிகச்சிறந்த சேவையை வழங்கி வருகிறோம்.",
            staffLogin: "பணியாளர் உள்நுழைவு"
        }
    };

    const t = content[lang];

    // LocalBusiness JSON-LD Schema
    const schemaData = {
        "@context": "https://schema.org",
        "@type": "GroceryStore",
        "name": "Vellankanni Stores",
        "image": "https://vellankannistores.com/vellankanni_stores_hero_1772979609958.png",
        "@id": "https://vellankannistores.com",
        "url": "https://vellankannistores.com",
        "telephone": "919095774352",
        "priceRange": "$$",
        "address": {
            "@type": "PostalAddress",
            "streetAddress": "Upputhuraipalayam",
            "addressLocality": "Dharapuram",
            "postalCode": "638656",
            "addressRegion": "Tamil Nadu",
            "addressCountry": "IN"
        },
        "geo": {
            "@type": "GeoCoordinates",
            "latitude": 10.7300,
            "longitude": 77.5200
        },
        "openingHoursSpecification": {
            "@type": "OpeningHoursSpecification",
            "dayOfWeek": [
                "Monday",
                "Tuesday",
                "Wednesday",
                "Thursday",
                "Friday",
                "Saturday",
                "Sunday"
            ],
            "opens": "07:00",
            "closes": "22:00"
        },
        "sameAs": [
            "https://wa.me/919095774352"
        ]
    };

    return (
        <div className="min-h-screen bg-white font-sans text-surface-900 overflow-x-hidden">
            {/* Structured Data for SEO */}
            <script type="application/ld+json">
                {JSON.stringify(schemaData)}
            </script>

            {/* Floating WhatsApp Icon */}
            <a
                href={whatsappLink}
                target="_blank"
                rel="noreferrer"
                aria-label="Chat with Vellankanni Stores on WhatsApp"
                className="fixed bottom-6 right-6 md:bottom-8 md:right-8 z-[200] w-14 h-14 md:w-16 md:h-16 bg-[#25D366] text-white rounded-full shadow-2xl flex items-center justify-center text-2xl md:text-3xl hover:scale-110 transition-transform active:scale-95 group"
            >
                <FaWhatsapp />
                <span className="hidden md:block absolute right-full mr-4 bg-white text-surface-900 px-4 py-2 rounded-xl text-[10px] font-black shadow-xl opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap border pointer-events-none uppercase tracking-widest">
                    {lang === 'en' ? 'Chat with Vellankanni' : 'நேரடியாக பேச'}
                </span>
            </a>

            {/* Dynamic Header */}
            <nav className={`fixed top-0 left-0 right-0 z-[110] transition-all duration-500 ${scrolled ? 'bg-white/90 backdrop-blur-md py-3 shadow-sm border-b' : 'bg-transparent py-4 md:py-6'
                }`}>
                <div className="container mx-auto px-4 md:px-6 flex items-center justify-between">
                    <div className="flex items-center gap-2 md:gap-3">
                        <div className="w-8 h-8 md:w-10 md:h-10 bg-primary rounded-lg md:rounded-xl flex items-center justify-center text-white shadow-lg shadow-primary/30 shrink-0">
                            <span className="text-sm md:text-xl font-black tracking-tighter uppercase leading-none">V B</span>
                        </div>
                        <span className={`text-lg md:text-xl font-display font-black tracking-tight ${scrolled ? 'text-surface-900' : 'text-white'}`}>
                            {t.brand} <span className="text-primary font-bold">Stores</span>
                        </span>
                    </div>

                    <div className="flex items-center gap-3 md:gap-12">
                        {/* Language Switcher */}
                        <button
                            onClick={() => setLang(lang === 'en' ? 'ta' : 'en')}
                            aria-label={`Switch to ${lang === 'en' ? 'Tamil' : 'English'}`}
                            className={`flex items-center gap-2 h-8 md:h-10 px-3 md:px-4 rounded-full border border-current font-black text-[9px] md:text-[10px] uppercase tracking-widest transition-all ${scrolled ? 'text-surface-600' : 'text-white'
                                }`}
                        >
                            <MdTranslate className="text-sm md:text-lg" />
                            <span className="hidden sm:inline">{lang === 'en' ? 'தமிழ்' : 'English'}</span>
                            <span className="sm:hidden">{lang === 'en' ? 'TA' : 'EN'}</span>
                        </button>

                        {/* Desktop Nav */}
                        <div className="hidden lg:flex items-center gap-8">
                            <a href="#about" className={`text-sm font-bold uppercase tracking-widest hover:text-primary transition-colors ${scrolled ? 'text-surface-600' : 'text-white/80'}`}>{t.navAbout}</a>
                            <a href="#categories" className={`text-sm font-bold uppercase tracking-widest hover:text-primary transition-colors ${scrolled ? 'text-surface-600' : 'text-white/80'}`}>{t.navProducts}</a>
                            <a href="#location" className={`text-sm font-bold uppercase tracking-widest hover:text-primary transition-colors ${scrolled ? 'text-surface-600' : 'text-white/80'}`}>{t.navLocation}</a>
                            <a href="#contact" className={`text-sm font-bold uppercase tracking-widest hover:text-primary transition-colors ${scrolled ? 'text-surface-600' : 'text-white/80'}`}>{t.navContact}</a>
                        </div>

                        {/* Mobile Menu Toggle */}
                        <button
                            className={`lg:hidden text-3xl transition-colors ${scrolled ? 'text-surface-900' : 'text-white'}`}
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            aria-label="Toggle Mobile Menu"
                        >
                            {mobileMenuOpen ? <MdClose /> : <MdMenu />}
                        </button>
                    </div>
                </div>
            </nav>

            {/* Mobile Sidebar Navigation */}
            <div className={`fixed inset-0 z-[105] lg:hidden transition-all duration-500 ${mobileMenuOpen ? 'visible opacity-100' : 'invisible opacity-0'}`}>
                <div className="absolute inset-0 bg-surface-900/60 backdrop-blur-sm" onClick={() => setMobileMenuOpen(false)}></div>
                <div className={`absolute right-0 top-0 bottom-0 w-[80%] max-w-sm bg-white shadow-2xl transition-transform duration-500 flex flex-col ${mobileMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}>
                    <div className="p-8 border-b flex justify-between items-center">
                        <span className="font-display font-black text-2xl tracking-tighter">{t.brand} <span className="text-primary">STORES</span></span>
                        <button className="text-2xl" onClick={() => setMobileMenuOpen(false)} aria-label="Close Mobile Menu"><MdClose /></button>
                    </div>
                    <div className="flex-1 overflow-y-auto py-8 px-8 space-y-6">
                        {[
                            { label: t.navAbout, href: "#about" },
                            { label: t.navProducts, href: "#categories" },
                            { label: t.navLocation, href: "#location" },
                            { label: t.navContact, href: "#contact" },
                            { label: t.staffLogin, href: "/login", isLink: true }
                        ].map((link, i) => (
                            link.isLink ? (
                                <Link
                                    key={i}
                                    to={link.href}
                                    className="block text-xl font-black uppercase tracking-widest text-primary border-t pt-6"
                                    onClick={() => setMobileMenuOpen(false)}
                                >
                                    {link.label}
                                </Link>
                            ) : (
                                <a
                                    key={i}
                                    href={link.href}
                                    className="block text-xl font-black uppercase tracking-widest text-surface-400 hover:text-primary transition-colors"
                                    onClick={() => setMobileMenuOpen(false)}
                                >
                                    {link.label}
                                </a>
                            )
                        ))}
                    </div>
                </div>
            </div>

            {/* Hero Section */}
            <section className="relative min-h-screen md:h-[90vh] flex items-center overflow-hidden bg-surface-900 pt-20 md:pt-0" aria-label="Welcome Section">
                <div className="absolute inset-0 z-0">
                    <img
                        src="/vellankanni_stores_hero_1772979609958.png"
                        alt="Interior view of Vellankanni Stores Dharapuram showing fresh groceries"
                        className="w-full h-full object-cover opacity-60 scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-surface-900 via-surface-900/40 md:via-surface-900/20 to-transparent"></div>
                </div>

                <div className="container mx-auto px-4 md:px-6 relative z-10 w-full">
                    <div className="max-w-3xl fade-in text-center md:text-left mx-auto md:mx-0" style={{ animationDelay: '0.2s' }}>
                        <span className="inline-block px-3 md:px-4 py-1.5 rounded-full bg-primary/20 text-primary-300 text-[8px] md:text-[10px] font-black uppercase tracking-[0.2em] mb-4 md:mb-6 border border-primary/30">
                            {t.tag}
                        </span>
                        <h1 className="text-4xl sm:text-5xl md:text-8xl font-display font-black text-white leading-[1.1] tracking-tighter mb-6 md:mb-8">
                            {lang === 'en' ? (
                                <>Quality Groceries <br className="hidden sm:block" /><span className="text-primary uppercase">Trusted</span> Service.</>
                            ) : t.heroTitle}
                        </h1>
                        <p className="text-base md:text-xl text-white/70 font-medium leading-relaxed mb-8 md:mb-10 max-w-lg mx-auto md:mx-0">
                            {t.heroDesc}
                        </p>
                        <div className="flex flex-col sm:flex-row items-center justify-center md:justify-start gap-4">
                            <a href="#location" className="premium-button h-14 md:h-16 w-full sm:w-auto px-10 text-base md:text-lg flex items-center justify-center gap-3">
                                <MdLocationOn className="text-xl md:text-2xl" /> {t.visitBtn}
                            </a>
                            <a href="#about" className="h-14 md:h-16 w-full sm:w-auto px-10 border-2 border-white/20 rounded-xl flex items-center justify-center text-white font-black uppercase tracking-widest hover:bg-white/5 transition-all text-[10px] md:text-xs">
                                {t.learnBtn}
                            </a>
                        </div>
                    </div>
                </div>
            </section>

            {/* Trusted Numbers */}
            <section className="py-8 md:py-12 bg-white border-b overflow-hidden" aria-label="Business Statistics">
                <div className="container mx-auto px-4 md:px-6">
                    <div className="grid grid-cols-2 md:flex md:flex-wrap md:justify-between gap-6 md:gap-12">
                        {t.stats.map((stat, i) => (
                            <div key={i} className="text-center md:text-left">
                                <p className="text-3xl md:text-4xl font-display font-black text-primary mb-1">{stat.value}</p>
                                <p className="text-[9px] md:text-[10px] font-black uppercase tracking-widest text-surface-400">{stat.label}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Feature Grid */}
            <section id="about" className="py-16 md:py-24 bg-surface-50" aria-label="About Our Quality">
                <div className="container mx-auto px-4 md:px-6">
                    <div className="text-center max-w-3xl mx-auto mb-12 md:mb-20">
                        <h2 className="text-3xl md:text-5xl font-display font-black text-surface-900 mb-4 md:mb-6">{t.whyTitle}</h2>
                        <div className="h-1 w-16 md:w-24 bg-primary mx-auto rounded-full mb-6 md:mb-8"></div>
                        <p className="text-surface-500 font-medium text-base md:text-lg italic px-4 md:px-0">"{t.whyQuote}"</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
                        {t.features.map((item, i) => (
                            <div key={i} className="glass-card p-8 md:p-10 hover-lift group">
                                <div className="w-14 h-14 md:w-16 md:h-16 rounded-2xl bg-primary/5 text-primary flex items-center justify-center text-2xl md:text-3xl mb-6 md:mb-8 transition-all duration-500">
                                    {i === 0 ? <MdShoppingBag /> : i === 1 ? <MdCheckCircle /> : <MdLocalShipping />}
                                </div>
                                <h3 className="text-xl md:text-2xl font-black text-surface-900 mb-3 md:mb-4">{item.title}</h3>
                                <p className="text-sm md:text-surface-500 font-medium leading-relaxed">{item.text}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CATEGORIES SECTION */}
            <section id="categories" className="py-16 md:py-24 overflow-hidden relative" aria-label="Product Categories">
                <div className="container mx-auto px-4 md:px-6">
                    <div className="flex flex-col lg:flex-row items-center md:items-end justify-between mb-12 md:mb-16 gap-4 md:gap-6 text-center md:text-left">
                        <div className="max-w-2xl">
                            <span className="text-primary font-black uppercase tracking-widest text-[8px] md:text-[10px]">{t.deptSub}</span>
                            <h2 className="text-3xl md:text-5xl font-display font-black text-surface-900 mt-2 md:mt-4 leading-none">{t.deptTitle}</h2>
                        </div>
                        <p className="text-sm md:text-surface-500 font-bold max-w-sm lg:text-right">{t.deptText}</p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                        {t.depts.map((cat, i) => (
                            <div key={i} className="relative group overflow-hidden rounded-[2rem] md:rounded-[2.5rem] bg-surface-50 p-6 md:p-8 pt-12 md:pt-16 border-2 border-transparent hover:border-primary/20 transition-all duration-500">
                                <div className={`absolute top-0 right-0 w-24 md:w-32 h-24 md:h-32 opacity-5 rounded-bl-full ${i === 0 ? 'bg-amber-500' : i === 1 ? 'bg-emerald-500' : i === 2 ? 'bg-sky-500' : 'bg-rose-500'}`}></div>
                                <div className={`w-12 h-12 md:w-14 md:h-14 rounded-xl md:rounded-2xl text-white flex items-center justify-center text-xl md:text-2xl mb-4 md:mb-6 shadow-lg ${i === 0 ? 'bg-amber-500 shadow-amber-500/20' : i === 1 ? 'bg-emerald-500 shadow-emerald-500/20' : i === 2 ? 'bg-sky-500 shadow-sky-500/20' : 'bg-rose-500 shadow-rose-500/20'}`}>
                                    {i === 0 ? <MdOutlineFastfood /> : i === 1 ? <MdStorefront /> : i === 2 ? <MdCleaningServices /> : <MdOutlineStars />}
                                </div>
                                <h3 className="text-lg md:text-xl font-black text-surface-900 mb-1 md:mb-2">{cat.title}</h3>
                                <p className="text-[11px] md:text-xs font-bold text-surface-400 leading-relaxed">{cat.desc}</p>
                                <div className="mt-6 md:mt-8 flex items-center gap-2 text-primary text-[8px] md:text-[10px] font-black uppercase tracking-widest group-hover:translate-x-2 transition-transform">
                                    {lang === 'en' ? 'Browse' : 'பிரிவை பார்க்க'} <MdKeyboardArrowRight className="text-base md:text-lg" />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* TESTIMONIALS SECTION */}
            <section className="py-16 md:py-24 bg-surface-900 text-white relative overflow-hidden" aria-label="Customer Reviews">
                <div className="container mx-auto px-4 md:px-6 relative z-10">
                    <div className="text-center mb-12 md:mb-20">
                        <MdOutlineStars className="text-4xl md:text-5xl text-primary mx-auto mb-4 md:mb-6" />
                        <h2 className="text-3xl md:text-5xl font-display font-black mb-3 md:mb-4">{t.voicesTitle}</h2>
                        <p className="text-white/40 font-bold uppercase tracking-[0.2em] text-[8px] md:text-[10px]">{t.voicesSub}</p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-10">
                        {t.testimonials.map((test, i) => (
                            <div key={i} className="p-8 md:p-10 rounded-[2rem] md:rounded-[2.5rem] bg-white/5 border border-white/10 backdrop-blur-sm relative group hover:bg-white/10 transition-all">
                                <p className="relative z-10 text-base md:text-lg font-medium leading-relaxed mb-6 md:mb-8 text-white/80 italic">{test.text}</p>
                                <div className="flex items-center gap-3 md:gap-4 border-t border-white/10 pt-6">
                                    <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center text-primary font-black uppercase text-xs">
                                        {test.name[0]}
                                    </div>
                                    <div>
                                        <p className="font-black text-xs md:text-sm uppercase tracking-wider">{test.name}</p>
                                        <p className="text-[8px] md:text-[10px] font-bold text-white/30 uppercase tracking-tighter">{test.role}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* BANNER / FRESH PRODUCE */}
            <section className="h-[50vh] md:h-[60vh] relative flex items-center overflow-hidden" aria-label="Fresh Farm Banner">
                <img
                    src="/fresh_produce_display_1772980026198.png"
                    className="absolute inset-0 w-full h-full object-cover"
                    alt="Sustainable farm fresh organic vegetables at Vellankanni Stores"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/40 to-transparent"></div>
                <div className="container mx-auto px-4 md:px-6 relative z-10">
                    <div className="max-w-xl text-center md:text-left mx-auto md:mx-0">
                        <h2 className="text-3xl md:text-6xl font-display font-black text-white mb-4 md:mb-6 leading-tight">{t.bannerTitle}</h2>
                        <p className="text-sm md:text-lg text-white/70 font-medium mb-6 md:mb-8">{t.bannerDesc}</p>
                        <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 md:gap-4">
                            {t.bannerBadges.map((badge, i) => (
                                <div key={i} className="flex items-center gap-2 px-4 md:px-6 py-2 md:py-3 bg-white/10 backdrop-blur-md rounded-full border border-white/20 text-white font-black uppercase text-[8px] md:text-[10px]">
                                    <MdVerified className="text-primary text-xs md:text-sm" /> {badge}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* FAQ SECTION */}
            <section className="py-16 md:py-24 bg-surface-50" aria-label="Frequently Asked Questions">
                <div className="container mx-auto px-4 md:px-6">
                    <div className="flex flex-col lg:flex-row gap-12 md:gap-20">
                        <div className="lg:w-1/3 space-y-4 md:space-y-6 text-center lg:text-left">
                            <div className="w-12 h-12 md:w-16 md:h-16 rounded-2xl md:rounded-3xl bg-primary flex items-center justify-center text-white text-2xl md:text-3xl shadow-xl shadow-primary/30 mx-auto lg:mx-0">
                                <MdQuestionAnswer />
                            </div>
                            <h2 className="text-3xl md:text-5xl font-display font-black text-surface-900 leading-[1.1]">{t.faqTitle}</h2>
                            <p className="text-sm md:text-surface-500 font-medium">{t.faqDesc}</p>
                            <a href={whatsappLink} className="inline-flex items-center gap-3 text-primary font-black uppercase tracking-widest text-[10px] md:text-xs group">
                                {lang === 'en' ? 'Still have questions? Chat now' : 'மேலும் கேள்விகள் உள்ளதா?'} <MdKeyboardArrowRight className="text-lg md:text-xl group-hover:translate-x-1 transition-transform" />
                            </a>
                        </div>
                        <div className="lg:w-2/3 grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-8">
                            {t.faqItems.map((faq, i) => (
                                <div key={i} className="p-6 md:p-8 rounded-[1.5rem] md:rounded-[2rem] bg-white border border-surface-200 hover:shadow-lg transition-all">
                                    <h4 className="text-base md:text-lg font-black text-surface-900 mb-2 md:mb-4">{faq.q}</h4>
                                    <p className="text-xs md:text-sm text-surface-500 font-medium leading-relaxed">{faq.a}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Location Section */}
            <section id="location" className="py-16 md:py-24" aria-label="Visit Our Store Location">
                <div className="container mx-auto px-4 md:px-6">
                    <div className="flex flex-col lg:flex-row gap-12 md:gap-16 items-center">
                        <div className="flex-1 space-y-6 md:space-y-8 text-center md:text-left w-full">
                            <div>
                                <span className="text-primary font-black uppercase tracking-widest text-[8px] md:text-[10px]">{t.locSub}</span>
                                <h2 className="text-3xl md:text-5xl font-display font-black text-surface-900 mt-2">{t.locTitle}</h2>
                            </div>

                            <div className="space-y-4 md:space-y-6 text-left">
                                <div className="flex items-start gap-4 md:gap-6 p-5 md:p-6 rounded-2xl bg-surface-50 border-l-4 border-primary">
                                    <MdLocationOn className="text-2xl text-primary shrink-0" />
                                    <div>
                                        <h4 className="font-black text-surface-900 uppercase text-[10px] tracking-widest mb-1">{t.addrLabel}</h4>
                                        <address className="text-base md:text-lg font-bold text-surface-600 leading-tight not-italic">{t.addr}</address>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4 md:gap-6 p-5 md:p-6 rounded-2xl bg-surface-50 border-l-4 border-indigo-500">
                                    <MdAccessTime className="text-2xl text-indigo-500 shrink-0" />
                                    <div>
                                        <h4 className="font-black text-surface-900 uppercase text-[10px] tracking-widest mb-1">{t.hoursLabel}</h4>
                                        <p className="text-base md:text-lg font-bold text-surface-600">{t.hours}</p>
                                        <p className="text-[8px] md:text-[10px] uppercase font-black text-indigo-500 mt-1">{t.hoursNote}</p>
                                    </div>
                                </div>
                            </div>

                            <a
                                href="https://www.google.com/maps/search/?api=1&query=Vellankanni+Stores+Upputhuraipalayam+Dharapuram"
                                target="_blank"
                                rel="noreferrer"
                                className="premium-button h-14 md:h-16 w-full px-10 flex items-center justify-center"
                            >
                                {t.mapBtn} <MdKeyboardArrowRight className="text-2xl" />
                            </a>
                        </div>

                        <div className="flex-1 w-full relative group">
                            <div className="relative rounded-[1.5rem] md:rounded-[2rem] overflow-hidden shadow-2xl border-4 md:border-8 border-white h-[350px] md:h-[500px]">
                                <div className="bg-surface-200 h-full w-full flex items-center justify-center relative">
                                    <div className="absolute inset-0 bg-[#e5e5e5]">
                                        <iframe
                                            title="Vellankanni Stores Dharapuram Location Map"
                                            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15668.0!2d77.5!3d10.7!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTDCsDInMDAuMCJOIDc3wrAzMCcwMC4wIkU!5e0!3m2!1sen!2sin!4v1234567890"
                                            width="100%"
                                            height="100%"
                                            style={{ border: 0, filter: 'grayscale(0.3) contrast(1.1)' }}
                                            allowFullScreen=""
                                            loading="lazy"
                                        ></iframe>
                                    </div>
                                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none">
                                        <div className="w-10 h-10 md:w-12 md:h-12 bg-primary rounded-full animate-ping opacity-40"></div>
                                        <MdLocationOn className="text-4xl md:text-5xl text-primary drop-shadow-lg relative -mt-10 md:-mt-12" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Public Footer */}
            <footer id="contact" className="bg-surface-900 py-12 md:py-20 text-white" aria-label="Main Footer">
                <div className="container mx-auto px-4 md:px-6">
                    <div className="flex flex-col lg:flex-row justify-between gap-10 md:gap-12 mb-12 md:mb-16 text-center md:text-left">
                        <div className="max-w-md mx-auto md:mx-0">
                            <div className="flex items-center justify-center md:justify-start gap-3 mb-6 md:mb-8">
                                <div className="w-8 h-8 md:w-10 md:h-10 bg-primary rounded-lg flex items-center justify-center text-white">
                                    <span className="text-base font-black">V B</span>
                                </div>
                                <span className="text-2xl font-display font-black tracking-tight">
                                    {t.brand} <span className="text-primary font-bold">Stores</span>
                                </span>
                            </div>
                            <p className="text-white/40 font-medium leading-relaxed mb-8">
                                {t.footerMsg}
                            </p>
                        </div>

                        <div className="grid grid-cols-2 gap-8 text-left">
                            <div>
                                <h4 className="text-[9px] md:text-[10px] font-black uppercase tracking-widest text-primary mb-4 md:mb-6">{lang === 'en' ? 'Quick Links' : 'விரைவான இணைப்புகள்'}</h4>
                                <ul className="space-y-3 md:space-y-4">
                                    <li><a href="#" className="text-white/60 text-xs md:text-sm font-bold block">{lang === 'en' ? 'Home' : 'முகப்பு'}</a></li>
                                    <li><a href="#about" className="text-white/60 text-xs md:text-sm font-bold block">{t.navAbout}</a></li>
                                    <li><a href="#categories" className="text-white/60 text-xs md:text-sm font-bold block">{t.navProducts}</a></li>
                                    <li><a href="#location" className="text-white/60 text-xs md:text-sm font-bold block">{t.navLocation}</a></li>
                                </ul>
                            </div>
                            <div>
                                <h4 className="text-[9px] md:text-[10px] font-black uppercase tracking-widest text-primary mb-4 md:mb-6">{lang === 'en' ? 'Support' : 'உதவி'}</h4>
                                <ul className="space-y-3 md:space-y-4">
                                    <li><a href="#" className="text-white/60 text-xs md:text-sm font-bold block">{lang === 'en' ? 'Privacy' : 'தனியுரிமை'}</a></li>
                                    <li><a href="#" className="text-white/60 text-xs md:text-sm font-bold block">{lang === 'en' ? 'Tax info' : 'வரி தகவல்'}</a></li>
                                    <li><Link to="/login" className="text-white/60 text-xs md:text-sm font-bold block">{t.staffLogin}</Link></li>
                                    <li><a href={whatsappLink} className="text-white/60 text-xs md:text-sm font-bold block">{lang === 'en' ? 'Help' : 'உதவி'}</a></li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    <div className="pt-8 md:pt-10 border-t border-white/5 text-center">
                        <p className="text-[8px] md:text-[10px] font-black uppercase tracking-[0.3em] text-white/20">
                            © 2026 {t.brand} Stores Dharapuram. All Systems Active.
                        </p>
                    </div>
                </div>
            </footer>

        </div>
    );
}

export default Landing;
