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
  macroSkillTypeId: string;
  macroSkillType: MacroSkillType;
  createdAt: Date;
}

export interface CreateMacroSkillRequest {
  name: string;
  macroSkillTypeId: string;
}

export interface Skill {
  _id: string;
  name: string;
  description?: string;
  expectedLevel: number | null;
  levels?: string[];
  macroSkillId: string;
  macroSkill: {
    _id: string;
    name: string;
    macroSkillTypeId: string;
    macroSkillType: MacroSkillType;
    createdAt: Date;
  };
  jobIds: string[];
  createdAt: Date;
}

export interface CreateSkillRequest {
  name: string;
  expectedLevel?: number | null;
  macroSkillId: string;
}
