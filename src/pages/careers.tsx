import { useState } from 'react';
import Link from 'next/link';

export default function Careers() {
  const [selectedDepartment, setSelectedDepartment] = useState('all');

  const departments = [
    { id: 'all', name: 'All Departments' },
    { id: 'engineering', name: 'Engineering' },
    { id: 'product', name: 'Product' },
    { id: 'operations', name: 'Operations' },
    { id: 'marketing', name: 'Marketing' },
    { id: 'sales', name: 'Sales' },
    { id: 'customer', name: 'Customer Success' },
  ];

  const jobs = [
    {
      id: 1,
      title: 'Senior Backend Engineer',
      department: 'Engineering',
      location: 'Nairobi, Kenya',
      type: 'Full-time',
      description: 'Build and maintain our RESTful APIs and microservices architecture.',
    },
    {
      id: 2,
      title: 'Frontend Developer',
      department: 'Engineering',
      location: 'Nairobi, Kenya',
      type: 'Full-time',
      description: 'Create beautiful and responsive user interfaces with React and Next.js.',
    },
    {
      id: 3,
      title: 'Product Manager',
      department: 'Product',
      location: 'Nairobi, Kenya',
      type: 'Full-time',
      description: 'Define product roadmap and work closely with engineering teams.',
    },
    {
      id: 4,
      title: 'Operations Manager',
      department: 'Operations',
      location: 'Mombasa, Kenya',
      type: 'Full-time',
      description: 'Manage property partnerships and host relationships in coastal region.',
    },
    {
      id: 5,
      title: 'Digital Marketing Manager',
      department: 'Marketing',
      location: 'Nairobi, Kenya',
      type: 'Full-time',
      description: 'Plan and execute digital marketing campaigns across multiple channels.',
    },
    {
      id: 6,
      title: 'Sales Executive',
      department: 'Sales',
      location: 'Nairobi, Kenya',
      type: 'Full-time',
      description: 'Acquire new host partners and maintain relationships with existing hosts.',
    },
    {
      id: 7,
      title: 'Customer Success Lead',
      department: 'Customer',
      location: 'Nairobi, Kenya',
      type: 'Full-time',
      description: 'Ensure exceptional customer experience and resolve escalated issues.',
    },
    {
      id: 8,
      title: 'Mobile Developer',
      department: 'Engineering',
      location: 'Remote',
      type: 'Full-time',
      description: 'Build and maintain our native mobile applications.',
    },
  ];

  const benefits = [
    {
      icon: '💰',
      title: 'Competitive Salary',
      description: 'Market-leading compensation packages including equity options.',
    },
    {
      icon: '🏥',
      title: 'Health Insurance',
      description: 'Comprehensive medical, dental, and vision coverage for you and family.',
    },
    {
      icon: '🏝️',
      title: 'Flexible Time Off',
      description: 'Unlimited PTO policy with minimum required rest days.',
    },
    {
      icon: '🌴',
      title: 'Remote Work',
      description: 'Work from anywhere policy with home office stipend.',
    },
    {
      icon: '📚',
      title: 'Learning Budget',
      description: 'Annual budget for courses, conferences, and professional development.',
    },
    {
      icon: '👶',
      title: 'Parental Leave',
      description: 'Generous paid leave for new parents including adoption.',
    },
  ];

  const filteredJobs = selectedDepartment === 'all' 
    ? jobs 
    : jobs.filter(job => job.department.toLowerCase() === selectedDepartment);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="text-2xl font-bold text-primary-500">
              FamilyStay
            </Link>
            <nav className="hidden md:flex space-x-8">
              <Link href="/search" className="text-gray-600 hover:text-primary-500">
                Explore
              </Link>
              <Link href="/host/become-host" className="text-gray-600 hover:text-primary-500">
                Become a Host
              </Link>
              <Link href="/about" className="text-gray-600 hover:text-primary-500">
                About Us
              </Link>
              <Link href="/careers" className="text-primary-500 font-medium">
                Careers
              </Link>
            </nav>
            <div className="flex items-center space-x-4">
              <Link href="/auth/login" className="text-gray-600 hover:text-primary-500">
                Log in
              </Link>
              <Link href="/auth/register" className="btn-primary">
                Sign up
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary-500 to-primary-700 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Join Our Team
          </h1>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Help us transform family travel across Africa. We're looking for passionate people to join our mission.
          </p>
          <div className="flex justify-center gap-4">
            <a
              href="#jobs"
              className="bg-white text-primary-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              View Open Positions
            </a>
            <a
              href="#culture"
              className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-primary-600 transition-colors"
            >
              Our Culture
            </a>
          </div>
        </div>
      </section>

      {/* Why Join Us */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-4">Why Work at FamilyStay?</h2>
          <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
            We offer more than just a job. Join a team that's changing how families travel.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {benefits.map((benefit, index) => (
              <div key={index} className="flex items-start p-6 bg-gray-50 rounded-lg">
                <div className="text-3xl mr-4">{benefit.icon}</div>
                <div>
                  <h3 className="text-lg font-semibold mb-1">{benefit.title}</h3>
                  <p className="text-gray-600">{benefit.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Culture Section */}
      <section id="culture" className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-8">Our Culture</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h3 className="text-xl font-semibold mb-4">🎯 Mission-Driven</h3>
              <p className="text-gray-600">
                Every team member understands our goal: making family travel better. Your work has direct impact on real families.
              </p>
            </div>
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h3 className="text-xl font-semibold mb-4">🤝 Collaborative</h3>
              <p className="text-gray-600">
                We believe the best ideas come from diverse perspectives. Every voice matters, and we work together to achieve excellence.
              </p>
            </div>
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h3 className="text-xl font-semibold mb-4">🚀 Innovative</h3>
              <p className="text-gray-600">
                We embrace new technologies and creative solutions. Failure is seen as a learning opportunity, not a setback.
              </p>
            </div>
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h3 className="text-xl font-semibold mb-4">💡 Growth-Focused</h3>
              <p className="text-gray-600">
                Your career growth is important to us. We provide mentorship, training, and clear progression paths.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Open Positions */}
      <section id="jobs" className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-8">Open Positions</h2>
          
          {/* Department Filter */}
          <div className="flex flex-wrap justify-center gap-2 mb-8">
            {departments.map((dept) => (
              <button
                key={dept.id}
                onClick={() => setSelectedDepartment(dept.id)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  selectedDepartment === dept.id
                    ? 'bg-primary-500 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {dept.name}
              </button>
            ))}
          </div>

          {/* Jobs List */}
          <div className="space-y-4 max-w-4xl mx-auto">
            {filteredJobs.length > 0 ? (
              filteredJobs.map((job) => (
                <div key={job.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold mb-2">{job.title}</h3>
                      <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                        <span className="flex items-center">
                          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                          {job.location}
                        </span>
                        <span className="flex items-center">
                          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                          </svg>
                          {job.department}
                        </span>
                        <span className="flex items-center">
                          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          {job.type}
                        </span>
                      </div>
                      <p className="text-gray-600 mt-2">{job.description}</p>
                    </div>
                    <button className="mt-4 md:mt-0 btn-outline">
                      Apply Now
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-600">No open positions in this department right now.</p>
                <p className="text-gray-500 mt-2">Check back soon for new opportunities!</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Application Process */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">Our Hiring Process</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              { step: 1, title: 'Apply', description: 'Submit your resume and cover letter' },
              { step: 2, title: 'Screening', description: '30-minute call with our team' },
              { step: 3, title: 'Interview', description: 'Technical or role-specific interview' },
              { step: 4, title: 'Offer', description: 'Meet the team and receive offer' },
            ].map((item, index) => (
              <div key={index} className="text-center">
                <div className="w-12 h-12 bg-primary-500 text-white rounded-full flex items-center justify-center font-bold text-xl mx-auto mb-4">
                  {item.step}
                </div>
                <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
                <p className="text-gray-600 text-sm">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-primary-500 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Don't See the Right Role?</h2>
          <p className="text-xl mb-8">
            We're always looking for talented people. Send us your resume and we'll keep you in mind for future opportunities.
          </p>
          <a
            href="mailto:careers@familystay.co.ke"
            className="bg-white text-primary-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors inline-block"
          >
            Email Us Your Resume
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">FamilyStay</h3>
              <p className="text-gray-400">
                Your trusted platform for family-friendly vacation rentals across Kenya.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/about" className="hover:text-white">About Us</Link></li>
                <li><Link href="/careers" className="hover:text-white">Careers</Link></li>
                <li><Link href="/press" className="hover:text-white">Press</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/help" className="hover:text-white">Help Center</Link></li>
                <li><Link href="/safety" className="hover:text-white">Safety</Link></li>
                <li><Link href="/cancellation" className="hover:text-white">Cancellation</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/privacy" className="hover:text-white">Privacy</Link></li>
                <li><Link href="/terms" className="hover:text-white">Terms</Link></li>
              </ul>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-gray-800 text-center text-gray-400">
            <p>© {new Date().getFullYear()} FamilyStay. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
