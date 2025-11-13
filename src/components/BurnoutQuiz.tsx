// Importações necessárias do React para estado
import React, { useState } from 'react';
// Hook para navegação entre páginas
import { useHistory } from 'react-router-dom';
// Importação das perguntas base do questionário de burnout
import baseQuestions from '../utils/burnoutQuestions';

// Array de opções de resposta para cada pergunta do questionário
const OPTIONS = [
  { label: 'Sim, com frequência', value: 'sim_com_frequencia' },
  { label: 'Sim, porém com pouca frequência', value: 'sim_pouca_frequencia' },
  { label: 'Não tenho certeza', value: 'nao_tenho_certeza' },
  { label: 'Não', value: 'nao' },
];

// Função que determina se uma resposta é considerada positiva para burnout
const isPositive = (value: string | null) => {
  return value === 'sim_com_frequencia' || value === 'sim_pouca_frequencia';
};

// Função que recupera o perfil do usuário do localStorage
const getProfile = () => {
  try {
    // Recuperar dados do usuário autenticado
    const raw = localStorage.getItem('authUser');
    const user = raw ? JSON.parse(raw) : null;
    const email = user?.username || '';
    
    // Recuperar perfil específico baseado no email do usuário
    const pRaw = email ? localStorage.getItem(`userProfile:${email}`) : null;
    return pRaw ? JSON.parse(pRaw) : null;
  } catch (e) {
    // Retornar null em caso de erro na recuperação dos dados
    return null;
  }
};

// Função que gera perguntas personalizadas baseadas no perfil do usuário
const buildProfileQuestions = (profile: any) => {
  // Se não há perfil, retornar array vazio
  if (!profile) return [];
  
  // Extrair dados do perfil do usuário
  const { profissao, idade, tempoTrabalho } = profile;
  const q: { question: string }[] = [];
  
  // Adicionar perguntas específicas da profissão se disponível
  if (profissao) {
    q.push({ question: `Na sua área de ${profissao}, você sente pressão diária para atingir metas?` });
    q.push({ question: `Seu ambiente de ${profissao} dificulta pausas durante o expediente?` });
  }
  
  // Adicionar pergunta específica da idade se disponível
  if (typeof idade === 'number' && idade > 0) {
    q.push({ question: `Com ${idade} anos, percebe alterações no sono relacionadas ao trabalho?` });
  }
  
  // Adicionar pergunta específica do tempo de trabalho se disponível
  if (typeof tempoTrabalho === 'number' && tempoTrabalho > 0) {
    q.push({ question: `Trabalhando cerca de ${tempoTrabalho} horas por dia, você se sente exausto ao final?` });
  }
  
  return q;
};

// Componente principal do questionário de burnout
const BurnoutQuiz: React.FC = () => {
  // Recuperar perfil do usuário para personalizar perguntas
  const profile = getProfile();
  
  // Combinar perguntas base com perguntas personalizadas do perfil
  const allQuestions = [...baseQuestions, ...buildProfileQuestions(profile)];

  // Estado para armazenar as respostas do usuário (inicialmente todas null)
  const [answers, setAnswers] = useState<(string | null)[]>(Array(allQuestions.length).fill(null));
  
  // Estado para controlar efeito visual de clique nos botões
  const [clickedIndex, setClickedIndex] = useState<{ idx: number; value: string } | null>(null);
  
  // Hook para navegação entre páginas
  const history = useHistory();

  // Função que processa a seleção de uma resposta pelo usuário
  const handleAnswer = (index: number, value: string) => {
    // Criar cópia do array de respostas
    const updated = [...answers];
    // Atualizar a resposta na posição específica (garante apenas uma seleção por pergunta)
    updated[index] = value;
    setAnswers(updated);
    
    // Ativar efeito visual de clique
    setClickedIndex({ idx: index, value });
    // Remover efeito visual após 200ms
    setTimeout(() => setClickedIndex(null), 200);
  };

  // Função que processa o envio do questionário
  const handleSubmit = (e: React.FormEvent) => {
    // Prevenir comportamento padrão do formulário
    e.preventDefault();
    
    // Calcular pontuação contando respostas positivas para burnout
    const score = answers.filter(a => isPositive(a)).length;
    
    // Navegar para página de resultados passando a pontuação
    history.push('/results', { score });
  };

  // Renderização da interface do questionário
  return (
    <div className="quiz-container">
      <h2>Questionário de Burnout</h2>
      
      <form onSubmit={handleSubmit}>
        {allQuestions.map((q, idx) => (
          <div key={idx} style={{ marginBottom: 16 }}>
            <label>
              {idx + 1}. {q.question}
              <br />
              {OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  className={`button ${answers[idx] === opt.value ? 'selected' : ''} ${clickedIndex?.idx === idx && clickedIndex.value === opt.value ? 'clicked' : ''}`}
                  onClick={() => handleAnswer(idx, opt.value)}
                  style={{ marginRight: 8, marginTop: 8 }}
                >
                  {opt.label}
                </button>
              ))}
            </label>
          </div>
        ))}

        <button type="submit" className="start-btn" disabled={answers.includes(null)}>
          Ver Resultado
        </button>
      </form>
    </div>
  );
};

export default BurnoutQuiz;