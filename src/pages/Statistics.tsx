import React from 'react';
import '../styles/statistics.css';

// Dados simulados para os gráficos (FICTÍCIOS)
const mockData = {
  clientsLastThreeDays: [
    { day: 'Hoje', count: 15 },
    { day: 'Ontem', count: 12 },
    { day: 'Anteontem', count: 18 },
  ],
  results: [
    { result: 'Sem Burnout', count: 25 },
    { result: 'Burnout Leve', count: 18 },
    { result: 'Burnout Moderado', count: 12 },
    { result: 'Burnout Severo', count: 5 },
  ],
  mostYesQuestions: [
    { question: 'Sente-se esgotado ao final do dia?', count: 32 },
    { question: 'Tem dificuldade para dormir?', count: 28 },
    { question: 'Sente-se frustrado no trabalho?', count: 25 },
    { question: 'Sente dores de cabeça frequentes?', count: 22 },
    { question: 'Tem dificuldade de concentração?', count: 20 },
  ],
};

const BarChart = ({ data, valueKey, labelKey, maxValue, color }: any) => {
  return (
    <div className="simple-bar-chart">
      {data.map((item: any, index: number) => {
        const value = item[valueKey];
        const percentage = (value / maxValue) * 100;
        
        return (
          <div className="bar-item" key={index}>
            <div className="bar-label">{item[labelKey]}</div>
            <div className="bar-container">
              <div 
                className="bar" 
                style={{ 
                  width: `${percentage}%`,
                  backgroundColor: color
                }}
              >
                <span className="bar-value">{value}</span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

const Statistics: React.FC = () => {
  // Encontrar o valor máximo para cada conjunto de dados
  const maxClientsCount = Math.max(...mockData.clientsLastThreeDays.map(item => item.count));
  const maxResultsCount = Math.max(...mockData.results.map(item => item.count));
  const maxQuestionsCount = Math.max(...mockData.mostYesQuestions.map(item => item.count));

  return (
    <div className="statistics-container">
      <h1>Estatísticas de Clientes</h1>
      
      <div className="statistics-section">
        <h2>Acessos nos Últimos 3 Dias</h2>
        <BarChart 
          data={mockData.clientsLastThreeDays}
          valueKey="count"
          labelKey="day"
          maxValue={maxClientsCount}
          color="#4a90e2"
        />
      </div>
      
      <div className="statistics-section">
        <h2>Resultados dos Clientes</h2>
        <BarChart 
          data={mockData.results}
          valueKey="count"
          labelKey="result"
          maxValue={maxResultsCount}
          color="#50c878"
        />
      </div>
      
      <div className="statistics-section">
        <h2>Perguntas Mais Respondidas com "Sim"</h2>
        <BarChart 
          data={mockData.mostYesQuestions.map((item, index) => ({
            ...item,
            shortLabel: `Pergunta ${index + 1}`
          }))}
          valueKey="count"
          labelKey="shortLabel"
          maxValue={maxQuestionsCount}
          color="#f5a623"
        />
        
        <div className="questions-legend">
          <h3>Legenda das Perguntas:</h3>
          {mockData.mostYesQuestions.map((item, index) => (
            <div className="question-legend-item" key={index}>
              <span className="question-number">Pergunta {index + 1}:</span> {item.question}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Statistics;