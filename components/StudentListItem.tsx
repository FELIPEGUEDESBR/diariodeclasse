
import React from 'react';
import type { Student } from '../types';
import { AttendanceStatus } from '../types';
import { CheckCircleIcon, XCircleIcon, MailIcon, PencilIcon, TrashIcon } from './icons';

interface StudentListItemProps {
  student: Student;
  status: AttendanceStatus;
  onStatusChange: (studentId: string, status: AttendanceStatus) => void;
  onNotify: (student: Student) => void;
  onEdit: (student: Student) => void;
  onDelete: (studentId: string) => void;
}

const StudentListItem: React.FC<StudentListItemProps> = ({ student, status, onStatusChange, onNotify, onEdit, onDelete }) => {
  const getStatusClasses = () => {
    switch (status) {
      case AttendanceStatus.PRESENT:
        return 'bg-green-50 border-l-4 border-green-500';
      case AttendanceStatus.ABSENT:
        return 'bg-red-50 border-l-4 border-red-500';
      default:
        return 'bg-white border-l-4 border-gray-200';
    }
  };

  return (
    <div className={`flex items-center justify-between p-4 rounded-lg shadow-sm transition-all duration-300 ${getStatusClasses()}`}>
      <div className="flex items-center overflow-hidden">
        <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 font-bold">
          {student.name.charAt(0)}
        </div>
        <div className="ml-4 overflow-hidden">
          <div className="text-sm font-medium text-gray-900 truncate">{student.name}</div>
          <div className="text-xs text-gray-500 truncate">{student.parentEmail}</div>
          <div className="text-xs text-gray-500 truncate">{student.parentPhone}</div>
        </div>
      </div>
      <div className="flex items-center space-x-1 sm:space-x-2 flex-shrink-0">
        <button
          onClick={() => onStatusChange(student.id, AttendanceStatus.PRESENT)}
          className={`p-2 rounded-full transition-colors duration-200 ${status === AttendanceStatus.PRESENT ? 'bg-green-100 text-green-600' : 'text-gray-400 hover:bg-green-50 hover:text-green-500'}`}
          aria-label={`Marcar ${student.name} como presente`}
        >
          <CheckCircleIcon className="w-6 h-6" />
        </button>
        <button
          onClick={() => onStatusChange(student.id, AttendanceStatus.ABSENT)}
          className={`p-2 rounded-full transition-colors duration-200 ${status === AttendanceStatus.ABSENT ? 'bg-red-100 text-red-600' : 'text-gray-400 hover:bg-red-50 hover:text-red-500'}`}
          aria-label={`Marcar ${student.name} como ausente`}
        >
          <XCircleIcon className="w-6 h-6" />
        </button>
        {status === AttendanceStatus.ABSENT && (
          <button
            onClick={() => onNotify(student)}
            className="p-2 rounded-full bg-blue-100 text-blue-600 hover:bg-blue-200 transition-colors duration-200"
            aria-label={`Notificar ausência de ${student.name}`}
          >
            <MailIcon className="w-6 h-6" />
          </button>
        )}
         <button
          onClick={() => onEdit(student)}
          className="p-2 rounded-full text-gray-400 hover:bg-yellow-50 hover:text-yellow-500 transition-colors duration-200"
          aria-label={`Editar ${student.name}`}
        >
          <PencilIcon className="w-5 h-5" />
        </button>
        <button
          onClick={() => onDelete(student.id)}
          className="p-2 rounded-full text-gray-400 hover:bg-red-50 hover:text-red-500 transition-colors duration-200"
          aria-label={`Remover ${student.name}`}
        >
          <TrashIcon className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

export default StudentListItem;