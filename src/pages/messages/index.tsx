import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { communicationsApi } from '@/lib/api';
import toast from 'react-hot-toast';

interface Participant {
  id: number;
  username: string;
  first_name: string;
  last_name: string;
  profile_picture: string;
}

interface Property {
  id: number;
  title: string;
  featured_image: string;
}

interface LastMessage {
  id: number;
  content: string;
  sender: string;
  created_at: string;
}

interface Conversation {
  id: number;
  participants: Participant[];
  property: Property;
  last_message: LastMessage | string | null;
  updated_at: string;
  unread_count: number;
}

export default function Messages() {
  const router = useRouter();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userId, setUserId] = useState<number | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    const userData = localStorage.getItem('user');
    
    if (token && userData) {
      setIsLoggedIn(true);
      const user = JSON.parse(userData);
      setUserId(user.id);
    } else {
      router.push('/auth/login');
    }
  }, [router]);

  useEffect(() => {
    if (userId) {
      fetchConversations();
    }
  }, [userId]);

  const fetchConversations = async () => {
    setLoading(true);
    try {
      const response = await communicationsApi.listConversations();
      // Handle both paginated and non-paginated responses
      const data = response.data.results || response.data || [];
      setConversations(data);
    } catch (error) {
      console.error('Error fetching conversations:', error);
      toast.error('Failed to load conversations');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user');
    setIsLoggedIn(false);
    router.push('/');
  };

  const getOtherParticipant = (conversation: Conversation) => {
    if (!userId) return conversation.participants[0];
    return conversation.participants.find(p => p.id !== userId) || conversation.participants[0];
  };

  const getLastMessageContent = (conversation: Conversation): string => {
    if (!conversation.last_message) {
      return 'No messages yet';
    }
    
    // Handle if last_message is an object
    if (typeof conversation.last_message === 'object') {
      return conversation.last_message.content || 'No messages yet';
    }
    
    // Handle if last_message is a string
    return conversation.last_message;
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    
    if (days === 0) {
      return 'Today';
    } else if (days === 1) {
      return 'Yesterday';
    } else if (days < 7) {
      return `${days} days ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="text-2xl font-bold text-primary-500">
              FamilyStay
            </Link>
            <div className="flex items-center space-x-4">
              <Link href="/dashboard" className="text-gray-600 hover:text-primary-500">
                Dashboard
              </Link>
              <Link href="/bookings" className="text-gray-600 hover:text-primary-500">
                My Bookings
              </Link>
              <Link href="/messages" className="text-primary-500 font-medium">
                Messages
              </Link>
              <button onClick={handleLogout} className="text-gray-600 hover:text-primary-500">
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-2xl font-bold mb-6">Messages</h1>

        {conversations.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <div className="text-4xl mb-4">💬</div>
            <h3 className="text-lg font-semibold mb-2">No messages yet</h3>
            <p className="text-gray-600 mb-4">
              When you contact a host or receive messages about your bookings, they'll appear here.
            </p>
            <Link href="/search" className="btn-primary">
              Browse Properties
            </Link>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-sm divide-y">
            {conversations.map((conversation) => {
              const other = getOtherParticipant(conversation);
              const lastMessageContent = getLastMessageContent(conversation);
              
              return (
                <Link 
                  href={`/messages/${conversation.id}`} 
                  key={conversation.id}
                  className="block p-4 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    {/* Property Image */}
                    <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-200 flex-shrink-0">
                      {conversation.property?.featured_image ? (
                        <img 
                          src={conversation.property.featured_image} 
                          alt={conversation.property.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                          🏠
                        </div>
                      )}
                    </div>

                    {/* Conversation Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <h3 className="font-semibold text-gray-900 truncate">
                          {other?.first_name || other?.username || 'User'}
                        </h3>
                        <span className="text-sm text-gray-500">
                          {formatDate(conversation.updated_at)}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 truncate mb-1">
                        Re: {conversation.property?.title || 'Property'}
                      </p>
                      <p className="text-sm text-gray-500 truncate">
                        {lastMessageContent}
                      </p>
                    </div>

                    {/* Unread Badge */}
                    {conversation.unread_count > 0 && (
                      <div className="w-6 h-6 bg-primary-500 text-white rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">
                        {conversation.unread_count}
                      </div>
                    )}
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}