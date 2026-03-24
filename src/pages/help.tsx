import Link from 'next/link';
import { FaQuestionCircle, FaPhone, FaEnvelope, FaSearch } from 'react-icons/fa';

export default function Help() {
  const faqs = [
    {
      question: 'How do I create a booking?',
      answer: 'Search for properties, select your dates and guests, then click "Book Now". Complete the payment to confirm your booking.'
    },
    {
      question: 'How do I cancel a booking?',
      answer: 'Go to My Bookings, select the booking and click Cancel. Cancellation policy varies by property.'
    },
    {
      question: 'How do I list my property as a host?',
      answer: 'Click "Become a Host" in the dashboard, complete the property form with photos, wait for approval.'
    },
    {
      question: 'How does payment work?',
      answer: 'We accept M-Pesa STK Push and card payments. Payments are held until check-in and released to host after checkout.'
    },
    {
      question: 'Is my payment secure?',
      answer: 'Yes, all payments are processed securely through trusted payment gateways. Your card details are encrypted.'
    },
    {
      question: 'How long does approval take?',
      answer: 'Host properties typically take 24-48 hours for admin approval before being live for bookings.'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <FaQuestionCircle className="mx-auto text-6xl text-primary-500 mb-6" />
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Help Center
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
            Find answers to common questions or contact our support team
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
            <Link href="#faqs" className="btn-primary flex items-center justify-center gap-2">
              <FaSearch />
              Browse FAQs
            </Link>
            <Link href="#contact" className="btn-outline flex items-center justify-center gap-2">
              Contact Support
            </Link>
          </div>
        </div>

        {/* FAQ Section */}
        <section id="faqs" className="mb-20">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
              Frequently Asked Questions
            </h2>
            <div className="space-y-4">
              {faqs.map((faq, index) => (
                <div key={index} className="bg-white rounded-xl shadow-sm border p-6 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between cursor-pointer group">
                    <h3 className="text-xl font-semibold text-gray-900 flex-1 pr-4">
                      {faq.question}
                    </h3>
                    <div className="text-2xl transition-transform group-hover:rotate-180">
                      +
                    </div>
                  </div>
                  <p className="mt-4 text-gray-600 leading-relaxed">
                    {faq.answer}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section id="contact" className="bg-white rounded-2xl shadow-xl p-12 mb-16">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Still need help?
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Our support team is here for you 24/7
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {/* Phone Support */}
              <div className="text-center p-8 border-r md:border-r-0 md:border-b hover:shadow-md rounded-lg transition-all">
                <div className="w-20 h-20 bg-primary-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <FaPhone className="text-3xl text-primary-500" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Phone Support</h3>
                <p className="text-gray-600 mb-4">Call our team directly</p>
                <a href="tel:+254700000000" className="text-2xl font-bold text-primary-500 hover:text-primary-600">
                  +254 700 123 456
                </a>
              </div>

              {/* Email Support */}
              <div className="text-center p-8 md:border-b hover:shadow-md rounded-lg transition-all">
                <div className="w-20 h-20 bg-emerald-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <FaEnvelope className="text-3xl text-emerald-500" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Email Us</h3>
                <p className="text-gray-600 mb-4">Detailed support for complex issues</p>
                <a href="mailto:support@familystay.co.ke" className="text-lg font-semibold text-emerald-500 hover:text-emerald-600 block">
                  support@familystay.co.ke
                </a>
              </div>

              {/* Live Chat */}
              <div className="text-center p-8 hover:shadow-md rounded-lg transition-all">
                <div className="w-20 h-20 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <FaQuestionCircle className="text-3xl text-blue-500" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Live Chat</h3>
                <p className="text-gray-600 mb-4">Instant help for quick questions</p>
                <button className="bg-blue-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-600 transition-colors">
                  Start Chat
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Quick Links */}
        <section className="bg-gray-100 rounded-2xl p-12">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Quick Actions
            </h2>
            <p className="text-xl text-gray-600">Find help for common tasks</p>
          </div>

          <div className="grid md:grid-cols-4 gap-6 max-w-4xl mx-auto">
            <Link href="/dashboard" className="group">
              <div className="bg-white p-8 rounded-xl hover:shadow-xl transition-all group-hover:-translate-y-2">
                <div className="text-3xl mb-4 group-hover:scale-110 transition-transform">📅</div>
                <h3 className="font-bold text-lg mb-2">My Bookings</h3>
                <p className="text-gray-600">View & manage bookings</p>
              </div>
            </Link>
            
            <Link href="/host/dashboard" className="group">
              <div className="bg-white p-8 rounded-xl hover:shadow-xl transition-all group-hover:-translate-y-2">
                <div className="text-3xl mb-4 group-hover:scale-110 transition-transform">🏠</div>
                <h3 className="font-bold text-lg mb-2">Host Dashboard</h3>
                <p className="text-gray-600">Manage properties</p>
              </div>
            </Link>
            
            <Link href="/profile" className="group">
              <div className="bg-white p-8 rounded-xl hover:shadow-xl transition-all group-hover:-translate-y-2">
                <div className="text-3xl mb-4 group-hover:scale-110 transition-transform">👤</div>
                <h3 className="font-bold text-lg mb-2">My Profile</h3>
                <p className="text-gray-600">Update account</p>
              </div>
            </Link>
            
            <Link href="/messages" className="group">
              <div className="bg-white p-8 rounded-xl hover:shadow-xl transition-all group-hover:-translate-y-2">
                <div className="text-3xl mb-4 group-hover:scale-110 transition-transform">💬</div>
                <h3 className="font-bold text-lg mb-2">Messages</h3>
                <p className="text-gray-600">Contact hosts/guests</p>
              </div>
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}

