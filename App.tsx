import React, { useState, useMemo, useEffect, useRef } from 'react';
import type { Class, Student, AttendanceRecord } from './types';
import { AttendanceStatus } from './types';
import StudentListItem from './components/StudentListItem';
import EmailModal from './components/EmailModal';
import ExportModal from './components/ExportModal';
import StudentModal from './components/StudentModal';
import ClassModal from './components/ClassModal'; // Importado
import { UserGroupIcon, DocumentDownloadIcon, UploadIcon, PencilIcon, PlusIcon } from './components/icons';

// Mock Data - used as initial state if localStorage is empty
const INITIAL_CLASSES: Class[] = [
  {
    id: 'turma-a',
    name: 'Turma A - Matemática',
    students: [
      { id: '1', name: 'Ana Silva', parentEmail: 'pais.ana@example.com', parentPhone: '11987654321' },
      { id: '2', name: 'Bruno Costa', parentEmail: 'pais.bruno@example.com', parentPhone: '21912345678' },
      { id: '3', name: 'Carla Dias', parentEmail: 'pais.carla@example.com', parentPhone: '31988887777' },
      { id: '4', name: 'Daniel Faria', parentEmail: 'pais.daniel@example.com', parentPhone: '41999998888' },
      { id: '5', name: 'Eduarda Lima', parentEmail: 'pais.eduarda@example.com', parentPhone: '51977776666' },
    ],
  },
  {
    id: 'turma-b',
    name: 'Turma B - História',
    students: [
      { id: '6', name: 'Felipe Melo', parentEmail: 'pais.felipe@example.com', parentPhone: '61966665555' },
      { id: '7', name: 'Gabriela Nunes', parentEmail: 'pais.gabriel@example.com', parentPhone: '71955554444' },
      { id: '8', name: 'Heitor Rocha', parentEmail: 'pais.heitor@example.com', parentPhone: '81944443333' },
    ],
  },
];

