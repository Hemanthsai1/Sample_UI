import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaRocket, FaCheckCircle, FaUsers, FaClock } from 'react-icons/fa';
import favicon from '../assets/favicon.png';

const DemoPage: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    workEmail: '',
    phoneNumber: '',
    jobTitle: '',
    companyName: '',
    country: '',
    hearAbout: '',
    anythingElse: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.workEmail.trim()) newErrors.workEmail = 'Work email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.workEmail)) newErrors.workEmail = 'Please enter a valid email address';
    if (!formData.phoneNumber.trim()) newErrors.phoneNumber = 'Phone number is required';
    if (!formData.jobTitle.trim()) newErrors.jobTitle = 'Job title is required';
    if (!formData.companyName.trim()) newErrors.companyName = 'Company name is required';
    if (!formData.country.trim()) newErrors.country = 'Country is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    setIsSubmitting(true);

    const emailBody = `Hello,
I would like to request a live demo of VeritaScribe.
Contact Information:
- Name: ${formData.name}
- Work Email: ${formData.workEmail}
- Phone Number: ${formData.phoneNumber}
- Job Title: ${formData.jobTitle}
- Company Name: ${formData.companyName}
- Country: ${formData.country}
- How did you hear about VeritaScribe: ${formData.hearAbout || 'Not specified'}
${formData.anythingElse ? `- Additional Information: ${formData.anythingElse}` : ''}
I'm interested in learning more about your AI-powered document drafting platform.
Best regards,
${formData.name}`;

    const encodedBody = encodeURIComponent(emailBody);
    const emailSubject = encodeURIComponent('Request for Live Demo - VeritaScribe');

    window.location.href = `mailto:parthasarathi.j@ectdglobal.com?subject=${emailSubject}&body=${encodedBody}`;

    setTimeout(() => {
      setIsSubmitting(false);
      setFormData({
        name: '',
        workEmail: '',
        phoneNumber: '',
        jobTitle: '',
        companyName: '',
        country: '',
        hearAbout: '',
        anythingElse: '',
      });
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-teal-50 flex flex-col">
      {/* Compact Navigation */}
      <nav className="bg-white shadow-sm border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center gap-4">
          <button
            onClick={() => navigate('/')}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <FaArrowLeft className="text-gray-600" />
          </button>
          <div className="flex items-center gap-2">
            <img src={favicon} alt="VeritaScribe" className="w-7 h-7 object-contain" />
            <span className="text-lg font-bold bg-gradient-to-r from-pharma-blue to-pharma-teal bg-clip-text text-transparent">
              VeritaScribe
            </span>
          </div>
        </div>
      </nav>

      {/* Main Content - Narrow left, wider form */}
      <div className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid lg:grid-cols-12 gap-6 items-start h-full">
          {/* Left Side - Narrower (4 columns) */}
          <div className="lg:col-span-4 space-y-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                Book a Personalized Live Demo
              </h1>
              <p className="text-sm text-gray-600 leading-tight mb-4">
                Discover how VeritaScribe's AI-powered platform can transform your regulatory document workflows. 
                Save hours of manual work, eliminate errors, and boost efficiency by up to 80%.
              </p>

              <div className="space-y-3">
                <div className="flex items-start gap-2">
                  <div className="mt-0.5 p-1.5 bg-pharma-blue/10 rounded-lg flex-shrink-0">
                    <FaCheckCircle className="text-pharma-blue text-base" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 text-sm mb-0.5">Live Platform Walkthrough</h3>
                    <p className="text-xs text-gray-600">See VeritaScribe in action with examples tailored to your needs.</p>
                  </div>
                </div>

                <div className="flex items-start gap-2">
                  <div className="mt-0.5 p-1.5 bg-pharma-blue/10 rounded-lg flex-shrink-0">
                    <FaUsers className="text-pharma-blue text-base" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 text-sm mb-0.5">Expert Guidance</h3>
                    <p className="text-xs text-gray-600">Get your questions answered by our product specialists.</p>
                  </div>
                </div>

                <div className="flex items-start gap-2">
                  <div className="mt-0.5 p-1.5 bg-pharma-blue/10 rounded-lg flex-shrink-0">
                    <FaClock className="text-pharma-blue text-base" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 text-sm mb-0.5">Flexible Scheduling</h3>
                    <p className="text-xs text-gray-600">We'll contact you within 24 hours to schedule your demo.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - Wider form (8 columns) */}
          <div className="lg:col-span-8 bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl p-6 border border-gray-100">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Schedule Your Demo</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Row 1: Name + Work Email */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label htmlFor="name" className="block text-xs font-medium text-gray-700 mb-1">Full Name *</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 text-sm border rounded-xl focus:outline-none focus:ring-2 transition-all ${
                      errors.name ? 'border-red-300 focus:ring-red-500' : 'border-gray-300 focus:ring-pharma-blue focus:border-transparent'
                    }`}
                    placeholder="John Doe"
                  />
                  {errors.name && <p className="mt-0.5 text-xs text-red-600">{errors.name}</p>}
                </div>

                <div>
                  <label htmlFor="workEmail" className="block text-xs font-medium text-gray-700 mb-1">Work Email *</label>
                  <input
                    type="email"
                    id="workEmail"
                    name="workEmail"
                    value={formData.workEmail}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 text-sm border rounded-xl focus:outline-none focus:ring-2 transition-all ${
                      errors.workEmail ? 'border-red-300 focus:ring-red-500' : 'border-gray-300 focus:ring-pharma-blue focus:border-transparent'
                    }`}
                    placeholder="john@company.com"
                  />
                  {errors.workEmail && <p className="mt-0.5 text-xs text-red-600">{errors.workEmail}</p>}
                </div>
              </div>

              {/* Row 2: Phone Number + Job Title */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label htmlFor="phoneNumber" className="block text-xs font-medium text-gray-700 mb-1">Phone Number *</label>
                  <input
                    type="tel"
                    id="phoneNumber"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 text-sm border rounded-xl focus:outline-none focus:ring-2 transition-all ${
                      errors.phoneNumber ? 'border-red-300 focus:ring-red-500' : 'border-gray-300 focus:ring-pharma-blue focus:border-transparent'
                    }`}
                    placeholder="+1 (555) 123-4567"
                  />
                  {errors.phoneNumber && <p className="mt-0.5 text-xs text-red-600">{errors.phoneNumber}</p>}
                </div>

                <div>
                  <label htmlFor="jobTitle" className="block text-xs font-medium text-gray-700 mb-1">Job Title *</label>
                  <input
                    type="text"
                    id="jobTitle"
                    name="jobTitle"
                    value={formData.jobTitle}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 text-sm border rounded-xl focus:outline-none focus:ring-2 transition-all ${
                      errors.jobTitle ? 'border-red-300 focus:ring-red-500' : 'border-gray-300 focus:ring-pharma-blue focus:border-transparent'
                    }`}
                    placeholder="Regulatory Affairs Manager"
                  />
                  {errors.jobTitle && <p className="mt-0.5 text-xs text-red-600">{errors.jobTitle}</p>}
                </div>
              </div>

              {/* Row 3: Company Name + Country */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label htmlFor="companyName" className="block text-xs font-medium text-gray-700 mb-1">Company Name *</label>
                  <input
                    type="text"
                    id="companyName"
                    name="companyName"
                    value={formData.companyName}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 text-sm border rounded-xl focus:outline-none focus:ring-2 transition-all ${
                      errors.companyName ? 'border-red-300 focus:ring-red-500' : 'border-gray-300 focus:ring-pharma-blue focus:border-transparent'
                    }`}
                    placeholder="Acme Pharmaceuticals"
                  />
                  {errors.companyName && <p className="mt-0.5 text-xs text-red-600">{errors.companyName}</p>}
                </div>

                <div>
                  <label htmlFor="country" className="block text-xs font-medium text-gray-700 mb-1">Country *</label>
                  <input
                    type="text"
                    id="country"
                    name="country"
                    value={formData.country}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 text-sm border rounded-xl focus:outline-none focus:ring-2 transition-all ${
                      errors.country ? 'border-red-300 focus:ring-red-500' : 'border-gray-300 focus:ring-pharma-blue focus:border-transparent'
                    }`}
                    placeholder="United States"
                  />
                  {errors.country && <p className="mt-0.5 text-xs text-red-600">{errors.country}</p>}
                </div>
              </div>

              {/* How did you hear */}
              <div>
                <label htmlFor="hearAbout" className="block text-xs font-medium text-gray-700 mb-1">
                  How did you hear about VeritaScribe?
                </label>
                <select
                  id="hearAbout"
                  name="hearAbout"
                  value={formData.hearAbout}
                  onChange={handleChange}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-pharma-blue focus:border-transparent transition-all"
                >
                  <option value="">Please select</option>
                  <option value="google">Google Search</option>
                  <option value="linkedin">LinkedIn</option>
                  <option value="referral">Referral</option>
                  <option value="event">Industry Event</option>
                  <option value="social-media">Social Media</option>
                  <option value="other">Other</option>
                </select>
              </div>

              {/* Anything Else */}
              <div>
                <label htmlFor="anythingElse" className="block text-xs font-medium text-gray-700 mb-1">
                  Anything else you'd like us to know?
                </label>
                <textarea
                  id="anythingElse"
                  name="anythingElse"
                  value={formData.anythingElse}
                  onChange={handleChange}
                  rows={2}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-pharma-blue focus:border-transparent transition-all resize-none"
                  placeholder="Share specific challenges or use cases..."
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full px-5 py-3 bg-gradient-to-r from-pharma-blue to-pharma-teal text-white rounded-xl font-semibold text-sm hover:shadow-xl transform hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed ${
                  isSubmitting ? 'cursor-wait' : ''
                }`}
              >
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Submitting...
                  </>
                ) : (
                  <>
                    <FaRocket className="text-base" />
                    Request Your Demo
                  </>
                )}
              </button>

              <p className="text-center text-xs text-gray-500 mt-2">
                We typically respond within 24 hours.
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DemoPage;