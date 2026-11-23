import { createContext, useContext, useEffect, useMemo, useRef, useState } from 'react';

const translations = {
  en: { home: 'Home', browse: 'Browse equipment', myEquipment: 'My equipment', myRentals: 'My rentals', profile: 'Profile', login: 'Log in', logout: 'Log out', createAccount: 'Create account', language: 'Language' },
  mr: { home: 'मुख्यपृष्ठ', browse: 'उपकरणे पहा', myEquipment: 'माझी उपकरणे', myRentals: 'माझे भाडे', profile: 'प्रोफाइल', login: 'लॉग इन', logout: 'लॉग आउट', createAccount: 'खाते तयार करा', language: 'भाषा' },
};
const marathi = {
  'Hi, ': 'नमस्कार, ', 'Welcome back': 'पुन्हा स्वागत आहे', 'Good to see you again.': 'तुम्हाला पुन्हा पाहून आनंद झाला.',
  'Log in to manage your equipment, discover listings and keep track of rental requests.': 'तुमची उपकरणे व्यवस्थापित करा, यादी पहा आणि भाड्याच्या विनंत्यांचा मागोवा घ्या.',
  'Your AgriConnect account': 'तुमचे AgriConnect खाते', 'Use the email and password you registered with.': 'नोंदणी केलेला ईमेल आणि पासवर्ड वापरा.',
  'Email address': 'ईमेल पत्ता', 'Password': 'पासवर्ड', 'Your password': 'तुमचा पासवर्ड', 'Hide': 'लपवा', 'Show': 'दाखवा',
  'Logging in...': 'लॉग इन होत आहे...', 'New to AgriConnect?': 'AgriConnect वर नवीन आहात?', 'Create an account': 'खाते तयार करा',
  'Grow together': 'एकत्र वाढूया', 'Join the farmer community.': 'शेतकरी समुदायात सामील व्हा.',
  'Create an account as an equipment owner or as a farmer looking to rent.': 'उपकरण मालक किंवा भाड्याने उपकरणे घेऊ इच्छिणारा शेतकरी म्हणून खाते तयार करा.',
  'Create your account': 'तुमचे खाते तयार करा', 'Welcome to AgriConnect': 'AgriConnect मध्ये स्वागत आहे', 'Enter your details to get started.': 'सुरुवात करण्यासाठी तुमची माहिती भरा.',
  'Full name': 'पूर्ण नाव', 'Mobile number': 'मोबाईल नंबर', 'Location': 'ठिकाण', 'Account type': 'खात्याचा प्रकार',
  'Choose account type': 'खात्याचा प्रकार निवडा', 'Equipment owner': 'उपकरण मालक', 'Farmer / renter': 'शेतकरी / भाडेकरू',
  'Confirm password': 'पासवर्ड पुन्हा भरा', 'Enter password again': 'पासवर्ड पुन्हा भरा', 'I confirm that the details entered are correct.': 'मी भरलेली माहिती अचूक असल्याची पुष्टी करतो/करते.',
  'Creating account...': 'खाते तयार होत आहे...', 'Already have an account?': 'आधीच खाते आहे?',
  'Discover machinery near you': 'तुमच्या जवळील यंत्रसामग्री शोधा', 'Available equipment': 'उपलब्ध उपकरणे', 'Search equipment shared by fellow farmers.': 'इतर शेतकऱ्यांनी शेअर केलेली उपकरणे शोधा.',
  '＋ List equipment': '＋ उपकरण सूचीबद्ध करा', 'Search equipment': 'उपकरणे शोधा', 'Name, brand, owner or description...': 'नाव, ब्रँड, मालक किंवा वर्णन...',
  'Category': 'प्रकार', 'All categories': 'सर्व प्रकार', 'Sort by': 'क्रमवारी', 'Recommended': 'शिफारस केलेले', 'Price: low to high': 'किंमत: कमी ते जास्त', 'Price: high to low': 'किंमत: जास्त ते कमी', 'Name: A to Z': 'नाव: अ ते ज्ञ', 'Newest first': 'नवीन प्रथम',
  'Reset': 'रीसेट', 'Searching...': 'शोधत आहे...', 'Results update as you change filters': 'फिल्टर बदलल्यावर निकाल अपडेट होतात', 'Finding equipment...': 'उपकरणे शोधत आहे...', 'No equipment found': 'उपकरणे सापडली नाहीत', 'Clear filters': 'फिल्टर साफ करा',
  'My equipment': 'माझी उपकरणे', 'Owner workspace': 'मालक कार्यक्षेत्र', 'Manage the agricultural equipment you have listed.': 'तुम्ही सूचीबद्ध केलेली कृषी उपकरणे व्यवस्थापित करा.', '＋ Add equipment': '＋ उपकरण जोडा', 'Loading your listings...': 'तुमच्या याद्या लोड होत आहेत...', 'No listings yet': 'अजून कोणतीही यादी नाही', 'Add equipment': 'उपकरण जोडा',
  'Rental activity': 'भाडे क्रियाकलाप', 'My rentals & requests': 'माझे भाडे आणि विनंत्या', 'Track requests you have sent and requests received for your equipment.': 'तुम्ही पाठवलेल्या आणि तुमच्या उपकरणांसाठी आलेल्या विनंत्यांचा मागोवा घ्या.', 'Requests I sent': 'मी पाठवलेल्या विनंत्या', 'Requests received': 'आलेल्या विनंत्या', 'Loading rental requests...': 'भाड्याच्या विनंत्या लोड होत आहेत...', 'No requests sent yet': 'अजून विनंत्या पाठवलेल्या नाहीत', 'No requests received': 'कोणत्याही विनंत्या आलेल्या नाहीत', 'Accept': 'स्वीकारा', 'Reject': 'नकार द्या', 'Cancel request': 'विनंती रद्द करा',
  'Account settings': 'खाते सेटिंग्ज', 'My profile': 'माझे प्रोफाइल', 'Manage the contact details shown to the AgriConnect platform.': 'AgriConnect वर दाखवलेली संपर्क माहिती व्यवस्थापित करा.',
  'Helping farmers share resources and find the equipment they need.': 'शेतकऱ्यांना संसाधने शेअर करण्यास आणि आवश्यक उपकरणे शोधण्यास मदत.', 'Explore': 'एक्सप्लोर करा', 'Join the community': 'समुदायात सामील व्हा', 'Academic project': 'शैक्षणिक प्रकल्प',
  'Share your machinery': 'तुमची यंत्रसामग्री शेअर करा', 'Edit equipment': 'उपकरण संपादित करा', 'List your equipment': 'तुमचे उपकरण सूचीबद्ध करा', 'Add clear and accurate details so other farmers can find your listing.': 'इतर शेतकऱ्यांना तुमची यादी सापडण्यासाठी स्पष्ट आणि अचूक माहिती द्या.',
  'Equipment name *': 'उपकरणाचे नाव *', 'Select category': 'प्रकार निवडा', 'Rental price per day (₹) *': 'दररोजचे भाडे (₹) *', 'Excellent': 'उत्कृष्ट', 'Good': 'चांगले', 'Fair': 'समाधानकारक', 'Select condition': 'स्थिती निवडा', 'Description *': 'वर्णन *', 'Equipment photograph': 'उपकरणाचा फोटो', 'Upload JPG, PNG or WebP (maximum 5 MB), or paste a public HTTPS image URL.': 'JPG, PNG किंवा WebP अपलोड करा (कमाल 5 MB), किंवा सार्वजनिक HTTPS इमेज URL द्या.', 'Image URL': 'इमेज URL', 'Equipment preview': 'उपकरणाचा पूर्वदृश्य',
  '← My equipment': '← माझी उपकरणे', '← Back to equipment': '← उपकरणांकडे परत', 'Plan your rental': 'तुमचे भाडे नियोजित करा', '/ day': '/ दिवस', 'You will need to': 'तुम्हाला', 'to submit a request.': 'विनंती पाठवण्यासाठी लॉग इन करावे लागेल.', 'The owner must accept your request before the rental is confirmed.': 'भाडे निश्चित होण्यापूर्वी मालकाने तुमची विनंती स्वीकारणे आवश्यक आहे.',
  'Explore equipment and send a rental request when you find what you need.': 'आवश्यक उपकरणे सापडल्यावर ती एक्सप्लोर करा आणि भाड्याची विनंती पाठवा.', 'When another farmer requests your equipment, it will appear here.': 'दुसरा शेतकरी तुमच्या उपकरणाची विनंती केल्यावर ती येथे दिसेल.',
  'Please correct the highlighted fields.': 'कृपया ठळक केलेली माहिती दुरुस्त करा.', 'Registration successful. Please log in.': 'नोंदणी यशस्वी झाली. कृपया लॉग इन करा.', 'Password length:': 'पासवर्डची लांबी:', 'Weak': 'कमकुवत',
  'Page not found': 'पृष्ठ सापडले नाही', 'The page you are looking for does not exist.': 'तुम्ही शोधत असलेले पृष्ठ अस्तित्वात नाही.', 'Go home': 'मुख्यपृष्ठावर जा',
  'View details': 'तपशील पहा', 'Edit': 'संपादित करा', 'Delete': 'हटवा', ' / day': ' / दिवस', 'Brand / Power': 'ब्रँड / क्षमता', 'Condition': 'स्थिती', 'Fuel / Type': 'इंधन / प्रकार', 'Daily rental': 'दररोजचे भाडे', 'Not specified': 'नमूद केलेले नाही', 'Rental start date': 'भाडे सुरू होण्याची तारीख', 'Rental end date': 'भाडे संपण्याची तारीख', 'Duration': 'कालावधी', 'Estimated total': 'अंदाजे एकूण', 'This equipment is currently unavailable.': 'हे उपकरण सध्या उपलब्ध नाही.',
};
const LanguageContext = createContext(null);
export function LanguageProvider({ children }) {
  const [language, setLanguageState] = useState(() => localStorage.getItem('agriconnect-language') || 'mr');
  const originalsRef = useRef(new WeakMap());
  const setLanguage = (next) => { setLanguageState(next); localStorage.setItem('agriconnect-language', next); };
  const value = useMemo(() => ({ language, setLanguage, t: (key) => translations[language][key] || translations.en[key] || key }), [language]);
  useEffect(() => {
    const originals = originalsRef.current;
    const translate = () => {
      const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
      let node;
      while ((node = walker.nextNode())) {
        if (!originals.has(node)) originals.set(node, node.nodeValue);
        const original = originals.get(node);
        const trimmed = original.trim();
        if (!trimmed) continue;
        const translated = language === 'mr' ? marathi[trimmed] : trimmed;
        if (translated) node.nodeValue = original.replace(trimmed, translated);
      }
      document.querySelectorAll('input[placeholder], textarea[placeholder], [aria-label]').forEach((element) => {
        ['placeholder', 'aria-label'].forEach((attribute) => {
          if (!element.hasAttribute(attribute)) return;
          const key = `data-original-${attribute}`;
          if (!element.hasAttribute(key)) element.setAttribute(key, element.getAttribute(attribute));
          const original = element.getAttribute(key);
          element.setAttribute(attribute, language === 'mr' ? (marathi[original] || original) : original);
        });
      });
    };
    translate();
    const observer = new MutationObserver(translate);
    observer.observe(document.body, { childList: true, subtree: true });
    return () => observer.disconnect();
  }, [language]);
  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}
export function useLanguage() { return useContext(LanguageContext); }
