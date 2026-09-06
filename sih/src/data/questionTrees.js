import { generateSymptomQuestions } from './symptomAiEngine';

export const getLocalizedSocratesTree = (complaintKey = "", lang = 'en-IN') => {
  return generateSymptomQuestions(complaintKey, lang);
};
