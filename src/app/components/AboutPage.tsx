import { useNavigate } from 'react-router';
import { TrendingUp, Target, Lightbulb, Users, ArrowRight } from 'lucide-react';

export default function AboutPage() {
  const navigate = useNavigate();

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="relative pt-32 pb-24 overflow-hidden bg-white border-b border-gray-100 flex items-center justify-center min-h-[80vh]">
        {/* Abstract Background Visuals */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
          {/* Subtle Grid Pattern */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#05966908_1px,transparent_1px),linear-gradient(to_bottom,#05966908_1px,transparent_1px)] bg-[size:48px_48px]"></div>
          
          {/* Topographic Lines / Abstract Mesh Background Image */}
          <div 
            className="absolute inset-0 opacity-[0.03] mix-blend-multiply transition-opacity duration-1000"
            style={{ 
              backgroundImage: "url('https://images.unsplash.com/photo-1760783320600-32f1d32f5ded?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb250b3VyJTIwbWFwJTIwbGluZXMlMjBhYnN0cmFjdCUyMGxpZ2h0fGVufDF8fHx8MTc3NDYzMjI5Nnww&ixlib=rb-4.1.0&q=80&w=1080')", 
              backgroundSize: 'cover', 
              backgroundPosition: 'center' 
            }}
          ></div>
          
          {/* Soft Glow Orbs */}
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[50%] bg-emerald-100/40 rounded-full blur-[120px]"></div>
          <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[50%] bg-[#FFB600]/10 rounded-full blur-[120px]"></div>
        </div>

        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-4xl mx-auto flex flex-col items-center text-center">
            
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-100 text-emerald-700 text-sm font-semibold mb-8 animate-fade-in">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              Empowering the Future of Land
            </div>

            <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold text-gray-900 tracking-tight leading-[1.1] mb-6">
              Unlocking the True <br className="hidden md:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-emerald-800">
                Potential of Land
              </span>
            </h1>
            
            <p className="text-lg md:text-xl text-gray-600 leading-relaxed max-w-2xl mb-10 font-medium">
              Uprise.ai helps landowners, developers, and investors discover, analyze, and activate land opportunities using AI-powered insights.
            </p>
            
            <button
              onClick={() => navigate('/auth')}
              className="group px-8 py-4 bg-gray-900 text-white rounded-xl hover:bg-gray-800 transition-all font-semibold text-lg flex items-center justify-center gap-3 shadow-xl shadow-gray-900/10 hover:shadow-gray-900/20 active:scale-[0.98] w-full sm:w-auto"
            >
              Get Started
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </section>

      {/* Problem Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">The Problem</h2>
              <p className="text-lg text-gray-600">
                Land owners face critical challenges that prevent them from maximizing their assets
              </p>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center p-6">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-3xl">🤔</span>
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Unknown Potential</h3>
                <p className="text-gray-600">
                  Most land sits underutilized because owners don't know what's possible
                </p>
              </div>
              <div className="text-center p-6">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-3xl">🔍</span>
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">No Visibility</h3>
                <p className="text-gray-600">
                  Finding the right collaborators or buyers is time-consuming and opaque
                </p>
              </div>
              <div className="text-center p-6">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-3xl">💸</span>
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">High Barriers</h3>
                <p className="text-gray-600">
                  Traditional analysis is expensive, slow, and requires specialized expertise
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Solution Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Solution</h2>
              <p className="text-lg text-gray-600">
                A two-sided platform that combines AI-powered analysis with a transparent marketplace
              </p>
            </div>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-white rounded-2xl p-8 border border-gray-200">
                <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center mb-4">
                  <Lightbulb className="size-6 text-emerald-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Intelligent Analysis</h3>
                <p className="text-gray-600 mb-4">
                  Our AI evaluates your land across multiple sectors—energy, agriculture, community 
                  development, and tourism—providing detailed viability scores and actionable insights.
                </p>
                <ul className="space-y-2 text-gray-600">
                  <li className="flex items-start gap-2">
                    <span className="text-emerald-600 mt-1">✓</span>
                    <span>Sector-specific feasibility scoring</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-emerald-600 mt-1">✓</span>
                    <span>Regulatory and zoning analysis</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-emerald-600 mt-1">✓</span>
                    <span>Risk identification and mitigation</span>
                  </li>
                </ul>
              </div>
              <div className="bg-white rounded-2xl p-8 border border-gray-200">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                  <Users className="size-6 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Transparent Marketplace</h3>
                <p className="text-gray-600 mb-4">
                  Connect with qualified collaborators and buyers who are actively searching for 
                  land opportunities that match their criteria.
                </p>
                <ul className="space-y-2 text-gray-600">
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600 mt-1">✓</span>
                    <span>Verified user profiles</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600 mt-1">✓</span>
                    <span>Secure messaging system</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600 mt-1">✓</span>
                    <span>Privacy controls for sensitive data</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Vision & Mission */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-12">
            <div>
              <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center mb-4">
                <Target className="size-6 text-emerald-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Our Mission</h2>
              <p className="text-gray-600 leading-relaxed">
                To empower land owners with the insights and connections they need to unlock 
                the full potential of their property—whether that's renewable energy development, 
                sustainable agriculture, community projects, or tourism ventures.
              </p>
            </div>
            <div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <TrendingUp className="size-6 text-blue-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Our Vision</h2>
              <p className="text-gray-600 leading-relaxed">
                A world where every piece of land is utilized to its highest potential, creating 
                value for owners, communities, and the environment through intelligent analysis 
                and transparent collaboration.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-emerald-600 to-blue-600">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Ready to Discover Your Land's Potential?</h2>
          <p className="text-xl text-emerald-50 mb-8 max-w-2xl mx-auto">
            Join thousands of land owners and collaborators who are making smarter decisions with Uprise.ai
          </p>
          <button
            onClick={() => navigate('/auth')}
            className="px-8 py-4 bg-white text-emerald-600 rounded-lg hover:bg-gray-50 transition-colors font-semibold inline-flex items-center gap-2"
          >
            Get Started Today
            <ArrowRight className="size-5" />
          </button>
        </div>
      </section>
    </div>
  );
}
