import Link from 'next/link';

export default function About() {
  const values = [
    {
      icon: '🏠',
      title: 'Home Away from Home',
      description: 'We believe every family deserves a comfortable, welcoming space to create lasting memories.',
    },
    {
      icon: '🤝',
      title: 'Trust & Safety',
      description: 'Verified reviews, secure payments, and 24/7 support ensure peace of mind for every booking.',
    },
    {
      icon: '🌍',
      title: 'Community First',
      description: 'We foster connections between hosts and guests, building a community of hospitality.',
    },
    {
      icon: '💯',
      title: 'Quality Guaranteed',
      description: 'Every property is vetted to meet our standards for cleanliness, safety, and comfort.',
    },
  ];

  const team = [
    {
      name: 'Sarah Johnson',
      role: 'CEO & Founder',
      image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400',
      bio: 'Former hospitality executive with 15 years of experience in travel and accommodation.',
    },
    {
      name: 'Michael Chen',
      role: 'CTO',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400',
      bio: 'Tech entrepreneur with expertise in building scalable platforms and marketplace solutions.',
    },
    {
      name: 'Amara Okafor',
      role: 'Head of Operations',
      image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400',
      bio: 'Operations specialist focused on creating seamless experiences for hosts and guests.',
    },
    {
      name: 'David Mwangi',
      role: 'Head of Growth',
      image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400',
      bio: 'Growth strategist with deep understanding of the African market dynamics.',
    },
  ];

  const milestones = [
    { year: '2020', event: 'FamilyStay founded in Nairobi' },
    { year: '2021', event: 'Expanded to Mombasa and Diani' },
    { year: '2022', event: 'Launched host support program' },
    { year: '2023', event: '10,000+ bookings completed' },
    { year: '2024', event: '50+ cities across Kenya' },
  ];

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
              <Link href="/about" className="text-primary-500 font-medium">
                About Us
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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                About FamilyStay
              </h1>
              <p className="text-xl mb-8">
                We are on a mission to help families discover unique homes and create unforgettable experiences across Kenya.
              </p>
              <p className="text-lg opacity-90">
                Founded in 2020, FamilyStay has grown from a small startup to Kenya's leading family-friendly vacation rental platform.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white/10 rounded-lg p-6 text-center">
                <div className="text-4xl font-bold">10,000+</div>
                <div className="text-lg">Bookings</div>
              </div>
              <div className="bg-white/10 rounded-lg p-6 text-center">
                <div className="text-4xl font-bold">5,000+</div>
                <div className="text-lg">Properties</div>
              </div>
              <div className="bg-white/10 rounded-lg p-6 text-center">
                <div className="text-4xl font-bold">50+</div>
                <div className="text-lg">Cities</div>
              </div>
              <div className="bg-white/10 rounded-lg p-6 text-center">
                <div className="text-4xl font-bold">4.8</div>
                <div className="text-lg">Avg Rating</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-8">Our Story</h2>
          <div className="prose max-w-none">
            <p className="text-lg text-gray-600 mb-6">
              FamilyStay was born from a simple observation: families traveling in Kenya struggled to find truly family-friendly accommodations. Most options were either too impersonal (hotels) or lacked the safety and comfort features that families need.
            </p>
            <p className="text-lg text-gray-600 mb-6">
              We set out to change that. By connecting families with carefully vetted properties that understand their needs—from child-safe environments to baby equipment—we've created a marketplace where everyone can feel at home.
            </p>
            <p className="text-lg text-gray-600 mb-6">
              Today, we're proud to have helped thousands of families discover the joy of vacation rentals across Kenya, from beachfront villas in Diani to mountain cabins in Naivasha.
            </p>
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">Our Journey</h2>
          <div className="relative">
            <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-primary-200" />
            {milestones.map((milestone, index) => (
              <div key={index} className={`flex items-center mb-8 ${index % 2 === 0 ? 'flex-row-reverse' : ''}`}>
                <div className="flex-1" />
                <div className="absolute left-1/2 transform -translate-x-1/2 w-4 h-4 bg-primary-500 rounded-full" />
                <div className={`flex-1 ${index % 2 === 0 ? 'text-right pr-8' : 'pl-8'}`}>
                  <div className="bg-white rounded-lg p-4 shadow-sm">
                    <div className="text-primary-500 font-bold">{milestone.year}</div>
                    <div className="text-gray-700">{milestone.event}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Values */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">Our Values</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <div key={index} className="text-center p-6">
                <div className="text-5xl mb-4">{value.icon}</div>
                <h3 className="text-xl font-semibold mb-2">{value.title}</h3>
                <p className="text-gray-600">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-4">Meet Our Team</h2>
          <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
            A passionate group of individuals dedicated to transforming family travel in Kenya.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.map((member, index) => (
              <div key={index} className="bg-white rounded-lg overflow-hidden shadow-sm">
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-full h-64 object-cover"
                />
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-1">{member.name}</h3>
                  <div className="text-primary-500 font-medium mb-3">{member.role}</div>
                  <p className="text-gray-600 text-sm">{member.bio}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-primary-500 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Join the FamilyStay Community</h2>
          <p className="text-xl mb-8">
            Whether you're a family looking for your perfect getaway or a host wanting to share your space, we'd love to hear from you.
          </p>
          <div className="flex justify-center gap-4">
            <Link
              href="/search"
              className="bg-white text-primary-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              Explore Stays
            </Link>
            <Link
              href="/host/become-host"
              className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-primary-600 transition-colors"
            >
              Become a Host
            </Link>
          </div>
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
