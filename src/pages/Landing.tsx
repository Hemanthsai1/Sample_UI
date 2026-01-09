import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaRocket, FaFileAlt, FaChartLine, FaShieldAlt, FaClock, FaCheckCircle, FaSearch, FaEdit, FaHistory, FaMagic, FaLayerGroup } from 'react-icons/fa';

const Landing: React.FC = () => {
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const problems = [
    { icon: <FaClock />, title: 'Hours of Manual Work', desc: 'Repetitive document drafting takes days' },
    { icon: <FaFileAlt />, title: 'Error-Prone Process', desc: 'Manual entry leads to inconsistencies' },
    { icon: <FaChartLine />, title: 'Delayed Compliance', desc: 'Slow documentation slows approvals' },
  ];

  const solutions = [
    { icon: <FaRocket />, title: 'AI-Powered Automation', desc: 'Automatically fill documents in minutes' },
    { icon: <FaCheckCircle />, title: 'Zero Errors', desc: 'AI ensures consistency and accuracy' },
    { icon: <FaShieldAlt />, title: 'Faster Compliance', desc: 'Accelerate regulatory submissions' },
  ];

  const impacts = [
    { metric: '90%', label: 'Time Saved' },
    { metric: '100%', label: 'Accuracy' },
    { metric: '5x', label: 'Faster' },
  ];

  const features = [
    {
      icon: <FaSearch />,
      title: 'Advanced Search',
      description: 'Search anything in your document with real-time highlighting and match counting. Find specific terms, phrases, or sections instantly.',
      image: '/Search.png',
    },
    {
      icon: <FaEdit />,
      title: 'Edit & Review',
      description: 'Edit and review anything in your document with live updates. Make changes to fields, tables, and content, then save your changes instantly.',
      image: '/Edit_review.png',
    },
    {
      icon: <FaHistory />,
      title: 'Track Changes',
      description: 'Track changes option that monitors what is changed in your document. See all modifications with visual diff showing added, removed, and modified content.',
      image: '/trackchanges.png',
    },
    {
      icon: <FaMagic />,
      title: 'AI Summarization',
      description: 'Summarization using AI for anything in your document. Get intelligent summaries of sections or entire documents with key points extracted automatically.',
      image: '/summarize.png',
    },
    {
      icon: <FaLayerGroup />,
      title: 'Customize Section',
      description: 'Add or remove sections in your document based on your requirements. Dynamically customize document structure by inserting new sections or removing unnecessary ones with ease.',
      image: '/Edit_review.png', // Using Edit_review as fallback since no customize image
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-white/80 backdrop-blur-md shadow-sm z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <FaFileAlt className="text-2xl text-pharma-blue" />
            <span className="text-2xl font-bold bg-gradient-to-r from-pharma-blue to-pharma-teal bg-clip-text text-transparent">
              Veritascribe
            </span>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/demo')}
              className="px-6 py-2 bg-gradient-to-r from-pharma-blue to-pharma-teal text-white rounded-lg font-semibold hover:shadow-lg transition-all transform hover:-translate-y-0.5"
            >
              Schedule a Demo
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className={`text-5xl md:text-6xl lg:text-7xl font-extrabold mb-6 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            AI-Powered Document Drafting
            <span className="block bg-gradient-to-r from-pharma-blue via-pharma-teal to-blue-600 bg-clip-text text-transparent">
              for Pharma
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Reduce hours of manual regulatory documentation to minutes.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button
              onClick={() => navigate('/templates')}
              className="px-8 py-4 bg-white text-pharma-blue border-2 border-pharma-blue rounded-xl font-semibold text-lg hover:bg-pharma-blue hover:text-white transition-all"
            >
              See Samples
            </button>
          </div>
        </div>
      </section>

      {/* Problem Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-12 text-gray-800">The Problem</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {problems.map((problem, idx) => (
              <div
                key={idx}
                className="bg-red-50 border-2 border-red-200 rounded-2xl p-8 hover:shadow-xl transition-all transform hover:-translate-y-2"
              >
                <div className="text-4xl text-red-500 mb-4">{problem.icon}</div>
                <h3 className="text-xl font-bold mb-2 text-gray-800">{problem.title}</h3>
                <p className="text-gray-600">{problem.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Solution Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-blue-50 to-blue-50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-12 text-gray-800">The Solution</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {solutions.map((solution, idx) => (
              <div
                key={idx}
                className="bg-white border-2 border-green-200 rounded-2xl p-8 hover:shadow-xl transition-all transform hover:-translate-y-2"
              >
                <div className="text-4xl text-green-500 mb-4">{solution.icon}</div>
                <h3 className="text-xl font-bold mb-2 text-gray-800">{solution.title}</h3>
                <p className="text-gray-600">{solution.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Powerful Features Section */}
      <section id="features" className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-4 text-gray-800">Powerful Features</h2>
          <p className="text-center text-xl text-gray-600 mb-12">
            Everything you need to streamline your document workflow
          </p>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            {features.map((feature, idx) => (
              <div
                key={idx}
                className={`bg-white border-2 border-gray-200 rounded-2xl overflow-hidden hover:border-pharma-blue hover:shadow-xl transition-all transform hover:-translate-y-2 ${
                  idx >= 3 ? 'lg:col-start-2' : ''
                }`}
              >
                <div className="relative h-48 overflow-hidden bg-gray-100">
                  <img
                    src={feature.image}
                    alt={feature.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-3 text-gray-800">{feature.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Impact Section */}
          <div className="mt-16">
            <h2 className="text-4xl font-bold text-center mb-12 text-gray-800">The Impact</h2>
            <div className="grid md:grid-cols-3 gap-8">
              {impacts.map((impact, idx) => (
                <div
                  key={idx}
                  className="text-center bg-gradient-to-br from-pharma-blue to-pharma-teal rounded-2xl p-8 text-white hover:shadow-2xl transition-all transform hover:scale-105"
                >
                  <div className="text-6xl font-extrabold mb-2">{impact.metric}</div>
                  <div className="text-xl font-semibold">{impact.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Document Types */}
          <div className="mt-16">
            <h3 className="text-2xl font-bold text-center mb-8 text-gray-800">Supported Document Types</h3>
            <div className="grid md:grid-cols-5 gap-6">
              {['IND', 'NDA', 'ANDA', 'DMF', 'Photostability'].map((type) => (
                <div
                  key={type}
                  className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-6 text-center border-2 border-gray-200 hover:border-pharma-blue transition-all"
                >
                  <FaFileAlt className="text-3xl text-pharma-blue mx-auto mb-2" />
                  <div className="font-bold text-gray-800">{type}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-pharma-blue to-pharma-teal">
        <div className="max-w-4xl mx-auto text-center text-white">
          <h2 className="text-4xl font-bold mb-4">Ready to Transform Your Workflow?</h2>
          <p className="text-xl mb-8 opacity-90">Experience the power of AI-driven document automation</p>
        </div>
      </section>
    </div>
  );
};

export default Landing;

