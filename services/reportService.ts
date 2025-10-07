import type { Class, AttendanceRecord } from '../types';
import { AttendanceStatus } from '../types';

export const exportAttendanceToCSV = (
  selectedClass: Class, 
  attendance: Record<string, AttendanceRecord>,
  startDateStr: string,
  endDateStr: string
) => {
  const headers = ['Data', 'Nome do Aluno', 'E-mail do Responsável', 'Status'];
  
  const startDate = new Date(startDateStr + 'T00:00:00Z');
  const endDate = new Date(endDateStr + 'T23:59:59Z');

  const filteredDates = Object.keys(attendance).filter(dateStr => {
    const recordDate = new Date(dateStr + 'T00:00:00Z');
    return recordDate >= startDate && recordDate <= endDate;
  });

  if (filteredDates.length === 0) {
    alert('Nenhum dado de frequência encontrado no período selecionado.');
    return;
  }

  // Sort dates chronologically
  filteredDates.sort((a, b) => new Date(a).getTime() - new Date(b).getTime());

  const rows = filteredDates.flatMap(date => 
    selectedClass.students.map(student => {
      const status = attendance[date]?.[student.id] || AttendanceStatus.UNMARKED;
      // To handle commas in names, wrap in quotes.
      const studentName = `"${student.name}"`; 
      return [
        new Date(date + 'T00:00:00Z').toLocaleDateString('pt-BR', { timeZone: 'UTC' }),
        studentName,
        student.parentEmail,
        status
      ].join(',');
    })
  );
  
  const csvContent = [headers.join(','), ...rows].join('\n');
  
  const blob = new Blob([`\uFEFF${csvContent}`], { type: 'text/csv;charset=utf-8;' }); // Add BOM for Excel compatibility
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  
  const dateStr = new Date().toISOString().slice(0, 10);
  link.setAttribute('download', `relatorio_frequencia_${selectedClass.name.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_${dateStr}.csv`);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};
