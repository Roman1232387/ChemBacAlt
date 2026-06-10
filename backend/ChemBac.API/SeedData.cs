using ChemBac.DataAccess.Context;
using ChemBac.Domain.Entities;

public static class SeedData
{
    public static void SeedInitialData()
    {
        using (var db = new UserContext())
        {
            if (db.Users.Any()) return;
        }

        ClearDatabase();
        var adminId = SeedAdmin();
        SeedUser();
        var chapterIds = SeedChapters();
        var lessonIds = SeedLessons(chapterIds);
        SeedTests(adminId, lessonIds);
    }

    private static int SeedAdmin()
    {
        using var db = new UserContext();
        if (!db.Users.Any())
        {
            db.Users.Add(new User
            {
                Name = "Administrator",
                Email = "admin@chembac.md",
                PasswordHash = BCrypt.Net.BCrypt.HashPassword("Admin2026!"),
                Role = "Admin",
                AvatarInitials = "A",
                CreatedAt = DateTime.UtcNow
            });
            db.SaveChanges();
        }

        return db.Users
            .OrderByDescending(u => u.Role == "Admin")
            .ThenBy(u => u.Id)
            .Select(u => u.Id)
            .First();
    }

    private static void SeedUser()
    {
        using var db = new UserContext();
        if (!db.Users.Any(u => u.Email == "elev@chembac.md"))
        {
            db.Users.Add(new User
            {
                Name = "Elev Demo",
                Email = "elev@chembac.md",
                PasswordHash = BCrypt.Net.BCrypt.HashPassword("Elev123!"),
                Role = "User",
                AvatarInitials = "E",
                CreatedAt = DateTime.UtcNow
            });
            db.SaveChanges();
        }
    }

    private static Dictionary<string, int> SeedChapters()
    {
        using var db = new LessonContext();
        var chapters = new[]
        {
            new Chapter { Title = "Chimie Generală", Profile = "general", Order = 1 },
            new Chapter { Title = "Chimie Anorganică", Profile = "general", Order = 2 },
            new Chapter { Title = "Chimie Organică", Profile = "general", Order = 3 },
            new Chapter { Title = "Electrochimie", Profile = "real", Order = 4 },
            new Chapter { Title = "Calcule Chimice", Profile = "general", Order = 5 }
        };

        foreach (var chapter in chapters)
        {
            if (!db.Chapters.Any(c => c.Title == chapter.Title))
                db.Chapters.Add(chapter);
        }

        db.SaveChanges();
        return db.Chapters
            .GroupBy(c => c.Title)
            .ToDictionary(g => g.Key, g => g.OrderBy(c => c.Id).First().Id);
    }

    private static Dictionary<string, int> SeedLessons(Dictionary<string, int> chapterIds)
    {
        using var db = new LessonContext();
        foreach (var lesson in BuildLessons(chapterIds))
        {
            if (!db.Lessons.Any(l => l.Title == lesson.Title))
                db.Lessons.Add(lesson);
        }

        db.SaveChanges();
        return db.Lessons
            .GroupBy(l => l.Title)
            .ToDictionary(g => g.Key, g => g.OrderBy(l => l.Id).First().Id);
    }

