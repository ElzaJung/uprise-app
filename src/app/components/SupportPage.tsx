import { useState } from 'react';
import { 
  Search, 
  ChevronDown, 
  BarChart2, 
  Map, 
  MessageSquare, 
  User, 
  Mail, 
  Calendar, 
  ArrowRight 
} from 'lucide-react';

// FAQ Data
const faqs = [
  {
    category: "Analysis",
    icon: <BarChart2 className="w-5 h-5 text-emerald-500" />,
    questions: [
      { q: "How accurate is the AI land analysis?", a: "Our AI models use multi-layered geospatial data and historical trends to provide highly accurate initial assessments. However, we always recommend verifying with local authorities before making final decisions." },
      { q: "What data points are included in the report?", a: "Reports include zoning details, topography, soil composition, flood zones, solar potential, and comparative market analysis." }
    ]
  },
  {
    category: "Listings",
    icon: <Map className="w-5 h-5 text-emerald-500" />,
    questions: [
      { q: "How do I list my land?", a: "You can list your land by creating an owner account, navigating to your dashboard, and clicking 'Add New Parcel'. Our AI will auto-fill most of the details." },
      { q: "Can I hide the exact location of my property?", a: "Yes, you can choose to show an approximate location or hide the address until you approve a buyer's request." }
    ]
  },
  {
    category: "Requests",
    icon: <MessageSquare className="w-5 h-5 text-emerald-500" />,
    questions: [
      { q: "How do I communicate with buyers?", a: "All communication happens through our secure internal messaging system. You'll receive email notifications when you get a new message." },
      { q: "What happens when I accept a request?", a: "Accepting a request unlocks the full property details and allows the buyer to schedule an official site visit or make an offer." }
    ]
  },
  {
    category: "Account",
    icon: <User className="w-5 h-5 text-emerald-500" />,
    questions: [
      { q: "How do I reset my password?", a: "Click 'Forgot Password' on the login screen. We will send a secure reset link to your registered email address." },
      { q: "Can I upgrade my subscription plan?", a: "Yes, you can upgrade your plan at any time from the Billing section in your Account Settings." }
    ]
  }
];

