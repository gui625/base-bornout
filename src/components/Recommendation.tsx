// Importação do React para criação do componente
import React from 'react';

// Interface que define as propriedades esperadas pelo componente
interface RecommendationProps {
    score: number; // Pontuação do questionário de burnout
}

// Componente que exibe recomendações baseadas na pontuação do questionário
const Recommendation: React.FC<RecommendationProps> = ({ score }) => {
    // Função que determina a recomendação apropriada baseada na pontuação
    const getRecommendation = () => {
        // Pontuação alta (15+): indica sintomas significativos de burnout
        if (score >= 15) {
            return "Os seus resultados indicam que você pode estar enfrentando sintomas significativos de burnout. É altamente recomendável que você consulte um médico ou um profissional de saúde mental.";
        } 
        // Pontuação média (10-14): indica alguns sintomas de burnout
        else if (score >= 10) {
            return "Os seus resultados sugerem que você pode estar experimentando alguns sintomas de burnout. Considere conversar com um profissional de saúde para obter orientação.";
        } 
        // Pontuação baixa (0-9): não indica sintomas significativos
        else {
            return "Os seus resultados não indicam sintomas significativos de burnout, mas é sempre bom cuidar da sua saúde mental. Mantenha um equilíbrio saudável entre trabalho e vida pessoal.";
        }
    };

    // Renderização da interface de recomendação
    return (
        <div className="recommendation">
            {/* Título da seção de recomendação */}
            <h2>Recomendação</h2>
            {/* Parágrafo com a recomendação personalizada baseada na pontuação */}
            <p>{getRecommendation()}</p>
        </div>
    );
};

// Exportar o componente para uso em outras partes da aplicação
export default Recommendation;