    private static List<Lesson> BuildLessons(Dictionary<string, int> c) => new()
    {
        Lesson(c["Chimie Generală"], "Structura atomului și sistemul periodic", "chimie-generala", 10,
            "Studiul aprofundat al structurii atomice, configurațiilor electronice și legilor care guvernează tabelul periodic al elementelor.",
            Section("text", "Modelul atomic Bohr și numere cuantice", "Modelul lui Bohr introduce ideea nivelelor energetice staționare. Starea electronului este definită de numerele cuantice: <b>n</b> (principal, determină energia), <b>l</b> (secundar, forma orbitalului: s, p, d, f), <b>m<sub>l</sub></b> (magnetic, orientarea în spațiu) și <b>m<sub>s</sub></b> (de spin)."),
            Section("formula", "Configurația electronică", "Repartizarea electronilor pe substraturi se face conform principiului minimei energii (regula n+l), principiului lui Pauli (maxim 2 electroni/orbital) și regulii lui Hund (ocuparea maximă a orbitalilor cu spin paralel).", "1s<sup>2</sup> 2s<sup>2</sup> 2p<sup>6</sup> 3s<sup>2</sup> 3p<sup>6</sup> 4s<sup>2</sup> 3d<sup>10</sup>..."),
            Section("text", "Legea periodicității și proprietăți periodice", "Proprietățile elementelor sunt în funcție periodică de numărul atomic Z. <b>Raza atomică</b> scade în perioadă și crește în grupă. <b>Electronegativitatea</b> și <b>energia de ionizare</b> cresc în perioadă (spre elementele cu caracter nemetalic) și scad în grupă.")),

        Lesson(c["Chimie Generală"], "Tipuri de legături chimice", "chimie-generala", 10,
            "Natura forțelor care mențin atomii împreună în molecule și rețele cristaline.",
            Section("text", "Legătura covalentă și Geometria VSEPR", "Se formează prin punerea în comun de electroni între nemetale. Poate fi <b>nepolară</b> (H<sub>2</sub>, Cl<sub>2</sub>) sau <b>polară</b> (HCl, H<sub>2</sub>O). Teoria VSEPR explică geometria: de exemplu, CH<sub>4</sub> este tetraedric (109.5°), iar NH<sub>3</sub> este piramidal."),
            Section("text", "Legătura ionică și metalică", "Legătura ionică apare prin transfer de electroni (NaCl, K<sub>2</sub>O). Legătura metalică se bazează pe atracția dintre ionii pozitivi și 'norul' de electroni delocalizați, explicând conductibilitatea metalelor."),
            Section("text", "Legătura de hidrogen", "Este o interacțiune electrostatică între atomul de H legat de un element puternic electronegativ (F, O, N) și o pereche de electroni neparticipanți ai altui atom (H<sub>2</sub>O, proteine, ADN).")),

        Lesson(c["Calcule Chimice"], "Stoechiometrie și calcule chimice", "calcule-chimice", 10,
            "Fundamentele calculelor cantitative în chimie: mol, mase molare și randamentul reacțiilor.",
            Section("formula", "Molul și masa molară", "Molul este unitatea de măsură pentru cantitatea de substanță. Masa molară (M) se calculează însumând masele atomice relative (A<sub>r</sub>) ale elementelor componente.", "n = m / M; N = n · N<sub>A</sub>"),
            Section("text", "Calcule pe baza ecuațiilor chimice", "Pentru orice calcul, ecuația chimică trebuie să fie <b>echilibrată</b>. Raportul molar dat de coeficienții stoechiometrici stă la baza proporțiilor pentru calcularea maselor sau volumelor de reactanți/produși."),
            Section("formula", "Randamentul reacției și puritatea", "În practică, masa obținută (m<sub>p</sub>) este adesea mai mică decât cea teoretică (m<sub>t</sub>) datorită pierderilor sau reacțiilor secundare.", "η = (m<sub>practic</sub> / m<sub>teoretic</sub>) · 100%")),

        Lesson(c["Chimie Generală"], "Reacții chimice — clasificare și cinetica", "chimie-generala", 10,
            "Tipologia transformărilor chimice și factorii care determină viteza acestora.",
            Section("text", "Clasificarea reacțiilor", "Reacțiile pot fi de <b>combinare</b> (A+B→AB), <b>descompunere</b> (AB→A+B), <b>substituție</b> (A+BC→AC+B) sau <b>schimb</b> (AB+CD→AD+CB). O altă clasificare importantă este cea <b>Redox</b>, bazată pe transfer de electroni."),
            Section("formula", "Viteza de reacție și factori de influență", "Viteza depinde de natura reactanților, concentrație, suprafața de contact și temperatură (regula lui Van't Hoff).", "v = k · [A]<sup>a</sup> · [B]<sup>b</sup>"),
            Section("tip", "Cataliza", "Catalizatorii sunt substanțe care măresc viteza de reacție prin scăderea energiei de activare, fără a fi consumați în proces. Enzimele sunt catalizatori biologici extrem de eficienți.")),

        Lesson(c["Chimie Anorganică"], "Acizi, baze și săruri — teoria Arrhenius și Brønsted", "chimie-anorganica", 10,
            "Comportamentul substanțelor în soluție apoasă, echilibre acido-bazice și noțiunea de pH.",
            Section("text", "Teoria disocierii electrolitice", "Acizii sunt substanțe care cedează protoni (H<sup>+</sup>), iar bazele sunt cele care îi acceptă (Teoria Brønsted-Lowry). Electroliții tari disociază complet, pe când cei slabi stabilesc un echilibru."),
            Section("formula", "pH-ul și pOH-ul", "Aciditatea sau bazicitatea unei soluții se măsoară prin exponentul de hidrogen pH, egal cu logaritmul cu semn schimbat al concentrației ionilor de hidroniu.", "pH = -log[H<sub>3</sub>O<sup>+</sup>]; pH + pOH = 14"),
            Section("text", "Hidroliza sărurilor", "Sărurile provenite din acizi/baze de tării diferite reacționează cu apa. De exemplu, Na<sub>2</sub>CO<sub>3</sub> dă o soluție bazică prin hidroliza anionului CO<sub>3</sub><sup>2-</sup>.")),

        Lesson(c["Chimie Organică"], "Chimie organică — hidrocarburi", "chimie-organica", 10,
            "Introducere în studiul compușilor carbonului: alcani, alchene, alchine și arene.",
            Section("text", "Alcani și Alchene", "<b>Alcanii</b> (C<sub>n</sub>H<sub>2n+2</sub>) dau reacții de substituție. <b>Alchenele</b> (C<sub>n</sub>H<sub>2n</sub>) conțin o legătură dublă și dau reacții de adiție, respectând regula lui Markovnikov (H se adaugă la C mai hidrogenat)."),
            Section("text", "Alchine și Arene (Benzen)", "<b>Alchinele</b> (C<sub>n</sub>H<sub>2n-2</sub>) conțin o legătură triplă (ex: acetilena). <b>Arenele</b> au ca unitate structurală nucleul benzenic (C<sub>6</sub>H<sub>6</sub>), caracterizat prin stabilitate aromatică ridicată."),
            Section("bac_attention", "Important pentru BAC", "Rețineți reacțiile specifice: halogenarea alcanilor la lumină, decolorarea apei de brom de către hidrocarburile nesaturate și nitrarea benzenului cu amestec nitrant."))
    };

