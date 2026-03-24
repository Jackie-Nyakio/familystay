import Link from 'next/link';
import Head from 'next/head';

export default function TermsOfService() {
  return (
    <>
      <Head>
        <title>Terms of Service - FamilyStay</title>
        <meta name="description" content="FamilyStay Terms of Service - Read our terms and conditions for using our family-friendly accommodation booking platform." />
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
            <h1 className="text-3xl font-bold text-gray-900 mb-6">Terms of Service</h1>
            <p className="text-sm text-gray-500 mb-8">Last updated: March 2026</p>

            <div className="prose max-w-none space-y-8">
              {/* Section 1 */}
              <section>
                <h2 className="text-xl font-semibold text-gray-900 mb-3">1. Acceptance of Terms</h2>
                <p className="text-gray-600">
                  By accessing and using FamilyStay ("we," "our," or "us"), you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by these terms, please do not use this service.
                </p>
              </section>

              {/* Section 2 */}
              <section>
                <h2 className="text-xl font-semibold text-gray-900 mb-3">2. Description of Service</h2>
                <p className="text-gray-600 mb-3">
                  FamilyStay is an online platform that connects family travelers with hosts who offer family-friendly accommodations. Our service allows you to:
                </p>
                <ul className="list-disc pl-6 text-gray-600 space-y-2">
                  <li>Search and browse family-friendly properties</li>
                  <li>Book accommodations for your family</li>
                  <li>List your property as a host</li>
                  <li>Communicate with hosts and guests</li>
                  <li>Leave reviews about your experience</li>
                </ul>
              </section>

              {/* Section 3 */}
              <section>
                <h2 className="text-xl font-semibold text-gray-900 mb-3">3. User Accounts and Registration</h2>
                <p className="text-gray-600 mb-3">
                  To use certain features of our service, you must create an account. You agree to:
                </p>
                <ul className="list-disc pl-6 text-gray-600 space-y-2">
                  <li>Provide accurate and complete registration information</li>
                  <li>Maintain the security of your account credentials</li>
                  <li>Promptly update any changes to your information</li>
                  <li>Accept responsibility for all activities under your account</li>
                  <li>Be at least 18 years of age to create an account</li>
                </ul>
              </section>

              {/* Section 4 */}
              <section>
                <h2 className="text-xl font-semibold text-gray-900 mb-3">4. Booking and Payments</h2>
                <p className="text-gray-600 mb-3">
                  When you make a booking through FamilyStay:
                </p>
                <ul className="list-disc pl-6 text-gray-600 space-y-2">
                  <li>You agree to pay all fees associated with your booking</li>
                  <li>Payments are processed securely through our payment partners</li>
                  <li>Cancellation policies vary by property and are clearly displayed</li>
                  <li>Refunds are processed according to the applicable cancellation policy</li>
                  <li>You authorize us to charge your payment method for the booking amount</li>
                </ul>
              </section>

              {/* Section 5 */}
              <section>
                <h2 className="text-xl font-semibold text-gray-900 mb-3">5. Host Responsibilities</h2>
                <p className="text-gray-600 mb-3">
                  If you list your property on FamilyStay as a host, you agree to:
                </p>
                <ul className="list-disc pl-6 text-gray-600 space-y-2">
                  <li>Provide accurate property descriptions and photos</li>
                  <li>Maintain clean, safe, and family-friendly accommodations</li>
                  <li>Respond to guest inquiries promptly</li>
                  <li>Honor confirmed bookings</li>
                  <li>Comply with all applicable laws and regulations</li>
                  <li>Maintain appropriate insurance coverage</li>
                </ul>
              </section>

              {/* Section 6 */}
              <section>
                <h2 className="text-xl font-semibold text-gray-900 mb-3">6. Guest Responsibilities</h2>
                <p className="text-gray-600 mb-3">
                  As a guest, you agree to:
                </p>
                <ul className="list-disc pl-6 text-gray-600 space-y-2">
                  <li>Treat the property and host with respect</li>
                  <li>Follow all house rules provided by the host</li>
                  <li>Not exceed the maximum number of guests specified</li>
                  <li>Not smoke in non-smoking properties</li>
                  <li>Not bring pets unless explicitly allowed</li>
                  <li>Leave the property in good condition</li>
                </ul>
              </section>

              {/* Section 7 */}
              <section>
                <h2 className="text-xl font-semibold text-gray-900 mb-3">7. Cancellations and Refunds</h2>
                <p className="text-gray-600">
                  Cancellation policies are set by individual hosts and will be clearly displayed before you complete your booking. Generally:
                </p>
                <ul className="list-disc pl-6 text-gray-600 space-y-2 mt-3">
                  <li><strong>Free cancellation:</strong> Full refund if cancelled 7+ days before check-in</li>
                  <li><strong>Partial refund:</strong> 50% refund for cancellations 3-6 days before check-in</li>
                  <li><strong>No refund:</strong> Cancellations less than 3 days before check-in</li>
                </ul>
                <p className="text-gray-600 mt-3">
                  In case of extenuating circumstances, please contact our support team.
                </p>
              </section>

              {/* Section 8 */}
              <section>
                <h2 className="text-xl font-semibold text-gray-900 mb-3">8. Reviews and Ratings</h2>
                <p className="text-gray-600">
                  After completing a stay, guests may leave reviews. Reviews must be honest, accurate, and comply with our content guidelines. We reserve the right to remove reviews that violate our policies.
                </p>
              </section>

              {/* Section 9 */}
              <section>
                <h2 className="text-xl font-semibold text-gray-900 mb-3">9. Limitation of Liability</h2>
                <p className="text-gray-600">
                  FamilyStay acts as a platform connecting guests and hosts. We do not own or control properties listed on our platform. To the maximum extent permitted by law, FamilyStay shall not be liable for any damages arising from your use of the platform or any booking made through the platform.
                </p>
              </section>

              {/* Section 10 */}
              <section>
                <h2 className="text-xl font-semibold text-gray-900 mb-3">10. Indemnification</h2>
                <p className="text-gray-600">
                  You agree to indemnify, defend, and hold harmless FamilyStay and its officers, directors, employees, and agents from any claims, damages, losses, or expenses arising from your use of the platform or your violation of these Terms of Service.
                </p>
              </section>

              {/* Section 11 */}
              <section>
                <h2 className="text-xl font-semibold text-gray-900 mb-3">11. Modifications to Service</h2>
                <p className="text-gray-600">
                  We reserve the right to modify or discontinue the service (or any part thereof) at any time with reasonable notice. We shall not be liable to you or any third party for any modification, suspension, or discontinuation of the service.
                </p>
              </section>

              {/* Section 12 */}
              <section>
                <h2 className="text-xl font-semibold text-gray-900 mb-3">12. Governing Law</h2>
                <p className="text-gray-600">
                  These Terms of Service shall be governed by and construed in accordance with the laws of Kenya. Any disputes arising under these terms shall be subject to the exclusive jurisdiction of the courts of Kenya.
                </p>
              </section>

              {/* Section 13 */}
              <section>
                <h2 className="text-xl font-semibold text-gray-900 mb-3">13. Contact Information</h2>
                <p className="text-gray-600">
                  If you have any questions about these Terms of Service, please contact us at:
                </p>
                <ul className="list-none pl-6 text-gray-600 mt-3 space-y-2">
                  <li><strong>Email:</strong> legal@familystay.co.ke</li>
                  <li><strong>Phone:</strong> +254 700 000 000</li>
                  <li><strong>Address:</strong> FamilyStay Kenya Ltd, Nairobi, Kenya</li>
                </ul>
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

