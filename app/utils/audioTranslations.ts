// Mapeamento de categorias em inglês para português
export const categoryTranslations: Record<string, string> = {
    'balancedSensoryStimulation': 'Estímulo Sensorial Equilibrado',
    'cognitiveStimulation': 'Estímulo Cognitivo',
    'developmentOfCommunication': 'Desenvolvimento da Comunicação',
    'focusAndConcentration': 'Foco e Concentração',
    'moodImprovement': 'Melhoria de Humor',
    'reductionOfCrisesAndAnxiety': 'Redução de Crises e Ansiedade',
    'relaxationAndSleep': 'Relaxamento e Sono',
    'selfRegulationDuringCrisis': 'Autorregulação Durante Crise',
};

// Função para traduzir nomes de categorias
export function getCategoryTranslation(categoryName: string): string {
    return categoryTranslations[categoryName] || categoryName;
}

// Mapeamento de nomes de áudio em inglês para português
export const audioTranslations: Record<string, string> = {
    // Estímulo Sensorial Equilibrado
    'reductionOfMuscularAndSensoryTensions': 'Redução de Tensões Musculares e Sensoriais',
    'promotingABalancedSensation': 'Promovendo Sensação Equilibrada',
    'regulationOfIntenseSensoryStimuli': 'Regulação de Estímulos Sensoriais Intensos',
    'toHarmonizeSensoryStimuli': 'Harmonização de Estímulos Sensoriais',
    'physicalAndSensoryBalance': 'Equilíbrio Físico e Sensorial',
    'naturalSoundToImproveAuditoryPerception': 'Som Natural para Melhorar Percepção Auditiva',
    'sensorySynchronization': 'Sincronização Sensorial',
    'sensoryAndEmotionalIntegration': 'Integração Sensorial e Emocional',
    'releaseOfEmotionalOverload': 'Liberação de Sobrecarga Emocional',
    'gentleDesensitization': 'Dessensibilização Suave',

    // Ondas Cerebrais
    'deltaSleep': 'Sono Delta',
    'betaBinauralWaves': 'Ondas Binaurais Beta',
    'alphaRelaxation': 'Relaxamento Alpha',
    'higherConsciousnessGamma': 'Consciência Superior Gamma',
    '432hzAlphaHealing': 'Cura Alpha 432Hz',

    // Regulação Emocional
    'reliefOfFearsTensionsAndStress': 'Alívio de Medos, Tensões e Estresse',
    'gentleStimulusToStabilizeTheSenses': 'Estímulo Suave para Estabilizar os Sentidos',
    'emotionalTransformationAndRecoveryOfCalm': 'Transformação Emocional e Recuperação da Calma',
    'emotionalStabilizationDuringCrises': 'Estabilização Emocional Durante Crises',
    'deepCalmAndEmotionalRegulation': 'Calma Profunda e Regulação Emocional',
    'emotionalAndEnvironmentalHarmonyToRebalanceMood': 'Harmonia Emocional e Ambiental para Reequilibrar o Humor',
    'supportForConcentrationAndVerbalResponse': 'Suporte para Concentração e Resposta Verbal',
    'deepRelaxationAndSensoryRelief': 'Relaxamento Profundo e Alívio Sensorial',
    'balanceForTheCentralNervousSystem': 'Equilíbrio para o Sistema Nervoso Central',
    'balanceAndEmotionalSelfRegulation': 'Equilíbrio e Autorregulação Emocional',
    'activationOfMentalSerenityAndSelfControl': 'Ativação da Serenidade Mental e Autocontrole',

    // Comunicação
    'stimulationOfConcentrationForInteraction': 'Estimulação de Concentração para Interação',
    'improvementOfInterpersonalCommunication': 'Melhoria da Comunicação Interpessoal',
    'improvementInFocusAndVerbalExpression': 'Melhoria no Foco e Expressão Verbal',
    'stimulationForAttentionAndVerbalExpression': 'Estimulação para Atenção e Expressão Verbal',
    'Equilíbrio_Emocional_Essencia': 'Equilíbrio Emocional Essência',

    // Estímulo Cognitivo
    'facilitatesLearningAndActiveListening': 'Facilita Aprendizado e Escuta Ativa',
    'advancedInformationProcessing': 'Processamento Avançado de Informações',
    'activationOfIntuitionAndExpression': 'Ativação de Intuição e Expressão',
    'relaxedCognitiveEnvironment': 'Ambiente Cognitivo Relaxado',
    'problemSolving': 'Resolução de Problemas',
    'integrationOfSocialLearning': 'Integração de Aprendizado Social',
    'regeneratingAndMotivating': 'Regenerador e Motivador',
    'idealLearningState': 'Estado Ideal de Aprendizado',
    'memoryConsolidationDuringSleep': 'Consolidação de Memória Durante o Sono',
    'directCognitiveStimulation': 'Estimulação Cognitiva Direta',
    'harmonyForStudying': 'Harmonia para Estudar',
    'attentionAndInformationRetention': 'Atenção e Retenção de Informação',
    'advancedProcessing': 'Processamento Avançado',

    // Foco e Concentração
    'pianoSoundsThatStimulateFocus': 'Sons de Piano que Estimulam o Foco',
    'stimulationOfModerateAttention': 'Estimulação de Atenção Moderada',
    'intenseConcentration': 'Concentração Intensa',
    'mentalRelaxationForGreaterFocus': 'Relaxamento Mental para Maior Foco',
    'natureToHelpWithAttention': 'Natureza para Ajudar na Atenção',
    'intelligentLearningRetention': 'Retenção Inteligente de Aprendizado',
    'improvedAttentionDuringInteractions': 'Atenção Aprimorada Durante Interações',
    'harmonyForCalmMentalActivities': 'Harmonia para Atividades Mentais Calmas',
    'focusOnSpecificTasks': 'Foco em Tarefas Específicas',

    // Melhoria de Humor
    'releaseOfInternalTensions': 'Liberação de Tensões Internas',
    'harmonyAndEmotionalConnection': 'Harmonia e Conexão Emocional',
    'dissolutionOfNegativeEmotionalStates': 'Dissolução de Estados Emocionais Negativos',
    'natureThatInspiresHappiness': 'Natureza que Inspira Felicidade',
    'joyAndLove': 'Alegria e Amor',
    'happyMentalStates': 'Estados Mentais Felizes',
    'emotionalElevation': 'Elevação Emocional',
    'motivationAndHappiness': 'Motivação e Felicidade',
    'elevationOfEmotionalState': 'Elevação do Estado Emocional',
    'calmAndElevatedMood': 'Humor Calmo e Elevado',

    // Redução de Crises e Ansiedade
    'reductionOfAnxietyPeaks': 'Redução de Picos de Ansiedade',
    'rainSoundsAsCalmingBackground': 'Sons de Chuva como Fundo Calmante',
    'stabilizingEmotions': 'Estabilizando Emoções',
    'releaseOfFearsAndNegativeEmotions': 'Liberação de Medos e Emoções Negativas',
    'stressControlDuringCrisisMoments': 'Controle de Estresse em Momentos de Crise',
    'emotionalTransformationAndCleansing': 'Transformação e Limpeza Emocional',
    'soothingAndRestorative': 'Calmante e Restaurador',
    'emotionalHarmony': 'Harmonia Emocional',

    // Relaxamento e Sono
    'elevatingTranquility': 'Tranquilidade Elevadora',
    'deepRelaxation': 'Relaxamento Profundo',
    'naturalHarmonyAndEmotionalBalance': 'Harmonia Natural e Equilíbrio Emocional',
    'tensionReductionAndCellularRegeneration': 'Redução de Tensão e Regeneração Celular',
    'regulatingSleep': 'Regulando o Sono',
    'transitionToAStateOfRelaxation': 'Transição para Estado de Relaxamento',
    'relaxWithNatureSounds': 'Relaxe com Sons da Natureza',
    'healingAndUniversalLove': 'Cura e Amor Universal',
    'relaxationBeforeSleeping': 'Relaxamento Antes de Dormir',
    'inductionOfDeepSleep': 'Indução de Sono Profundo',
    'deepRelaxationAndPainRelief': 'Relaxamento Profundo e Alívio da Dor',
    'deepAndRestorativeSleepStimulation': 'Estimulação de Sono Profundo e Restaurador',
};

// Função auxiliar para obter tradução
export function getAudioTranslation(fileName: string): string {
    // Remove sufixos aleatórios (_xxxxx) e extensão
    const cleanName = fileName
        .replace(/\.[^/.]+$/, '')  // Remove extensão
        .replace(/_[a-z0-9]{6}$/i, '');  // Remove sufixo de 6 caracteres

    // Procura tradução
    return audioTranslations[cleanName] || cleanName;
}