    private static void SeedTests(int adminId, Dictionary<string, int> lessonIds)
    {
        using var db = new TestContext();
        var lId = lessonIds.Values.FirstOrDefault();

        if (!db.Tests.Any(t => t.Title == "Simulare BAC Chimie — Sesiunea I"))
            db.Tests.Add(BuildBacSesiunea1(adminId, lId));

        if (!db.Tests.Any(t => t.Title == "Simulare BAC Chimie — Chimie Organică"))
            db.Tests.Add(BuildBacOrganica(adminId, lId));

        if (!db.Tests.Any(t => t.Title == "Exerciții Stoechiometrie și Calcule"))
            db.Tests.Add(BuildStoechiometrie(adminId, lId));

        db.SaveChanges();
    }

    private static Test BuildBacSesiunea1(int adminId, int lessonId) => new()
    {
        Title = "Simulare BAC Chimie — Sesiunea I",
        Description = "Test complex care acoperă programa de BAC: Chimie Generală, Anorganică și Calcule.",
        Duration = 45, PassingScore = 60, Status = "published", LessonId = lessonId, CreatedById = adminId,
        Questions = GenerateBacQuestions()
    };

    private static List<Question> GenerateBacQuestions()
    {
        var q = new List<Question>();
        q.Add(Single("Numărul de electroni de pe ultimul strat al atomului de sulf (Z=16) este:", "6", "2", "4", "6", "8"));
        q.Add(Single("Hibridizarea atomului de carbon în molecula de etenă (C₂H₄) este:", "sp²", "sp³", "sp", "sp²", "sp³d"));
        q.Add(Single("Câți moli de NaOH sunt necesari pentru neutralizarea a 0,5 moli H₂SO₄?", "1", "0,5", "1", "2", "0,25"));
        q.Add(Single("Numărul de oxidare al manganului în KMnO₄ este:", "+7", "+2", "+4", "+6", "+7"));
        q.Add(Single("Care din următorii oxizi este acid?", "CO₂", "Na₂O", "CaO", "MgO", "CO₂"));
        q.Add(Single("Legătura chimică în molecula de clor (Cl₂) este:", "covalentă nepolară", "ionică", "covalentă polară", "covalentă nepolară", "metalică"));
        q.Add(Single("Care element are cea mai mare electronegativitate?", "Fluor", "Oxigen", "Fluor", "Clor", "Azot"));
        q.Add(Single("Volumul molar al gazelor în condiții normale este:", "22,4 L/mol", "11,2 L/mol", "22,4 L/mol", "24,4 L/mol", "1 L/mol"));
        q.Add(Single("Produsul ionic al apei la 25°C este:", "10⁻¹⁴", "10⁻⁷", "10⁻¹⁴", "7", "14"));
        q.Add(Single("Care metal nu reacționează cu acidul clorhidric?", "Cu", "Mg", "Zn", "Fe", "Cu"));

        q.Add(Multiple("Care dintre următoarele substanțe sunt oxizi acizi?", new[] { "CO₂", "SO₃" }, "CO₂", "SO₃", "Na₂O", "CaO"));
        q.Add(Multiple("Identificați hidrocarburile nesaturate:", new[] { "C₂H₄", "C₂H₂" }, "C₂H₄", "C₂H₂", "C₂H₆", "CH₄"));
        q.Add(Multiple("Care afirmații despre legătura ionică sunt corecte?", new[] { "Se formează prin transfer de electroni", "Apare între metale și nemetale" }, "Se formează prin transfer de electroni", "Apare între metale și nemetale", "Apare prin punerea în comun de electroni", "Este specifică moleculelor de gaze nobile"));
        q.Add(Multiple("Care elemente se află în perioada a 3-a a tabelului periodic?", new[] { "Na", "Cl" }, "Na", "Cl", "K", "Ca"));
        q.Add(Multiple("Identificați bazele tari:", new[] { "NaOH", "KOH" }, "NaOH", "KOH", "NH₃", "Cu(OH)₂"));
        q.Add(Multiple("Care reacții sunt reacții redox?", new[] { "Zn + 2HCl -> ZnCl₂ + H₂", "2Na + Cl₂ -> 2NaCl" }, "Zn + 2HCl -> ZnCl₂ + H₂", "2Na + Cl₂ -> 2NaCl", "NaOH + HCl -> NaCl + H₂O", "BaCl₂ + Na₂SO₄ -> BaSO₄ + 2NaCl"));
        q.Add(Multiple("Proprietăți care cresc în perioadă (stânga->dreapta):", new[] { "Electronegativitatea", "Energia de ionizare" }, "Electronegativitatea", "Energia de ionizare", "Raza atomică", "Caracterul metalic"));
        q.Add(Multiple("Care substanțe sunt electroliti tari?", new[] { "HCl", "NaOH" }, "HCl", "NaOH", "CH₃COOH", "NH₃"));
        q.Add(Multiple("Identificați alchenele:", new[] { "C₃H₆", "C₄H₈" }, "C₃H₆", "C₄H₈", "C₃H₈", "C₄H₆"));
        q.Add(Multiple("Care oxizi reacționează cu apa formând acizi?", new[] { "CO₂", "P₂O₅" }, "CO₂", "P₂O₅", "Na₂O", "MgO"));

        q.Add(Stepped("Calculați masa de CaCO₃ necesară pentru a obține 11,2 L CO₂ (c.n.) prin descompunere termică.", new[] {
            Step("Scrieți ecuația reacției de descompunere termică a CaCO₃", "CaCO3 -> CaO + CO2", "text", 0, 1, ""),
            Step("Calculați numărul de moli de CO₂ obținuți din 11,2 L la c.n.", "0.5", "numeric", 0.01, 2, "mol"),
            Step("Determinați numărul de moli de CaCO₃ necesari (raport 1:1)", "0.5", "numeric", 0.01, 1, "mol"),
            Step("Calculați masa de CaCO₃ (M=100 g/mol)", "50", "numeric", 0.5, 1, "g")
        }));

        q.Add(Stepped("Se ard 8 g de sulf. Calculați volumul de dioxid de sulf obținut la c.n.", new[] {
            Step("Ecuația reacției de ardere a sulfului:", "S + O2 -> SO2", "text", 0, 1, ""),
            Step("Masa molară a sulfului (M):", "32", "numeric", 0, 1, "g/mol"),
            Step("Numărul de moli de sulf (n=m/M):", "0.25", "numeric", 0.01, 1, "mol"),
            Step("Volumul de SO2 (V=n*22.4):", "5.6", "numeric", 0.1, 2, "L")
        }));

        q.Add(Stepped("Se dizolvă 40 g NaOH (M=40) în apă până la 500 mL soluție. Calculați concentrația molară.", new[] {
            Step("Calculați numărul de moli de NaOH (n=m/M):", "1", "numeric", 0.01, 1, "mol"),
            Step("Transformați volumul soluției în litri:", "0.5", "numeric", 0, 1, "L"),
            Step("Calculați concentrația molară (c=n/V):", "2", "numeric", 0.1, 3, "mol/L")
        }));

        q.Add(Stepped("Calculați pH-ul unei soluții de HCl 0,01 mol/L.", new[] {
            Step("Identificați concentrația ionilor de hidroniu [H⁺] (acid tare):", "0.01", "numeric", 0, 1, "mol/L"),
            Step("Calculați pH-ul (pH = -log[H⁺]):", "2", "numeric", 0.1, 4, "")
        }));

        q.Add(Stepped("Se arde complet 6 g de carbon. Calculați volumul de CO₂ la c.n.", new[] {
            Step("Ecuația reacției de ardere a carbonului:", "C + O2 -> CO2", "text", 0, 1, ""),
            Step("Numărul de moli de carbon (M=12):", "0.5", "numeric", 0.01, 1, "mol"),
            Step("Volumul de CO₂ obținut (V=n*22.4):", "11.2", "numeric", 0.1, 3, "L")
        }));

        q.Add(Stepped("Calculați masa de precipitat BaSO₄ obținut din 0,2 mol BaCl₂ și exces de H₂SO₄. M(BaSO₄)=233 g/mol", new[] {
            Step("Ecuația reacției:", "BaCl2 + H2SO4 -> BaSO4 + 2HCl", "text", 0, 1, ""),
            Step("Numărul de moli de BaSO₄ format (raport 1:1):", "0.2", "numeric", 0.01, 1, "mol"),
            Step("Masa precipitatului (m=n*M):", "46.6", "numeric", 0.1, 3, "g")
        }));

        q.Add(Stepped("O soluție de H₂SO₄ are concentrația masică 49% și densitatea 1,4 g/mL. Calculați concentrația molară. M(H₂SO₄)=98 g/mol", new[] {
            Step("Calculați masa unui litru de soluție (m=V*d):", "1400", "numeric", 1, 1, "g"),
            Step("Calculați masa de H₂SO₄ dizolvată (m_d = m_s * c/100):", "686", "numeric", 1, 1, "g"),
            Step("Calculați numărul de moli de acid (n=m/M):", "7", "numeric", 0.1, 1, "mol"),
            Step("Concentrația molară (c=n/V_sol):", "7", "numeric", 0.1, 2, "mol/L")
        }));

        q.Add(Stepped("Calculați masa de Fe(OH)₂ obținută prin reacția a 0,3 mol FeCl₂ cu exces NaOH. M(Fe(OH)₂)=90 g/mol", new[] {
            Step("Ecuația reacției:", "FeCl2 + 2NaOH -> Fe(OH)2 + 2NaCl", "text", 0, 1, ""),
            Step("Numărul de moli de Fe(OH)₂ format:", "0.3", "numeric", 0.01, 1, "mol"),
            Step("Masa de Fe(OH)₂ (m=n*M):", "27", "numeric", 0.1, 3, "g")
        }));
        q.Add(Stepped("Calculați masa de sare formată prin reacția a 0,1 mol H₂SO₄ cu KOH în exces.", new[] {
            Step("Ecuația reacției de neutralizare:", "H2SO4 + 2KOH -> K2SO4 + 2H2O", "text", 0, 1, ""),
            Step("Numărul de moli de K₂SO₄ format (raport 1:1):", "0.1", "numeric", 0, 2, "mol"),
            Step("Masa de K₂SO₄ formată (M=174 g/mol):", "17.4", "numeric", 0.1, 2, "g")
        }));

        q.Add(Stepped("Calculați volumul de hidrogen (c.n.) degajat la reacția a 4,8 g magneziu (A_r=24) cu HCl în exces.", new[] {
            Step("Ecuația reacției:", "Mg + 2HCl -> MgCl2 + H2", "text", 0, 1, ""),
            Step("Numărul de moli de magneziu (n=m/A_r):", "0.2", "numeric", 0.01, 2, "mol"),
            Step("Volumul de H₂ la c.n. (V=n*22.4):", "4.48", "numeric", 0.05, 2, "L")
        }));
        return q;
    }

