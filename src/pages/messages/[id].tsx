import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { communicationsApi } from '@/lib/api';
import toast from 'react-hot-toast';

interface Sender {
  id: number;
  username: string;
  first_name: string;
  last_name: string;
  profile_picture: string;
}

interface Message {
  id: number;
  sender: Sender;
  content: string;
  attachments: string[];
  is_read: boolean;
  read_at: string | null;
  created_at: string;
}

interface Property {
  id: number;
  title: string;
  featured_image: string;
  address: string;
  city: string;
}

interface Conversation {
  id: number;
  participants: Sender[];
  property: Property;
  messages: Message[];
}

export default function ConversationDetail() {
  const router = useRouter();
  const { id } = router.query;
  const [conversation, setConversation] = useState<Conversation | null>(null);
  const [loading, setLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userId, setUserId] = useState<number | null>(null);
  const [newMessage, setNewMessage] = useState('');
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

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
    if (id && userId) {
      fetchConversation();
    }
  }, [id, userId]);

  useEffect(() => {
    // Scroll to bottom when messages change
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [conversation?.messages]);

  const fetchConversation = async () => {
    setLoading(true);
    try {
      const response = await communicationsApi.getConversation(Number(id));
      setConversation(response.data);
    } catch (error) {
      console.error('Error fetching conversation:', error);
      toast.error('Failed to load conversation');
      router.push('/messages');
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

  const handleSendMessage = async () => {
    if (!newMessage.trim()) {
      toast.error('Please enter a message');
      return;
    }

    setSending(true);
    try {
      await communicationsApi.sendMessage(Number(id), newMessage);
      setNewMessage('');
      fetchConversation(); // Refresh to get new message
      toast.success('Message sent!');
    } catch (error: any) {
      console.error('Error sending message:', error);
      toast.error(error.response?.data?.detail || 'Failed to send message');
    } finally {
      setSending(false);
    }
  };

  const getOtherParticipant = () => {
    if (!conversation || !userId) return null;
    return conversation.participants.find(p => p.id !== userId) || conversation.participants[0];
  };

  const formatTime = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  if (!conversation) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Conversation not found</h2>
          <Link href="/messages" className="btn-primary">Back to Messages</Link>
        </div>
      </div>
    );
  }

  const other = getOtherParticipant();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-4">
              <Link href="/messages" className="text-gray-600 hover:text-primary-500">
                ← Back
              </Link>
              <Link href="/" className="text-2xl font-bold text-primary-500">
                FamilyStay
              </Link>
            </div>
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
        {/* Conversation Header */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-gray-300 overflow-hidden">
              {other?.profile_picture ? (
                <img src={other.profile_picture} alt={other.username} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-600 font-bold">
                  {other?.first_name?.charAt(0) || other?.username?.charAt(0) || 'U'}
                </div>
              )}
            </div>
            <div>
              <h2 className="font-semibold text-gray-900">
                {other?.first_name || other?.username || 'User'}
              </h2>
              <p className="text-sm text-gray-500">
                Re: {conversation.property?.title || 'Property'}
              </p>
            </div>
            <Link 
              href={`/property/${conversation.property?.id}`}
              className="ml-auto btn-outline text-sm"
            >
              View Property
            </Link>
          </div>
        </div>

        {/* Messages */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-4 h-[400px] overflow-y-auto">
          {!conversation.messages || conversation.messages.length === 0 ? (
            <div className="text-center text-gray-500 py-8">
              No messages yet. Start the conversation!
            </div>
          ) : (
            <div className="space-y-4">
              {conversation.messages.map((message, index) => {
                const isMe = message.sender.id === userId;
                const showDate = index === 0 || 
                  formatDate(message.created_at) !== formatDate(conversation.messages[index - 1].created_at);
                
                return (
                  <div key={message.id}>
                    {showDate && (
                      <div className="text-center text-sm text-gray-400 my-4">
                        {formatDate(message.created_at)}
                      </div>
                    )}
                    <div className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[70%] ${isMe ? 'order-1' : ''}`}>
                        <div className={`rounded-lg px-4 py-2 ${
                          isMe ? 'bg-primary-500 text-white' : 'bg-gray-100 text-gray-900'
                        }`}>
                          <p className="whitespace-pre-wrap break-words">{message.content}</p>
                        </div>
                        <p className={`text-xs text-gray-400 mt-1 ${isMe ? 'text-right' : ''}`}>
                          {formatTime(message.created_at)}
                          {isMe && message.is_read && ' • Read'}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        {/* Message Input */}
        <div className="bg-white rounded-lg shadow-sm p-4">
          <div className="flex gap-2">
            <textarea
              className="input flex-1"
              placeholder="Type your message..."
              rows={2}
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage();
                }
              }}
            />
            <button
              onClick={handleSendMessage}
              disabled={sending || !newMessage.trim()}
              className="btn-primary px-6 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {sending ? 'Sending...' : 'Send'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}