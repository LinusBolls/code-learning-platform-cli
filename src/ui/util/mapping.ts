import { getDepartment } from '../../data/departments.js';
import { theme } from '../../services/useTheme/index.js';

export const toModuleViewModel = (module: any) => {
  return {
    id: module.id,
    shortCode: module.shortCode ?? 'N/A',
    title: module.title,
    coordinatorName: module.coordinator.name ?? 'No coordinator',
    departmentShortCode:
      getDepartment(module.department?.abbreviation)?.id ?? 'N/A',
    departmentColor:
      getDepartment(module.department?.abbreviation)?.color ??
      theme.department.unknown.main,
    ects: module.ects,
    graded: module.graded,
    content: module.content,
    qualificationGoals: module.qualificationGoals,
  };
};
