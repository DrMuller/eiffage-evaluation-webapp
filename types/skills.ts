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
  macroSkillId: string;
  macroSkillName: string;
  macroSkillTypeId: string;
  macroSkillTypeName: string;
  jobIds: string[];
  createdAt: Date;
}

export interface CreateSkillRequest {
  name: string;
  macroSkillId: string;
}
