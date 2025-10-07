import React, { useState } from 'react';
import type { Class, AttendanceRecord } from '../types';
import { exportAttendanceToCSV } from '../services/reportService';
import { DocumentDownloadIcon } from './icons';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedClass: Class;
  attendance: Record<string, AttendanceRecord>;
}

const ExportModal: React.FC<ExportModalProps> = ({ isOpen, onClose, selectedClass, attendance }) => {
  const today = new Date().toISOString().slice(0, 10);
  const [startDate, setStartDate] = useState(today);
  const [endDate, setEndDate] = useState(today);

  const handleExport = () => {
    if (new Date(startDate) > new Date(endDate)) {
        alert("A data de início não pode ser posterior à data de fim.");
        return;
    }
    exportAttendanceToCSV(selectedClass, attendance, startDate, endDate);
    onClose();
  };
  
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg transform transition-all duration-300 scale-95 opacity-0 animate-scale-in">
        <div className="p-8">
          <h2 className="text-2xl font-bold text-gray-800">Exportar Relatório de Frequência</h2>
          <p className="text-gray-500 mt-1">Selecione o período para exportar o relatório da <span className="font-medium text-gray-700">{selectedClass.name}</span>.</p>

          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
                <label htmlFor="start-date" className="block text-sm font-medium text-gray-700">
                    Data de Início
                </label>
                <input
                    type="date"
                    id="start-date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="mt-1 block w-full p-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
                />
            </div>
             <div>
                <label htmlFor="end-date" className="block text-sm font-medium text-gray-700">
                    Data de Fim
                </label>
                <input
                    type="date"
                    id="end-date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="mt-1 block w-full p-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
                />
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
            onClick={handleExport}
            className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition"
          >
             <DocumentDownloadIcon className="w-5 h-5 mr-2"/>
            Exportar para CSV
          </button>
        </div>
      </div>
    </div>
  );
};

export default ExportModal;
