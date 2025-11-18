// Array de perguntas base para o questionário de avaliação de burnout
// Estas perguntas são baseadas em critérios clínicos e pesquisas sobre síndrome de burnout
// Cada pergunta avalia diferentes aspectos dos sintomas de burnout:
// - Exaustão física e emocional
// - Despersonalização e cinismo
// - Redução da realização pessoal
// - Sintomas físicos e psicológicos associados
const questions = [
  // Pergunta sobre exaustão física - sintoma central do burnout
  { question: "Você sente cansaço extremo mesmo após descansar?" },
  
  // Pergunta sobre dificuldades cognitivas - impacto na concentração
  { question: "Tem dificuldade para se concentrar nas tarefas do dia a dia?" },
  
  // Pergunta sobre desmotivação - perda de interesse e energia
  { question: "Sente-se desmotivado ou sem energia para trabalhar?" },
  
  // Pergunta sobre alterações emocionais - irritabilidade e instabilidade de humor
  { question: "Percebe irritabilidade ou mudanças de humor frequentes?" },
  
  // Pergunta sobre distúrbios do sono - problema comum no burnout
  { question: "Tem insônia ou sono de má qualidade?" },
  
  // Pergunta sobre sintomas físicos - manifestações somáticas do estresse
  { question: "Sente dores de cabeça ou outros sintomas físicos sem explicação médica?" },
  
  // Pergunta sobre incapacidade de relaxar - hiperativação do sistema nervoso
  { question: "Sente que não consegue relaxar mesmo fora do trabalho?" },
  
  // Pergunta sobre autoestima e autoeficácia - sentimentos de inadequação
  { question: "Tem sensação de fracasso ou insegurança constante?" },
  
  // Pergunta sobre isolamento social - despersonalização e afastamento
  { question: "Percebe afastamento de amigos, familiares ou colegas?" },
  
  // Pergunta sobre sobrecarga - percepção de demandas excessivas
  { question: "Sente-se sobrecarregado com frequência?" },
  
  // Pergunta sobre anedonia - perda da capacidade de sentir prazer
  { question: "Tem dificuldade em sentir prazer em atividades que antes gostava?" },
  
  // Pergunta sobre tensão emocional - estado de alerta constante
  { question: "Sente que está sempre no limite ou prestes a explodir?" },
  
  // Pergunta sobre pensamentos de desistência - ideação de escape
  { question: "Já pensou em desistir do trabalho ou das responsabilidades por exaustão?" },
  
  // Pergunta sobre desvalorização pessoal - baixa realização profissional
  { question: "Sente que suas conquistas não têm valor?" },
  
  // Pergunta sobre declínio no desempenho - impacto funcional do burnout
  { question: "Percebe queda no rendimento profissional ou acadêmico?" }
];

// Exportar as perguntas para uso no componente BurnoutQuiz
// Este array será combinado com perguntas personalizadas baseadas no perfil do usuário
export default questions;