export default function SupportPage() {
  const [activeCategory, setActiveCategory] = useState("Analysis");
  const [expandedIndex, setExpandedIndex] = useState<number | null>(0);
  const [searchQuery, setSearchQuery] = useState("");

  const activeFaqs = faqs.find(f => f.category === activeCategory)?.questions || [];

  const searchResults = searchQuery.trim() === "" ? [] : faqs.flatMap(cat => 
    cat.questions.map((q, idx) => ({ ...q, category: cat.category, originalIndex: idx }))
  ).filter(item => 
    item.q.toLowerCase().includes(searchQuery.toLowerCase()) || 
    item.a.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSuggestionClick = (category: string, index: number) => {
    setActiveCategory(category);
    setExpandedIndex(index);
    setSearchQuery("");
    document.getElementById("faq-section")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="bg-[#0a0f18] text-gray-300 font-sans selection:bg-emerald-500/30">
      
      {/* Hero Section */}
      <section className="relative pt-24 pb-16 px-6 lg:px-8 overflow-hidden">
        {/* Background Accents */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[400px] bg-emerald-600/10 blur-[120px] rounded-full pointer-events-none" />
        
        <div className="max-w-3xl mx-auto text-center relative z-10">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 tracking-tight">
            How Can We <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-emerald-600">Help You?</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-400 mb-10">
            Find answers, explore guides, and get support for your land analysis journey.
          </p>

          {/* Search Bar */}
          <div className="relative max-w-2xl mx-auto">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-500" />
            </div>
            <input
              type="text"
              placeholder="Search for articles, guides, or FAQs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-4 bg-[#141d2e] border border-gray-800 rounded-2xl text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all shadow-lg"
            />
            
            {/* Search Suggestions Dropdown */}
            {searchQuery.trim() !== "" && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-[#141d2e] border border-gray-800 rounded-2xl shadow-2xl overflow-hidden z-50 max-h-[300px] overflow-y-auto">
                {searchResults.length > 0 ? (
                  <ul className="flex flex-col">
                    {searchResults.map((result, idx) => (
                      <li key={idx} className="border-b border-gray-800 last:border-0">
                        <button
                          onClick={() => handleSuggestionClick(result.category, result.originalIndex)}
                          className="w-full text-left px-5 py-4 hover:bg-[#1f293d] transition-colors focus:outline-none focus:bg-[#1f293d]"
                        >
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400">
                              {result.category}
                            </span>
                          </div>
                          <p className="text-sm font-medium text-gray-200 line-clamp-1">{result.q}</p>
                          <p className="text-xs text-gray-500 mt-1 line-clamp-1">{result.a}</p>
                        </button>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="p-6 text-center text-gray-500 text-sm">
                    No matching FAQs found for "{searchQuery}"
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq-section" className="py-12 px-6 lg:px-8 max-w-6xl mx-auto scroll-mt-24">
        <div className="grid md:grid-cols-[240px_1fr] gap-10 lg:gap-16">
          
          {/* Categories Sidebar */}
          <div className="flex flex-col gap-2">
            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2 px-3">
              Categories
            </h3>
            {faqs.map((faq) => (
              <button
                key={faq.category}
                onClick={() => {
                  setActiveCategory(faq.category);
                  setExpandedIndex(0); // Reset accordion on category change
                }}
                className={`flex items-center gap-3 w-full px-4 py-3 rounded-xl transition-all duration-200 text-left font-medium ${
                  activeCategory === faq.category
                    ? 'bg-emerald-600/10 text-emerald-400'
                    : 'text-gray-400 hover:bg-[#141d2e] hover:text-gray-200'
                }`}
              >
                <div className={activeCategory === faq.category ? 'opacity-100' : 'opacity-60 grayscale'}>
                  {faq.icon}
                </div>
                {faq.category}
              </button>
            ))}
          </div>

          {/* FAQ Accordion */}
          <div className="flex flex-col gap-4 min-h-[400px]">
            <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
              {faqs.find(f => f.category === activeCategory)?.icon}
              {activeCategory} FAQs
            </h2>
            
            {activeFaqs.map((faq, idx) => (
              <div 
                key={idx}
                className={`bg-[#141d2e] border rounded-2xl overflow-hidden transition-colors duration-300 ${
                  expandedIndex === idx ? 'border-emerald-500/30' : 'border-gray-800 hover:border-gray-700'
                }`}
              >
                <button
                  onClick={() => setExpandedIndex(expandedIndex === idx ? null : idx)}
                  className="w-full flex items-center justify-between p-5 text-left"
                >
                  <span className="font-medium text-gray-100 pr-8">{faq.q}</span>
                  <ChevronDown 
                    className={`w-5 h-5 text-gray-500 flex-shrink-0 transition-transform duration-300 ${
                      expandedIndex === idx ? 'rotate-180 text-emerald-500' : ''
                    }`} 
                  />
                </button>
                <div 
                  className={`px-5 overflow-hidden transition-all duration-300 ease-in-out ${
                    expandedIndex === idx ? 'max-h-48 pb-5 opacity-100' : 'max-h-0 opacity-0'
                  }`}
                >
                  <p className="text-gray-400 leading-relaxed">
                    {faq.a}
                  </p>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* Contact Support Section */}
      <section className="py-16 px-6 lg:px-8 mb-12">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-6">
            
            {/* Contact Card */}
            <div className="bg-[#141d2e] border border-gray-800 rounded-3xl p-8 lg:p-10 flex flex-col justify-center items-start group hover:border-emerald-500/30 transition-colors duration-300 relative overflow-hidden">
              <div className="w-14 h-14 bg-emerald-500/10 rounded-2xl flex items-center justify-center mb-6 text-emerald-500 group-hover:scale-110 group-hover:bg-emerald-500 group-hover:text-white transition-all duration-300 relative z-10">
                <Mail className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-3 relative z-10">Still Need Help?</h3>
              <p className="text-gray-400 mb-8 max-w-sm relative z-10">
                Our team is here to help you navigate your land analysis. Send us a message and we'll reply within 24 hours.
              </p>
              <button onClick={() => window.location.href='/contact'} className="bg-emerald-600 hover:bg-emerald-500 text-white px-6 py-3 rounded-xl font-medium flex items-center gap-2 transition-all active:scale-95 w-full sm:w-auto justify-center relative z-10">
                Contact Support
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            {/* Schedule Demo Card */}
            <div className="bg-[#141d2e] border border-gray-800 rounded-3xl p-8 lg:p-10 flex flex-col justify-center items-start group hover:border-[#FFB600]/30 transition-colors duration-300 relative overflow-hidden">
              {/* Subtle yellow accent background glow */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-[#FFB600]/5 blur-3xl rounded-full pointer-events-none" />
              
              <div className="w-14 h-14 bg-[#FFB600]/10 rounded-2xl flex items-center justify-center mb-6 text-[#FFB600] group-hover:scale-110 group-hover:bg-[#FFB600] group-hover:text-white transition-all duration-300 relative z-10">
                <Calendar className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-3 relative z-10">Schedule a Demo</h3>
              <p className="text-gray-400 mb-8 max-w-sm relative z-10">
                Want to see the platform in action? Book a personalized walkthrough with our land specialists.
              </p>
              <a 
                href="https://calendly.com/francisccm/renewable"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white/5 hover:bg-white/10 border border-white/10 text-white px-6 py-3 rounded-xl font-medium flex items-center gap-2 transition-all active:scale-95 w-full sm:w-auto justify-center relative z-10"
              >
                Book a Time
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>

          </div>
        </div>
      </section>

    </div>
  );
}
