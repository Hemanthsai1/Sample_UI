import React, { useState } from 'react';
import { FaEnvelope, FaTimes, FaUser, FaPhone, FaBriefcase, FaBuilding, FaGlobe } from 'react-icons/fa';
import favicon from '../assets/favicon.png';

interface DemoModalProps {
  onClose: () => void;
}

const DemoModal: React.FC<DemoModalProps> = ({ onClose }) => {
  const [formData, setFormData] = useState({
    name: '',
    workEmail: '',
    phoneNumber: '',
    jobTitle: '',
    companyName: '',
    country: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
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

I would like to request a live demo of Veritascribe.

Contact Information:
- Name: ${formData.name}
- Work Email: ${formData.workEmail}
- Phone Number: ${formData.phoneNumber}
- Job Title: ${formData.jobTitle}
- Company Name: ${formData.companyName}
- Country: ${formData.country}

I'm interested in learning more about your AI-powered document drafting platform.

Best regards,
${formData.name}`;

    // Encode the email body for mailto link
    const encodedBody = encodeURIComponent(emailBody);
    const emailSubject = encodeURIComponent('Request for Live Demo - Veritascribe');
    
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
      });
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Blurred Background */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-md"
        onClick={onClose}
      ></div>

      {/* Modal Content */}
      <div className="relative bg-white rounded-2xl shadow-2xl p-8 max-w-lg w-full mx-4 max-h-[90vh] overflow-y-auto transform transition-all animate-slide-up">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors z-10"
        >
          <FaTimes className="text-xl" />
        </button>

        {/* Logo and Title */}
        <div className="text-center mb-6">
          <div className="flex items-center justify-center gap-3 mb-4">
            <img
              src={favicon}
              alt="VeritaScribe"
              className="w-12 h-12 object-contain"
            />
            <span className="text-2xl font-bold bg-gradient-to-r from-pharma-blue to-pharma-teal bg-clip-text text-transparent">
              VeritaScribe
            </span>
          </div>
          <h2 className="text-3xl font-bold text-gray-800 mb-2">
            Get the Demo for Live
          </h2>
          <p className="text-gray-600">
            Fill in your details to request a live demo
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name */}
          <div>
            <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-2">
              <FaUser className="inline mr-2 text-pharma-blue" />
              Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-all ${
                errors.name
                  ? 'border-red-300 focus:ring-red-500'
                  : 'border-gray-300 focus:ring-pharma-blue focus:border-transparent'
              }`}
              placeholder="Enter your full name"
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-600">{errors.name}</p>
            )}
          </div>

          {/* Work Email */}
          <div>
            <label htmlFor="workEmail" className="block text-sm font-semibold text-gray-700 mb-2">
              <FaEnvelope className="inline mr-2 text-pharma-blue" />
              Work Email
            </label>
            <input
              type="email"
              id="workEmail"
              name="workEmail"
              value={formData.workEmail}
              onChange={handleChange}
              className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-all ${
                errors.workEmail
                  ? 'border-red-300 focus:ring-red-500'
                  : 'border-gray-300 focus:ring-pharma-blue focus:border-transparent'
              }`}
              placeholder="your.email@company.com"
            />
            {errors.workEmail && (
              <p className="mt-1 text-sm text-red-600">{errors.workEmail}</p>
            )}
          </div>

          {/* Phone Number */}
          <div>
            <label htmlFor="phoneNumber" className="block text-sm font-semibold text-gray-700 mb-2">
              <FaPhone className="inline mr-2 text-pharma-blue" />
              Phone Number
            </label>
            <input
              type="tel"
              id="phoneNumber"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleChange}
              className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-all ${
                errors.phoneNumber
                  ? 'border-red-300 focus:ring-red-500'
                  : 'border-gray-300 focus:ring-pharma-blue focus:border-transparent'
              }`}
              placeholder="+1 (555) 123-4567"
            />
            {errors.phoneNumber && (
              <p className="mt-1 text-sm text-red-600">{errors.phoneNumber}</p>
            )}
          </div>

          {/* Job Title */}
          <div>
            <label htmlFor="jobTitle" className="block text-sm font-semibold text-gray-700 mb-2">
              <FaBriefcase className="inline mr-2 text-pharma-blue" />
              Job Title
            </label>
            <input
              type="text"
              id="jobTitle"
              name="jobTitle"
              value={formData.jobTitle}
              onChange={handleChange}
              className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-all ${
                errors.jobTitle
                  ? 'border-red-300 focus:ring-red-500'
                  : 'border-gray-300 focus:ring-pharma-blue focus:border-transparent'
              }`}
              placeholder="e.g., Regulatory Affairs Manager"
            />
            {errors.jobTitle && (
              <p className="mt-1 text-sm text-red-600">{errors.jobTitle}</p>
            )}
          </div>

          {/* Company Name */}
          <div>
            <label htmlFor="companyName" className="block text-sm font-semibold text-gray-700 mb-2">
              <FaBuilding className="inline mr-2 text-pharma-blue" />
              Company Name
            </label>
            <input
              type="text"
              id="companyName"
              name="companyName"
              value={formData.companyName}
              onChange={handleChange}
              className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-all ${
                errors.companyName
                  ? 'border-red-300 focus:ring-red-500'
                  : 'border-gray-300 focus:ring-pharma-blue focus:border-transparent'
              }`}
              placeholder="Your Company Name"
            />
            {errors.companyName && (
              <p className="mt-1 text-sm text-red-600">{errors.companyName}</p>
            )}
          </div>

          {/* Country */}
          <div>
            <label htmlFor="country" className="block text-sm font-semibold text-gray-700 mb-2">
              <FaGlobe className="inline mr-2 text-pharma-blue" />
              Country
            </label>
            <input
              type="text"
              id="country"
              name="country"
              value={formData.country}
              onChange={handleChange}
              className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-all ${
                errors.country
                  ? 'border-red-300 focus:ring-red-500'
                  : 'border-gray-300 focus:ring-pharma-blue focus:border-transparent'
              }`}
              placeholder="Enter your country"
            />
            {errors.country && (
              <p className="mt-1 text-sm text-red-600">{errors.country}</p>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full px-6 py-4 bg-gradient-to-r from-pharma-blue to-pharma-teal text-white rounded-xl font-bold text-lg hover:shadow-2xl transform hover:-translate-y-1 transition-all flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed ${
              isSubmitting ? 'cursor-wait' : ''
            }`}
          >
            {isSubmitting ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Sending...
              </>
            ) : (
              <>
                <FaEnvelope className="text-xl" />
                Request Live Demo
              </>
            )}
          </button>

          <p className="text-center text-sm text-gray-500 mt-4">
            We'll get back to you within 24 hours
          </p>
        </form>
      </div>

      <style>{`
        @keyframes slide-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-slide-up {
          animation: slide-up 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default DemoModal;

