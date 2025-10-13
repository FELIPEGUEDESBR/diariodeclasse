
import React, { useState, useEffect } from 'react';
import type { Student } from '../types';
import { UserGroupIcon } from './icons';

interface StudentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (student: Omit<Student, 'id'> & { id?: string }) => void;
  student: Student | null;
}

const StudentModal: React.FC<StudentModalProps> = ({ isOpen, onClose, onSave, student }) => {
  const [name, setName] = useState('');
  const [parentEmail, setParentEmail] = useState('');
  const [parentPhone, setParentPhone] = useState('');
  const [errors, setErrors] = useState({ name: '', parentEmail: '', parentPhone: '' });

  useEffect(() => {
    if (isOpen) {
      if (student) {
        setName(student.name);
        setParentEmail(student.parentEmail);
        setParentPhone(student.parentPhone);
      } else {
        setName('');
        setParentEmail('');
        setParentPhone('');
      }
      setErrors({ name: '', parentEmail: '', parentPhone: '' });
    }
  }, [isOpen, student]);

  if (!isOpen) return null;

  const validate = () => {
    const newErrors = { name: '', parentEmail: '', parentPhone: '' };
    let isValid = true;

    if (!name.trim()) {
      newErrors.name = 'O nome do aluno é obrigatório.';
      isValid = false;
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!parentEmail.trim()) {
      newErrors.parentEmail = 'O e-mail do responsável é obrigatório.';
      isValid = false;
    } else if (!emailRegex.test(parentEmail)) {
        newErrors.parentEmail = 'Formato de e-mail inválido.';
        isValid = false;
    }

    const phoneDigits = parentPhone.replace(/\D/g, '');
    if (!parentPhone.trim()) {
      newErrors.parentPhone = 'O telefone do responsável é obrigatório.';
      isValid = false;
    } else if (phoneDigits.length < 10 || phoneDigits.length > 11) {
      newErrors.parentPhone = 'Telefone inválido. Deve conter 10 ou 11 dígitos (incluindo DDD).';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSave = () => {
    if (validate()) {
      onSave({ id: student?.id, name, parentEmail, parentPhone });
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg transform transition-all duration-300 scale-95 opacity-0 animate-scale-in">
        <div className="p-8">
          <h2 className="text-2xl font-bold text-gray-800">{student ? 'Editar Aluno' : 'Adicionar Aluno'}</h2>
          <p className="text-gray-500 mt-1">Preencha os dados abaixo.</p>

          <div className="mt-6 space-y-4">
            <div>
              <label htmlFor="student-name" className="block text-sm font-medium text-gray-700">
                Nome do Aluno
              </label>
              <input
                type="text"
                id="student-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className={`mt-1 block w-full p-2 border rounded-lg shadow-sm ${errors.name ? 'border-red-500' : 'border-gray-300'} focus:ring-blue-500 focus:border-blue-500`}
              />
              {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
            </div>
            <div>
              <label htmlFor="parent-email" className="block text-sm font-medium text-gray-700">
                E-mail do Responsável
              </label>
              <input
                type="email"
                id="parent-email"
                value={parentEmail}
                onChange={(e) => setParentEmail(e.target.value)}
                className={`mt-1 block w-full p-2 border rounded-lg shadow-sm ${errors.parentEmail ? 'border-red-500' : 'border-gray-300'} focus:ring-blue-500 focus:border-blue-500`}
              />
              {errors.parentEmail && <p className="text-red-500 text-xs mt-1">{errors.parentEmail}</p>}
            </div>
             <div>
              <label htmlFor="parent-phone" className="block text-sm font-medium text-gray-700">
                Telefone do Responsável
              </label>
              <input
                type="tel"
                id="parent-phone"
                value={parentPhone}
                onChange={(e) => setParentPhone(e.target.value)}
                placeholder="(99) 99999-9999"
                className={`mt-1 block w-full p-2 border rounded-lg shadow-sm ${errors.parentPhone ? 'border-red-500' : 'border-gray-300'} focus:ring-blue-500 focus:border-blue-500`}
              />
              {errors.parentPhone && <p className="text-red-500 text-xs mt-1">{errors.parentPhone}</p>}
            </div>
          </div>
        </div>

        <div className="bg-gray-50 px-8 py-4 flex justify-end space-x-3 rounded-b-2xl">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 transition"
          >
            Cancelar
          </button>
          <button
            onClick={handleSave}
            className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition"
          >
            <UserGroupIcon className="w-5 h-5 mr-2" />
            Salvar
          </button>
        </div>
      </div>
    </div>
  );
};

export default StudentModal;
