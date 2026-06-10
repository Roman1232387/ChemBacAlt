import { Topic } from './Topic';

export const TOPICS: Topic[] = [
    {
        id: 'top1',
        title: 'Structura atomului și tabelul periodic',
        category: 'structura-atomului',
        difficulty: 'beginner',
        icon: '⚛️',
        shortDescription: 'Fundamentele structurii materiei: nucleu, electroni și organizarea elementelor.',
        estimatedTime: 15,
        keyFormulas: ['A = Z + N', 'n = m / M'],
        concepts: ['Protoni', 'Neutroni', 'Electroni', 'Orbitali', 'Perioade', 'Grupe'],
        examTips: [
            'Verifică întotdeauna dacă suma electronilor din configurație corespunde cu Z.',
            'Reține ordinea de completare a orbitalilor (regula n+l).',
            'Nu confunda numărul atomic Z cu numărul de masă A.'
        ],
        commonMistakes: [
            'Scrierea greșită a configurației pentru excepții (Cr, Cu).',
            'Confundarea grupelor principale (A) cu cele secundare (B).'
        ],
        practiceProblems: [
            {
                title: 'Configurația electronică a sulfului',
                steps: [
                    'Identifică numărul atomic Z pentru S (Z=16).',
                    'Repartizează cei 16 electroni pe substraturi conform ordinii de energie.',
                    'Specifică poziția în tabelul periodic.'
                ],
                solution: '1s² 2s² 2p⁶ 3s² 3p⁴. Perioada 3, grupa 16 (VI A).'
            }
        ],
        subsections: [
            {
                id: "top1-s1",
                title: "Numerele cuantice",
                content: "Starea electronului în atom este descrisă de patru numere cuantice: principal (n), secundar (l), magnetic (ml) și de spin (ms). Ele definesc energia, forma și orientarea orbitalilor.",
                formulas: [{ label: "Numărul maxim de electroni pe strat", formula: "2n²" }],
                tip: "Configurația electronică a elementelor din grupele secundare se termină în substratul (n-1)d."
            }
        ],
        keyPoints: [
            "Z reprezintă numărul de protoni din nucleu și numărul de electroni în atomul neutru",
            "A reprezintă suma numărului de protoni și a numărului de neutroni",
            "Izotopii sunt atomi cu același Z dar A diferit",
            "Proprietățile elementelor se repetă periodic în funcție de numărul atomic Z"
        ],
        relatedLessonIds: []
    },
    {
        id: 'top2',
        title: 'Legătura chimică și structura moleculelor',
        category: 'chimie-anorganica',
        difficulty: 'intermediate',
        icon: '🔗',
        shortDescription: 'Interacțiunile dintre atomi și formarea rețelelor cristaline.',
        estimatedTime: 15,
        keyFormulas: ['Δχ = |χA - χB|'],
        concepts: ['Covalentă', 'Ionică', 'Metalică', 'Hidrogen', 'VSEPR', 'Hibridizare'],
        examTips: [
            'Diferența de electronegativitate peste 1.7 indică de obicei o legătură ionică.',
            'Identifică legăturile de hidrogen la moleculele cu H legat de F, O sau N.'
        ],
        commonMistakes: [
            'Considerarea apei ca având legături ionice.',
            'Omiterea geometriei unghiulare la molecula de apă.'
        ],
        practiceProblems: [
            {
                title: 'Tipul legăturii în HCl',
                steps: [
                    'Verifică natura elementelor (H nemetal, Cl nemetal).',
                    'Identifică dacă există diferență de electronegativitate.'
                ],
                solution: 'Legătură covalentă polară.'
            }
        ],
        subsections: [
            {
                id: "top2-s1",
                title: "Teoria VSEPR",
                content: "Teoria respingerii perechilor de electroni din stratul de valență explică geometria moleculelor prin minimizarea respingerilor între perechile de electroni (legante sau neparticipante).",
                formulas: [{ label: "Moment de dipol", formula: "μ = q · d" }],
                tip: "Molecula de apă (H₂O) are geometrie unghiulară (104.5°) din cauza celor două perechi de electroni neparticipante ale oxigenului."
            }
        ],
        keyPoints: [
            "Legătura ionică: atracție electrostatică între ioni de semne opuse",
            "Legătura covalentă: punere în comun de perechi de electroni",
            "Legătura de hidrogen: interacțiune între H și elemente puternic electronegative (F, O, N)",
            "Hibridizarea explică egalizarea orbitalilor atomici în procesul de legare"
        ],
        relatedLessonIds: []
    },
    {
        id: 'top3',
        title: 'Starea gazoasă — legile gazelor',
        category: 'chimie-anorganica',
        difficulty: 'intermediate',
        icon: '🎈',
        shortDescription: 'Comportamentul gazelor ideale și legile fundamentale.',
        estimatedTime: 15,
        keyFormulas: ['PV = nRT', 'P1V1/T1 = P2V2/T2', 'n = V / Vm'],
        concepts: ['Presiune', 'Volum', 'Temperatură (K)', 'Mol', 'Condiții normale'],
        examTips: [
            'Transformă întotdeauna temperatura în Kelvin (T = t + 273).',
            'Vm = 22.4 L/mol doar în condiții normale (0°C, 1 atm).'
        ],
        commonMistakes: [
            'Folosirea temperaturii în grade Celsius în formula PV=nRT.',
            'Unități de măsură inconsistente pentru presiune.'
        ],
        practiceProblems: [
            {
                title: 'Calculul volumului de O2',
                steps: ['Află numărul de moli.', 'Înmulțește cu volumul molar la c.n.'],
                solution: 'V = n · 22.4'
            }
        ],
        subsections: [
            {
                id: "top3-s1",
                title: "Gazul ideal",
                content: "Un gaz ideal este un model teoretic în care particulele sunt punctiforme și nu interacționează între ele decât prin ciocniri perfect elastice.",
                formulas: [{ label: "Densitatea gazului", formula: "ρ = (P · M) / (R · T)" }],
                tip: "Constanta universală a gazelor R are valoarea 0.082 L·atm/(mol·K) sau 8.314 J/(mol·K)."
            }
        ],
        keyPoints: [
            "Legea Boyle-Mariotte: la T constantă, produsul P·V este constant",
            "Legea lui Avogadro: volume egale de gaze în aceleași condiții conțin același număr de moli",
            "Condițiile normale (c.n.) presupun 0°C (273 K) și 1 atm (101325 Pa)",
            "Amestecurile de gaze respectă legea presiunilor parțiale a lui Dalton"
        ],
        relatedLessonIds: []
    },
    {
        id: 'top4',
        title: 'Soluții și concentrații',
        category: 'chimie-anorganica',
        difficulty: 'beginner',
        icon: '🧪',
        shortDescription: 'Pregătirea soluțiilor și exprimarea concentrației.',
        estimatedTime: 15,
        keyFormulas: ['w = (md / ms) · 100', 'Cm = n / V_sol', 'ms = md + m_apă'],
        concepts: ['Solvat', 'Solvent', 'Dizolvare', 'Saturație', 'Diluție'],
        examTips: [
            'Masa soluției se schimbă la adăugarea de apă sau substanță.',
            'Atenție la transformarea volumului în litri pentru Cm.'
        ],
        commonMistakes: [
            'Confundarea masei dizolvatului cu masa soluției.',
            'Adunarea volumelor fără a ține cont de densitate.'
        ],
        practiceProblems: [],
        subsections: [
            {
                id: "top4-s1",
                title: "Solubilitatea",
                content: "Capacitatea unei substanțe de a se dizolva într-un anumit solvent depinde de natura componentelor ('ceea ce se aseamănă se dizolvă') și de temperatură.",
                formulas: [{ label: "Coeficient de solubilitate", formula: "S = (md / m_solvent) · 100" }],
                tip: "Dizolvarea substanțelor gazoase în lichide este favorizată de scăderea temperaturii și creșterea presiunii."
            }
        ],
        keyPoints: [
            "Concentrația procentuală exprimă masa de dizolvat în 100g de soluție",
            "Concentrația molară exprimă numărul de moli de dizolvat în 1L de soluție",
            "Masa dizolvatului (md) nu se schimbă în timpul procesului de diluare",
            "Amestecarea a două soluții duce la o concentrație intermediară între cele două"
        ],
        relatedLessonIds: []
    },
    {
        id: 'top5',
        title: 'Cinetica și echilibrul chimic',
        category: 'chimie-anorganica',
        difficulty: 'advanced',
        icon: '⚖️',
        shortDescription: 'Viteza de reacție și starea de echilibru dinamic.',
        estimatedTime: 15,
        keyFormulas: ['v = k [A]^a [B]^b', 'Kc = [C]^c [D]^d / [A]^a [B]^b'],
        concepts: ['Le Chatelier', 'Catalizator', 'Energie de activare', 'Echilibru'],
        examTips: [
            'Principiul Le Chatelier: sistemul se opune perturbării.',
            'Creșterea presiunii deplasează echilibrul spre volum mai mic (gaz).'
        ],
        commonMistakes: [
            'Includerea solidelor în expresia constantei Kc.',
            'Confundarea vitezei cu echilibrul.'
        ],
        practiceProblems: [],
        subsections: [
            {
                id: "top5-s1",
                title: "Viteza de reacție",
                content: "Viteza de reacție reprezintă variația concentrației reactanților sau produșilor în unitatea de timp. Depinde de natura reactanților, concentrație, suprafața de contact și catalizatori.",
                formulas: [{ label: "Ecuația vitezei", formula: "v = k · [A]^a · [B]^b" }],
                tip: "Catalizatorii scad energia de activare, mărind viteza de reacție fără a modifica constanta de echilibru."
            }
        ],
        keyPoints: [
            "Echilibrul chimic este dinamic: reacțiile directă și inversă au loc cu viteze egale",
            "Creșterea temperaturii favorizează reacția endotermă",
            "Creșterea concentrației unui reactant deplasează echilibrul spre formarea produșilor",
            "Constanta de echilibru Kc depinde numai de temperatură"
        ],
        relatedLessonIds: []
    },
    {
        id: 'top6',
        title: 'Electrochimie — celule galvanice și electroliza',
        category: 'electrochimie',
        difficulty: 'advanced',
        icon: '🔋',
        shortDescription: 'Conversia energiei chimice în electrică și procesele de electrod.',
        estimatedTime: 15,
        keyFormulas: ['E = E0_catod - E0_anod', 'm = (m · I · t) / (n · F)'],
        concepts: ['Redox', 'Anod', 'Catod', 'Punte salină', 'Potential'],
        examTips: [
            'La anod are loc întotdeauna oxidarea (A.O.).',
            'Metalele cu potențial mai mic sunt agenți reducători mai tari.'
        ],
        commonMistakes: [
            'Inversarea polarității electrozilor între pilă și electrolizor.',
            'Calculul greșit al numărului de electroni transferați.'
        ],
        practiceProblems: [],
        subsections: [
            {
                id: "top6-s1",
                title: "Pila Daniell",
                content: "Un exemplu clasic de celulă galvanică formată dintr-un electrod de Zn (anod) și unul de Cu (catod), scufundați în soluțiile sărurilor lor respective și conectați printr-o punte salină.",
                formulas: [{ label: "Tensiunea electromotoare", formula: "E = E_catod - E_anod" }],
                tip: "Puntea salină asigură neutralitatea electrică a soluțiilor prin migrarea ionilor."
            }
        ],
        keyPoints: [
            "Oxidarea (pierdere de electroni) are loc la anod",
            "Reducerea (câștig de electroni) are loc la catod",
            "Seria tensiunilor metalelor permite prezicerea spontaneității reacțiilor redox",
            "Electroliza este procesul de descompunere a unui electrolit cu ajutorul curentului electric"
        ],
        relatedLessonIds: []
    },
    {
        id: 'top7',
        title: 'Hidrocarburi — alcani, alchene, alchine, arene',
        category: 'chimie-organica',
        difficulty: 'intermediate',
        icon: '🔥',
        shortDescription: 'Studiul compușilor formați doar din carbon și hidrogen.',
        estimatedTime: 15,
        keyFormulas: ['CnH2n+2', 'CnH2n', 'CnH2n-2'],
        concepts: ['Substituție', 'Adiție', 'Markovnikov', 'Halogenare', 'Aromaticitate'],
        examTips: [
            'Regula Markovnikov: H merge la carbonul mai bogat în hidrogen.',
            'Alcanii sunt inerți la rece față de majoritatea reactivilor.'
        ],
        commonMistakes: [
            'Omiterea condițiilor de reacție (lumină, Ni, H2SO4).',
            'Scrierea incorectă a izomerilor de catenă.'
        ],
        practiceProblems: [],
        subsections: [
            {
                id: "top7-s1",
                title: "Nomenclatura IUPAC",
                content: "Denumirea hidrocarburilor se face identificând cea mai lungă catenă de atomi de carbon și numerotând-o astfel încât ramificațiile sau legăturile multiple să aibă indici cât mai mici.",
                formulas: [{ label: "Formula generală arene", formula: "CnH2n-6" }],
                tip: "Acetilena (etina) arde cu o flacără foarte fierbinte, fiind folosită la tăierea metalelor."
            }
        ],
        keyPoints: [
            "Alcanii sunt hidrocarburi saturate cu legături simple C-C și C-H",
            "Alchenele conțin o legătură dublă și participă la reacții de adiție",
            "Alchinele conțin o legătură triplă și pot forma acetiluri metalice",
            "Arenele au un nucleu aromatic stabil (benzenic) și dau preferențial substituție"
        ],
        relatedLessonIds: []
    },
    {
        id: 'top8',
        title: 'Compuși cu funcțiuni organice',
        category: 'chimie-organica',
        difficulty: 'advanced',
        icon: '🍊',
        shortDescription: 'Alcooli, acizi carboxilici, esteri și amine.',
        estimatedTime: 15,
        keyFormulas: ['R-OH', 'R-COOH', 'R-COOR'],
        concepts: ['Esterificare', 'Hidroliză', 'Saponificare', 'Aminoacizi', 'Legătură peptidică'],
        examTips: [
            'Reacția oglinzii de argint este specifică aldehidelor.',
            'Esterificarea este o reacție reversibilă.'
        ],
        commonMistakes: [
            'Confundarea acidului formic cu alți acizi la reacția cu reactivul Tollens.',
            'Identificarea greșită a grupei amino.'
        ],
        practiceProblems: [],
        subsections: [
            {
                id: "top8-s1",
                title: "Acizii carboxilici",
                content: "Compuși care conțin grupa funcțională carboxil (-COOH). Sunt acizi slabi, dar mai tari decât alcoolii și fenolii. Reacționează cu metale active, oxizi bazici, baze și săruri.",
                formulas: [{ label: "Reacția de esterificare", formula: "R-COOH + R'-OH ⇌ R-COOR' + H2O" }],
                tip: "Acidul acetic (oțetul) este cel mai cunoscut reprezentant al seriei acizilor monocarboxilici saturați."
            }
        ],
        keyPoints: [
            "Alcoolii formează legături de hidrogen, ceea ce le conferă solubilitate și puncte de fierbere mari",
            "Fenolii au caracter acid mai pronunțat decât alcoolii din cauza efectului nucleului aromatic",
            "Aminoacizii sunt compuși cu funcțiune mixtă și stau la baza formării proteinelor",
            "Săpunurile sunt săruri ale acizilor grași cu sodiu sau potasiu"
        ],
        relatedLessonIds: []
    }
];
