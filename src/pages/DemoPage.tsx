import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaRocket } from 'react-icons/fa';
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
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.workEmail.trim()) {
      newErrors.workEmail = 'Work email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.workEmail)) {
      newErrors.workEmail = 'Please enter a valid email address';
    }

    if (!formData.phoneNumber.trim()) {
      newErrors.phoneNumber = 'Phone number is required';
    }

    if (!formData.jobTitle.trim()) {
      newErrors.jobTitle = 'Job title is required';
    }

    if (!formData.companyName.trim()) {
      newErrors.companyName = 'Company name is required';
    }

    if (!formData.country.trim()) {
      newErrors.country = 'Country is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    // Create email body with form data
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

    // Encode the email body for mailto link
    const encodedBody = encodeURIComponent(emailBody);
    const emailSubject = encodeURIComponent('Request for Live Demo - VeritaScribe');
    
    // Open email client
    window.location.href = `mailto:parthasarathi.j@ectdglobal.com?subject=${emailSubject}&body=${encodedBody}`;
    
    // Reset form after a short delay
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50">
      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur-md shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center gap-4">
          <button
            onClick={() => navigate('/')}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <FaArrowLeft className="text-gray-600" />
          </button>
          <div className="flex items-center gap-3">
            <img
              src={favicon}
              alt="VeritaScribe"
              className="w-8 h-8 object-contain"
            />
            <span className="text-xl font-bold bg-gradient-to-r from-pharma-blue to-pharma-teal bg-clip-text text-transparent">
              VeritaScribe
            </span>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="grid lg:grid-cols-2 gap-6 items-start">
          {/* Left Side - Content */}
          <div className="flex flex-col justify-center space-y-3">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 mb-3">
                Schedule Your Demo session
              </h1>
              <p className="text-base text-gray-600 leading-relaxed mb-4">
                See how the VeritaScribe can help you to Save hours of Manual work in minutes, eliminate human errors and increase efficiency by 80% in Document Automation
              </p>
              <ul className="space-y-2">
                <li className="flex items-start gap-2">
                  <span className="text-pharma-blue text-lg mt-0.5">•</span>
                  <span className="text-gray-700 text-sm">Get all your Question answered</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-pharma-blue text-lg mt-0.5">•</span>
                  <span className="text-gray-700 text-sm">walkthrough of the platform</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Right Side - Form */}
          <div className="bg-white rounded-2xl shadow-xl p-4 border border-gray-100">
            <form onSubmit={handleSubmit} className="space-y-2.5">
              {/* Name */}
              <div>
                <label htmlFor="name" className="block text-xs font-semibold text-gray-700 mb-1">
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 transition-all ${
                    errors.name
                      ? 'border-red-300 focus:ring-red-500'
                      : 'border-gray-300 focus:ring-pharma-blue focus:border-transparent'
                  }`}
                  placeholder="Enter your name"
                />
                {errors.name && (
                  <p className="mt-0.5 text-xs text-red-600">{errors.name}</p>
                )}
              </div>

              {/* Name */}
              <div>
                <label htmlFor="name" className="block text-xs font-semibold text-gray-700 mb-1">
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 transition-all ${
                    errors.name
                      ? 'border-red-300 focus:ring-red-500'
                      : 'border-gray-300 focus:ring-pharma-blue focus:border-transparent'
                  }`}
                  placeholder="Enter your name"
                />
                {errors.name && (
                  <p className="mt-0.5 text-xs text-red-600">{errors.name}</p>
                )}
              </div>

              {/* Work Email */}
              <div>
                <label htmlFor="workEmail" className="block text-xs font-semibold text-gray-700 mb-1">
                  Work Email
                </label>
                <input
                  type="email"
                  id="workEmail"
                  name="workEmail"
                  value={formData.workEmail}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 transition-all ${
                    errors.workEmail
                      ? 'border-red-300 focus:ring-red-500'
                      : 'border-gray-300 focus:ring-pharma-blue focus:border-transparent'
                  }`}
                  placeholder="your.email@company.com"
                />
                {errors.workEmail && (
                  <p className="mt-0.5 text-xs text-red-600">{errors.workEmail}</p>
                )}
              </div>

              {/* Phone Number */}
              <div>
                <label htmlFor="phoneNumber" className="block text-xs font-semibold text-gray-700 mb-1">
                  Phone Number
                </label>
                <input
                  type="tel"
                  id="phoneNumber"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 transition-all ${
                    errors.phoneNumber
                      ? 'border-red-300 focus:ring-red-500'
                      : 'border-gray-300 focus:ring-pharma-blue focus:border-transparent'
                  }`}
                  placeholder="+1 (555) 123-4567"
                />
                {errors.phoneNumber && (
                  <p className="mt-0.5 text-xs text-red-600">{errors.phoneNumber}</p>
                )}
              </div>

              {/* Job Title */}
              <div>
                <label htmlFor="jobTitle" className="block text-xs font-semibold text-gray-700 mb-1">
                  Job Title
                </label>
                <input
                  type="text"
                  id="jobTitle"
                  name="jobTitle"
                  value={formData.jobTitle}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 transition-all ${
                    errors.jobTitle
                      ? 'border-red-300 focus:ring-red-500'
                      : 'border-gray-300 focus:ring-pharma-blue focus:border-transparent'
                  }`}
                  placeholder="e.g., Regulatory Affairs Manager"
                />
                {errors.jobTitle && (
                  <p className="mt-0.5 text-xs text-red-600">{errors.jobTitle}</p>
                )}
              </div>

              {/* Company Name */}
              <div>
                <label htmlFor="companyName" className="block text-xs font-semibold text-gray-700 mb-1">
                  Company Name
                </label>
                <input
                  type="text"
                  id="companyName"
                  name="companyName"
                  value={formData.companyName}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 transition-all ${
                    errors.companyName
                      ? 'border-red-300 focus:ring-red-500'
                      : 'border-gray-300 focus:ring-pharma-blue focus:border-transparent'
                  }`}
                  placeholder="Your Company Name"
                />
                {errors.companyName && (
                  <p className="mt-0.5 text-xs text-red-600">{errors.companyName}</p>
                )}
              </div>

              {/* Country */}
              <div>
                <label htmlFor="country" className="block text-xs font-semibold text-gray-700 mb-1">
                  Country
                </label>
                <input
                  type="text"
                  id="country"
                  name="country"
                  value={formData.country}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 transition-all ${
                    errors.country
                      ? 'border-red-300 focus:ring-red-500'
                      : 'border-gray-300 focus:ring-pharma-blue focus:border-transparent'
                  }`}
                  placeholder="Enter your country"
                />
                {errors.country && (
                  <p className="mt-0.5 text-xs text-red-600">{errors.country}</p>
                )}
              </div>

              {/* How did you hear about VeritaScribe */}
              <div>
                <label htmlFor="hearAbout" className="block text-xs font-semibold text-gray-700 mb-1">
                  How did you hear about VeritaScribe ?
                </label>
                <select
                  id="hearAbout"
                  name="hearAbout"
                  value={formData.hearAbout}
                  onChange={handleChange}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pharma-blue focus:border-transparent transition-all"
                >
                  <option value="">Please Select</option>
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
                <label htmlFor="anythingElse" className="block text-xs font-semibold text-gray-700 mb-1">
                  Anything Else ?
                </label>
                <textarea
                  id="anythingElse"
                  name="anythingElse"
                  value={formData.anythingElse}
                  onChange={handleChange}
                  rows={3}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pharma-blue focus:border-transparent transition-all resize-none"
                  placeholder="Tell us more about your requirement !"
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full px-4 py-2.5 bg-gradient-to-r from-pharma-blue to-pharma-teal text-white rounded-lg font-semibold text-sm hover:shadow-lg transform hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed ${
                  isSubmitting ? 'cursor-wait' : ''
                }`}
              >
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Sending...
                  </>
                ) : (
                  <>
                    <FaRocket className="text-base" />
                    Request Live Demo
                  </>
                )}
              </button>

              <p className="text-center text-xs text-gray-500 mt-2">
                We'll get back to you within 24 hours
              </p>
          </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DemoPage;

