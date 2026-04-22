import type { Lesson } from '../models/Lesson';

export const mockLessons: Lesson[] = [
  {
    id: 'l1',
    title: 'Reactii de Oxido-Reducere (Redox)',
    category: 'chimie-anorganica',
    difficulty: 'intermediate',
    description:
      'Studiul reactiilor in care are loc transfer de electroni intre speciile chimice. Notiuni de oxidant, reducator, numar de oxidare.',
    duration: 45,
    tags: ['redox', 'oxidare', 'reducere', 'electron'],
    sections: [
      {
        id: 's1-1',
        title: 'Numarul de oxidare',
        content:
          'Numarul de oxidare reprezinta sarcina electrica pe care ar dobandi-o un atom daca toti electronii legaturii ar apartine atomului mai electronegativ. Se calculeaza pe baza regulilor conventionale: pentru elementele simple este 0, suma numerelor de oxidare in molecule este 0, iar in ioni este egala cu sarcina ionului.',
        formula: 'Suma n.o. = 0 (molecula)  |  Suma n.o. = sarcina (ion)',
      },
      {
        id: 's1-2',
        title: 'Oxidantul si Reducatorul',
        content:
          'Oxidantul este specia care accepta electroni si se reduce (numarul de oxidare scade). Reducatorul este specia care cedeaza electroni si se oxideaza (numarul de oxidare creste). Exemplu clasic: reactia fierului cu acidul clorhidric.',
        formula: 'Fe + 2HCl -> FeCl2 + H2',
      },
      {
        id: 's1-3',
        title: 'Metoda bilantului electronic',
        content:
          'Metoda de egalizare a reactiilor redox bazata pe principiul conservarii sarcinii electrice: numarul de electroni cedati de reducator trebuie sa fie egal cu numarul de electroni acceptati de oxidant.',
        formula: 'Delta_n(ox) x coef = Delta_n(red) x coef',
      },
    ],
    createdAt: '2024-01-10T10:00:00Z',
    updatedAt: '2024-03-01T10:00:00Z',
  },
  {
    id: 'l2',
    title: 'Acizi si Baze – Teoria Bronsted-Lowry',
    category: 'chimie-anorganica',
    difficulty: 'beginner',
    description:
      'Concepte fundamentale despre acizi si baze conform teoriei Bronsted-Lowry. pH, pOH, produsul ionic al apei.',
    duration: 40,
    tags: ['acizi', 'baze', 'pH', 'protoni', 'neutralizare'],
    sections: [
      {
        id: 's2-1',
        title: 'Definitia Bronsted-Lowry',
        content:
          'Conform teoriei Bronsted-Lowry, un acid este o specie chimica ce poate ceda protoni (H+), iar o baza este o specie chimica ce poate accepta protoni. Fiecare acid are o baza conjugata si invers, formand perechile acid-baza conjugate.',
        formula: 'HA + B <=> A- + BH+',
      },
      {
        id: 's2-2',
        title: 'pH-ul solutiilor',
        content:
          'pH-ul este o scara logaritmica ce masoara concentratia ionilor de hidrogen dintr-o solutie. La 25 grade C, apa pura are pH = 7 (neutru). Solutiile cu pH < 7 sunt acide, iar cele cu pH > 7 sunt bazice. Produsul ionic al apei Kw = 10^-14.',
        formula: 'pH = -log[H3O+]  |  pH + pOH = 14',
      },
      {
        id: 's2-3',
        title: 'Neutralizarea',
        content:
          'Reactia de neutralizare are loc intre un acid si o baza, producand o sare si apa. Reactia este exoterma si se poate urmari prin titrare cu indicatori acido-bazici (fenolftaleina, turnesol).',
        formula: 'HCl + NaOH -> NaCl + H2O  (Delta_H < 0)',
      },
    ],
    createdAt: '2024-01-12T10:00:00Z',
    updatedAt: '2024-03-02T10:00:00Z',
  },
  {
    id: 'l3',
    title: 'Hidrocarburi – Alcani, Alchene, Alchine',
    category: 'chimie-organica',
    difficulty: 'intermediate',
    description:
      'Seria omologa a hidrocarburilor saturate si nesaturate. Nomenclatura IUPAC, proprietati fizice si chimice, reactii caracteristice.',
    duration: 60,
    tags: ['hidrocarburi', 'alcani', 'alchene', 'alchine', 'organic'],
    sections: [
      {
        id: 's3-1',
        title: 'Alcanii (parafine)',
        content:
          'Alcanii sunt hidrocarburi saturate cu formula generala CnH2n+2. Sunt relativ inerte chimic (reactioneaza prin substitutie radicalica). Primii 4 termeni sunt gaze la temperatura camerei. Nomenclatura: metan, etan, propan, butan, pentan.',
        formula: 'CnH2n+2  |  CH4 + Cl2 ->(hv) CH3Cl + HCl',
      },
      {
        id: 's3-2',
        title: 'Alchenele (olefine)',
        content:
          'Alchenele sunt hidrocarburi nesaturate cu o dubla legatura C=C, formula generala CnH2n. Reactioneaza prin aditie electrofilica (HX, X2, H2O, H2). Regula lui Markovnikov guverneaza orientarea aditiei.',
        formula: 'CH2=CH2 + H2 ->(Ni, Delta) CH3-CH3',
      },
      {
        id: 's3-3',
        title: 'Alchinele',
        content:
          'Alchinele au o tripla legatura C triple C si formula generala CnH2n-2. Acetilena (HC triple CH) este cel mai important reprezentant. Reactioneaza prin aditie in doua etape si pot polimeriza. Au caracter slab acid (H terminal).',
        formula: 'HC triple CH + H2 ->(Pd) CH2=CH2 ->(Ni) CH3-CH3',
      },
    ],
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-03-05T10:00:00Z',
  },
  {
    id: 'l4',
    title: 'Electrochimie – Celule Galvanice si Electroliza',
    category: 'electrochimie',
    difficulty: 'advanced',
    description:
      'Principii de electrochimie: pila Daniell, potentiale de electrod, electroliza si legile lui Faraday.',
    duration: 55,
    tags: ['electrochimie', 'electroliza', 'Faraday', 'pila', 'electrod'],
    sections: [
      {
        id: 's4-1',
        title: 'Pila Daniell',
        content:
          'Pila Daniell este o celula galvanica formata din electrodul de zinc (anod: Zn -> Zn2+ + 2e-) si electrodul de cupru (catod: Cu2+ + 2e- -> Cu). Tensiunea electromotoare standard este 1.10 V.',
        formula: 'E_celula = E_catod - E_anod = +0.34 - (-0.76) = 1.10 V',
      },
      {
        id: 's4-2',
        title: 'Electroliza',
        content:
          'Electroliza reprezinta descompunerea unui electrolit prin curent electric continuu. La catod are loc reducerea, la anod are loc oxidarea. Aplicatii: rafinarea metalelor, galvanizarea, productia aluminiului.',
        formula: 'Catod: Cu2+ + 2e- -> Cu  |  Anod: 2Cl- -> Cl2 + 2e-',
      },
      {
        id: 's4-3',
        title: 'Legile lui Faraday',
        content:
          'Prima lege: masa substantei depusa/dizolvate este proportionala cu cantitatea de electricitate. A doua lege: masele depuse de aceeasi cantitate de electricitate sunt proportionale cu echivalentul chimic al substantei.',
        formula: 'm = (M * I * t) / (n * F)  |  F = 96485 C/mol',
      },
    ],
    createdAt: '2024-01-20T10:00:00Z',
    updatedAt: '2024-03-08T10:00:00Z',
  },
  {
    id: 'l5',
    title: 'Termodinamica Chimica – Entalpia si Entropia',
    category: 'termodinamica',
    difficulty: 'advanced',
    description:
      'Principiile termodinamicii aplicate in chimie: entalpia de reactie, legea lui Hess, entropia si energia libera Gibbs.',
    duration: 50,
    tags: ['termodinamica', 'entalpie', 'entropie', 'Gibbs', 'Hess'],
    sections: [
      {
        id: 's5-1',
        title: 'Entalpia de reactie',
        content:
          'Entalpia (H) este o functie de stare ce masoara continutul termic al unui sistem la presiune constanta. Variatia de entalpie DeltaH a unei reactii poate fi exoterma (DeltaH < 0) sau endoterma (DeltaH > 0).',
        formula: 'DeltaH_rxn = Suma DeltaH_f(prod) - Suma DeltaH_f(react)',
      },
      {
        id: 's5-2',
        title: 'Legea lui Hess',
        content:
          'Legea lui Hess afirma ca variatia de entalpie a unei reactii este independenta de calea urmata. Permite calcularea DeltaH pentru reactii care nu pot fi masurate direct prin combinarea algebrica a altor reactii.',
        formula: 'DeltaH_total = Suma DeltaH_etape',
      },
      {
        id: 's5-3',
        title: 'Energia libera Gibbs',
        content:
          'Energia libera Gibbs (G) determina spontaneitatea reactiilor la presiune si temperatura constante. O reactie este spontana daca DeltaG < 0. Relatia fundamentala leaga entalpia, entropia si temperatura.',
        formula: 'DeltaG = DeltaH - T*DeltaS  |  DeltaG < 0: spontan',
      },
    ],
    createdAt: '2024-01-25T10:00:00Z',
    updatedAt: '2024-03-10T10:00:00Z',
  },
  {
    id: 'l6',
    title: 'Chimie Organica: Grupari functionale si polimeri',
    category: 'chimie-organica',
    difficulty: 'intermediate',
    description:
      'Functional groups in organic compounds, basic reactivities, and polymer types with polymerization mechanisms.',
    duration: 60,
    tags: ['grupari functionale', 'polimeri', 'esteri', 'aminoacizi', 'polimerizare'],
    sections: [
      {
        id: 's6-1',
        title: 'Grupari functionale comune',
        content:
          'Alcoholii (-OH), eterii (R-O-R), aldehidele (-CHO), cetonele (C=O), acizii carboxilici (-COOH), esterii (-COOR), aminele (-NH2) si amidele (-CONH2) sunt grupari functionale centrale. Reactivitatea depinde de polaritate si posibilitati de formare legaturi hidrogen.',
        formula:
          'Etanol: CH3CH2OH  |  Acid acetic: CH3COOH  |  Acetona: CH3COCH3',
      },
      {
        id: 's6-2',
        title: 'Formarea esterilor (esterificare Fischer)',
        content:
          'Reactia unui acid carboxilic cu un alcool in prezenta acidului sulfuric ca catalizator duce la formarea unui ester si apa. Este o reactie de echilibru, adesea folosita pentru sintetizarea parfumurilor.',
        formula: 'CH3COOH + C2H5OH <=> CH3COOC2H5 + H2O',
      },
      {
        id: 's6-3',
        title: 'Polimeri si mecanisme de polimerizare',
        content:
          'Polimerii pot fi de aditie (polietilena, polipropilena, PVC) sau de condensatie (poliesteri, nailon). Polimerizarea radicalica si policondensarea sunt mecanisme esentiale.',
        formula:
          'n CH2=CH2 ->(initiator) [-CH2-CH2-]n  |  n HO-CH2-CH2-OH + n HOOC-Ph-COOH -> [-O-CH2-CH2-O-CO-Ph-CO-]n + 2n H2O',
      },
    ],
    createdAt: '2024-01-27T10:00:00Z',
    updatedAt: '2024-03-12T10:00:00Z',
  },
  {
    id: 'l7',
    title: 'Chimie Anorganica: Oxiizi, hidroxizi si complexi coordinativi',
    category: 'chimie-anorganica',
    difficulty: 'intermediate',
    description:
      'Proprietatile oxidului, hidroxidului, formarea complexelor si tipuri de legaturi in chimia anorganica.',
    duration: 55,
    tags: ['oxizi', 'hidroxizi', 'complexi', 'coordinar', 'acid-baza'],
    sections: [
      {
        id: 's7-1',
        title: 'Oxizi si hidroxizi',
        content:
          'Oxizii metalici sunt bazici (ex: Na2O + H2O -> 2NaOH), oxidii nonmetalicii sunt acizi (SO2 + H2O -> H2SO3). Hidroxizii metalici pot fi precipitabile si au solubilitate variabila.',
        formula:
          'CaO + H2O -> Ca(OH)2  |  SO3 + H2O -> H2SO4  |  Fe(OH)3 (s) instabil in mediu acid',
      },
      {
        id: 's7-2',
        title: 'Formarea ligandilor si complexelor',
        content:
          'Ligandii neutri (NH3, H2O) si anioni (Cl-, CN-) se leaga la ionul central metalic pentru a forma complexi de coordonare. Un complex [Cu(NH3)4]2+ apare in solutii amoniacale ale Cu2+.',
        formula:
          'Cu2+ + 4 NH3 -> [Cu(NH3)4]2+  |  Fe3+ + 6 CN- -> [Fe(CN)6]3-',
      },
      {
        id: 's7-3',
        title: 'Teoria acid-baza Lewis si stabilitatea complexelor',
        content:
          'Un acid Lewis accepta un cuplu de electroni, baza Lewis donate; formarea complexelor este exemplu clasic. Constanta de formare beta indica stabilitatea complexului in solutie.',
        formula: 'Cu2+ + 4 CN- <=> [Cu(CN)4]2-  (beta4)  |  Kf pentru [Ag(NH3)2]+ = 1.7e7',
      },
    ],
    createdAt: '2024-01-30T10:00:00Z',
    updatedAt: '2024-03-14T10:00:00Z',
  },
  {
    id: 'l8',
    title: 'Chimie Fizica: Cinética și echilibru chimic',
    category: 'chimie-fizica',
    difficulty: 'advanced',
    description:
      'Cinetica reactiilor, factorii care influenteaza viteza si legea actiunii maselor pentru echilibru chimic.',
    duration: 50,
    tags: ['cinetica', 'echilibru', 'Le Chatelier', 'rată', 'rendament'],
    sections: [
      {
        id: 's8-1',
        title: 'Rata de reactie si factori influentatori',
        content:
          'Rata de reactie depinde de concentratie, temperatura, suprafata de contact, catalizatori si presiune in cazul gazelor. Ecuatia generala: v = k [A]^m [B]^n.',
        formula: 'v = k [NO2]^2  (pentru 2 NO2 -> N2O4) si k = A e^{-Ea/RT}',
      },
      {
        id: 's8-2',
        title: 'Echilibrul chimic si principiul lui Le Chatelier',
        content:
          'In sistemele inchise aflate in echilibru, perturbatiile de concentratie, temperatura sau presiune determina deplasarea echilibrului pentru a contracara modificarea.',
        formula: 'Kc = [CO]^2 / ([CO2][H2]) pentru reacția CO2 + H2 <=> CO + H2O',
      },
      {
        id: 's8-3',
        title: 'Constanta de echilibru si factorul de reactie Q',
        content:
          'Comparand Q cu K putem determina directia de deplasare. Daca Q < K, reactioneaza spre producei; daca Q > K, reactioneaza spre reactanti.',
        formula: 'Q = [CO]^2 / ([CO2][H2]) si K = 4.5 la 700K',
      },
    ],
    createdAt: '2024-02-02T10:00:00Z',
    updatedAt: '2024-03-16T10:00:00Z',
  },
];
