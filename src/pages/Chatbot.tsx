import React, { useState, useRef, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import '../styles/chatbot.css';

interface Message {
  id: number;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

// Interface para o contexto da conversa
interface ConversationContext {
  lastTopic: string;
  mentionedSymptoms: boolean;
  mentionedTreatment: boolean;
  mentionedPrevention: boolean;
  userGreeted: boolean;
  userName: string | null;
}

// Componente principal do chatbot - assistente virtual para questões sobre burnout
const Chatbot: React.FC = () => {
  const history = useHistory();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: 'Olá! Sou o assistente virtual especializado em burnout. Como posso ajudar você hoje?',
      sender: 'bot',
      timestamp: new Date()
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [sessionId, setSessionId] = useState<number | null>(null);
  
  const handleFinishChat = () => {
    history.push('/final');
  };
  
  // Estado para manter o contexto da conversa
  const [context, setContext] = useState<ConversationContext>({
    lastTopic: '',
    mentionedSymptoms: false,
    mentionedTreatment: false,
    mentionedPrevention: false,
    userGreeted: false,
    userName: null
  });

  // Função para rolar automaticamente para a mensagem mais recente
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Função para enviar mensagem para a API de IA
  const sendMessageToAI = async (userMessage: string) => {
    setIsLoading(true);
    try {
      // Garante sessão no backend
      if (!sessionId) {
        try {
          const s = await fetch('/api/chat/session', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({})
          });
          const sData = await s.json();
          if (sData?.sessionId) setSessionId(Number(sData.sessionId));
        } catch {}
      }

      const history = messages.slice().map((m) => ({
        role: m.sender === 'user' ? 'user' : 'assistant',
        content: m.text,
      }));

      const r = await fetch('/api/gemini', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMessage, history, sessionId }),
      });

      let data: any = null;
      try {
        data = await r.json();
      } catch {
        data = null;
      }

      const botText = data?.reply || 'Não foi possível gerar resposta agora.';
      const newBotMessage: Message = {
        id: messages.length + 2,
        text: botText,
        sender: 'bot',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, newBotMessage]);

      // Tenta salvar a resposta no backend
      try {
        const sid = data?.sessionId ?? sessionId;
        if (sid) {
          await fetch('/api/chat/message', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ sessionId: sid, sender: 'assistant', text: botText })
          });
        }
      } catch {}
    } catch (e) {
      const newBotMessage: Message = {
        id: messages.length + 2,
        text: 'Falha ao contatar a IA. Tente novamente em instantes.',
        sender: 'bot',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, newBotMessage]);
    } finally {
      setIsLoading(false);
    }
  };
  const handleSendMessage = () => {
    if (inputText.trim() === '') return;
    const text = inputText;

    const newUserMessage: Message = {
      id: messages.length + 1,
      text,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prevMessages => [...prevMessages, newUserMessage]);

    // Tenta salvar a pergunta do usuário no backend
    try {
      if (sessionId) {
        fetch('/api/chat/message', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ sessionId, sender: 'user', text })
        }).catch(() => {});
      }
    } catch {}

    sendMessageToAI(text);
    setInputText('');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="chatbot-container">
      <div className="chatbot-header">
        <h1>Assistente Virtual de Burnout</h1>
        <p>Tire suas dúvidas sobre burnout e saúde mental</p>
        <button className="finish-button" onClick={handleFinishChat}>Finalizar Atendimento</button>
      </div>
      
      <div className="chatbot-messages">
        {messages.map(message => (
          <div 
            key={message.id} 
            className={`message ${message.sender === 'user' ? 'user-message' : 'bot-message'}`}
          >
            <div className="message-content">
              <p>{message.text}</p>
              <span className="message-time">{formatTime(message.timestamp)}</span>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="message bot-message">
            <div className="message-content">
              <div className="typing-indicator">
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      
      <div className="chatbot-input">
        <textarea
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Digite sua mensagem aqui..."
          disabled={isLoading}
        />
        <button 
          onClick={handleSendMessage} 
          disabled={inputText.trim() === '' || isLoading}
        >
          Enviar
        </button>
      </div>
    </div>
  );
};

// Exportar o componente para uso em outras partes da aplicação
export default Chatbot;