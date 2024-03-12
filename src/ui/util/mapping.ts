import { LP } from 'code-university';

import { getDepartment } from '../../data/departments.js';
import { theme } from '../../services/useTheme/index.js';

export const toModuleViewModel =
  (mandatoryModuleIds: string[]) =>
  (module: LP.ViewerSemesterModule): Module => {
    return {
      id: module.id,
      shortCode: module.module!.simpleShortCode ?? 'N/A',
      title: module.module!.title,
      retired: module.module!.retired ?? false,
      coordinatorName: module.module!.coordinator?.name ?? 'No coordinator',
      departmentShortCode:
        getDepartment(module.module!.department?.abbreviation)?.id ?? 'N/A',
      departmentColor:
        getDepartment(module.module!.department?.abbreviation)?.color ??
        theme.department.unknown.main,
      ects: module.module!.ects,
      graded: module.module!.graded ?? false,
      content: module.module!.content,
      qualificationGoals: module.module!.qualificationGoals ?? null,
      notOfferedThisSemester: !(
        module.semester?.isActive && module.allowsRegistration
      ),
      isMandatory: mandatoryModuleIds.includes(
        module.module!.id + '|MANDATORY'
      ),
      isCompulsoryElective: mandatoryModuleIds.includes(
        module.module!.id + '|COMPULSORY_ELECTIVE'
      ),
    };
  };

export const toEventViewModel = (event: LP.EventGroup) => {
  return {
    id: event.id,
    title: event.title,
    location: '',
    maxParticipants: event.maxParticipants,
    participantCount: event.participantCount,
    creatorName: event.organizersAndHosts?.[0]?.name ?? null,
  };
};

export interface Module {
  id: string;
  title: string;
  coordinatorName: string;
  shortCode: string;
  departmentShortCode: string;
  departmentColor: string;
  ects: number;
  graded: boolean;
  retired: boolean;
  notOfferedThisSemester: boolean;
  content: string;
  qualificationGoals: string | null;
  isMandatory: boolean;
  isCompulsoryElective: boolean;
}

export interface EventViewModel {
  id: string;
  title: string;
  maxParticipants: number;
  participantCount: number;
  creatorName: string | null;
  location: string | null;
}
