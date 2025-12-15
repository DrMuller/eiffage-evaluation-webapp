export type Job = {
    _id: string;
    name: string;
    code: string;
    jobProfile: string;
    jobFamily?: string;
    createdAt: string | Date;
};

export type JobSkillLink = {
    skill: import('./skills').Skill;
    skillId: string;
    skillName: string;
    macroSkillId: string;
    macroSkillName: string;
    macroSkillTypeId: string;
    macroSkillTypeName: string;
    levelExpected: number | null;
};
