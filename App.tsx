import React, { useState, useEffect, useCallback } from 'react';
import { Onboarding } from './components/Onboarding';
import { ChatInterface } from './components/ChatInterface';
import { TutorConfig, ChatState, Message } from './types';
import { initializeTutorSession, sendMessageStream, resetSession } from './services/geminiService';

const App: React.FC = () => {
  const [config, setConfig] = useState<TutorConfig | null>(null);
  const [chatState, setChatState] = useState<ChatState>({
    messages: [],
    isTyping: false
  });

  const startSession = async (newConfig: TutorConfig) => {
    setConfig(newConfig);
    try {
      initializeTutorSession(newConfig);
      
      // Start with a generic greeting trigger to get the AI to initiate per its system instructions
      // We don't display this trigger to the user in the UI, we just send it to wake up the model
      setChatState(prev => ({ ...prev, isTyping: true }));
      
      const stream = sendMessageStream("Hello! I am ready to start learning. Please introduce yourself and the topic based on my level.");
      
      let initialResponseText = '';
      const messageId = Date.now().toString();

      // Create a placeholder message for the AI response
      const initialMessage: Message = {
        id: messageId,
        role: 'model',
        content: '',
        timestamp: Date.now()
      };

       setChatState(prev => ({
        ...prev,
        messages: [initialMessage]
      }));

      for await (const chunk of stream) {
        initialResponseText += chunk;
        setChatState(prev => ({
          ...prev,
          messages: prev.messages.map(msg => 
            msg.id === messageId ? { ...msg, content: initialResponseText } : msg
          )
        }));
      }

      setChatState(prev => ({ ...prev, isTyping: false }));

    } catch (error) {
      console.error("Failed to start session:", error);
      setConfig(null); // Go back to onboarding on error
    }
  };

  const handleSendMessage = useCallback(async (text: string) => {
    // Optimistic update for user message
    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: text,
      timestamp: Date.now()
    };

    setChatState(prev => ({
      messages: [...prev.messages, userMsg],
      isTyping: true
    }));

    try {
      const stream = sendMessageStream(text);
      let fullResponse = '';
      const responseId = (Date.now() + 1).toString();
      
      // Add placeholder for AI response
      const aiPlaceholder: Message = {
        id: responseId,
        role: 'model',
        content: '', // Start empty
        timestamp: Date.now()
      };

      setChatState(prev => ({
        ...prev,
        messages: [...prev.messages, aiPlaceholder]
      }));

      for await (const chunk of stream) {
        fullResponse += chunk;
        setChatState(prev => ({
          ...prev,
          messages: prev.messages.map(msg => 
            msg.id === responseId ? { ...msg, content: fullResponse } : msg
          )
        }));
      }
    } catch (error) {
      console.error("Error sending message:", error);
      // Could add an error message bubble here
    } finally {
      setChatState(prev => ({ ...prev, isTyping: false }));
    }
  }, []);

  const endSession = () => {
    resetSession();
    setConfig(null);
    setChatState({ messages: [], isTyping: false });
  };

  return (
    <>
      {!config ? (
        <Onboarding onStart={startSession} />
      ) : (
        <ChatInterface 
          messages={chatState.messages} 
          isTyping={chatState.isTyping} 
          onSendMessage={handleSendMessage}
          onEndSession={endSession}
          config={config}
        />
      )}
    </>
  );
};

export default App;