# ChemBac - Structură Proiect

## Organizare Fișiere și Foldere

### 📁 `src/`
Directorul principal al codului sursă.

#### 🧩 `components/`
Componente React reutilizabile.

- **`layout/`** - Componente de layout (Header, Footer, Sidebar)
- **`ui/`** - Componente UI de bază (butoane, input-uri, etc.) - viitor

#### 🎯 `pages/`
Pagini ale aplicației (route components).

- **`admin/`** - Pagini pentru administratori
- **`errors/`** - Pagini de eroare (404, 500, etc.)

#### 🔧 `services/`
Logică de business și API calls.

- **`AuthService.ts`** - Autentificare și gestionare utilizatori

#### 📊 `models/`
Modele de date TypeScript (interfețe și tipuri).

- **`User.ts`** - Tipuri pentru utilizatori
- **`Lesson.ts`** - Tipuri pentru lecții
- **`Question.ts`** - Tipuri pentru întrebări
- **`Test.ts`** - Tipuri pentru teste
- **`Result.ts`** - Tipuri pentru rezultate

#### 🎣 `hooks/`
Custom React hooks.

- **`useAuth.ts`** - Hook pentru autentificare
- **`useLocalStorage.ts`** - Hook pentru localStorage

#### 🌐 `context/`
React Context providers.

- **`AuthContext.tsx`** - Context pentru autentificare

#### 🛣️ `routes/`
Configurație de routing.

- **`guards.tsx`** - Route guards (ProtectedRoute, AdminRoute)

#### 📋 `layouts/`
Layout components pentru diferite secțiuni.

- **`layouts.tsx`** - Layout-uri principale (PublicLayout, ProtectedLayout)

#### 🎭 `mock/`
Date mock pentru dezvoltare.

- **`users.ts`** - Utilizatori de test
- **`lessons.ts`** - Lecții de test
- **`tests.ts`** - Teste de test
- **`results.ts`** - Rezultate de test

#### 🛠️ `utils/`
Funcții utilitare.

- **`index.ts`** - Funcții helper (delay, generateInitials, etc.)

#### 📏 `constants/`
Constante ale aplicației.

- **`app.ts`** - Chei de stocare, endpoint-uri, rute

#### 🏷️ `types/`
Tipuri TypeScript comune.

- **`common.ts`** - Tipuri comune (FormState, NavItem, etc.)
- **`index.ts`** - Exporturi centralizate

## Principii de Organizare

### 1. **Separare UI vs Logică**
- **UI (Componente)**: `components/`, `pages/`, `layouts/`
- **Logică**: `services/`, `hooks/`, `context/`, `utils/`
- **Date**: `models/`, `types/`, `constants/`

### 2. **Structură pe Funcționalități**
- Foldere grupate pe domeniu (auth, admin, etc.)
- Componente organizate în sub-foldere logice

### 3. **TypeScript Strict**
- Toate modelele de date au interfețe/types
- Tipuri comune în `types/common.ts`
- Exporturi centralizate în `types/index.ts`

### 4. **Convenții de Nume**
- **Componente**: PascalCase (ex: `LoginPage.tsx`)
- **Fișiere**: camelCase pentru utilitare, PascalCase pentru componente
- **Foldere**: lowercase, descriptive

## Reguli de Import

```typescript
// Tipuri
import type { User, Lesson } from '../types';

// Servicii
import { AuthService } from '../services/AuthService';

// Utilitare
import { delay, generateInitials } from '../utils';

// Constante
import { ROUTES, STORAGE_KEYS } from '../constants/app';
```