    private static Test BuildBacOrganica(int adminId, int lessonId) => new()
    {
        Title = "Simulare BAC Chimie — Chimie Organică",
        Description = "Test axat pe hidrocarburi și compuși cu funcțiuni.",
        Duration = 45, PassingScore = 60, Status = "published", LessonId = lessonId, CreatedById = adminId,
        Questions = GenerateOrganicQuestions()
    };

    private static List<Question> GenerateOrganicQuestions()
    {
        var q = new List<Question>();
        q.Add(Single("Formula generală a alcanilor este:", "CnH2n+2", "CnH2n", "CnH2n-2", "CnH2n+2", "CnHn"));
        q.Add(Single("Care este produsul principal al adiției HCl la propenă?", "2-cloropropan", "1-cloropropan", "2-cloropropan", "1,2-dicloropropan", "cloretan"));
        q.Add(Single("Care este produsul adiției apei la etenă?", "Etanol", "Etanol", "Eter etilic", "Acid acetic", "Acetonă"));
        q.Add(Single("Câți izomeri are butanul (C₄H₁₀)?", "2", "1", "2", "3", "4"));
        q.Add(Single("Care este formula benzenului?", "C₆H₆", "C₆H₁₂", "C₆H₆", "C₆H₁₀", "C₁₂H₁₂"));
        q.Add(Single("Reacția caracteristică alcanilor este:", "Substituție", "Adiție", "Substituție", "Polimerizare", "Eliminare"));
        q.Add(Single("Câți atomi de H are molecula de propan (C₃H₈)?", "8", "4", "6", "8", "10"));
        q.Add(Single("Care hidrocarbură decolorează apa de brom?", "Etenă", "Metan", "Etan", "Propan", "Etenă"));
        q.Add(Single("Masa molară a etanolului (C₂H₅OH):", "46 g/mol", "32 g/mol", "44 g/mol", "46 g/mol", "60 g/mol"));
        q.Add(Single("Hibridizarea C în benzen este:", "sp²", "sp³", "sp", "sp²", "sp³d"));

        q.Add(Multiple("Identificați hidrocarburile saturate:", new[] { "Metan", "Etan" }, "Metan", "Etan", "Etenă", "Acetilenă"));
        q.Add(Multiple("Care dintre următorii compuși sunt alcooli?", new[] { "Glicerina", "Metanol" }, "Glicerina", "Metanol", "Fenol", "Anilină"));
        q.Add(Multiple("Identificați arenele mononucleare:", new[] { "Toluen", "Benzen" }, "Toluen", "Benzen", "Naftalină", "Antracen"));
        q.Add(Multiple("Care sunt produșii reacției de nitrare a benzenului?", new[] { "Nitrobenzen", "Apă" }, "Nitrobenzen", "Apă", "Acid clorhidric", "Hidrogen"));
        q.Add(Multiple("Identificați compușii cu funcțiuni oxigenate:", new[] { "Acid acetic", "Acetonă" }, "Acid acetic", "Acetonă", "Anilină", "Cloroform"));
        q.Add(Multiple("Proprietăți ale etenei:", new[] { "Participă la reacții de polimerizare", "Decolorează soluția de KMnO₄" }, "Participă la reacții de polimerizare", "Decolorează soluția de KMnO₄", "Este o hidrocarbură saturată", "Are geometrie liniară"));
        q.Add(Multiple("Care afirmații despre glucoză sunt corecte?", new[] { "Este o aldohexoză", "Participă la reacția de fermentație alcoolică" }, "Este o aldohexoză", "Participă la reacția de fermentație alcoolică", "Este o dizaharidă", "Are gust amar"));
        q.Add(Multiple("Identificați acizii carboxilici grași:", new[] { "Acid palmitic", "Acid stearic" }, "Acid palmitic", "Acid stearic", "Acid formic", "Acid oxalic"));
        q.Add(Multiple("Produșii de oxidare blândă a alchenelor sunt:", new[] { "Dioli", "Glicoli" }, "Dioli", "Glicoli", "Acizi", "Aldehide"));
        q.Add(Multiple("Care sunt izomerii de catenă ai pentanului?", new[] { "2-metilbutan", "2,2-dimetilpropan" }, "2-metilbutan", "2,2-dimetilpropan", "n-pentan", "ciclopentan"));

        q.Add(Stepped("Calculați masa de etanol obținut prin fermentarea a 180 g glucoză. M(C₂H₅OH)=46, M(C₆H₁₂O₆)=180", new[] {
            Step("Scrieți ecuația reacției de fermentație:", "C6H12O6 -> 2C2H5OH + 2CO2", "text", 0, 1, ""),
            Step("Numărul de moli de glucoză (n=m/M):", "1", "numeric", 0, 1, "mol"),
            Step("Numărul de moli de etanol formați (raport 1:2):", "2", "numeric", 0, 1, "mol"),
            Step("Masa de etanol obținută (m=n*M):", "92", "numeric", 0.1, 2, "g")
        }));

        q.Add(Stepped("Calculați volumul de acetilenă (c.n.) obținut din 0,5 mol CaC₂ cu apă.", new[] {
            Step("Ecuația reacției:", "CaC2 + 2H2O -> Ca(OH)2 + C2H2", "text", 0, 1, ""),
            Step("Numărul de moli de C₂H₂ formați (raport 1:1):", "0.5", "numeric", 0, 1, "mol"),
            Step("Volumul de gaz la c.n. (V=n*22.4):", "11.2", "numeric", 0.1, 3, "L")
        }));

        q.Add(Stepped("Calculați masa de acid acetic necesară pentru a reacționa cu 46 g de etanol (randament 100%). M(acid)=60, M(etanol)=46", new[] {
            Step("Ecuația reacției de esterificare:", "CH3COOH + C2H5OH -> CH3COOC2H5 + H2O", "text", 0, 1, ""),
            Step("Numărul de moli de etanol (n=m/M):", "1", "numeric", 0, 1, "mol"),
            Step("Numărul de moli de acid necesar (raport 1:1):", "1", "numeric", 0, 1, "mol"),
            Step("Masa de acid acetic (m=n*M):", "60", "numeric", 0.1, 2, "g")
        }));

        q.Add(Stepped("Se ard 16 g de metan (M=16). Calculați volumul de aer necesar (20% O₂).", new[] {
            Step("Ecuația reacției de ardere:", "CH4 + 2O2 -> CO2 + 2H2O", "text", 0, 1, ""),
            Step("Numărul de moli de metan:", "1", "numeric", 0, 1, "mol"),
            Step("Numărul de moli de O₂ necesari (raport 1:2):", "2", "numeric", 0, 1, "mol"),
            Step("Volumul de O₂ la c.n. (V=n*22.4):", "44.8", "numeric", 0.1, 1, "L"),
            Step("Volumul de aer necesar (V_aer = V_O2 * 5):", "224", "numeric", 1, 1, "L")
        }));

        q.Add(Stepped("Calculați masa de benzen necesară pentru obținerea a 123 g nitrobenzen. M(benzen)=78, M(nitrobenzen)=123", new[] {
            Step("Ecuația reacției de nitrare:", "C6H6 + HNO3 -> C6H5NO2 + H2O", "text", 0, 1, ""),
            Step("Numărul de moli de nitrobenzen (n=m/M):", "1", "numeric", 0, 1, "mol"),
            Step("Numărul de moli de benzen necesar:", "1", "numeric", 0, 1, "mol"),
            Step("Masa de benzen (m=n*M):", "78", "numeric", 0.1, 2, "g")
        }));

        q.Add(Stepped("Din 2 moli de acetilenă se obține benzen prin trimerizare. Calculați masa de benzen obținută.", new[] {
            Step("Ecuația reacției de trimerizare:", "3C2H2 -> C6H6", "text", 0, 1, ""),
            Step("Numărul de moli de benzen obținut (n=n_acetilena/3):", "0.66", "numeric", 0.05, 2, "mol"),
            Step("Masa de benzen (M=78):", "51.5", "numeric", 0.5, 2, "g")
        }));

        q.Add(Stepped("Să se determine masa de glicerină obținută prin hidroliza a 1 mol de tristearină (M=890). M(glicerina)=92", new[] {
            Step("Numărul de moli de glicerină formați din 1 mol trigliceridă:", "1", "numeric", 0, 1, "mol"),
            Step("Masa de glicerină (m=n*M):", "92", "numeric", 0.1, 4, "g")
        }));

        q.Add(Stepped("Calculați masa de argint depusă în reacția oglinzii de argint folosind 0,1 mol de glucoză.", new[] {
            Step("Numărul de moli de Ag depuși per mol glucoză (raport 1:2):", "0.2", "numeric", 0, 2, "mol"),
            Step("Masa de argint (A_r=108):", "21.6", "numeric", 0.1, 3, "g")
        }));
        q.Add(Stepped("Calculați masa de argint obținută la oxidarea a 0,2 moli de acetaldehidă (CH₃CHO) cu reactiv Tollens.", new[] {
            Step("Ecuația reacției (simplificată):", "CH3CHO + 2Ag(NH3)2OH -> CH3COONH4 + 2Ag + 3NH3 + H2O", "text", 0, 1, ""),
            Step("Numărul de moli de argint obținuți (raport 1:2):", "0.4", "numeric", 0, 2, "mol"),
            Step("Masa de argint (A_r=108):", "43.2", "numeric", 0.1, 2, "g")
        }));

        q.Add(Stepped("Calculați masa de săpun (stearat de sodiu) obținută prin saponificarea a 0,1 moli de tristearină.", new[] {
            Step("Numărul de moli de stearat de sodiu obținuți din 0,1 mol tristearină (raport 1:3):", "0.3", "numeric", 0.01, 2, "mol"),
            Step("Masa de stearat de sodiu (M=306 g/mol):", "91.8", "numeric", 0.1, 3, "g")
        }));
        return q;
    }

