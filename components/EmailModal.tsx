
import React, { useState, useEffect } from 'react';
import type { Student } from '../types';
import { MailIcon, WhatsAppIcon } from './icons'; // Import WhatsAppIcon

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

  // Email content
  const subject = `Ausência na aula de ${className}`;
  const emailBody = `Prezados pais ou responsáveis de ${student.name},\n\nGostaríamos de informar que ${student.name} esteve ausente na aula de ${className} hoje.\n\n${observations ? `Observações:\n${observations}\n\n` : ''}Por favor, incentive ${student.name} a revisar o material para se manter em dia com a turma.\n\nAtenciosamente,\nO Professor`.trim();
  const mailtoLink = `mailto:${student.parentEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(emailBody)}`;

  // WhatsApp content
  const whatsappBody = `Olá! Gostaríamos de informar que ${student.name} esteve ausente na aula de ${className} hoje.\n\n${observations ? `Observações:\n${observations}\n\n` : ''}Por favor, incentive ${student.name} a revisar o material para se manter em dia com a turma.\n\nAtenciosamente,\nO Professor`.trim();
  const whatsappLink = student.parentPhone
    ? `https://wa.me/${student.parentPhone.replace(/\D/g, '')}?text=${encodeURIComponent(whatsappBody)}`
    : `https://wa.me/?text=${encodeURIComponent(whatsappBody)}`;


  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg transform transition-all duration-300 scale-95 opacity-0 animate-scale-in">
        <div className="p-8">
          <h2 className="text-2xl font-bold text-gray-800">Notificar Ausência de {student.name}</h2>
          <p className="text-gray-500 mt-1">Escreva uma observação para enviar aos responsáveis.</p>

          <div className="mt-6">
            <label htmlFor="observations" className="block text-sm font-medium text-gray-700 mb-2">
              Observações (opcional):
            </label>
            <textarea
              id="observations"
              value={observations}
              onChange={(e) => setObservations(e.target.value)}
              placeholder="Ex: Havia uma avaliação importante hoje..."
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
              rows={4}
              aria-label="Observações sobre a ausência"
            />
          </div>
        </div>
        <div className="bg-gray-50 px-8 py-4 flex flex-wrap justify-end items-center rounded-b-2xl gap-3">
           <button
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 transition"
            >
              Cancelar
            </button>
            <a
              href={whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              onClick={onClose}
              className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 transition"
            >
                <WhatsAppIcon className="w-5 h-5 mr-2" />
                Enviar por WhatsApp
            </a>
            <a
              href={mailtoLink}
              onClick={onClose}
              className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition"
            >
              <MailIcon className="w-5 h-5 mr-2" />
              Enviar por E-mail
            </a>
        </div>
      </div>
    </div>
  );
};

export default EmailModal;
