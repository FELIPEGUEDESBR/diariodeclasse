
export enum AttendanceStatus {
  PRESENT = 'Presente',
  ABSENT = 'Ausente',
  UNMARKED = 'Não Marcado',
}

export interface Student {
  id: string;
  name: string;
  parentEmail: string;
}

export interface Class {
  id: string;
  name: string;
  students: Student[];
}

export interface AttendanceRecord {
  [studentId: string]: AttendanceStatus;
}
   