    private static Test BuildStoechiometrie(int adminId, int lessonId) => new()
    {
        Title = "Exerciții Stoechiometrie și Calcule",
        Description = "Probleme de calcul pe baza formulelor și ecuațiilor chimice.",
        Duration = 45, PassingScore = 60, Status = "published", LessonId = lessonId, CreatedById = adminId,
        Questions = GenerateStoechQuestions()
    };

    private static List<Question> GenerateStoechQuestions()
    {
        var q = new List<Question>();
        q.Add(Single("Masa molară a apei (H₂O) este:", "18 g/mol", "10", "16", "18", "20"));
        q.Add(Single("Câți moli sunt în 44 g de CO₂ (M=44)?", "1 mol", "0,5 mol", "1 mol", "2 mol", "44 mol"));
        q.Add(Single("Volumul ocupat de 2 moli de gaz la c.n. este:", "44,8 L", "22,4 L", "44,8 L", "11,2 L", "2 L"));
        q.Add(Single("Concentrația molară a unei soluții ce conține 1 mol dizolvat în 2 L este:", "0,5 M", "1 M", "0,5 M", "2 M", "0,1 M"));
        q.Add(Single("Masa de NaCl necesară pentru a prepara 100g soluție 5% este:", "5 g", "0,5 g", "5 g", "10 g", "50 g"));
        q.Add(Single("Numărul de moli de atomi de oxigen într-un mol de H₂SO₄ este:", "4", "1", "2", "3", "4"));
        q.Add(Single("Masa molară a sulfului (A_r=32) este:", "32 g/mol", "16 g/mol", "32 g/mol", "64 g/mol", "8 g/mol"));
        q.Add(Single("Câți electroni are un ion de Na⁺ (Z=11)?", "10", "11", "10", "12", "9"));
        q.Add(Single("Densitatea apei este aproximativ:", "1 g/mL", "1 g/mL", "10 g/mL", "0,5 g/mL", "2 g/mL"));
        q.Add(Single("Compoziția procentuală a oxigenului în MgO (M=40, O=16) este:", "40%", "16%", "40%", "60%", "20%"));

        q.Add(Multiple("Mărimi fundamentale în stoechiometrie:", new[] { "Masa molară", "Volumul molar" }, "Masa molară", "Volumul molar", "Culoarea", "Vâscozitatea"));
        q.Add(Multiple("Unități de măsură pentru concentrație:", new[] { "mol/L", "g/L" }, "mol/L", "g/L", "L/mol", "kg/m"));
        q.Add(Multiple("Condiții normale (c.n.) înseamnă:", new[] { "0°C", "1 atm" }, "0°C", "1 atm", "25°C", "101,3 kPa"));
        q.Add(Multiple("Formula m=n*M leagă mărimile:", new[] { "Masa", "Cantitatea de substanță" }, "Masa", "Cantitatea de substanță", "Volumul", "Densitatea"));
        q.Add(Multiple("Factori care definesc o soluție:", new[] { "Dizolvatul", "Solventul" }, "Dizolvatul", "Solventul", "Precipitatul", "Catalizatorul"));
        q.Add(Multiple("Elemente care formează molecule diatomice:", new[] { "Hidrogen", "Azot" }, "Hidrogen", "Azot", "Heliu", "Carbon"));
        q.Add(Multiple("Tipuri de concentrații:", new[] { "Procentuală", "Molară" }, "Procentuală", "Molară", "Volumetrică", "Termică"));
        q.Add(Multiple("Valori constante în calcule:", new[] { "Numărul lui Avogadro", "Volumul molar la c.n." }, "Numărul lui Avogadro", "Volumul molar la c.n.", "Masa atomică a H", "Temperatura camerei"));
        q.Add(Multiple("Produșii reacției de ardere a hidrocarburilor:", new[] { "CO₂", "H₂O" }, "CO₂", "H₂O", "CO", "H₂"));
        q.Add(Multiple("Metale care reacționează cu apa la rece:", new[] { "Sodiu", "Potasiu" }, "Sodiu", "Potasiu", "Cupru", "Aur"));

        q.Add(Stepped("Se amestecă 200 g soluție 10% cu 300 g soluție 20%. Calculați concentrația finală.", new[] {
            Step("Calculați masa de substanță dizolvată în prima soluție:", "20", "numeric", 0, 1, "g"),
            Step("Calculați masa de substanță dizolvată în a doua soluție:", "60", "numeric", 0, 1, "g"),
            Step("Masa totală de substanță dizolvată:", "80", "numeric", 0, 1, "g"),
            Step("Masa totală a soluției finale:", "500", "numeric", 0, 1, "g"),
            Step("Concentrația procentuală finală (c = m_d_total/m_s_total * 100):", "16", "numeric", 0.1, 1, "%")
        }));

        q.Add(Stepped("Calculați masa de apă necesară pentru a prepara 400 g soluție 25% din sare.", new[] {
            Step("Calculați masa de sare (dizolvat) necesară:", "100", "numeric", 0, 2, "g"),
            Step("Calculați masa de apă (m_apa = m_sol - m_sare):", "300", "numeric", 1, 3, "g")
        }));

        q.Add(Stepped("Se tratează 10 g CaCO₃ impur (80% puritate) cu HCl în exces. Calculați volumul de CO₂ obținut (c.n.).", new[] {
            Step("Calculați masa de CaCO₃ pură:", "8", "numeric", 0, 1, "g"),
            Step("Numărul de moli de CaCO₃ pur (M=100):", "0.08", "numeric", 0.001, 1, "mol"),
            Step("Numărul de moli de CO₂ formați (raport 1:1):", "0.08", "numeric", 0.001, 1, "mol"),
            Step("Volumul de CO₂ la c.n. (V=n*22.4):", "1.79", "numeric", 0.05, 2, "L")
        }));

        q.Add(Stepped("Calculați masa de CuO obținută prin descompunerea a 0,5 mol Cu(OH)₂. M(CuO)=80", new[] {
            Step("Ecuația reacției:", "Cu(OH)2 -> CuO + H2O", "text", 0, 1, ""),
            Step("Numărul de moli de CuO formați:", "0.5", "numeric", 0, 1, "mol"),
            Step("Masa de CuO (m=n*M):", "40", "numeric", 0.1, 3, "g")
        }));

        q.Add(Stepped("Determinarea formulei brute: un compus conține 40% C, 6.66% H și 53.33% O.", new[] {
            Step("Raportul atomic pentru C (40/12):", "3.33", "numeric", 0.01, 1, ""),
            Step("Raportul atomic pentru H (6.66/1):", "6.66", "numeric", 0.01, 1, ""),
            Step("Raportul atomic pentru O (53.33/16):", "3.33", "numeric", 0.01, 1, ""),
            Step("Formula brută (raport minim):", "CH2O", "text", 0, 2, "")
        }));

        q.Add(Stepped("Calculați randamentul reacției dacă din 100 g CaCO₃ s-au obținut practic 44,8 g CaO (M=56).", new[] {
            Step("Numărul de moli de CaCO₃ inițial (M=100):", "1", "numeric", 0, 1, "mol"),
            Step("Masa teoretică de CaO (m=n*M):", "56", "numeric", 0, 1, "g"),
            Step("Randamentul (η = m_p/m_t * 100):", "80", "numeric", 1, 3, "%")
        }));

        q.Add(Stepped("Calculați masa de apă formată prin arderea a 2 moli de hidrogen.", new[] {
            Step("Ecuația reacției:", "2H2 + O2 -> 2H2O", "text", 0, 1, ""),
            Step("Numărul de moli de apă formați (raport 1:1):", "2", "numeric", 0, 1, "mol"),
            Step("Masa de apă (M=18):", "36", "numeric", 0.1, 3, "g")
        }));

        q.Add(Stepped("Calculați masa a 3 moli de aluminiu (A_r=27).", new[] {
            Step("Formula de calcul a masei (m = n * M):", "m = n * M", "text", 0, 2, ""),
            Step("Calculați masa de aluminiu (m = 3 * 27):", "81", "numeric", 0, 3, "g")
        }));

        q.Add(Stepped("Calculați compoziția procentuală a sulfului în H₂SO₄ (M=98, A_r(S)=32).", new[] {
            Step("Masa de sulf într-un mol de acid:", "32", "numeric", 0, 2, "g"),
            Step("Procentul de sulf (32/98 * 100):", "32.65", "numeric", 0.1, 3, "%")
        }));

        q.Add(Stepped("Calculați masa de oxid de calciu (CaO) obținută prin arderea a 10 moli de calciu.", new[] {
            Step("Ecuația reacției de ardere:", "2Ca + O2 -> 2CaO", "text", 0, 1, ""),
            Step("Numărul de moli de CaO format (raport 1:1):", "10", "numeric", 0, 2, "mol"),
            Step("Masa de CaO (M=56 g/mol):", "560", "numeric", 1, 2, "g")
        }));
        return q;
    }



