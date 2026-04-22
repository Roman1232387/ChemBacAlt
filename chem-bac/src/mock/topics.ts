import type { Topic } from '../models/Topic.ts';

export const mockTopics: Topic[] = [
    {
        id: 'top1',
        title: 'Structura Atomului',
        category: 'structura-atomului',
        difficulty: 'beginner',
        icon: '⚛',
        shortDescription: 'Nucleu, electroni, configurație electronică și legătura cu proprietățile elementelor chimice.',
        relatedLessonIds: [],
        keyPoints: [
            'Atomul = nucleu (protoni + neutroni) + electroni pe niveluri energetice',
            'Numărul atomic Z = numărul de protoni = numărul de electroni (atom neutru)',
            'Numărul de masă A = protoni + neutroni',
            'Izotopii au același Z dar A diferit',
            'Electronii se distribuie pe straturi K, L, M, N (max 2n² electroni)',
        ],
        commonMistakes: [
            'Confundarea numărului atomic cu numărul de masă',
            'Greșeli la configurația electronică a elementelor din blocul d',
            'Uitarea regulii lui Hund la completarea orbitalilor',
        ],
        examTips: [
            'Memorează configurația electronică a primelor 20 elemente',
            'Cunoaște excepțiile: Cr (3d⁵4s¹) și Cu (3d¹⁰4s¹)',
            'La subiecte de baraj: verifică întotdeauna că suma electronilor = Z',
        ],
        subsections: [
            {
                id: 'top1-1',
                title: 'Nucleul atomic',
                content: 'Nucleul se află în centrul atomului și conține protonii (sarcină +1) și neutronii (sarcină 0). Nucleul concentrează aproape întreaga masă a atomului, deși ocupă un volum extrem de mic față de dimensiunea totală a atomului. Protonii determină identitatea chimică a elementului — un atom cu 6 protoni este întotdeauna carbon.',
                formulas: [
                    { label: 'Numărul de masă', formula: 'A = Z + N  (protoni + neutroni)' },
                    { label: 'Numărul de neutroni', formula: 'N = A − Z' },
                ],
                tip: 'La BAC apare frecvent calculul numărului de neutroni dintr-un izotop dat.',
            },
            {
                id: 'top1-2',
                title: 'Învelișul electronic și configurația',
                content: 'Electronii ocupă niveluri energetice (straturi) notate K, L, M, N, corespunzând numerelor cuantice principale n = 1, 2, 3, 4. Fiecare strat conține maxim 2n² electroni. Completarea orbitalilor respectă Principiul lui Aufbau (de la energie mai mică la mai mare), Principiul excluderii lui Pauli (max 2 electroni per orbital, cu spin opus) și Regula lui Hund (orbitali degeneri se completează mai întâi câte un electron).',
                formulas: [
                    { label: 'Max electroni pe strat n', formula: 'N_max = 2n²' },
                    { label: 'Exemplu: Carbon (Z=6)', formula: '1s² 2s² 2p²' },
                    { label: 'Exemplu: Fier (Z=26)', formula: '[Ar] 3d⁶ 4s²' },
                ],
                tip: 'Configurația electronică determină poziția elementului în tabelul periodic și valența sa.',
            },
            {
                id: 'top1-3',
                title: 'Izotopi și aplicații',
                content: 'Izotopii sunt atomi ai aceluiași element (același Z) cu număr de masă diferit (A diferit), deci cu număr diferit de neutroni. Proprietățile chimice ale izotopilor sunt identice, dar proprietățile fizice (masă, radioactivitate) diferă. Masa atomică din tabelul periodic este media ponderată a maselor izotopilor din natură.',
                formulas: [
                    { label: 'Izotopii hidrogenului', formula: '¹H (protiu), ²H (deuteriu), ³H (tritiu)' },
                    { label: 'Masa atomică medie', formula: 'M̄ = Σ(abundență × masă izotop)' },
                ],
            },
        ],
    },

    {
        id: 'top2',
        title: 'Legături Chimice',
        category: 'chimie-anorganica',
        difficulty: 'intermediate',
        icon: '🔗',
        shortDescription: 'Legătura ionică, covalentă și metalică. Cum se formează și ce proprietăți conferă substanțelor.',
        relatedLessonIds: [],
        keyPoints: [
            'Legătura ionică: transfer de electroni între metal și nemetal → ioni opuși care se atrag',
            'Legătura covalentă: punere în comun de electroni între nemetale',
            'Legătura metalică: electroni delocalizați în rețeaua de cationi metalici',
            'Polaritatea legăturii depinde de diferența de electronegativitate (ΔEN)',
            'Forma moleculei se determină cu teoria VSEPR',
        ],
        commonMistakes: [
            'Confundarea legăturii ionice cu cea covalent-polară',
            'Greșeli la structura Lewis (distribuția greșită a electronilor neparticipanți)',
            'Uitarea că H₂O este moleculă polară deși are 2 legături polare simetrice — NU, simetria este în V, deci e polară',
        ],
        examTips: [
            'ΔEN > 1.7 → legătură ionică; 0.4–1.7 → covalentă polară; < 0.4 → covalentă nepolar',
            'Desenează structura Lewis pas cu pas: numără electronii de valență, formează legăturile, completează octeții',
            'VSEPR: perechile neparticipante „împing" mai tare decât legăturile → unghiuri mai mici',
        ],
        subsections: [
            {
                id: 'top2-1',
                title: 'Legătura ionică',
                content: 'Legătura ionică se formează prin transferul unuia sau mai multor electroni de la un atom cu electronegativitate mică (metale) la un atom cu electronegativitate mare (nemetale). Rezultă ioni cu sarcini opuse care se atrag electrostatic. Compușii ionici formează rețele cristaline, au puncte de topire ridicate, sunt conductori de electricitate în stare topită sau dizolvată, dar nu în stare solidă.',
                formulas: [
                    { label: 'Formarea NaCl', formula: 'Na → Na⁺ + e⁻  |  Cl + e⁻ → Cl⁻  |  Na⁺ + Cl⁻ → NaCl' },
                ],
                tip: 'La BAC: dacă se cere energia rețelei cristaline, folosești ciclul Born-Haber.',
            },
            {
                id: 'top2-2',
                title: 'Legătura covalentă',
                content: 'Legătura covalentă apare când doi atomi (de regulă nemetale) împart una sau mai multe perechi de electroni. Poate fi simplă (σ), dublă (σ+π) sau triplă (σ+2π). Legătura covalentă polară apare când electronii sunt atrași mai mult de atomul mai electronegativ. Legătura de coordonare (dativă) este un caz special în care ambii electroni ai perechii provin de la același atom.',
                formulas: [
                    { label: 'H₂ (covalentă nepolară)', formula: 'H· + ·H → H:H  (ΔEN = 0)' },
                    { label: 'HCl (covalentă polară)', formula: 'H–Cl  (ΔEN = 0.9, δ⁺H–Clδ⁻)' },
                    { label: 'N₂ (triplă)', formula: 'N≡N  (1σ + 2π)' },
                ],
            },
            {
                id: 'top2-3',
                title: 'Teoria VSEPR și geometria moleculelor',
                content: 'Teoria VSEPR (Valence Shell Electron Pair Repulsion) prezice geometria moleculelor pe baza repulsiei perechilor de electroni din jurul atomului central. Perechile neparticipante (lone pairs) exercită o repulsie mai mare decât perechile de legătură, distorsionând unghiurile față de geometria ideală.',
                formulas: [
                    { label: 'CH₄ — tetraedric', formula: 'Unghi H-C-H = 109.5°' },
                    { label: 'NH₃ — piramidal trigonal', formula: 'Unghi H-N-H = 107°  (o pereche neparticipantă)' },
                    { label: 'H₂O — angular (în V)', formula: 'Unghi H-O-H = 104.5°  (două perechi neparticipante)' },
                ],
                tip: 'Memorează: liniar (180°), trigonal plan (120°), tetraedric (109.5°), octaedric (90°).',
            },
        ],
    },

    {
        id: 'top3',
        title: 'Reacții de Oxido-Reducere (Redox)',
        category: 'chimie-anorganica',
        difficulty: 'intermediate',
        icon: '⚡',
        shortDescription: 'Transfer de electroni, numere de oxidare, bilanțul electronic și aplicații practice.',
        relatedLessonIds: ['l1'],
        keyPoints: [
            'Oxidarea = pierdere de electroni = creșterea numărului de oxidare',
            'Reducerea = câștig de electroni = scăderea numărului de oxidare',
            'Oxidantul se reduce; reducătorul se oxidează',
            'Numărul de electroni cedați = numărul de electroni acceptați (bilanț)',
            'KMnO₄ și K₂Cr₂O₇ sunt oxidanți puternici în mediu acid',
        ],
        commonMistakes: [
            'Inversarea rolurilor: reducătorul se oxidează (NU se reduce)',
            'Calculul greșit al numărului de oxidare la ioni poliatomici',
            'Uitarea că O are n.o. = −2 (excepție: în OF₂ are +2, în peroxizi −1)',
        ],
        examTips: [
            'La bilanțul electronic: scrie mai întâi jumătățile de reacție, egalizează electronii, apoi adaugă',
            'Verifică suma algebrică a numerelor de oxidare în orice specie',
            'Recunoaște rapid oxidanții comuni: O₂, F₂, Cl₂, H₂O₂, KMnO₄, HNO₃, H₂SO₄ concentrat',
        ],
        subsections: [
            {
                id: 'top3-1',
                title: 'Numărul de oxidare',
                content: 'Numărul de oxidare (n.o.) este sarcina ipotetica a unui atom, presupunând că toți electronii de legătură aparțin atomului mai electronegativ. Se calculează pe baza unor reguli convenționale bine stabilite. Este esențial pentru identificarea proceselor de oxidare și reducere în reacții chimice.',
                formulas: [
                    { label: 'Reguli de bază', formula: 'n.o. element pur = 0  |  n.o. ion monoatomic = sarcina ionului' },
                    { label: 'Suma în moleculă', formula: 'Σ n.o. = 0 (moleculă)  |  Σ n.o. = sarcina (ion)' },
                    { label: 'MnO₄⁻ exemplu', formula: 'n.o.(Mn) + 4×(−2) = −1  →  n.o.(Mn) = +7' },
                ],
                tip: 'O are n.o. = −2 în aproape toate compușii. H are n.o. = +1 (excepție în hidruri metalice: −1).',
            },
            {
                id: 'top3-2',
                title: 'Oxidantul și reducătorul',
                content: 'Oxidantul acceptă electroni și se reduce (numărul de oxidare scade). Reducătorul cedează electroni și se oxidează (numărul de oxidare crește). Ambele procese au loc simultan — nu există oxidare fără reducere și invers.',
                formulas: [
                    { label: 'Exemplu clasic', formula: 'Zn + CuSO₄ → ZnSO₄ + Cu' },
                    { label: 'Zn: oxidat', formula: 'Zn⁰ → Zn²⁺ + 2e⁻  (reducător)' },
                    { label: 'Cu²⁺: redus', formula: 'Cu²⁺ + 2e⁻ → Cu⁰  (oxidant)' },
                ],
            },
            {
                id: 'top3-3',
                title: 'Metoda bilanțului electronic',
                content: 'Metoda bilanțului electronic egalizează reacțiile redox pe baza principiului că numărul total de electroni cedați trebuie să fie egal cu numărul total de electroni acceptați. Pașii: 1) identifică atomii cu n.o. schimbat; 2) scrie variațiile de n.o.; 3) egalizează electronii (CMMMC); 4) găsește coeficienții; 5) egalizează restul moleculei.',
                formulas: [
                    { label: 'KMnO₄ + FeSO₄ + H₂SO₄', formula: 'Mn⁺⁷ + 5e⁻ → Mn²⁺  |  Fe²⁺ → Fe³⁺ + e⁻' },
                    { label: 'Bilanț', formula: '1 × 5e⁻ = 5 × 1e⁻  →  coef: KMnO₄=1, FeSO₄=5' },
                ],
                tip: 'La BAC, metodă semireacțiilor ionice este preferată pentru claritate.',
            },
        ],
    },

    {
        id: 'top4',
        title: 'Acizi și Baze',
        category: 'chimie-anorganica',
        difficulty: 'beginner',
        icon: '🧪',
        shortDescription: 'Teoria Brønsted-Lowry, calculul pH-ului, neutralizarea și indicatori acido-bazici.',
        relatedLessonIds: ['l2'],
        keyPoints: [
            'Acid Brønsted-Lowry = donator de protoni (H⁺)',
            'Bază Brønsted-Lowry = acceptor de protoni (H⁺)',
            'pH = −log[H₃O⁺]  |  pH + pOH = 14 (la 25°C)',
            'Kw = [H⁺][OH⁻] = 10⁻¹⁴ la 25°C',
            'Substanțele amfotere reacționează cu acizi ȘI cu baze (ex: Al(OH)₃, Zn(OH)₂)',
        ],
        commonMistakes: [
            'Confundarea teoriei Arrhenius cu Brønsted-Lowry (Arrhenius se aplică doar în apă)',
            'Calculul greșit: pH = log[H⁺] în loc de −log[H⁺]',
            'Uitarea că soluțiile de săruri pot fi acide sau bazice prin hidroliză',
        ],
        examTips: [
            'pH sub 7 → acid; pH = 7 → neutru; pH peste 7 → bazic (la 25°C)',
            'Acizii tari: HCl, HBr, HI, HNO₃, H₂SO₄, HClO₄ — se disociază complet',
            'Bazele tari: NaOH, KOH, Ca(OH)₂ — se disociază complet',
        ],
        subsections: [
            {
                id: 'top4-1',
                title: 'Teoria Brønsted-Lowry',
                content: 'Conform teoriei Brønsted-Lowry (1923), un acid este orice specie chimică care poate dona un proton (H⁺), iar o bază este orice specie care poate accepta un proton. Această definiție este mai generală decât cea a lui Arrhenius și se aplică și în solvenți non-apoși. Fiecare acid are o bază conjugată (obținută prin pierderea unui proton), iar fiecare bază are un acid conjugat.',
                formulas: [
                    { label: 'Ecuația generală', formula: 'HA + B ⇌ A⁻ + BH⁺' },
                    { label: 'Exemplu în apă', formula: 'CH₃COOH + H₂O ⇌ CH₃COO⁻ + H₃O⁺' },
                    { label: 'Perechi conjugate', formula: 'CH₃COOH/CH₃COO⁻  și  H₃O⁺/H₂O' },
                ],
                tip: 'Apa este amfoter: poate dona SAU accepta protoni, deci este și acid și bază conform Brønsted-Lowry.',
            },
            {
                id: 'top4-2',
                title: 'Calculul pH-ului',
                content: 'pH-ul este o scară logaritmică (inventată de Sørensen în 1909) care măsoară concentrația ionilor de hidron (H₃O⁺) dintr-o soluție. O scară tipică de pH merge de la 0 la 14, deși teoretic poate depăși aceste limite. Fiecare unitate de pH reprezintă o variație de 10 ori a concentrației.',
                formulas: [
                    { label: 'Definiție pH', formula: 'pH = −log[H₃O⁺]' },
                    { label: 'Relație complementară', formula: 'pOH = −log[OH⁻]  |  pH + pOH = 14' },
                    { label: 'Acid tare 0.01 M', formula: '[H⁺] = 0.01 = 10⁻²  →  pH = 2' },
                    { label: 'Bază tare 0.001 M', formula: '[OH⁻] = 10⁻³  →  pOH = 3  →  pH = 11' },
                ],
                tip: 'La BAC: concentrațiile sunt de obicei puteri ale lui 10 pentru a facilita calculul log-ului.',
            },
            {
                id: 'top4-3',
                title: 'Neutralizarea și titrarea',
                content: 'Neutralizarea este reacția dintre un acid și o bază în care se formează o sare și apă. Titrarea acido-bazică este o tehnică analitică prin care se determină concentrația unui acid sau baze prin adăugarea treptată a unei soluții cu concentrație cunoscută (titrant) până la punctul de echivalență, indicat de un indicator (fenolftaleină sau turnesol) sau pH-metru.',
                formulas: [
                    { label: 'Neutralizare completă', formula: 'HCl + NaOH → NaCl + H₂O' },
                    { label: 'Relație titrare', formula: 'n(acid) = n(bază)  →  C_a × V_a = C_b × V_b' },
                    { label: 'H₂SO₄ + 2NaOH', formula: 'C_a × V_a × 2 = C_b × V_b' },
                ],
            },
        ],
    },

    {
        id: 'top5',
        title: 'Hidrocarburi',
        category: 'chimie-organica',
        difficulty: 'intermediate',
        icon: '🔬',
        shortDescription: 'Alcani, alchene, alchine — nomenclatură IUPAC, proprietăți și reacții specifice pentru BAC.',
        relatedLessonIds: ['l3'],
        keyPoints: [
            'Alcani CₙH₂ₙ₊₂ → reacții de substituție radicalică (SR)',
            'Alchene CₙH₂ₙ → reacții de adiție electrofiliă (AE), polimerizare',
            'Alchine CₙH₂ₙ₋₂ → adiție în două etape, caracter slab acid (H terminal)',
            'Regula lui Markovnikov: H se adaugă la C cu mai mulți H',
            'Arene (benzen C₆H₆) → substituție electrofiliă aromatică (SE)',
        ],
        commonMistakes: [
            'Confundarea formulei alcanilor cu a alchenelor (CₙH₂ₙ vs CₙH₂ₙ₊₂)',
            'Aplicarea greșită a regulii Markovnikov (H merge la C mai bogat în H, nu la cel mai substituit)',
            'Uitarea că polimerizarea alchenelor necesită inițiatori (radicali liberi sau catalizatori ionici)',
        ],
        examTips: [
            'Denumire IUPAC: identifică catena principală (cel mai lung lanț cu funcțiunea), numerotează de la capătul cel mai aproape de substituent',
            'La reacțiile de ardere: CₙH₂ₙ₊₂ + (3n+1)/2 O₂ → nCO₂ + (n+1)H₂O',
            'Acetilena (HC≡CH) decolorează AgNO₃ amoniacal → precipitat galben de AgC≡CAg',
        ],
        subsections: [
            {
                id: 'top5-1',
                title: 'Alcani (parafine) — CₙH₂ₙ₊₂',
                content: 'Alcanii sunt hidrocarburi saturate în care toți atomii de carbon formează numai legături simple (σ). Sunt relativ inerti chimic datorită stabilității legăturilor C-C și C-H. Reacția caracteristică este halogenarea radicalică în prezența luminii UV (fotochimică) sau la căldură. Primii 4 termeni sunt gaze la temperatura ambiantă (metan, etan, propan, butan), urmați de lichide și solide.',
                formulas: [
                    { label: 'Formula generală', formula: 'CₙH₂ₙ₊₂  (n ≥ 1)' },
                    { label: 'Halogenare', formula: 'CH₄ + Cl₂ →(hν) CH₃Cl + HCl' },
                    { label: 'Ardere completă', formula: 'CₙH₂ₙ₊₂ + (3n+1)/2 O₂ → nCO₂ + (n+1)H₂O' },
                ],
                tip: 'Metan, etan, propan, butan, pentan, hexan, heptan, octan, nonan, decan — memorează primii 10!',
            },
            {
                id: 'top5-2',
                title: 'Alchene (olefine) — CₙH₂ₙ',
                content: 'Alchenele conțin o legătură dublă C=C (1σ + 1π). Legătura π este mai slabă și reactivă — se rupe ușor în reacțiile de adiție. Reacția caracteristică este adiția electrofiliă (AE): halogenare, hidrohalogenare (regula Markovnikov), hidratare, hidrogenare. Alchenele decolorează apa de brom și soluția de KMnO₄ la rece (test calitativ).',
                formulas: [
                    { label: 'Formula generală', formula: 'CₙH₂ₙ  (n ≥ 2)' },
                    { label: 'Bromurare', formula: 'CH₂=CH₂ + Br₂ → CH₂Br–CH₂Br  (1,2-dibromoetan)' },
                    { label: 'Markovnikov', formula: 'CH₃–CH=CH₂ + HBr → CH₃–CHBr–CH₃  (produs major)' },
                    { label: 'Polimerizare', formula: 'nCH₂=CH₂ →(cat.) (–CH₂–CH₂–)ₙ  (polietilenă)' },
                ],
            },
            {
                id: 'top5-3',
                title: 'Alchine — CₙH₂ₙ₋₂',
                content: 'Alchinele conțin o legătură triplă C≡C (1σ + 2π). Acetilena (etenă, HC≡CH) este cel mai important reprezentant. Reacționează prin adiție în două etape (mai întâi dă o alchenă, apoi un alcan). Alchinele terminale (cu H pe C triplit legat) au caracter slab acid și pot forma precipitate cu reactivi specifici (testul AgNO₃ amoniacal).',
                formulas: [
                    { label: 'Formula generală', formula: 'CₙH₂ₙ₋₂  (n ≥ 2)' },
                    { label: 'Adiție H₂ (etape)', formula: 'HC≡CH + H₂ →(Pd) CH₂=CH₂ →(Ni) CH₃–CH₃' },
                    { label: 'Test AgNO₃', formula: 'HC≡CH + 2[Ag(NH₃)₂]⁺ → AgC≡CAg↓ (galben) + 2NH₄⁺' },
                ],
                tip: 'Acetilena se obține industrial prin cracarea metanului sau din CaC₂ + H₂O.',
            },
        ],
    },

    {
        id: 'top6',
        title: 'Echilibrul Chimic',
        category: 'chimie-anorganica',
        difficulty: 'advanced',
        icon: '⚖',
        shortDescription: 'Legea acțiunii maselor, constanta de echilibru Kc/Kp și principiul Le Chatelier.',
        relatedLessonIds: [],
        keyPoints: [
            'Echilibrul chimic este dinamic: reacțiile directă și inversă au loc simultan cu vitezeegale',
            'Kc = [produse]^coef / [reactanți]^coef  (concentrații la echilibru)',
            'Principiul Le Chatelier: un sistem în echilibru perturbat se opune perturbației',
            'Creșterea presiunii favorizează sensul cu mai puțini moli de gaz',
            'Temperatura afectează Kc: creșterea T favorizează reacția endotermă',
        ],
        commonMistakes: [
            'Includerea solidelor și lichidelor pure în expresia lui Kc (nu se includ!)',
            'Confundarea efectului temperaturii cu efectul catalizatorului (catalizatorul NU deplasează echilibrul)',
            'Greșeli la scrierea expresiei Kc pentru reacții cu coeficienți > 1',
        ],
        examTips: [
            'Un catalizator accelerează atingerea echilibrului dar NU modifică Kc sau poziția echilibrului',
            'Kc > 1 → echilibrul favorizează produșii; Kc < 1 → echilibrul favorizează reactanții',
            'La presiune constantă, adăugarea unui gaz inert NU perturbă echilibrul',
        ],
        subsections: [
            {
                id: 'top6-1',
                title: 'Legea acțiunii maselor și Kc',
                content: 'Legea acțiunii maselor (Guldberg și Waage, 1864) afirmă că viteza unei reacții chimice este proporțională cu produsul concentrațiilor molare ale reactanților, ridicate la puterea coeficienților stoichiometrici. La echilibru, raportul dintre produsul concentrațiilor produșilor și al reactanților are o valoare constantă Kc, care depinde numai de temperatură.',
                formulas: [
                    { label: 'Reacție generală', formula: 'aA + bB ⇌ cC + dD' },
                    { label: 'Expresia Kc', formula: 'Kc = [C]ᶜ × [D]ᵈ / ([A]ᵃ × [B]ᵇ)' },
                    { label: 'Exemplu: N₂ + 3H₂ ⇌ 2NH₃', formula: 'Kc = [NH₃]² / ([N₂] × [H₂]³)' },
                ],
                tip: 'Solidele pure (CaCO₃, C) și apa lichidă pură NU apar în expresia lui Kc.',
            },
            {
                id: 'top6-2',
                title: 'Principiul Le Chatelier',
                content: 'Principiul Le Chatelier (1884) afirmă că dacă un sistem aflat în echilibru este supus unei perturbații (modificarea concentrației, presiunii sau temperaturii), echilibrul se deplasează în sensul care tinde să anuleze perturbația. Este un instrument puternic de predicție calitativă a comportamentului sistemelor la echilibru.',
                formulas: [
                    { label: 'Creștere [reactant]', formula: '→ echilibrul se deplasează spre produse (direct →)' },
                    { label: 'Creștere presiune', formula: '→ sensul cu mai puțini moli de gaz' },
                    { label: 'Creștere T (reacție exotermă)', formula: '→ echilibrul se deplasează spre reactanți (invers ←)' },
                ],
                tip: 'Sinteza amoniacului (procesul Haber): N₂+3H₂⇌2NH₃, ΔH<0 — presiune mare și T moderată + catalizator (Fe).',
            },
        ],
    },

    {
        id: 'top7',
        title: 'Compuși Organici cu Funcțiuni',
        category: 'chimie-organica',
        difficulty: 'advanced',
        icon: '🧬',
        shortDescription: 'Alcooli, acizi carboxilici, esteri, amine și aminoacizi — funcțiuni organice esențiale pentru BAC.',
        relatedLessonIds: [],
        keyPoints: [
            'Alcooli (–OH): esterificare, oxidare la aldehide/cetone/acizi, deshidratare',
            'Acizi carboxilici (–COOH): esterificare (cu alcooli), săruri (cu baze)',
            'Esteri (–COO–): formare prin esterificare, hidroliză (saponificare cu NaOH)',
            'Amine (–NH₂): caracter bazic, formare de săruri de amoniu cu acizi',
            'Aminoacizi: conțin –NH₂ și –COOH, formează peptide prin legătura peptidică',
        ],
        commonMistakes: [
            'Confundarea alcoolilor primari cu cei secundari și terțiari la oxidare',
            'Greșeli la scrierea reacției de esterificare (nu uita că este reversibilă și produce apă)',
            'Uitarea că aminoacizii sunt amfoteri (reacționează cu acizi ȘI cu baze)',
        ],
        examTips: [
            'Oxidarea: alcool primar → aldehidă → acid carboxilic; alcool secundar → cetonă',
            'Esterificarea: acid + alcool ⇌ ester + apă (catalizator: H₂SO₄ conc.)',
            'Saponificarea: ester + NaOH → alcool + sare sodică a acidului (săpun)',
        ],
        subsections: [
            {
                id: 'top7-1',
                title: 'Alcooli',
                content: 'Alcoolii sunt compuși organici care conțin grupa hidroxil (–OH) legată de un atom de carbon sp³. Se clasifică în primari (–CH₂OH), secundari (>CHOH) și terțiari (>C(OH)<) în funcție de substituted carbonului purtător de OH. Proprietățile chimice includ aciditatea slabă, esterificarea, deshidratarea (la alchene sau eteri) și oxidarea.',
                formulas: [
                    { label: 'Etanol → acid acetic', formula: 'CH₃CH₂OH →(oxidare) CH₃CHO →(oxidare) CH₃COOH' },
                    { label: 'Deshidratare interă', formula: 'CH₃CH₂OH →(H₂SO₄, 170°C) CH₂=CH₂ + H₂O' },
                    { label: 'Esterificare', formula: 'R–OH + R\'–COOH ⇌ R\'–COO–R + H₂O' },
                ],
            },
            {
                id: 'top7-2',
                title: 'Acizi carboxilici și esteri',
                content: 'Acizii carboxilici conțin grupa –COOH și sunt compuși relativ acizi (pKa 4–5 pentru acizii alifatici). Reacționează cu alcoolii (esterificare Fischer), cu bazele (formare de săruri), cu metalele active și cu compuși cu clor activ. Esterii (–COO–) se formează prin esterificare și se hidrolizează în mediu acid sau bazic (saponificare).',
                formulas: [
                    { label: 'Esterificare', formula: 'CH₃COOH + C₂H₅OH ⇌(H₂SO₄) CH₃COOC₂H₅ + H₂O' },
                    { label: 'Saponificare', formula: 'CH₃COOC₂H₅ + NaOH → CH₃COONa + C₂H₅OH' },
                ],
                tip: 'Grăsimile sunt esteri ai glicerolului cu acizi grași — saponificarea lor dă săpunuri.',
            },
        ],
    },
];
