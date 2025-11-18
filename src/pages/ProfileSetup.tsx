// Importações necessárias do React para hooks e navegação
import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import '../styles/profileSetup.css';

// Componente da página de configuração de perfil - segunda tela para usuários novos
const ProfileSetup: React.FC = () => {
  // Hook para navegação entre páginas
  const history = useHistory();
  
  // Estado para armazenar o e-mail do usuário logado
  const [email, setEmail] = useState<string>('');
  
  // Estado para armazenar o nome digitado pelo usuário
  const [nome, setNome] = useState('');
  
  // Estado para armazenar a idade digitada pelo usuário (número ou vazio)
  const [idade, setIdade] = useState<number | ''>('');
  
  // Estado para armazenar a profissão digitada pelo usuário
  const [profissao, setProfissao] = useState('');
  
  // Estado para armazenar o tempo de trabalho diário (número ou vazio)
  const [tempoTrabalho, setTempoTrabalho] = useState<number | ''>('');
  
  // Estado para controlar mensagens de erro na tela
  const [error, setError] = useState<string | null>(null);

  // Hook que executa quando o componente é montado
  useEffect(() => {
    try {
      // Recupera dados do usuário logado do localStorage
      const raw = localStorage.getItem('authUser');
      const user = raw ? JSON.parse(raw) : null;
      // Define o e-mail do usuário no estado
      setEmail(user?.username || '');
      
      // Verifica se já existe um perfil salvo para pré-carregar os dados
      const existing = user?.username ? localStorage.getItem(`userProfile:${user.username}`) : null;
      if (existing) {
        // Se existe perfil, carrega os dados nos campos
        const p = JSON.parse(existing);
        setNome(p.nome || '');
        setIdade(p.idade || '');
        setProfissao(p.profissao || '');
        setTempoTrabalho(p.tempoTrabalho || '');
      }
    } catch (e) {
      // Ignora erros de parsing do localStorage
    }
  }, []);

  // Função que valida se todos os campos estão vazios antes do envio
  const handlePreSubmit = () => {
    // Verifica se o nome está vazio (removendo espaços)
    const isEmptyNome = (nome || '').trim() === '';
    // Verifica se a idade está vazia ou é zero
    const isEmptyIdade = !idade || Number(idade) === 0;
    // Verifica se a profissão está vazia (removendo espaços)
    const isEmptyProfissao = (profissao || '').trim() === '';
    // Verifica se o tempo de trabalho está vazio ou é zero
    const isEmptyTempo = !tempoTrabalho || Number(tempoTrabalho) === 0;
    
    // Se todos os campos estão vazios, mostra erro
    if (isEmptyNome && isEmptyIdade && isEmptyProfissao && isEmptyTempo) {
      setError('Por favor, preencha os campos antes de enviar.');
    } else {
      // Remove a mensagem de erro se pelo menos um campo foi preenchido
      setError(null);
    }
  };
  
  // Função principal que processa o salvamento do perfil
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Se não há e-mail, redireciona para login
    if (!email) {
      history.push('/login');
      return;
    }
    
    // Cria objeto com os dados do perfil
    const profile = { nome, idade: Number(idade), profissao, tempoTrabalho: Number(tempoTrabalho) };
    
    // Salva o perfil no localStorage usando o e-mail como chave
    localStorage.setItem(`userProfile:${email}`, JSON.stringify(profile));
    
    // Marca que o perfil foi completado para este usuário
    localStorage.setItem(`userProfileCompleted:${email}`, 'true');
    
    // Redireciona para a página do questionário
    history.push('/quiz');
  };

  return (
    <div className="profile-container">
      <div className="profile-card">
        <h2>Complete seu Perfil</h2>
        
        <p className="profile-subtitle">Essas informações ajudam a personalizar o questionário</p>
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="nome">Nome</label>
            <input id="nome" type="text" value={nome} onChange={(e) => setNome(e.target.value)} placeholder="Seu nome" required />
          </div>
          
          <div className="form-group">
            <label htmlFor="idade">Idade</label>
            <input id="idade" type="number" value={idade} onChange={(e) => setIdade(Number(e.target.value))} placeholder="Sua idade" required />
          </div>
          
          <div className="form-group">
            <label htmlFor="profissao">Profissão</label>
            <input id="profissao" type="text" value={profissao} onChange={(e) => setProfissao(e.target.value)} placeholder="Sua profissão" required />
          </div>
          
          <div className="form-group">
            <label htmlFor="tempo">Tempo diário de trabalho (horas)</label>
            <input id="tempo" type="number" value={tempoTrabalho} onChange={(e) => setTempoTrabalho(Number(e.target.value))} placeholder="Horas por dia" required />
          </div>
          
          {error && <div className="error-message">{error}</div>}
          
          <button type="submit" className="save-button" onClick={handlePreSubmit}>Salvar e continuar</button>
        </form>
      </div>
    </div>
  );
};

export default ProfileSetup;