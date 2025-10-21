import React, { useState, useRef, useEffect } from 'react';
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

const Chatbot: React.FC = () => {
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

  // Função para enviar mensagem para a API de IA (simulada por enquanto)
  const sendMessageToAI = async (userMessage: string) => {
    setIsLoading(true);
    
    // Simulação de chamada à API com timeout
    setTimeout(() => {
      // Sistema de resposta mais robusto com análise de palavras-chave
      const message = userMessage.toLowerCase();
      let botResponse = '';
      let newContext = {...context};
      
      // Detectar possível nome do usuário
      if (!context.userName) {
        const nameMatch = message.match(/meu nome é (\w+)/i) || message.match(/me chamo (\w+)/i);
        if (nameMatch && nameMatch[1]) {
          newContext.userName = nameMatch[1].charAt(0).toUpperCase() + nameMatch[1].slice(1);
        }
      }
      
      // Respostas para saudações
      if (message.match(/^(oi|olá|ola|hey|e aí|eai|bom dia|boa tarde|boa noite|hi|hello)/i)) {
        newContext.userGreeted = true;
        botResponse = context.userName 
          ? `Olá, ${context.userName}! Como posso ajudar você hoje com questões relacionadas ao burnout?` 
          : 'Olá! Como posso ajudar você hoje com questões relacionadas ao burnout?';
      }
      // Respostas sobre o que é burnout
      else if (message.includes('burnout') && (message.includes('o que é') || message.includes('o que significa') || message.includes('definição'))) {
        newContext.lastTopic = 'definição';
        botResponse = 'Burnout é uma síndrome resultante do estresse crônico no trabalho que não foi administrado com sucesso. É caracterizado por três dimensões: sentimentos de exaustão, cinismo em relação ao trabalho e eficácia profissional reduzida. Foi reconhecido pela Organização Mundial da Saúde como um fenômeno ocupacional.';
        
        // Sugestão contextual baseada no histórico
        if (!context.mentionedSymptoms) {
          botResponse += ' Gostaria de saber mais sobre os sintomas do burnout?';
        }
      }
      // Respostas sobre sintomas
      else if (message.includes('sintoma') || message.includes('sinais') || (message.includes('como') && message.includes('identificar'))) {
        newContext.lastTopic = 'sintomas';
        newContext.mentionedSymptoms = true;
        botResponse = 'Os sintomas comuns de burnout incluem: exaustão física e emocional, cinismo e despersonalização, sensação de ineficácia e falta de realização, problemas de sono, dificuldade de concentração, e sintomas físicos como dores de cabeça e problemas digestivos.';
        
        // Pergunta contextual
        botResponse += ' Você está experimentando algum desses sintomas?';
      }
      // Respostas sobre tratamento
      else if (message.includes('ajuda') || message.includes('tratamento') || message.includes('tratar') || message.includes('lidar') || message.includes('superar')) {
        newContext.lastTopic = 'tratamento';
        newContext.mentionedTreatment = true;
        botResponse = 'Para lidar com o burnout, é importante: buscar apoio profissional (psicólogo ou psiquiatra), estabelecer limites no trabalho, praticar autocuidado (exercícios, meditação, hobbies), melhorar a qualidade do sono e considerar mudanças no ambiente de trabalho se necessário.';
        
        // Pergunta contextual
        botResponse += ' Você já tentou alguma dessas abordagens?';
      }
      // Respostas sobre prevenção
      else if (message.includes('prevenção') || message.includes('prevenir') || message.includes('evitar') || (message.includes('como') && message.includes('não') && message.includes('ter'))) {
        newContext.lastTopic = 'prevenção';
        newContext.mentionedPrevention = true;
        botResponse = 'Para prevenir o burnout: estabeleça limites claros entre trabalho e vida pessoal, pratique técnicas de gerenciamento de estresse, faça pausas regulares, cultive relacionamentos de apoio, e busque significado e propósito em suas atividades.';
        
        // Pergunta contextual
        botResponse += ' Gostaria de saber mais sobre alguma dessas estratégias específicas?';
      }
      // Respostas sobre causas
      else if (message.includes('causa') || message.includes('motivo') || message.includes('razão') || message.includes('por que acontece')) {
        newContext.lastTopic = 'causas';
        botResponse = 'O burnout geralmente é causado por estresse crônico no trabalho, especialmente em ambientes com alta carga de trabalho, falta de controle, recompensas insuficientes, quebra de comunidade, ausência de justiça ou conflitos de valores. Fatores pessoais como perfeccionismo e dificuldade em estabelecer limites também contribuem.';
        
        // Pergunta contextual
        botResponse += ' Algum desses fatores ressoa com sua situação?';
      }
      // Respostas sobre diferença entre estresse e burnout
      else if ((message.includes('diferença') || message.includes('diferente')) && (message.includes('estresse') && message.includes('burnout'))) {
        newContext.lastTopic = 'diferença estresse-burnout';
        botResponse = 'Enquanto o estresse envolve muita pressão que demanda muito de você física e mentalmente, o burnout é caracterizado por sentir-se vazio, sem motivação e além do ponto de cuidar. O estresse geralmente causa hiperatividade, enquanto o burnout causa desengajamento. O estresse pode ser superado com descanso, mas o burnout requer uma abordagem mais abrangente de recuperação.';
      }
      // Respostas sobre estatísticas
      else if (message.includes('estatística') || message.includes('número') || message.includes('percentual') || message.includes('quantas pessoas')) {
        newContext.lastTopic = 'estatísticas';
        botResponse = 'Estudos recentes mostram que cerca de 76% dos trabalhadores experimentam burnout em algum momento. A pandemia aumentou esses números, com mais de 80% dos profissionais relatando maior estresse relacionado ao trabalho. Profissionais de saúde, educação e serviços sociais apresentam as maiores taxas. Esses dados demonstram como o burnout é um problema significativo no ambiente de trabalho moderno.';
      }
      // Respostas sobre trabalho remoto e burnout
      else if ((message.includes('trabalho remoto') || message.includes('home office') || message.includes('trabalhar de casa')) && message.includes('burnout')) {
        newContext.lastTopic = 'trabalho remoto';
        botResponse = 'O trabalho remoto pode tanto prevenir quanto contribuir para o burnout. Benefícios incluem eliminação do deslocamento e maior flexibilidade, mas desafios como fronteiras borradas entre trabalho e vida pessoal, isolamento social e dificuldade de desconectar podem aumentar o risco de burnout. Estabelecer rotinas claras, um espaço de trabalho dedicado e horários definidos para começar e terminar o trabalho são estratégias importantes.';
      }
      // Resposta para perguntas sobre o chatbot
      else if ((message.includes('você') || message.includes('chatbot') || message.includes('assistente')) && 
               (message.includes('quem é') || message.includes('o que é') || message.includes('como funciona'))) {
        newContext.lastTopic = 'sobre o chatbot';
        botResponse = 'Sou um assistente virtual especializado em fornecer informações sobre burnout, seus sintomas, prevenção e tratamento. Estou aqui para responder suas dúvidas e oferecer orientações baseadas em pesquisas sobre saúde mental no trabalho.';
        
        // Sugestão contextual
        if (!context.mentionedSymptoms && !context.mentionedTreatment && !context.mentionedPrevention) {
          botResponse += ' Posso ajudar com informações sobre sintomas, tratamento ou prevenção do burnout. Sobre qual desses tópicos você gostaria de saber mais?';
        } else {
          botResponse += ' Como posso ajudar você hoje?';
        }
      }
      // Resposta para agradecimentos
      else if (message.includes('obrigado') || message.includes('obrigada') || message.includes('valeu') || message.includes('agradeço')) {
        botResponse = 'De nada! Estou aqui para ajudar. Se tiver mais alguma dúvida sobre burnout ou saúde mental, não hesite em perguntar.';
        
        // Sugestão contextual baseada no histórico
        if (context.lastTopic && context.lastTopic !== '') {
          botResponse += ` Gostaria de saber mais sobre ${context.lastTopic} ou explorar outro aspecto do burnout?`;
        }
      }
      // Resposta para despedidas
      else if (message.includes('tchau') || message.includes('adeus') || message.includes('até logo') || message.includes('até mais')) {
        botResponse = context.userName 
          ? `Até logo, ${context.userName}! Lembre-se de cuidar da sua saúde mental. Estou aqui se precisar de mais informações sobre burnout.` 
          : 'Até logo! Lembre-se de cuidar da sua saúde mental. Estou aqui se precisar de mais informações sobre burnout.';
      }
      // Resposta para perguntas de sim/não após contexto
      else if ((message.includes('sim') || message.includes('não') || message.includes('nao')) && message.length < 10) {
        if (context.lastTopic === 'sintomas') {
          botResponse = message.includes('sim') 
            ? 'Entendo que você está experimentando alguns desses sintomas. É importante lembrar que o burnout é uma condição séria e buscar ajuda profissional é fundamental. Gostaria de saber mais sobre as opções de tratamento disponíveis?' 
            : 'Que bom que você não está experimentando esses sintomas! A prevenção é sempre a melhor abordagem. Gostaria de conhecer algumas estratégias para prevenir o burnout?';
        } else if (context.lastTopic === 'tratamento') {
          botResponse = message.includes('sim') 
            ? 'É ótimo saber que você já está tomando medidas para lidar com o burnout. Lembre-se que a recuperação é um processo e pode levar tempo. Continuar com essas práticas e ajustá-las conforme necessário é importante. Há alguma abordagem específica que você gostaria de explorar mais?' 
            : 'Entendo. Começar pode ser o passo mais difícil. Recomendo iniciar com pequenas mudanças, como estabelecer limites de tempo para o trabalho ou dedicar alguns minutos por dia para atividades relaxantes. Qual dessas abordagens parece mais viável para você neste momento?';
        } else if (context.lastTopic === 'prevenção') {
          botResponse = message.includes('sim') 
            ? 'Ótimo! Sobre qual estratégia específica você gostaria de saber mais: estabelecer limites no trabalho, técnicas de gerenciamento de estresse, melhorar o sono, ou encontrar mais significado nas atividades?' 
            : 'Sem problemas! Se tiver outras dúvidas sobre burnout ou saúde mental no trabalho, estou à disposição para ajudar.';
        } else if (context.lastTopic === 'causas') {
          botResponse = message.includes('sim') 
            ? 'Compreendo que você se identifica com alguns desses fatores. Reconhecer as causas é um passo importante para lidar com o burnout. Gostaria de discutir estratégias específicas para abordar esses fatores em sua situação?' 
            : 'Entendo que sua situação pode ser diferente. O burnout pode se manifestar de maneiras distintas para cada pessoa. Há algum outro aspecto da sua experiência que você gostaria de discutir?';
        } else {
          botResponse = 'Entendi sua resposta. Há algum aspecto específico do burnout sobre o qual você gostaria de saber mais?';
        }
      }
      // Resposta padrão para mensagens não reconhecidas
      else {
        botResponse = 'Entendi sua mensagem. Como especialista em burnout, posso ajudar com informações sobre definição, sintomas, causas, prevenção e tratamento dessa condição.';
        
        // Adicionar sugestões baseadas no contexto
        if (!context.mentionedSymptoms && !context.mentionedTreatment && !context.mentionedPrevention) {
          botResponse += ' Você pode perguntar sobre sintomas, tratamento ou prevenção do burnout. Sobre qual desses tópicos você gostaria de saber mais?';
        } else {
          botResponse += ' Você pode elaborar um pouco mais sua pergunta ou especificar qual aspecto do burnout gostaria de saber mais?';
        }
      }
      
      // Atualizar o contexto
      setContext(newContext);
      
      const newBotMessage: Message = {
        id: messages.length + 2,
        text: botResponse,
        sender: 'bot',
        timestamp: new Date()
      };
      
      setMessages(prevMessages => [...prevMessages, newBotMessage]);
      setIsLoading(false);
    }, 800); // Reduzindo o tempo de resposta para melhorar a experiência
  };

  const handleSendMessage = () => {
    if (inputText.trim() === '') return;
    
    const newUserMessage: Message = {
      id: messages.length + 1,
      text: inputText,
      sender: 'user',
      timestamp: new Date()
    };
    
    setMessages(prevMessages => [...prevMessages, newUserMessage]);
    sendMessageToAI(inputText);
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

export default Chatbot;