import Link from 'next/link';
import Head from 'next/head';

export default function PrivacyPolicy() {
  return (
    <>
      <Head>
        <title>Privacy Policy - FamilyStay</title>
        <meta name="description" content="FamilyStay Privacy Policy - Learn how we collect, use, and protect your personal information." />
      </Head>

      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <Link href="/" className="text-2xl font-bold text-blue-600">
                FamilyStay
              </Link>
              <nav className="hidden md:flex space-x-8">
                <Link href="/search" className="text-gray-600 hover:text-blue-600">
                  Explore
                </Link>
                <Link href="/about" className="text-gray-600 hover:text-blue-600">
                  About
                </Link>
                <Link href="/auth/login" className="text-gray-600 hover:text-blue-600">
                  Sign In
                </Link>
              </nav>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="bg-white rounded-lg shadow-sm p-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-6">Privacy Policy</h1>
            <p className="text-sm text-gray-500 mb-8">Last updated: March 2026</p>

            <div className="prose max-w-none space-y-8">
              {/* Introduction */}
              <section>
                <p className="text-gray-600">
                  FamilyStay Kenya Ltd ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our FamilyStay platform and services.
                </p>
              </section>

              {/* Section 1 */}
              <section>
                <h2 className="text-xl font-semibold text-gray-900 mb-3">1. Information We Collect</h2>
                <p className="text-gray-600 mb-3">
                  We collect information you provide directly to us, as well as information automatically collected when you use our platform.
                </p>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Personal Information</h3>
                <ul className="list-disc pl-6 text-gray-600 space-y-2 mb-3">
                  <li>Name, email address, and phone number</li>
                  <li>Profile information and profile picture</li>
                  <li>Payment information (processed securely through third-party providers)</li>
                  <li>Government-issued identification (for verification purposes)</li>
                  <li>Communication preferences</li>
                  <li>Reviews and feedback you provide</li>
                </ul>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Automatically Collected Information</h3>
                <ul className="list-disc pl-6 text-gray-600 space-y-2">
                  <li>Device information (IP address, browser type, operating system)</li>
                  <li>Usage data (pages visited, time spent on platform)</li>
                  <li>Location data (general location based on IP address)</li>
                  <li>Cookies and similar tracking technologies</li>
                </ul>
              </section>

              {/* Section 2 */}
              <section>
                <h2 className="text-xl font-semibold text-gray-900 mb-3">2. How We Use Your Information</h2>
                <p className="text-gray-600 mb-3">
                  We use the information we collect to:
                </p>
                <ul className="list-disc pl-6 text-gray-600 space-y-2">
                  <li>Provide, maintain, and improve our services</li>
                  <li>Process your bookings and transactions</li>
                  <li>Verify your identity and prevent fraud</li>
                  <li>Communicate with you about your bookings, inquiries, and updates</li>
                  <li>Send you marketing and promotional materials (with your consent)</li>
                  <li>Respond to your comments, questions, and provide customer support</li>
                  <li>Monitor and analyze trends, usage, and activities</li>
                  <li>Detect, investigate, and prevent illegal activities</li>
                  <li>Comply with legal obligations</li>
                </ul>
              </section>

              {/* Section 3 */}
              <section>
                <h2 className="text-xl font-semibold text-gray-900 mb-3">3. Information Sharing and Disclosure</h2>
                <p className="text-gray-600 mb-3">
                  We may share your information in the following circumstances:
                </p>
                <ul className="list-disc pl-6 text-gray-600 space-y-2">
                  <li><strong>With Hosts/Guests:</strong> When you make a booking, we share relevant information with the host (for bookings) or guest (for reservations)</li>
                  <li><strong>Service Providers:</strong> With third-party vendors who help us operate our platform (payment processing, data analysis, email delivery, etc.)</li>
                  <li><strong>Business Transfers:</strong> In connection with any merger, sale of company assets, or acquisition</li>
                  <li><strong>Legal Requirements:</strong> When required by law, court order, or government regulation</li>
                  <li><strong>Protect Rights:</strong> To protect the rights, property, or safety of FamilyStay, our users, or the public</li>
                </ul>
              </section>

              {/* Section 4 */}
              <section>
                <h2 className="text-xl font-semibold text-gray-900 mb-3">4. Data Security</h2>
                <p className="text-gray-600">
                  We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. These measures include:
                </p>
                <ul className="list-disc pl-6 text-gray-600 space-y-2 mt-3">
                  <li>Encryption of sensitive data using industry-standard SSL/TLS</li>
                  <li>Secure storage of personal information</li>
                  <li>Regular security audits and vulnerability assessments</li>
                  <li>Access controls limiting employee access to personal information</li>
                  <li>Employee training on data protection</li>
                </ul>
              </section>

              {/* Section 5 */}
              <section>
                <h2 className="text-xl font-semibold text-gray-900 mb-3">5. Data Retention</h2>
                <p className="text-gray-600">
                  We retain your personal information for as long as your account is active or as needed to provide you services. We will retain and use your information as necessary to:
                </p>
                <ul className="list-disc pl-6 text-gray-600 space-y-2 mt-3">
                  <li>Comply with our legal obligations</li>
                  <li>Resolve disputes</li>
                  <li>Enforce our agreements</li>
                </ul>
                <p className="text-gray-600 mt-3">
                  After account deletion, we may retain certain information in anonymized form for analytics purposes.
                </p>
              </section>

              {/* Section 6 */}
              <section>
                <h2 className="text-xl font-semibold text-gray-900 mb-3">6. Your Rights and Choices</h2>
                <p className="text-gray-600 mb-3">
                  You have the following rights regarding your personal information:
                </p>
                <ul className="list-disc pl-6 text-gray-600 space-y-2">
                  <li><strong>Access:</strong> Request a copy of the personal information we hold about you</li>
                  <li><strong>Correction:</strong> Request correction of inaccurate personal information</li>
                  <li><strong>Deletion:</strong> Request deletion of your personal information (subject to legal requirements)</li>
                  <li><strong>Opt-out:</strong> Opt-out of receiving marketing communications</li>
                  <li><strong>Data Portability:</strong> Request your data in a structured, machine-readable format</li>
                </ul>
                <p className="text-gray-600 mt-3">
                  To exercise these rights, please contact us at privacy@familystay.co.ke.
                </p>
              </section>

              {/* Section 7 */}
              <section>
                <h2 className="text-xl font-semibold text-gray-900 mb-3">7. Cookies and Tracking Technologies</h2>
                <p className="text-gray-600 mb-3">
                  We use cookies and similar tracking technologies to track the activity on our platform and hold certain information. You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent.
                </p>
                <p className="text-gray-600">
                  Types of cookies we use:
                </p>
                <ul className="list-disc pl-6 text-gray-600 space-y-2 mt-3">
                  <li><strong>Essential Cookies:</strong> Required for the platform to function properly</li>
                  <li><strong>Analytics Cookies:</strong> Help us understand how users interact with our platform</li>
                  <li><strong>Marketing Cookies:</strong> Used to track visitors across websites for advertising purposes</li>
                </ul>
              </section>

              {/* Section 8 */}
              <section>
                <h2 className="text-xl font-semibold text-gray-900 mb-3">8. Third-Party Links</h2>
                <p className="text-gray-600">
                  Our platform may contain links to third-party websites, services, or applications that are not operated by us. We are not responsible for the privacy practices of these third parties. We encourage you to review the privacy policies of any third-party sites you visit.
                </p>
              </section>

              {/* Section 9 */}
              <section>
                <h2 className="text-xl font-semibold text-gray-900 mb-3">9. Children's Privacy</h2>
                <p className="text-gray-600">
                  Our service is not intended for children under 18 years of age. We do not knowingly collect personal information from children under 18. If you are a parent or guardian and believe your child has provided us with personal information, please contact us immediately.
                </p>
              </section>

              {/* Section 10 */}
              <section>
                <h2 className="text-xl font-semibold text-gray-900 mb-3">10. International Data Transfers</h2>
                <p className="text-gray-600">
                  Your information may be transferred to and maintained on computers located outside of your state, province, country, or other governmental jurisdiction where the data protection laws may differ from those of your jurisdiction. By using our platform, you consent to such transfer.
                </p>
              </section>

              {/* Section 11 */}
              <section>
                <h2 className="text-xl font-semibold text-gray-900 mb-3">11. Changes to This Privacy Policy</h2>
                <p className="text-gray-600">
                  We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last updated" date at the top. You are advised to review this Privacy Policy periodically for any changes.
                </p>
              </section>

              {/* Section 12 */}
              <section>
                <h2 className="text-xl font-semibold text-gray-900 mb-3">12. Contact Information</h2>
                <p className="text-gray-600">
                  If you have any questions about this Privacy Policy, please contact us at:
                </p>
                <ul className="list-none pl-6 text-gray-600 mt-3 space-y-2">
                  <li><strong>Email:</strong> privacy@familystay.co.ke</li>
                  <li><strong>Phone:</strong> +254 700 000 000</li>
                  <li><strong>Address:</strong> FamilyStay Kenya Ltd, Nairobi, Kenya</li>
                  <li><strong>Data Protection Officer:</strong> dpo@familystay.co.ke</li>
                </ul>
              </section>

              {/* Section 13 - Kenya Data Protection */}
              <section>
                <h2 className="text-xl font-semibold text-gray-900 mb-3">13. Compliance with Kenyan Data Protection Laws</h2>
                <p className="text-gray-600 mb-3">
                  This Privacy Policy is designed to comply with the Data Protection Act, 2019 of Kenya ("DPA"). Under the DPA, you have the following additional rights:
                </p>
                <ul className="list-disc pl-6 text-gray-600 space-y-2">
                  <li>Right to be informed about how your data is being used</li>
                  <li>Right to access your personal data</li>
                  <li>Right to have inaccurate personal data corrected</li>
                  <li>Right to have your personal data erased (right to be forgotten)</li>
                  <li>Right to restrict processing of your personal data</li>
                  <li>Right to object to processing of your personal data</li>
                  <li>Right to data portability</li>
                  <li>Rights in relation to automated decision-making and profiling</li>
                </ul>
                <p className="text-gray-600 mt-3">
                  We have registered with the Office of the Data Protection Commissioner (ODPC) as a data controller. Our registration number is: [To be updated upon registration].
                </p>
              </section>
            </div>

            {/* Back link */}
            <div className="mt-12 pt-8 border-t border-gray-200">
              <Link href="/" className="text-blue-600 hover:text-blue-700 font-medium">
                ← Back to Home
              </Link>
            </div>
          </div>
        </main>

        {/* Footer */}
        <footer className="bg-gray-800 text-white py-8 mt-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div className="mb-4 md:mb-0">
                <span className="text-xl font-bold">FamilyStay</span>
                <p className="text-gray-400 text-sm mt-1">Family-friendly accommodations in Kenya</p>
              </div>
              <div className="flex space-x-6 text-sm">
                <Link href="/privacy" className="text-gray-400 hover:text-white">Privacy Policy</Link>
                <Link href="/terms" className="text-gray-400 hover:text-white">Terms of Service</Link>
                <Link href="/contact" className="text-gray-400 hover:text-white">Contact</Link>
              </div>
            </div>
            <div className="mt-8 pt-8 border-t border-gray-700 text-center text-gray-400 text-sm">
              © 2026 FamilyStay Kenya Ltd. All rights reserved.
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}

