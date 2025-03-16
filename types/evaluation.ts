export interface EvaluationSkill {
    _id: string;
    evaluationId: string;
    skillId: string;
    macroSkillId: string;
    macroSkillTypeId: string;
    expectedLevel: string | null;
    observedLevel: string | null;
    gap: number | null;
    createdAt: Date;
    skill: {
        _id: string;
        name: string;
        expectedLevel: string | null;
        macroSkill: {
            _id: string;
            name: string;
            macroSkillType: {
                _id: string;
                name: string;
                createdAt?: Date;
            };
            createdAt?: Date;
        };
        createdAt: Date;
    };
}

export interface Evaluation {
    _id: string;
    userJobId?: string;
    userJobCode?: string;
    userId: string;
    userName: string;
    userCode: string;
    managerUserId?: string;
    managerUserName?: string;
    managerUserCode?: string;
    observationDate: Date;
    createdAt: Date;
    updatedAt: Date;
    createdBy: string;
    evaluationSkills?: EvaluationSkill[];
}

export interface CreateEvaluationRequest {
    userJobId?: string;
    userJobCode?: string;
    userId: string;
    userName: string;
    userCode: string;
    managerUserId?: string;
    managerUserName?: string;
    managerUserCode?: string;
    observationDate: string;
}

export interface CreateCompleteEvaluationRequest {
    evaluation: CreateEvaluationRequest;
    skills: Array<{
        skillId: string;
        expectedLevel: string | null;
        observedLevel: string | null;
    }>;
}

export interface JobSkillWithLevel {
    skill: import('./skills').Skill;
    levelExpected: string | null;
}