    private static Lesson Lesson(int chapterId, string title, string category, int duration, string description, params LessonSection[] sections)
    {
        for (var i = 0; i < sections.Length; i++)
            sections[i].Order = i + 1;

        return new Lesson
        {
            ChapterId = chapterId,
            Title = title,
            Category = category,
            Difficulty = "intermediate",
            Description = description,
            Duration = duration,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow,
            Sections = sections.ToList()
        };
    }

    private static LessonSection Section(string type, string title, string content, string formula = "") => new()
    {
        Type = type,
        Title = title,
        Content = content,
        Formula = formula
    };

    private static Question Single(string text, string correct, params string[] options) => new()
    {
        Text = text,
        Type = "single",
        Explanation = $"Răspuns corect: {correct}.",
        Points = 1,
        Options = options.Select(option => new QuestionOption { Text = option, IsCorrect = option == correct }).ToList()
    };

    private static Question Multiple(string text, IEnumerable<string> correct, params string[] options)
    {
        var correctSet = correct.ToHashSet();
        return new Question
        {
            Text = text,
            Type = "multiple",
            Explanation = $"Răspunsuri corecte: {string.Join(", ", correctSet)}.",
            Points = 3,
            Options = options.Select(option => new QuestionOption { Text = option, IsCorrect = correctSet.Contains(option) }).ToList()
        };
    }

