import { theme } from '../services/useTheme/index.js';

export interface Department {
  id: string;
  title: string;
  color: string;
}

export const Department = {
  SE: {
    id: 'SE',
    title: 'Software Engineering',
    color: theme.department.se.main,
  },
  PM: {
    id: 'PM',
    title: 'Product Management',
    color: theme.department.pm.main,
  },
  ID: {
    id: 'ID',
    title: 'Interaction Design',
    color: theme.department.id.main,
  },
  STS: {
    id: 'STS',
    title: 'Science, Technology, and Society',
    color: theme.department.sts.main,
  },
  IS: {
    id: 'IS',
    title: 'Interpersonal Skills',
    color: theme.department.is.main,
  },
} satisfies Record<string, Department>;

/**
 * some modules, (e.g. Bachelor Thesis, Capstone Project, Special Mobility Module) do not have a department
 */
export const getDepartment = (id?: string | null): Department | null => {
  if (typeof id !== 'string' || !(id in Department)) return null;

  return Department[id as keyof typeof Department];
};
