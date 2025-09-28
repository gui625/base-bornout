import React from 'react';

interface RecommendationProps {
    score: number;
}

const Recommendation: React.FC<RecommendationProps> = ({ score }) => {
    const getRecommendation = () => {
        if (score >= 15) {
            return "Os seus resultados indicam que você pode estar enfrentando sintomas significativos de burnout. É altamente recomendável que você consulte um médico ou um profissional de saúde mental.";
        } else if (score >= 10) {
            return "Os seus resultados sugerem que você pode estar experimentando alguns sintomas de burnout. Considere conversar com um profissional de saúde para obter orientação.";
        } else {
            return "Os seus resultados não indicam sintomas significativos de burnout, mas é sempre bom cuidar da sua saúde mental. Mantenha um equilíbrio saudável entre trabalho e vida pessoal.";
        }
    };

    return (
        <div className="recommendation">
            <h2>Recomendação</h2>
            <p>{getRecommendation()}</p>
        </div>
    );
};

export default Recommendation;