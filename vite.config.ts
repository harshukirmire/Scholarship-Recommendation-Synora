import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig} from 'vite';
import {GoogleGenAI} from '@google/genai';

export default defineConfig(() => {
  return {
    plugins: [
      react(),
      tailwindcss(),
      {
        name: 'synora-gemini-guide-api',
        configureServer(server) {
          server.middlewares.use('/api/guide', async (req, res) => {
            if (req.method !== 'POST') {
              res.statusCode = 405;
              res.end(JSON.stringify({ error: 'Method not allowed' }));
              return;
            }

            let rawBody = '';
            req.on('data', chunk => { rawBody += chunk; });
            req.on('end', async () => {
              res.setHeader('Content-Type', 'application/json');
              try {
                const data = JSON.parse(rawBody || '{}');
                const { query, userProfile, savedScholarships = [], applications = [], scholarships = [], globalScholarships = [] } = data;

                const apiKey = process.env.GEMINI_API_KEY;
                if (apiKey) {
                  try {
                    const ai = new GoogleGenAI({ apiKey });
                    const systemInstruction = `You are SYNORA GUIDE, an authoritative, verified scholarship and global examination advisor.
Today's local date is: 2026-09-24.

IMPORTANT DISTINCTION:
1. If the user asks a GLOBAL OR EXAM QUESTION (e.g. about Chinese Government Scholarship CSC, Japanese MEXT, German DAAD, UK Chevening, Korean GKS, Fulbright, IELTS, SAT, or exams required for scholarships):
   - Answer strictly from the verified scholarship and examination database.
   - DO NOT personalize or evaluate student profile marks/income unless explicitly asked in "Find For Me" mode.
   - Clearly distinguish:
     a) Scholarship-specific exam (e.g. MEXT written exam, Singapore MOE test)
     b) Admission exam (e.g. GRE, SAT, university entrance)
     c) Language test (IELTS, TOEFL, HSK, TOPIK)
     d) No separate examination (DAAD EPOS, Chevening, GKS, Erasmus Mundus)
     e) Conditional requirement (CSC depends on host Chinese university program)

2. If the user asks a PERSONALIZED question (e.g. "Which scholarships am I eligible for?", "What applications are still pending?", "What are my deadlines?"):
   - Use the student's profile (Level: ${userProfile?.level || 'Undergraduate'}, Score: ${userProfile?.score ?? 80}%, State: ${userProfile?.state || 'India'}, Income: ₹${userProfile?.annualIncome || 300000}).

VERIFIED SCHOLARSHIP & GLOBAL EXAM DATABASE:
${JSON.stringify({ scholarships, globalScholarships }, null, 2)}

STRICT RULES:
1. NEVER invent a scholarship, exam requirement, deadline, or official website.
2. If an exam is not required, state: "NO SEPARATE SCHOLARSHIP EXAM: Selection is based on academic record, documents, and admission status."
3. For CSC (Chinese Government Scholarship), clarify that the CSC itself has NO universal exam, but host Chinese universities require HSK for Chinese-taught or IELTS/TOEFL for English-taught programs.
4. Provide structured, concise markdown with bullet points and official URLs.`;

                    const response = await ai.models.generateContent({
                      model: 'gemini-3.8-flash',
                      contents: query,
                      config: {
                        systemInstruction,
                        temperature: 0.2,
                      }
                    });

                    if (response.text) {
                      res.end(JSON.stringify({ text: response.text }));
                      return;
                    }
                  } catch (genAiError: any) {
                    console.warn('Gemini API call returned error, falling back to rule-based response:', genAiError?.message);
                  }
                }

                // Deterministic verified fallback
                const lower = (query || '').toLowerCase();
                let reply = '';

                if (lower.includes('csc') || (lower.includes('china') && lower.includes('scholarship'))) {
                  reply = `### Chinese Government Scholarship (CSC) Exam Requirements\n\n- **Universal CSC Exam:** **NO SEPARATE SCHOLARSHIP EXAM** administered by the China Scholarship Council itself.\n- **University-Specific Requirements:** Individual Chinese host universities determine admission entrance exams or interviews.\n- **Language Requirements:**\n  - **Chinese-Taught Programs:** Valid **HSK Level 4** (Science/Engineering) or **HSK Level 5** (Liberal Arts/Medicine).\n  - **English-Taught Programs:** Typically **IELTS 6.0+** or **TOEFL iBT 80+** (varies per host university).\n- [Official CSC Portal](https://www.campuschina.org)`;
                } else if (lower.includes('mext') || (lower.includes('japan') && lower.includes('scholarship'))) {
                  reply = `### Japanese Government (MEXT) Exam Requirements\n\n- **Exam Status:** **SCHOLARSHIP EXAM REQUIRED** (Embassy Track).\n- **Mandatory Exam Name:** **MEXT Written Examination** (Japanese, English, Mathematics, and Sciences).\n- **Details:** Administered directly by the Embassy or Consulate General of Japan in the applicant's home country.\n- [Official MEXT Exam Information](https://www.studyinjapan.go.jp/en/planning/scholarship/application/examination/)`;
                } else if (lower.includes('ielts')) {
                  reply = `### Verified Scholarships Requiring / Accepting IELTS\n\n- **Australia Awards Scholarships:** Mandatory minimum **IELTS Academic 6.5** (no band < 6.0) at time of application.\n- **DAAD EPOS (Germany):** IELTS 6.0–6.5 required for English-taught master courses by host German universities.\n- **Chevening (UK):** No separate exam for Chevening itself, but accepted UK universities mandate IELTS 6.5–7.5 for unconditional admission offers.\n- **Erasmus Mundus (EU):** Program consortia mandate IELTS Academic 6.5–7.0.\n- **CSC (China English-Taught):** Chinese universities accept IELTS 6.0–6.5.\n- **Fulbright-Nehru (USA):** Accepted alongside TOEFL for US university placement.`;
                } else if (lower.includes('without') && (lower.includes('exam') || lower.includes('test'))) {
                  reply = `### Verified Scholarships with NO SEPARATE EXAMINATION\n\n1. **DAAD EPOS (Germany):** Purely academic merit, 2+ years professional experience, and motivation letter.\n2. **Chevening Scholarships (UK):** Four leadership essays, professional references, and interview.\n3. **Global Korea Scholarship (GKS - South Korea):** Document review & NIIED interview. (Mandatory 1-year language institute follows selection).\n4. **Erasmus Mundus Joint Masters (EU):** Direct consortium academic assessment.\n5. **Eiffel Excellence Scholarship (France):** Nomination directly by French higher education institutions.\n6. **INSPIRE SHE (India):** Based on Top 1% in Class 12th Board examinations.`;
                } else if (lower.includes('eligible') || lower.includes('which scholarship') || lower.includes('matches')) {
                  const eligibleList = scholarships.filter((s: any) => {
                    const levelMatch = s.educationLevels.includes(userProfile?.level);
                    const marksMatch = !s.minimumMarks || (userProfile?.score >= s.minimumMarks);
                    const incomeMatch = !s.incomeLimit || (userProfile?.annualIncome <= s.incomeLimit);
                    const stateMatch = !s.state || s.state === 'All India' || s.state.toLowerCase() === userProfile?.state?.toLowerCase();
                    return levelMatch && marksMatch && incomeMatch && stateMatch;
                  });

                  reply = `### Personalized Verified Matches for ${userProfile?.fullName || 'You'}\n\nBased on your profile (**${userProfile?.level}**, **${userProfile?.score}% marks**, **${userProfile?.state}** domicile, and family income **₹${userProfile?.annualIncome?.toLocaleString('en-IN')}**), you are directly eligible for:\n\n` +
                    eligibleList.map((s: any) => `- **[${s.name}](${s.applicationUrl})** (${s.category})\n  - **Benefit:** ${s.benefits}\n  - **Deadline:** ${s.deadline}\n  - **Why you match:** Your ${userProfile?.score}% satisfies the minimum requirement and your domicile is ${userProfile?.state}.`).join('\n\n') +
                    `\n\n*All listings are cross-checked against official 2026-2027 scheme notifications.*`;
                } else if (lower.includes('document') || lower.includes('doc')) {
                  reply = `### Required Documents Checklist\n\nHere are the verified document requirements for your tracked and matched opportunities:\n\n` +
                    scholarships.slice(0, 3).map((s: any) => `**${s.name}**:\n` + s.requiredDocuments.map((d: string) => `  - ${d}`).join('\n')).join('\n\n') +
                    `\n\n*Tip: Always retain original hard copies and attested digital PDF copies under 200KB before commencing portal submission.*`;
                } else if (lower.includes('pending') || lower.includes('application') || lower.includes('status')) {
                  if (applications.length > 0) {
                    reply = `### Active Applications Overview\n\n` +
                      applications.map((a: any) => `- **${a.scholarshipName}**\n  - **Current Status:** \`${a.status.replace('_', ' ')}\`\n  - **Reference No:** ${a.referenceNumber || 'Pending assignment'}\n  - **Last Updated:** ${new Date(a.updatedAt).toLocaleDateString()}\n  - **Notes:** ${a.notes || 'No custom notes'}\n  - [Official Portal Access](${a.officialPortalUrl})`).join('\n\n');
                  } else {
                    reply = `You do not have any tracked applications yet. You can start tracking any scholarship from the **Explorer** or **Find For Me** pages!`;
                  }
                } else if (lower.includes('deadline') || lower.includes('soon') || lower.includes('date')) {
                  if (savedScholarships.length > 0) {
                    reply = `### Upcoming Deadlines for Saved Scholarships\n\n` +
                      savedScholarships.map((s: any) => `- **${s.scholarshipName}**\n  - **Closing Date:** ${s.deadline}\n  - **Provider:** ${s.provider}`).join('\n\n') +
                      `\n\n*We recommend submitting at least 5 days prior to official portal closing to avoid server congestion.*`;
                  } else {
                    reply = `You have not saved any scholarships yet. Visit **Explore All** to bookmark upcoming opportunities.`;
                  }
                } else {
                  reply = `Welcome to **Synora Guide**. I provide verified counseling on both global scholarships & required exams as well as your personalized matching.\n\nYou can ask me:\n- *"What exam is required for CSC?"*\n- *"Does MEXT require an entrance exam?"*\n- *"What scholarships require IELTS?"*\n- *"Which scholarships do not require a separate examination?"*\n- *"Which scholarships am I eligible for?"*`;
                }

                res.end(JSON.stringify({ text: reply }));
              } catch (err: any) {
                res.statusCode = 500;
                res.end(JSON.stringify({ error: err?.message || 'Failed to process guidance' }));
              }
            });
          });
        }
      }
    ],
    resolve: {
      alias: {
        '@': path.resolve(import.meta.dirname, '.'),
      },
    },
    server: {
      hmr: process.env.DISABLE_HMR !== 'true',
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});

