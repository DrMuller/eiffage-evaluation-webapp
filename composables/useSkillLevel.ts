export interface SkillLevelInfo {
    value: number
    name: string
    shortName: string
    color: 'neutral' | 'warning' | 'error' | 'info' | 'success'
    definition: string
    example: string
}

export const skillLevels: SkillLevelInfo[] = [
    {
        value: 0,
        name: 'Non applicable',
        shortName: 'N/A',
        color: 'neutral',
        definition: '',
        example: ''
    },
    {
        value: 1,
        name: 'Notion',
        shortName: 'Notion',
        color: 'warning',
        definition: 'Possède une maîtrise partielle de la compétence. Capable d\'effectuer des tâches simples sous supervision stricte avec une assistance fréquente.',
        example: 'Peut réaliser des soudures simples avec une ou 2 techniques sous supervision'
    },
    {
        value: 2,
        name: 'Application simple',
        shortName: 'Application',
        color: 'warning',
        definition: 'Est capable d\'effectuer des tâches de manière autonome, avec des connaissances pratiques suffisantes pour suivre des instructions standards. Peut gérer des situations courantes avec une supervision modérée.',
        example: 'Peut réaliser en autonomie différents types de soudures en utilisant différents procédés en autonomie mais sous supervision.'
    },
    {
        value: 3,
        name: 'Maîtrise',
        shortName: 'Maîtrise',
        color: 'success',
        definition: 'Maîtrise la compétence dans son ensemble et peut exécuter des tâches complexes de manière autonome. Capable de diagnostiquer et de résoudre des problèmes réguliers, de former d\'autres personnes et de travailler sans supervision.',
        example: 'Peut effectuer et interpréter des contrôles qualité par magnétoscopie ou ultrasons, et rédiger des PV et des procédures de standardisation.'
    },
    {
        value: 4,
        name: 'Expertise',
        shortName: 'Expertise',
        color: 'success',
        definition: 'Possède une expertise approfondie et peut gérer des tâches complexes, innover et développer des solutions avancées dans le domaine de compétence. Capable d\'agir comme un leader, de conseiller sur des projets complexes et de proposer des améliorations des pratiques existantes.',
        example: 'Peut développer, optimiser et standardiser des procédures de soudage avancées, former de grands groupes d\'employés à ces techniques, et résoudre des problèmes très complexes impliquant des méthodes de soudage innovantes.'
    }
]

export const useSkillLevelLabel = (level?: number | null): string => {
    if (level === null || level === undefined) return 'Non applicable'
    const levelInfo = skillLevels.find(l => l.value === level)
    return levelInfo?.name || 'Non applicable'
}

export const useSkillLevelShortName = (level?: number | null): string => {
    if (level === null || level === undefined) return 'N/A'
    const levelInfo = skillLevels.find(l => l.value === level)
    return levelInfo?.shortName || 'N/A'
}

export const useSkillLevelColor = (level?: number | null): 'neutral' | 'warning' | 'error' | 'info' | 'success' => {
    if (level === null || level === undefined) return 'neutral'
    const levelInfo = skillLevels.find(l => l.value === level)
    return levelInfo?.color || 'neutral'
}

export const useSkillLevelInfo = (level?: number | null): SkillLevelInfo => {
    if (level === null || level === undefined) return skillLevels[0]!
    const levelInfo = skillLevels.find(l => l.value === level)
    return levelInfo || skillLevels[0]!
}


