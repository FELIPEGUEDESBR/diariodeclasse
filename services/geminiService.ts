
import { GoogleGenAI } from "@google/genai";

if (!process.env.API_KEY) {
  console.warn("API_KEY environment variable not set. Gemini API features will be disabled.");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });

export const generateAbsenceSummary = async (studentName: string, className: string, topics: string): Promise<string> => {
  if (!process.env.API_KEY) {
    return Promise.resolve(`
Assunto: Ausência na aula de ${className}

Prezados pais ou responsáveis de ${studentName},

Gostaríamos de informar que ${studentName} esteve ausente na aula de ${className} hoje.

Os tópicos abordados foram:
- ${topics.split('\n').join('\n- ')}

Por favor, incentive ${studentName} a revisar o material para se manter em dia com a turma.

Atenciosamente,
O Professor
    `.trim());
  }
  
  const prompt = `
    Você é um assistente de professor atencioso e profissional.
    Sua tarefa é escrever um e-mail curto e informativo para os pais de um aluno ausente.
    Seja amigável, mas direto. Não adicione saudações como "Olá" ou "Prezados".
    O e-mail deve estar em português do Brasil.

    Informações:
    - Nome do Aluno: ${studentName}
    - Nome da Turma: ${className}
    - Tópicos abordados na aula: ${topics}

    Gere o corpo do e-mail. Comece diretamente com uma linha de assunto clara.
    Exemplo de formato:
    Assunto: Ausência na aula de [Nome da Turma]

    [Corpo do e-mail]
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        temperature: 0.5,
      }
    });
    return response.text;
  } catch (error) {
    console.error("Error generating summary with Gemini:", error);
    // Fallback to template if API fails
    return `
Assunto: Ausência na aula de ${className}

Prezados pais ou responsáveis de ${studentName},

Gostaríamos de informar que ${studentName} esteve ausente na aula de ${className} hoje.

Os tópicos abordados foram:
- ${topics.split('\n').join('\n- ')}

Por favor, incentive ${studentName} a revisar o material para se manter em dia com a turma.

Atenciosamente,
O Professor
    `.trim();
  }
};
   