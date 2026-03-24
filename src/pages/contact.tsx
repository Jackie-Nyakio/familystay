import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import toast from 'react-hot-toast';

export default function Contact() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Simulate API call to contact endpoint
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      toast.success('Thank you for your message! We will get back to you soon.');
      setSubmitted(true);
      setFormData({ name: '', email: '', subject: '', message: '' });
    } catch (error) {
      toast.error('Failed to send message. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-20">
        <div className="max-w-4xl mx-auto px-4">
          <div className="bg-white rounded-2xl shadow-xl p-12 text-center">
            <div className="w-24 h-24 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-8">
              <svg className="w-12 h-12 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Message Sent!</h1>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Thank you for contacting FamilyStay. Our support team has received your message and will get back to you within 24 hours.
            </p>
            <Link 
              href="/"
              className="inline-flex items-center px-8 py-4 bg-primary-500 text-white font-semibold rounded-2xl hover:bg-primary-600 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            >
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-20">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-primary-500 to-primary-600 bg-clip-text text-transparent mb-6">
            Contact Us
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Have questions about your booking, need help with your listing, or want to give feedback? 
            We're here to help!
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Contact Form */}
          <div className="bg-white rounded-2xl shadow-2xl p-8 lg:p-12">
            <h2 className="text-2xl font-bold mb-8">Send us a message</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Full Name *</label>
                <input
                  type="text"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-4 focus:ring-primary-100 focus:border-primary-500 transition-all"
                  placeholder="John Doe"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Email *</label>
                <input
                  type="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-4 focus:ring-primary-100 focus:border-primary-500 transition-all"
                  placeholder="john@example.com"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Subject *</label>
                <select
                  name="subject"
                  required
                  value={formData.subject}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-4 focus:ring-primary-100 focus:border-primary-500 transition-all"
                >
                  <option value="">Choose a subject</option>
                  <option value="booking_issue">Booking Issue</option>
                  <option value="payment_problem">Payment Problem</option>
                  <option value="host_problem">Host Issue</option>
                  <option value="listing_question">Listing Question</option>
                  <option value="feature_request">Feature Request</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Message *</label>
                <textarea
                  name="message"
                  required
                  rows={6}
                  value={formData.message}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-4 focus:ring-primary-100 focus:border-primary-500 transition-all resize-vertical"
                  placeholder="Tell us more about your issue or question..."
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-primary-500 to-primary-600 text-white py-4 px-6 rounded-2xl font-bold text-lg hover:from-primary-600 hover:to-primary-700 focus:ring-4 focus:ring-primary-200 transition-all duration-200 shadow-xl hover:shadow-2xl transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <div className="inline-block w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    Sending...
                  </>
                ) : (
                  'Send Message'
                )}
              </button>
            </form>
          </div>

          {/* Contact Info */}
          <div className="space-y-8">
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-8 rounded-2xl">
              <h3 className="text-2xl font-bold text-emerald-800 mb-4">📧 Email Support</h3>
              <p className="text-lg text-gray-700 mb-4">
                For billing, technical issues, or account problems
              </p>
              <a 
                href="mailto:support@familystay.com" 
                className="block text-emerald-600 font-semibold hover:text-emerald-700 text-xl"
              >
                support@familystay.com
              </a>
            </div>

            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-8 rounded-2xl">
              <h3 className="text-2xl font-bold text-blue-800 mb-4">📱 Live Chat</h3>
              <p className="text-lg text-gray-700 mb-4">
                Instant help for booking and reservation questions
              </p>
              <button className="w-full bg-blue-500 text-white py-4 px-6 rounded-2xl font-bold hover:bg-blue-600 transition-all">
                Start Live Chat
              </button>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-violet-50 p-8 rounded-2xl">
              <h3 className="text-2xl font-bold text-purple-800 mb-4">📞 Phone Support</h3>
              <p className="text-lg text-gray-700 mb-4">
                Call us for urgent matters (Mon-Fri 8AM-6PM)
              </p>
              <div className="space-y-2">
                <a href="tel:+254700123456" className="block text-purple-600 font-bold text-xl hover:text-purple-700">
                  +254 700 123 456
                </a>
                <span className="text-sm text-gray-500">Kenya (Mainland)</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-20 text-center">
          <p className="text-lg text-gray-600">
            © 2024 FamilyStay. All rights reserved. | 
            <Link href="/privacy" className="text-primary-500 hover:underline ml-2">Privacy</Link> | 
            <Link href="/terms" className="text-primary-500 hover:underline ml-2">Terms</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
