import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { 
  MessageCircle, 
  X, 
  Send, 
  Bot, 
  User, 
  Phone, 
  MapPin, 
  Heart,
  AlertTriangle,
  Clock
} from "lucide-react";

interface Message {
  id: string;
  text: string;
  sender: 'bot' | 'user';
  timestamp: Date;
  quickReplies?: string[];
}

const emergencyResponses = {
  "medical emergency": {
    text: "🚨 For MEDICAL EMERGENCIES, call 911 immediately! If this is not life-threatening, I can help you find medical resources or first aid information.",
    quickReplies: ["Call 911 Now", "Find Medical Centers", "First Aid Tips"]
  },
  "shelter": {
    text: "🏠 I can help you find emergency shelter. Call 311 for immediate shelter assistance or browse our shelter directory.",
    quickReplies: ["Call 311", "Find Shelters", "Shelter Requirements"]
  },
  "food": {
    text: "🍽️ For food assistance, call (555) 123-4567 or check our food bank locations. Many provide same-day emergency food supplies.",
    quickReplies: ["Call Food Assistance", "Find Food Banks", "Apply for Aid"]
  },
  "volunteer": {
    text: "👥 Thank you for wanting to help! You can register as a volunteer using our form. We have opportunities in medical aid, shelter support, and more.",
    quickReplies: ["Register to Volunteer", "View Opportunities", "Contact Coordinator"]
  },
  "water": {
    text: "💧 For clean water access, call (555) 123-4568. We also have water distribution points throughout the area.",
    quickReplies: ["Call Water Services", "Find Distribution Points", "Report Water Issues"]
  }
};

const quickStartOptions = [
  "Medical Emergency",
  "Need Shelter", 
  "Food Assistance",
  "Clean Water",
  "Volunteer",
  "Transportation Help"
];

export const EmergencyChatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: "👋 Hello! I'm your Emergency Relief Assistant. I'm here 24/7 to help you access emergency services and resources. How can I help you today?",
      sender: 'bot',
      timestamp: new Date(),
      quickReplies: quickStartOptions
    }
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const getBotResponse = (userMessage: string): Message => {
    const message = userMessage.toLowerCase();
    
    // Check for emergency keywords
    if (message.includes('emergency') || message.includes('911') || message.includes('urgent')) {
      return {
        id: crypto.randomUUID(),
        text: "🚨 If this is a LIFE-THREATENING EMERGENCY, call 911 immediately! For other urgent needs, I can help you find the right resources quickly.",
        sender: 'bot',
        timestamp: new Date(),
        quickReplies: ["Call 911 Now", "Find Emergency Services", "Other Help"]
      };
    }

    // Check for specific service keywords
    for (const [key, response] of Object.entries(emergencyResponses)) {
      if (message.includes(key) || message.includes(key.replace(' ', ''))) {
        return {
          id: crypto.randomUUID(),
          text: response.text,
          sender: 'bot',
          timestamp: new Date(),
          quickReplies: response.quickReplies
        };
      }
    }

    // Default helpful response
    return {
      id: crypto.randomUUID(),
      text: "I understand you need assistance. Here are the main emergency services I can help you access:",
      sender: 'bot',
      timestamp: new Date(),
      quickReplies: ["Medical Help", "Shelter", "Food", "Water", "Volunteer", "Transportation"]
    };
  };

  const handleSendMessage = (messageText?: string) => {
    const textToSend = messageText || inputValue.trim();
    if (!textToSend) return;

    // Add user message
    const userMessage: Message = {
      id: crypto.randomUUID(),
      text: textToSend,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue("");
    setIsTyping(true);

    // Simulate bot typing delay
    setTimeout(() => {
      const botResponse = getBotResponse(textToSend);
      setMessages(prev => [...prev, botResponse]);
      setIsTyping(false);
    }, 1000);
  };

  const handleQuickReply = (reply: string) => {
    handleSendMessage(reply);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <>
      {/* Chat Toggle Button */}
      {!isOpen && (
        <Button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-50 h-14 w-14 rounded-full shadow-emergency"
          variant="emergency"
        >
          <MessageCircle className="h-6 w-6" />
          <span className="sr-only">Open Emergency Chat</span>
        </Button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <Card className="fixed bottom-6 right-6 z-50 w-96 h-[600px] shadow-emergency flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b bg-emergency text-emergency-foreground rounded-t-lg">
            <div className="flex items-center gap-2">
              <div className="relative">
                <Bot className="h-6 w-6" />
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-success rounded-full live-indicator"></div>
              </div>
              <div>
                <h3 className="font-semibold">Emergency Assistant</h3>
                <p className="text-xs opacity-90">24/7 Available</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsOpen(false)}
              className="text-emergency-foreground hover:bg-emergency-foreground/20"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Messages */}
          <ScrollArea className="flex-1 p-4">
            <div className="space-y-4">
              {messages.map((message) => (
                <div key={message.id} className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[80%] ${message.sender === 'user' ? 'order-2' : 'order-1'}`}>
                    <div className={`flex items-end gap-2 ${message.sender === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        message.sender === 'user' ? 'bg-relief text-relief-foreground' : 'bg-emergency text-emergency-foreground'
                      }`}>
                        {message.sender === 'user' ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
                      </div>
                      <div className={`rounded-lg p-3 max-w-full ${
                        message.sender === 'user' 
                          ? 'bg-relief text-relief-foreground' 
                          : 'bg-muted'
                      }`}>
                        <p className="text-sm whitespace-pre-wrap">{message.text}</p>
                        <p className="text-xs opacity-70 mt-1">
                          {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                    </div>
                    
                    {/* Quick Replies */}
                    {message.quickReplies && message.sender === 'bot' && (
                      <div className="flex flex-wrap gap-2 mt-2 ml-10">
                        {message.quickReplies.map((reply, index) => (
                          <Button
                            key={index}
                            variant="outline"
                            size="sm"
                            onClick={() => handleQuickReply(reply)}
                            className="text-xs"
                          >
                            {reply}
                          </Button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
              
              {/* Typing Indicator */}
              {isTyping && (
                <div className="flex justify-start">
                  <div className="flex items-end gap-2">
                    <div className="w-8 h-8 rounded-full bg-emergency text-emergency-foreground flex items-center justify-center">
                      <Bot className="h-4 w-4" />
                    </div>
                    <div className="bg-muted rounded-lg p-3">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          </ScrollArea>

          {/* Input */}
          <div className="p-4 border-t">
            <div className="flex gap-2">
              <Input
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type your emergency question..."
                className="flex-1"
              />
              <Button
                onClick={() => handleSendMessage()}
                disabled={!inputValue.trim()}
                variant="emergency"
                size="icon"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex items-center gap-2 mt-2">
              <div className="w-2 h-2 bg-success rounded-full live-indicator"></div>
              <span className="text-xs text-muted-foreground">Emergency support available 24/7</span>
            </div>
          </div>
        </Card>
      )}
    </>
  );
};