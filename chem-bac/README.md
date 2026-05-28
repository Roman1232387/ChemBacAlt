# ⚗ ChimieBAC – Platformă de Pregătire Bacalaureat Chimie

Aplicație web educațională full-featured pentru pregătirea examenului de Bacalaureat la Chimie.

---

## 🚀 Instalare și pornire

### Cerințe
- **Node.js** v18+ (recomand v20 LTS)
- **npm** v9+ sau **pnpm** / **yarn**

### Pași

```bash
# 1. Dezarhivați / clonați proiectul
cd chem-bac

# 2. Instalați dependențele
npm install

# 3. Porniți serverul de development
npm run dev
```

Aplicația va rula la: **http://localhost:5173**

---

## 🔑 Conturi demo

| Rol       | Email                     | Parolă      |
|-----------|---------------------------|-------------|
| **Admin** | admin@chimie-bac.ro       | Admin123!   |
| **Elev**  | elev@chimie-bac.ro        | Elev123!    |

---

## 📁 Structura proiectului

```
chem-bac/
├── src/
│   ├── components/
│   │   └── layout/
│   │       ├── Sidebar.tsx       # Navigare laterală cu roluri
│   │       ├── Header.tsx        # Topbar + PublicHeader
│   │       └── Footer.tsx        # Footer global
│   ├── pages/
│   │   ├── LoginPage.tsx         # Autentificare cu validare
│   │   ├── DashboardPage.tsx     # Tablou de bord (rol-aware)
│   │   ├── LessonsPage.tsx       # Listă lecții (search/filter/sort)
│   │   ├── LessonDetailPage.tsx  # Detaliu lecție + formule
│   │   ├── TestsPage.tsx         # Listă teste disponibile
│   │   ├── TakeTestPage.tsx      # Susținere test interactiv
│   │   ├── MyResultsPage.tsx     # Istoricul rezultatelor
│   │   ├── ResultDetailPage.tsx  # Detaliu rezultat + explicații
│   │   ├── admin/
│   │   │   └── AdminTestsPage.tsx  # CRUD complet teste (admin)
│   │   └── errors/
│   │       └── ErrorPages.tsx    # 401, 403, 404, 500
│   ├── layouts/
│   │   └── layouts.tsx           # ProtectedLayout, PublicLayout
│   ├── routes/
│   │   └── guards.tsx            # ProtectedRoute, AdminRoute
│   ├── models/
│   │   ├── User.ts               # AuthUser, UserRole, LoginCredentials
│   │   ├── Lesson.ts             # Lesson, LessonSection
│   │   ├── Question.ts           # Question, QuestionOption, UserAnswer
│   │   ├── Test.ts               # Test, TestFormData, TestStatus
│   │   └── Result.ts             # Result, QuestionResult
│   ├── services/
│   │   ├── AuthService.ts        # login, logout, restoreSession
│   │   ├── LessonService.ts      # getAll, getById, search
│   │   ├── TestService.ts        # CRUD complet (create/read/update/delete)
│   │   └── ResultService.ts      # getByUser, getById, submit
│   ├── context/
│   │   └── AuthContext.tsx       # Context global autentificare
│   ├── hooks/
│   │   ├── useAuth.ts            # Hook custom pentru AuthContext
│   │   └── useLocalStorage.ts    # Hook generic localStorage
│   ├── mock/
│   │   ├── users.ts              # 2 utilizatori (admin + elev)
│   │   ├── lessons.ts            # 5 lecții chimie complete
│   │   ├── tests.ts              # 3 teste cu întrebări reale
│   │   └── results.ts            # 2 rezultate demo
│   ├── App.tsx                   # Router principal
│   ├── main.tsx                  # Entry point React
│   └── index.css                 # Design system global
├── index.html
├── package.json
├── tsconfig.json
└── vite.config.ts
```

---

## 🛠️ Tehnologii utilizate

- **React 18** – UI declarativ, hooks
- **TypeScript** – type safety complet
- **React Router v6** – routing declarativ, nested routes
- **Vite** – build tool modern, HMR instant
- **Context API** – state global autentificare
- **localStorage** – persistarea sesiunii între refresh-uri
- **CSS Variables** – design system consistent fără framework extern

---

## ✅ Funcționalități implementate

### Autentificare
- Login cu validare formular (required, format email, min length)
- Restaurare sesiune automată la refresh (localStorage)
- Logout cu redirect
- Roluri: `admin` și `user`

### Routing & Guards
- `ProtectedRoute` – redirect la `/login` dacă neautentificat
- `AdminRoute` – redirect la `/403` dacă nu ești admin
- Pagini de eroare: 401, 403, 404, 500

### Lecții
- Listă cu **căutare**, **filtrare** (dificultate, categorie), **sortare** (titlu, durată, nivel)
- Detaliu lecție cu secțiuni și formule chimice evidențiate

### Teste (Elev)
- Vizualizare teste disponibile cu filtrare și sortare
- Susținere test interactiv (single choice, multiple choice, adevărat/fals)
- Navigare liberă între întrebări + indicator de progres
- Rezultat instant cu scor, status promovat/nepromovat, explicații per întrebare

### Rezultate
- Istoricul complet al testelor susținute
- Statistici: scor mediu, promovate, nepromovate
- Filtrare (toate / promovate / nepromovate), sortare după dată

### Admin – CRUD Teste
- **Creare** test cu formular controlat + validări
- **Editare** test existent
- **Ștergere** cu modal de confirmare
- Listă cu **search**, **filtru status**, **sortare** multi-câmp
- Toast de succes / eroare

### Services (mock, fără backend)
- Delay simulat per operație (400–900ms)
- 5% șansă de eroare 500 simulată
- CRUD complet in-memory pentru teste

---

## 📝 Scripturi disponibile

```bash
npm run dev      # Server development (http://localhost:5173)
npm run build    # Build producție
npm run preview  # Preview build producție
```