    private static Question Stepped(string text, IEnumerable<QuestionStep> steps) => new()
    {
        Text = text,
        Type = "stepped",
        Explanation = "Problema se rezolvă prin pași succesivi și verificarea fiecărei etape.",
        Points = steps.Sum(s => s.Points),
        Steps = steps.Select((step, index) =>
        {
            step.Order = index + 1;
            return step;
        }).ToList()
    };

    private static QuestionStep Step(string prompt, string answer, string type, double tolerance, int points, string? unit) => new()
    {
        Prompt = prompt,
        CorrectAnswer = answer,
        StepType = type,
        Tolerance = tolerance,
        Points = points,
        Unit = unit
    };

    private static void ClearDatabase()
    {
        using var userDb = new UserContext();
        using var lessonDb = new LessonContext();
        using var testDb = new TestContext();
        using var resultDb = new ResultContext();
        using var fileDb = new FileContext();

        // Order is important because of Foreign Keys
        resultDb.Results.RemoveRange(resultDb.Results);
        resultDb.SaveChanges();

        testDb.Questions.RemoveRange(testDb.Questions);
        testDb.Tests.RemoveRange(testDb.Tests);
        testDb.SaveChanges();

        lessonDb.LessonSections.RemoveRange(lessonDb.LessonSections);
        lessonDb.Lessons.RemoveRange(lessonDb.Lessons);
        lessonDb.Chapters.RemoveRange(lessonDb.Chapters);
        lessonDb.SaveChanges();

        // Do not delete Admin users to avoid login issues if seeding fails
        var nonAdmins = userDb.Users.Where(u => u.Role != "Admin");
        userDb.Users.RemoveRange(nonAdmins);
        userDb.SaveChanges();
    }
}