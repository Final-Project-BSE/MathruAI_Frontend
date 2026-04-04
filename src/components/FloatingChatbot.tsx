'use client'

import { useState, useRef, useEffect } from 'react'
import { MessageCircle, X, Send, Minimize2, Maximize2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'
import { cn } from '@/lib/utils'
import { getSession } from '@/lib/authentication'

interface Message {
  id: string
  text: string
  sender: 'user' | 'bot'
  timestamp: Date
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'

export function FloatingChatbot() {
  const [isOpen, setIsOpen] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [inputValue, setInputValue] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [sessionId, setSessionId] = useState<string | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (isOpen && !isMinimized) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }
  }, [messages, isOpen, isMinimized])

  // Focus input when chat opens
  useEffect(() => {
    if (isOpen && !isMinimized) {
      inputRef.current?.focus()
    }
  }, [isOpen, isMinimized])

  // Create new chat session when opened
  useEffect(() => {
    if (isOpen && !sessionId) {
      initializeChat()
    }
  }, [isOpen, sessionId])

  const initializeChat = async () => {
    try {
      // Get JWT token from session
      const session = await getSession()
      if (session?.user?.token) {
        setToken(session.user.token)
        console.log("✅ JWT token loaded for FloatingChatbot")
        createNewSession()
      } else {
        console.warn("⚠️ No session found — user needs to log in")
        setMessages([{
          id: '0',
          text: "Please log in to use the chatbot assistant.",
          sender: 'bot',
          timestamp: new Date()
        }])
      }
    } catch (error) {
      console.error("Failed to get session:", error)
      setMessages([{
        id: '0',
        text: "Authentication error. Please log in to use the chatbot.",
        sender: 'bot',
        timestamp: new Date()
      }])
    }
  }

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isLoading])

  const createNewSession = async () => {
    try {
      // Don't create session ID locally - let backend manage it
      // Add welcome message
      setMessages([{
        id: '0',
        text: "Hello! I'm your pregnancy advisor assistant. How can I help you today?",
        sender: 'bot',
        timestamp: new Date()
      }])
    } catch (error) {
      console.error('Failed to create chat session:', error)
    }
  }

  const sendMessage = async () => {
    if (!inputValue.trim() || isLoading) {
      console.log('Message not sent: input empty or loading')
      return
    }
    
    if (!token) {
      console.log('No JWT token available')
      const errorMsg: Message = {
        id: Date.now().toString(),
        text: 'Please log in to use the chatbot.',
        sender: 'bot',
        timestamp: new Date()
      }
      setMessages(prev => [...prev, errorMsg])
      return
    }

    console.log('Sending message:', inputValue, 'Current session:', sessionId)

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputValue,
      sender: 'user',
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    const messageToSend = inputValue
    setInputValue('')
    setIsLoading(true)

    try {
      const requestBody: any = { 
        message: messageToSend,
        top_k: 3,
        similarity_threshold: 0.1
      }
      
      // Only include session_id if we have one from a previous response
      if (sessionId) {
        console.log('Including session_id in request:', sessionId)
        requestBody.session_id = sessionId
      } else {
        console.log('No session_id - this is a new conversation')
      }
      
      console.log('API Request:', `${API_BASE_URL}/chat`, requestBody)
      
      const response = await fetch(`${API_BASE_URL}/chat`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(requestBody)
      })

      console.log('API Response status:', response.status)

      if (response.ok) {
        const data = await response.json()
        console.log('API Response data:', data)
        
        // Store session_id from response for future messages
        if (data.session_id && !sessionId) {
          setSessionId(data.session_id)
          console.log('Session ID received from server:', data.session_id)
        }
        
        if (data.status === 'success') {
          const botMessage: Message = {
            id: (Date.now() + 1).toString(),
            text: data.response || 'No response from server',
            sender: 'bot',
            timestamp: new Date()
          }
          setMessages(prev => [...prev, botMessage])
        } else {
          console.error('API returned error status:', data)
          const errorMessage: Message = {
            id: (Date.now() + 1).toString(),
            text: data.error || data.message || 'Sorry, I encountered an error. Please try again.',
            sender: 'bot',
            timestamp: new Date()
          }
          setMessages(prev => [...prev, errorMessage])
        }
      } else {
        console.error('Response not OK:', response.status)
        const errorText = await response.text()
        console.error('Error response:', errorText)
        const errorMessage: Message = {
          id: (Date.now() + 1).toString(),
          text: `Server error (${response.status}): ${errorText || 'Please check if the backend is running.'}`,
          sender: 'bot',
          timestamp: new Date()
        }
        setMessages(prev => [...prev, errorMessage])
      }
    } catch (error: any) {
      console.error('Failed to send message:', error)
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: `Connection error: ${error.message || 'Please check if the backend is running at ' + API_BASE_URL}`,
        sender: 'bot',
        timestamp: new Date()
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  const handleNewChat = () => {
    setMessages([])
    setSessionId(null)
    setMessages([{
      id: '0',
      text: "Hello! I'm your pregnancy advisor assistant. How can I help you today?",
      sender: 'bot',
      timestamp: new Date()
    }])
  }

  return (
    <>
      {/* Floating Button */}
      {!isOpen && (
        <Button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg bg-[#d04f51] text-white z-50 transition-transform hover:scale-110 hover:bg-[#f04f51]"
          size="icon"
        >
          <MessageCircle className="h-6 w-6" />
        </Button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <Card
          className={cn(
            "fixed bottom-6 right-6 shadow-2xl border-2 z-50 flex flex-col transition-all duration-300",
            isMinimized ? "w-80 h-14" : "w-96 h-[600px]"
          )}
        >
          {/* Header - Sticky */}
          <div 
            className={cn(
              "bg-[#d04f51] text-white flex items-center justify-between sticky top-0 z-10 shrink-0",
              isMinimized ? "p-2 cursor-pointer" : "p-4"
            )}
            onClick={isMinimized ? () => setIsMinimized(false) : undefined}
          >
            <div className="flex items-center gap-2">
              <div className="bg-white/20 p-1.5 rounded-full">
                <MessageCircle className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-semibold text-sm">Pregnancy Assistant</h3>
                {!isMinimized && (
                  <p className="text-xs text-pink-100">Always here to help</p>
                )}
              </div>
            </div>
            <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-white hover:bg-white/20"
                onClick={() => setIsMinimized(!isMinimized)}
                title={isMinimized ? "Maximize" : "Minimize"}
              >
                {isMinimized ? (
                  <Maximize2 className="h-4 w-4" />
                ) : (
                  <Minimize2 className="h-4 w-4" />
                )}
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-white hover:bg-white/20"
                onClick={() => {
                  setIsOpen(false)
                  setIsMinimized(false)
                }}
                title="Close"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Messages Area */}
          {!isMinimized && (
            <>
              <ScrollArea className="flex-1 p-4 bg-gradient-to-b from-pink-50/30 to-white h-[440px]">
                <div className="min-h-full">
                  {messages.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-center">
                      <div className="bg-pink-100 p-4 rounded-full mb-4">
                        <MessageCircle className="h-8 w-8 text-pink-600" />
                      </div>
                      <h4 className="font-semibold text-gray-800 mb-2">
                        Welcome! 👋
                      </h4>
                      <p className="text-sm text-gray-600">
                        Ask me anything about pregnancy care and health!
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {messages.map((message) => (
                        <div
                          key={message.id}
                          className={cn(
                            "flex",
                            message.sender === 'user' ? "justify-end" : "justify-start"
                          )}
                        >
                          <div
                            className={cn(
                              "max-w-[80%] rounded-lg px-4 py-2 text-sm break-words whitespace-pre-wrap",
                              message.sender === 'user'
                                ? "bg-pink-600 text-white"
                                : "bg-gray-100 text-gray-800"
                            )}
                          >
                            {message.text}
                          </div>
                        </div>
                      ))}
                      {isLoading && (
                        <div className="flex justify-start">
                          <div className="bg-gray-100 rounded-lg px-4 py-2">
                            <div className="flex space-x-2">
                              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                            </div>
                          </div>
                        </div>
                      )}
                      <div ref={messagesEndRef} />
                    </div>
                  )}
                </div>
              </ScrollArea>

              {/* Input Area */}
              <div className="border-t border-gray-200 p-3 bg-white">
                <div className="flex items-end gap-2">
                  <textarea
                    ref={inputRef}
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Type your message..."
                    className="flex-1 resize-none rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#d04f51] max-h-24"
                    rows={1}
                    disabled={isLoading}
                  />
                  <Button
                    onClick={sendMessage}
                    disabled={!inputValue.trim() || isLoading}
                    size="icon"
                    className="bg-[#d04f51] hover:bg-[#d04f51] text-white h-9 w-9 flex-shrink-0"
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
                <div className="mt-2 flex justify-center">
                  <button
                    onClick={handleNewChat}
                    className="text-xs text-[#d04f51] hover:text-[#d04f51] hover:underline"
                  >
                    Start New Conversation
                  </button>
                </div>
              </div>
            </>
          )}
        </Card>
      )}
    </>
  )
}