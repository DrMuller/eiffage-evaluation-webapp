export interface MacroSkillType {
  _id: string;
  name: string;
  createdAt?: Date;
}

export interface CreateMacroSkillTypeRequest {
  name: string;
}

export interface MacroSkill {
  _id: string;
  name: string;
  jobId: string;
  jobName: string;
  macroSkillTypeId: string;
  macroSkillType: MacroSkillType;
  createdAt: Date;
}

export interface CreateMacroSkillRequest {
  name: string;
  jobId: string;
  macroSkillTypeId: string;
}

export interface Skill {
  _id: string;
  name: string;
  jobId: string;
  jobName: string;
  expectedLevel: number;
  macroSkillId: string;
  macroSkillName: string;
  macroSkillTypeId: string;
  macroSkillTypeName: string;
  createdAt: Date;
}

export interface CreateSkillRequest {
  name: string;
  jobId: string;
  expectedLevel: number;
  macroSkillId: string;
}
