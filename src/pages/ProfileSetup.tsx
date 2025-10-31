import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import '../styles/profileSetup.css';

const ProfileSetup: React.FC = () => {
  const history = useHistory();
  const [email, setEmail] = useState<string>('');
  const [nome, setNome] = useState('');
  const [idade, setIdade] = useState<number | ''>('');
  const [profissao, setProfissao] = useState('');
  const [tempoTrabalho, setTempoTrabalho] = useState<number | ''>('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem('authUser');
      const user = raw ? JSON.parse(raw) : null;
      setEmail(user?.username || '');
      // Caso já exista perfil, pré-carregar
      const existing = user?.username ? localStorage.getItem(`userProfile:${user.username}`) : null;
      if (existing) {
        const p = JSON.parse(existing);
        setNome(p.nome || '');
        setIdade(p.idade || '');
        setProfissao(p.profissao || '');
        setTempoTrabalho(p.tempoTrabalho || '');
      }
    } catch (e) {}
  }, []);

  const handlePreSubmit = () => {
    const isEmptyNome = (nome || '').trim() === '';
    const isEmptyIdade = !idade || Number(idade) === 0;
    const isEmptyProfissao = (profissao || '').trim() === '';
    const isEmptyTempo = !tempoTrabalho || Number(tempoTrabalho) === 0;
    if (isEmptyNome && isEmptyIdade && isEmptyProfissao && isEmptyTempo) {
      setError('Por favor, preencha os campos antes de enviar.');
    } else {
      setError(null);
    }
  };
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      history.push('/login');
      return;
    }
    const profile = { nome, idade: Number(idade), profissao, tempoTrabalho: Number(tempoTrabalho) };
    localStorage.setItem(`userProfile:${email}`, JSON.stringify(profile));
    localStorage.setItem(`userProfileCompleted:${email}`, 'true');
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