
import React, { useState, useEffect } from 'react';
import type { Class } from '../types';
import { UserGroupIcon } from './icons';

interface ClassModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (classData: { id?: string; name: string }) => void;
  classData: Pick<Class, 'id' | 'name'> | null;
}

const ClassModal: React.FC<ClassModalProps> = ({ isOpen, onClose, onSave, classData }) => {
  const [name, setName] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen) {
      setName(classData?.name || '');
      setError('');
    }
  }, [isOpen, classData]);

  if (!isOpen) return null;

  const handleSave = () => {
    if (!name.trim()) {
      setError('O nome da turma é obrigatório.');
      return;
    }
    onSave({ id: classData?.id, name: name.trim() });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg transform transition-all duration-300 scale-95 opacity-0 animate-scale-in">
        <div className="p-8">
          <h2 className="text-2xl font-bold text-gray-800">{classData ? 'Editar Turma' : 'Adicionar Nova Turma'}</h2>
          <p className="text-gray-500 mt-1">Digite o nome da turma.</p>

          <div className="mt-6">
            <label htmlFor="class-name" className="block text-sm font-medium text-gray-700">
              Nome da Turma
            </label>
            <input
              type="text"
              id="class-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={`mt-1 block w-full p-2 border rounded-lg shadow-sm ${error ? 'border-red-500' : 'border-gray-300'} focus:ring-blue-500 focus:border-blue-500`}
              autoFocus
              onKeyDown={(e) => e.key === 'Enter' && handleSave()}
            />
            {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
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
            Salvar Turma
          </button>
        </div>
      </div>
    </div>
  );
};

export default ClassModal;
