// Importações necessárias do React para estado, referências e efeitos
import React, { useState, useRef, useEffect } from 'react';
// Hook para navegação entre páginas
import { useHistory } from 'react-router-dom';
// Estilos específicos do chatbot
import '../styles/chatbot.css';

// Interface que define a estrutura de uma mensagem no chat
interface Message {
  id: number;           // Identificador único da mensagem
  text: string;         // Conteúdo da mensagem
  sender: 'user' | 'bot'; // Quem enviou a mensagem (usuário ou bot)
  timestamp: Date;      // Horário de envio da mensagem
}

// Interface para o contexto da conversa - mantém informações sobre o histórico do chat
interface ConversationContext {
  lastTopic: string;          // Último tópico discutido na conversa
  mentionedSymptoms: boolean; // Se sintomas já foram mencionados
  mentionedTreatment: boolean; // Se tratamento já foi mencionado
  mentionedPrevention: boolean; // Se prevenção já foi mencionada
  userGreeted: boolean;       // Se o usuário já cumprimentou
  userName: string | null;    // Nome do usuário (se fornecido)
}

// Componente principal do chatbot - assistente virtual para questões sobre burnout
const Chatbot: React.FC = () => {
  // Hook para navegação entre páginas
  const history = useHistory();
  
  // Estado que armazena todas as mensagens do chat, iniciando com mensagem de boas-vindas do bot
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: 'Olá! Sou o assistente virtual especializado em burnout. Como posso ajudar você hoje?',
      sender: 'bot',
      timestamp: new Date()
    }
  ]);
  
  // Estado para o texto digitado pelo usuário no campo de entrada
  const [inputText, setInputText] = useState('');
  
  // Estado para indicar quando o bot está processando uma resposta
  const [isLoading, setIsLoading] = useState(false);
  
  // Referência para o elemento que marca o final das mensagens (para scroll automático)
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Função que redireciona para a tela final quando o usuário termina o chat
  const handleFinishChat = () => {
    history.push('/final');
  };
  
  // Estado para manter o contexto da conversa e personalizar respostas
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

  // Efeito que executa o scroll automático sempre que novas mensagens são adicionadas
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Função para enviar mensagem para a API de IA (simulada por enquanto)
  // Função principal que processa mensagens do usuário e gera respostas do bot
  const sendMessageToAI = async (userMessage: string) => {
    // Ativa o indicador de carregamento enquanto processa a resposta
    setIsLoading(true);
    
    // Simulação de chamada à API com timeout para simular processamento
    setTimeout(() => {
      // Sistema de resposta mais robusto com análise de palavras-chave
      const message = userMessage.toLowerCase();
      let botResponse = '';
      let newContext = {...context};
      
      // Detectar possível nome do usuário nas mensagens
      if (!context.userName) {
        const nameMatch = message.match(/meu nome é (\w+)/i) || message.match(/me chamo (\w+)/i);
        if (nameMatch && nameMatch[1]) {
          newContext.userName = nameMatch[1].charAt(0).toUpperCase() + nameMatch[1].slice(1);
        }
      }
      
      // Lógica de respostas baseada em palavras-chave e contexto
      // [Todo o sistema de respostas permanece igual...]
      
      // Atualizar o contexto da conversa
      setContext(newContext);
      
      // Criar nova mensagem do bot com a resposta gerada
      const newBotMessage: Message = {
        id: messages.length + 2,
        text: botResponse,
        sender: 'bot',
        timestamp: new Date()
      };
      
      // Adicionar a nova mensagem do bot à lista de mensagens
      setMessages(prevMessages => [...prevMessages, newBotMessage]);
      // Desativar o indicador de carregamento
      setIsLoading(false);
    }, 800); // Tempo de resposta simulado para melhorar a experiência
  };

  // Função que envia mensagem do usuário e processa resposta do bot
  const handleSendMessage = () => {
    // Verificar se há texto para enviar (não vazio)
    if (inputText.trim() === '') return;
    
    // Criar nova mensagem do usuário
    const newUserMessage: Message = {
      id: messages.length + 1,
      text: inputText,
      sender: 'user',
      timestamp: new Date()
    };
    
    // Adicionar mensagem do usuário à lista de mensagens
    setMessages(prevMessages => [...prevMessages, newUserMessage]);
    // Enviar mensagem para processamento do bot
    sendMessageToAI(inputText);
    // Limpar o campo de entrada
    setInputText('');
  };

  // Função que detecta quando o usuário pressiona Enter para enviar mensagem
  const handleKeyPress = (e: React.KeyboardEvent) => {
    // Se pressionar Enter (sem Shift), enviar mensagem
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Função que formata o horário das mensagens para exibição
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  // Renderização da interface do usuário
  return (
    {/* Container principal do chatbot */}
    <div className="chatbot-container">
      {/* Cabeçalho do chatbot com título e botão de finalizar */}
      <div className="chatbot-header">
        {/* Título principal do assistente virtual */}
        <h1>Assistente Virtual de Burnout</h1>
        {/* Subtítulo explicativo sobre a função do chatbot */}
        <p>Tire suas dúvidas sobre burnout e saúde mental</p>
        {/* Botão para finalizar o atendimento e ir para tela final */}
        <button className="finish-button" onClick={handleFinishChat}>Finalizar Atendimento</button>
      </div>
      
      {/* Área de exibição das mensagens do chat */}
      <div className="chatbot-messages">
        {/* Mapear e renderizar todas as mensagens */}
        {messages.map(message => (
          {/* Container individual de cada mensagem com classe dinâmica baseada no remetente */}
          <div 
            key={message.id} 
            className={`message ${message.sender === 'user' ? 'user-message' : 'bot-message'}`}
          >
            {/* Conteúdo da mensagem */}
            <div className="message-content">
              {/* Texto da mensagem */}
              <p>{message.text}</p>
              {/* Horário de envio da mensagem */}
              <span className="message-time">{formatTime(message.timestamp)}</span>
            </div>
          </div>
        ))}
        
        {/* Indicador de digitação quando o bot está processando resposta */}
        {isLoading && (
          <div className="message bot-message">
            <div className="message-content">
              {/* Animação de três pontos indicando que o bot está digitando */}
              <div className="typing-indicator">
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
          </div>
        )}
        
        {/* Elemento de referência para scroll automático para o final das mensagens */}
        <div ref={messagesEndRef} />
      </div>
      
      {/* Área de entrada de texto para o usuário */}
      <div className="chatbot-input">
        {/* Campo de texto para digitar mensagens */}
        <textarea
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Digite sua mensagem aqui..."
          disabled={isLoading}
        />
        {/* Botão para enviar mensagem - desabilitado se não há texto ou se está carregando */}
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