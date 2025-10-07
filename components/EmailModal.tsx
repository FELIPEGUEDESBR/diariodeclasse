
import React, { useState, useEffect } from 'react';
import type { Student } from '../types';
import { MailIcon } from './icons';

interface EmailModalProps {
  student: Student | null;
  className: string;
  isOpen: boolean;
  onClose: () => void;
}

const EmailModal: React.FC<EmailModalProps> = ({ student, className, isOpen, onClose }) => {
  const [observations, setObservations] = useState('');

  useEffect(() => {
    if (!isOpen) {
      setObservations('');
    }
  }, [isOpen]);

  if (!isOpen || !student) return null;

  const subject = `Ausência na aula de ${className}`;
  const body = `
Prezados pais ou responsáveis de ${student.name},

Gostaríamos de informar que ${student.name} esteve ausente na aula de ${className} hoje.

Observações do professor:
${observations}

Atenciosamente,
O Professor
  `.trim();

  const mailtoLink = `mailto:${student.parentEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

  const isSendButtonDisabled = !observations.trim();

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl transform transition-all duration-300 scale-95 opacity-0 animate-scale-in">
        <div className="p-8">
          <h2 className="text-2xl font-bold text-gray-800">Notificar Ausência de {student.name}</h2>
          <p className="text-gray-500 mt-1">Envie um e-mail para <span className="font-medium text-gray-700">{student.parentEmail}</span>.</p>

          <div className="mt-6">
            <label htmlFor="observations" className="block text-sm font-medium text-gray-700 mb-2">
              Observações do professor:
            </label>
            <textarea
              id="observations"
              value={observations}
              onChange={(e) => setObservations(e.target.value)}
              placeholder="Digite aqui suas observações sobre a aula ou tarefas para o aluno..."
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
              rows={4}
            />
          </div>
        </div>
        <div className="bg-gray-50 px-8 py-4 flex justify-end space-x-3 rounded-b-2xl">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 transition"
          >
            Cancelar
          </button>
          <a
            href={isSendButtonDisabled ? undefined : mailtoLink}
            onClick={!isSendButtonDisabled ? onClose : (e) => e.preventDefault()}
            className={`inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 transition ${isSendButtonDisabled ? 'opacity-50 cursor-not-allowed' : ''}`}
            aria-disabled={isSendButtonDisabled}
          >
             <MailIcon className="w-5 h-5 mr-2"/>
            Abrir Cliente de E-mail
          </a>
        </div>
      </div>
    </div>
  );
};

export default EmailModal;
