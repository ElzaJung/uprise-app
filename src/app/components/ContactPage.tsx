import { useState } from 'react';
import { Mail, MessageSquare, Phone, Send, MapPin } from 'lucide-react';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
      setFormData({ name: '', email: '', subject: '', message: '' });
    }, 1500);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <div className="bg-[#0a0f18] text-gray-300 font-sans min-h-screen selection:bg-emerald-500/30 pb-20">
      {/* Hero Section */}
      <section className="relative pt-24 pb-12 px-6 lg:px-8 overflow-hidden">
        {/* Background Accents */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[300px] bg-emerald-600/10 blur-[100px] rounded-full pointer-events-none" />
        
        <div className="max-w-3xl mx-auto text-center relative z-10">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 tracking-tight">
            Get in <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-emerald-600">Touch</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto">
            Whether you have a question about our land analysis, pricing, or need technical support, our team is ready to answer all your questions.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="px-6 lg:px-8 max-w-6xl mx-auto relative z-10">
        <div className="grid lg:grid-cols-[1fr_1.5fr] gap-12 lg:gap-20">
          
          {/* Contact Info Sidebar */}
          <div className="flex flex-col gap-8">
            <div>
              <h2 className="text-2xl font-bold text-white mb-6">Contact Information</h2>
              <p className="text-gray-400 mb-8 leading-relaxed">
                Fill out the form and our team will get back to you within 24 hours. For immediate assistance, please check our Support page.
              </p>
            </div>

            <div className="flex flex-col gap-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-[#141d2e] border border-gray-800 rounded-xl flex items-center justify-center text-emerald-500 shrink-0">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-white font-medium mb-1">Email Us</h3>
                  <p className="text-gray-400 text-sm mb-1">Our friendly team is here to help.</p>
                  <a href="mailto:hello@uprise.ai" className="text-emerald-400 hover:text-emerald-300 text-sm font-medium transition-colors">
                    hello@uprise.ai
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-[#141d2e] border border-gray-800 rounded-xl flex items-center justify-center text-[#FFB600] shrink-0">
                  <MessageSquare className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-white font-medium mb-1">Live Chat</h3>
                  <p className="text-gray-400 text-sm mb-1">Available Mon-Fri, 9am-5pm EST.</p>
                  <button className="text-[#FFB600] hover:text-[#e5a400] text-sm font-medium transition-colors">
                    Start a conversation
                  </button>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-[#141d2e] border border-gray-800 rounded-xl flex items-center justify-center text-blue-500 shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-white font-medium mb-1">Office</h3>
                  <p className="text-gray-400 text-sm mb-1">Come say hello at our HQ.</p>
                  <p className="text-gray-500 text-sm">
                    100 Innovation Drive<br />
                    San Francisco, CA 94111
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-[#141d2e] border border-gray-800 rounded-3xl p-8 lg:p-10 shadow-2xl relative overflow-hidden">
            {/* Subtle top border glow */}
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-emerald-500/50 to-transparent" />
            
            {isSuccess ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-12 animate-in fade-in zoom-in duration-500">
                <div className="w-20 h-20 bg-emerald-500/10 rounded-full flex items-center justify-center mb-6 text-emerald-500">
                  <Send className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">Message Sent!</h3>
                <p className="text-gray-400 max-w-sm">
                  Thanks for reaching out. We've received your message and will get back to you shortly.
                </p>
                <button 
                  onClick={() => setIsSuccess(false)}
                  className="mt-8 text-emerald-400 hover:text-emerald-300 font-medium text-sm transition-colors"
                >
                  Send another message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="flex flex-col gap-2">
                    <label htmlFor="name" className="text-sm font-medium text-gray-300">
                      First Name
                    </label>
                    <input
                      id="name"
                      name="name"
                      type="text"
                      required
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Jane Doe"
                      className="bg-[#0a0f18] border border-gray-800 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all"
                    />
                  </div>
                  
                  <div className="flex flex-col gap-2">
                    <label htmlFor="email" className="text-sm font-medium text-gray-300">
                      Email Address
                    </label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="jane@example.com"
                      className="bg-[#0a0f18] border border-gray-800 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <label htmlFor="subject" className="text-sm font-medium text-gray-300">
                    Subject
                  </label>
                  <select
                    id="subject"
                    name="subject"
                    required
                    value={formData.subject}
                    onChange={handleChange}
                    className="bg-[#0a0f18] border border-gray-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all appearance-none"
                  >
                    <option value="" disabled className="text-gray-600">Select a topic...</option>
                    <option value="sales">Sales & Pricing</option>
                    <option value="support">Technical Support</option>
                    <option value="partnership">Partnership Inquiry</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div className="flex flex-col gap-2">
                  <label htmlFor="message" className="text-sm font-medium text-gray-300">
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    required
                    rows={5}
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="How can we help you?"
                    className="bg-[#0a0f18] border border-gray-800 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-emerald-600 hover:bg-emerald-500 text-white font-medium py-4 rounded-xl transition-all active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-2"
                >
                  {isSubmitting ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      Send Message
                      <Send className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