const App: React.FC = () => {
  const [classes, setClasses] = useState<Class[]>(() => {
    try {
      const savedClasses = localStorage.getItem('classData');
      return savedClasses ? JSON.parse(savedClasses) : INITIAL_CLASSES;
    } catch (error) {
      console.error("Erro ao carregar dados das turmas do localStorage:", error);
      return INITIAL_CLASSES;
    }
  });

  const [selectedClassId, setSelectedClassId] = useState<string>(classes[0]?.id || '');
  const [attendance, setAttendance] = useState<Record<string, AttendanceRecord>>(() => {
    try {
      const savedAttendance = localStorage.getItem('attendanceData');
      return savedAttendance ? JSON.parse(savedAttendance) : {};
    } catch (error) {
      console.error("Erro ao carregar dados de frequência do localStorage:", error);
      return {};
    }
  });

  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [isStudentModalOpen, setIsStudentModalOpen] = useState(false);
  const [isClassModalOpen, setIsClassModalOpen] = useState(false); // Novo state
  const [studentToNotify, setStudentToNotify] = useState<Student | null>(null);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [editingClass, setEditingClass] = useState<Pick<Class, 'id' | 'name'> | null>(null); // Novo state
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    try {
      localStorage.setItem('attendanceData', JSON.stringify(attendance));
    } catch (error) {
      console.error("Erro ao salvar dados de frequência no localStorage:", error);
    }
  }, [attendance]);

  useEffect(() => {
    try {
      localStorage.setItem('classData', JSON.stringify(classes));
    } catch (error)      {
      console.error("Erro ao salvar dados das turmas no localStorage:", error);
    }
  }, [classes]);

  useEffect(() => {
    // Garante que uma turma válida esteja selecionada ao carregar ou ao deletar turmas
    if ((!selectedClassId || !classes.some(c => c.id === selectedClassId)) && classes.length > 0) {
        setSelectedClassId(classes[0].id);
    }
  }, [classes, selectedClassId]);

  const today = new Date().toISOString().slice(0, 10);

  const selectedClass = classes.find(c => c.id === selectedClassId) || classes[0];
  const todaysAttendance = attendance[today] || {};

  const handleStatusChange = (studentId: string, status: AttendanceStatus) => {
    setAttendance(prev => ({
      ...prev,
      [today]: {
        ...prev[today],
        [studentId]: status,
      },
    }));
  };
  
  const handleNotify = (student: Student) => {
    setStudentToNotify(student);
    setIsEmailModalOpen(true);
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      if (!text) {
        alert('Erro: Arquivo vazio ou ilegível.');
        return;
      }

      try {
        const rows = text.trim().split('\n');
        const newStudents: Student[] = rows.map((row, index) => {
          const [name, parentEmail, parentPhone] = row.split(',').map(item => item.trim());
          if (!name || !parentEmail || !parentPhone) {
            throw new Error(`Linha ${index + 1} inválida: "${row}"`);
          }
          return { id: crypto.randomUUID(), name, parentEmail, parentPhone };
        });

        setClasses(prevClasses => 
          prevClasses.map(c => 
            c.id === selectedClassId ? { ...c, students: newStudents } : c
          )
        );

        alert(`${newStudents.length} alunos importados com sucesso para ${selectedClass.name}!`);

      } catch (error: any) {
        alert(`Erro ao processar o arquivo CSV: ${error.message}`);
      }
    };
    
    reader.onerror = () => {
      alert('Erro ao ler o arquivo.');
    };
    
    reader.readAsText(file);
    event.target.value = '';
  };

  const handleEditStudent = (student: Student) => {
    setEditingStudent(student);
    setIsStudentModalOpen(true);
  };

  const handleAddStudent = () => {
    setEditingStudent(null);
    setIsStudentModalOpen(true);
  };

  const handleDeleteStudent = (studentId: string) => {
    if (window.confirm("Tem certeza que deseja remover este aluno?")) {
        setClasses(prevClasses =>
            prevClasses.map(c =>
                c.id === selectedClassId
                    ? { ...c, students: c.students.filter(s => s.id !== studentId) }
                    : c
            )
        );
    }
  };

  const handleSaveStudent = (studentData: Omit<Student, 'id'> & { id?: string }) => {
    setClasses(prevClasses =>
        prevClasses.map(c => {
            if (c.id === selectedClassId) {
                const newStudents = [...c.students];
                if (studentData.id) {
                    const index = newStudents.findIndex(s => s.id === studentData.id);
                    if (index !== -1) {
                        newStudents[index] = { ...newStudents[index], ...studentData } as Student;
                    }
                } else {
                    newStudents.push({ ...studentData, id: crypto.randomUUID() } as Student);
                }
                return { ...c, students: newStudents };
            }
            return c;
        })
    );
  };
  
  const handleAddNewClass = () => {
    setEditingClass(null);
    setIsClassModalOpen(true);
  };
  
  const handleEditClass = () => {
    if (selectedClass) {
        setEditingClass(selectedClass);
        setIsClassModalOpen(true);
    }
  };

  const handleSaveClass = (classData: { id?: string; name: string }) => {
    if (classData.id) { // Editando turma existente
        setClasses(prevClasses =>
            prevClasses.map(c =>
                c.id === classData.id ? { ...c, name: classData.name } : c
            )
        );
    } else { // Adicionando nova turma
        const newClass: Class = {
            id: crypto.randomUUID(),
            name: classData.name,
            students: [],
        };
        const updatedClasses = [...classes, newClass];
        setClasses(updatedClasses);
        setSelectedClassId(newClass.id); // Seleciona a nova turma
    }
  };

  const attendanceSummary = useMemo(() => {
    if (!selectedClass) return { total: 0, present: 0, absent: 0, unmarked: 0 };
    const students = selectedClass.students;
    const total = students.length;
    const present = students.filter(s => todaysAttendance[s.id] === AttendanceStatus.PRESENT).length;
    const absent = students.filter(s => todaysAttendance[s.id] === AttendanceStatus.ABSENT).length;
    const unmarked = total - present - absent;
    return { total, present, absent, unmarked };
  }, [todaysAttendance, selectedClass]);

  if (!selectedClass) {
    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="text-center p-8 bg-white rounded-2xl shadow-lg max-w-md">
                <UserGroupIcon className="w-16 h-16 mx-auto text-gray-300"/>
                <h2 className="mt-4 text-2xl font-bold text-gray-700">Nenhuma turma encontrada.</h2>
                <p className="text-gray-500 mt-2">Crie sua primeira turma para começar a registrar a frequência.</p>
                <button
                    onClick={handleAddNewClass}
                    className="mt-6 inline-flex items-center px-6 py-3 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition shadow-sm"
                >
                   <PlusIcon className="w-5 h-5 mr-2"/>
                   Criar Nova Turma
               </button>
            </div>
        </div>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-gray-50 font-sans text-gray-800">
        <header className="bg-white shadow-md">
          <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 flex items-center justify-between">
            <h1 className="text-3xl font-bold text-gray-900 flex items-center">
              <UserGroupIcon className="w-8 h-8 mr-3 text-blue-600"/>
              Diário de Classe Inteligente
            </h1>
            <div className="flex items-center space-x-4">
               <span className="text-sm text-gray-500">Data:</span>
               <span className="font-semibold text-gray-700 bg-gray-100 px-3 py-1 rounded-md">{new Date(today).toLocaleDateString('pt-BR', { timeZone: 'UTC' })}</span>
            </div>
          </div>
        </header>

        <main className="max-w-7xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Left Column: Class Selection and Summary */}
                <aside className="md:col-span-1 space-y-8">
                    <div>
                        <div className="flex justify-between items-center">
                            <label htmlFor="class-select" className="block text-lg font-medium text-gray-700">
                                Selecione a Turma
                            </label>
                             <button
                                onClick={handleAddNewClass}
                                className="p-2 rounded-full text-blue-600 bg-blue-100 hover:bg-blue-200 transition-colors duration-200"
                                aria-label="Adicionar nova turma"
                                title="Adicionar nova turma"
                            >
                                <PlusIcon className="w-5 h-5" />
                            </button>
                        </div>
                        <select
                            id="class-select"
                            value={selectedClassId}
                            onChange={(e) => setSelectedClassId(e.target.value)}
                            className="mt-2 block w-full pl-3 pr-10 py-3 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-lg shadow-sm"
                        >
                            {classes.map(c => (
                                <option key={c.id} value={c.id}>{c.name}</option>
                            ))}
                        </select>
                         <div className="mt-4 space-y-2">
                             <button
                                onClick={handleImportClick}
                                className="w-full flex items-center justify-center px-4 py-2 border border-dashed border-gray-400 text-sm font-medium rounded-lg text-gray-600 bg-gray-50 hover:bg-gray-100 hover:border-gray-500 transition"
                            >
                                <UploadIcon className="w-5 h-5 mr-2 text-gray-500"/>
                                Importar Alunos (CSV)
                            </button>
                            <p className="text-xs text-gray-500 text-center">
                                Formato: nome,email,telefone (um por linha).
                            </p>
                         </div>
                        <input
                            type="file"
                            ref={fileInputRef}
                            onChange={handleFileImport}
                            className="hidden"
                            accept=".csv, text/csv"
                        />
                    </div>

                    <div className="bg-white p-6 rounded-2xl shadow-lg">
                        <h3 className="text-xl font-bold text-gray-800">Resumo da Chamada</h3>
                        <p className="text-sm text-gray-500 mt-1">Total de {attendanceSummary.total} alunos</p>
                        <div className="mt-6 space-y-4">
                            <div className="flex justify-between items-center">
                                <span className="font-medium text-green-600">Presentes</span>
                                <span className="font-bold text-lg text-green-600 bg-green-100 px-3 py-1 rounded-full">{attendanceSummary.present}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="font-medium text-red-600">Ausentes</span>
                                <span className="font-bold text-lg text-red-600 bg-red-100 px-3 py-1 rounded-full">{attendanceSummary.absent}</span>
                            </div>
                             <div className="flex justify-between items-center">
                                <span className="font-medium text-gray-500">Não Marcados</span>
                                <span className="font-bold text-lg text-gray-600 bg-gray-100 px-3 py-1 rounded-full">{attendanceSummary.unmarked}</span>
                            </div>
                        </div>
                        <div className="mt-8 border-t pt-6">
                            <button
                                onClick={() => setIsExportModalOpen(true)}
                                className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 transition"
                            >
                                <DocumentDownloadIcon className="w-5 h-5 mr-2 text-gray-500"/>
                                Exportar Relatório
                            </button>
                        </div>
                    </div>
                </aside>

                {/* Right Column: Student List */}
                <div className="md:col-span-2">
                    <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                        <div className="p-6 border-b border-gray-200">
                           <div className="flex justify-between items-center">
                                <div className="flex items-center gap-2">
                                    <h2 className="text-2xl font-bold text-gray-800">{selectedClass.name}</h2>
                                    <button onClick={handleEditClass} className="text-gray-400 hover:text-blue-600">
                                        <PencilIcon className="w-5 h-5"/>
                                    </button>
                                </div>
                               <button 
                                    onClick={handleAddStudent}
                                    className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition"
                                >
                                   <PlusIcon className="w-5 h-5 mr-2"/>
                                   Adicionar Aluno
                               </button>
                           </div>
                           <p className="text-gray-500 mt-1">Marque a presença ou ausência de cada aluno.</p>
                        </div>
                        <div className="p-4 space-y-3 bg-gray-50 max-h-[60vh] overflow-y-auto">
                            {selectedClass.students.length > 0 ? (
                                selectedClass.students.map(student => (
                                    <StudentListItem
                                        key={student.id}
                                        student={student}
                                        status={todaysAttendance[student.id] || AttendanceStatus.UNMARKED}
                                        onStatusChange={handleStatusChange}
                                        onNotify={handleNotify}
                                        onEdit={handleEditStudent}
                                        onDelete={handleDeleteStudent}
                                    />
                                ))
                             ) : (
                                <div className="text-center py-10 px-4">
                                    <p className="text-gray-500">Nenhum aluno nesta turma.</p>
                                    <p className="text-gray-500 mt-2">Use o botão "Adicionar Aluno" ou "Importar Alunos" para começar.</p>
                                </div>
                             )}
                        </div>
                    </div>
                </div>
            </div>
        </main>
      </div>

      <EmailModal
        isOpen={isEmailModalOpen}
        onClose={() => setIsEmailModalOpen(false)}
        student={studentToNotify}
        className={selectedClass.name}
      />
      <ExportModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        selectedClass={selectedClass}
        attendance={attendance}
      />
      <StudentModal
        isOpen={isStudentModalOpen}
        onClose={() => setIsStudentModalOpen(false)}
        onSave={handleSaveStudent}
        student={editingStudent}
      />
      <ClassModal
        isOpen={isClassModalOpen}
        onClose={() => setIsClassModalOpen(false)}
        onSave={handleSaveClass}
        classData={editingClass}
      />
      <style>{`
          @keyframes scale-in {
              0% { transform: scale(0.95); opacity: 0; }
              100% { transform: scale(1); opacity: 1; }
          }
          .animate-scale-in {
              animation: scale-in 0.2s ease-out forwards;
          }
      `}</style>
    </>
  );
};

export default App;