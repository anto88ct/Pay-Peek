# PayPeek - Analisi Intelligente Buste Paga

PayPeek è una **PWA mobile-first** per l'analisi automatica delle buste paga tramite IA. Estrae stipendio, ferie, permessi, ROL e contributi da PDF, rileva anomalie e visualizza dashboard con trend e grafici. [file:1]

## 🚀 Architettura Tecnologica

Frontend: Angular 16 PWA + Bootstrap 5 + PrimeNG 20
↓ REST API
Backend: Spring Boot 3.1 + MongoDB + MinIO S3
↓ OCR/NLP
AI Module: Tesseract OCR + Pattern Matching
Storage: MinIO + Redis (OTP cache)
DevOps: Docker Compose → Kubernetes ready

text

**Caratteristiche principali:**
- ✅ Upload multiplo PDF buste paga
- ✅ Estrazione IA campi chiave (95% accuracy)
- ✅ Dashboard KPI + grafici trend 12 mesi
- ✅ Rilevamento anomalie automatiche
- ✅ Multilingua IT/EN + Dark/Light mode
- ✅ PWA installabile + biometrico [file:1]

## 🛠️ Stack Completo

| Componente | Tecnologie Principali |
|------------|----------------------|
| **Frontend** | Angular 16, PrimeNG 20, Bootstrap 5, RxJS, ngx-translate |
| **Backend** | Spring Boot 3.1, MongoDB 7, MinIO S3, JWT+BCrypt |
| **AI/OCR** | Tesseract 5.10, PDFBox, Regex NLP |
| **Sicurezza** | JWT Refresh, OTP Email, Redis Cache |
| **DevOps** | Docker Compose, Cypress E2E, JUnit |
| **Monitoraggio** | Prometheus + Grafana ready [file:1] |

## 🎯 Funzionalità MVP

### 1. **Upload & Elaborazione**
PDF Upload → MinIO → OCR Tesseract → NLP Parsing → MongoDB
Status: pending → processing → completed/error (WebSocket realtime)

text

### 2. **Dashboard Interattiva**
- Filtri mese/anno
- KPI cards (Stipendio, Ferie, Permessi, ROL)
- Grafici: Pie (distribuzione), Line (trend 12 mesi)
- Anomalie alert (rosso/giallo/verde)

### 3. **Sicurezza & UX**
Auth: Email+OTP → Passkey (PIN4) → Biometrico
Temi: Light/Dark/System (CSS Variables)
Lingue: Italiano/English (ngx-translate)
PWA: Installabile, offline-first

text

## 🚀 Setup Rapido (5 min)

Clone & Config
git clone <repo> pay-peek
cd pay-peek
cp .env.example .env # SMTP, JWT_SECRET, MinIO

Docker Compose (tutto incluso)
docker-compose up -d

Accesso
Frontend: http://localhost:4200
Backend API: http://localhost:8080/swagger-ui.html
MongoDB: localhost:27017
MinIO: localhost:9001 (admin/admin)

text

**`.env` essenziale:**
JWT_SECRET=your-super-secret-key-32chars
SMTP_HOST=smtp.gmail.com
SMTP_USERNAME=your-email@gmail.com
SMTP_PASSWORD=your-app-password
MINIO_ACCESS_KEY=minioadmin
MINIO_SECRET_KEY=minioadmin

text

## 📱 Struttura Frontend (Lazy Loading)

src/app/
├── auth/ (login, OTP, biometrico)
├── onboarding/ (setup passkey + profile)
├── dashboard/ (KPI, grafici, anomalie)
├── payslips/ (upload, lista, dettaglio)
├── profile/ (dati personali)
├── settings/ (tema, lingua, sicurezza)
└── shared/ (layout, servizi, modelli)

text

## 🔧 Struttura Backend

pay-peek-backend/
├── controller/ (REST endpoints Swagger)
├── service/ (AIExtractionService, DashboardService)
├── repository/ (MongoDB: users, payslips, anomalies)
├── security/ (JWT, BCrypt, CORS)
├── config/ (MinIO, Redis, SMTP)
└── docker/ (Dockerfile + docker-compose.yml)

text

## 🎨 Design System

**Palette colori:**
Primario: #2C3E50 (blu notte)
Secondario: #18BC9C (verde acqua)
Accenti: #F39C12 (arancio)
Dark: #1F2A38
Light: #F8F9FA

text

**Temi dinamici** via CSS Variables + `data-color-scheme="dark/light"`

## 🧪 Testing & CI/CD

Cypress E2E (frontend)
cypress/e2e/
├── auth.cy.ts
├── upload.cy.ts
├── dashboard.cy.ts

JUnit (backend)
src/test/java/
├── AIExtractionServiceTest.java
├── DashboardServiceTest.java

text

**Pipeline GitHub Actions/Bitbucket:**
build → test → docker build → push → deploy Kubernetes

text

## 🚀 Roadmap Sviluppo

| Fase | Durata | Features |
|------|--------|----------|
| **MVP** | 4 sett. | Upload PDF, OCR base, Dashboard IT |
| **v1.1** | 4 sett. | Dark mode, Anomalie, Export Excel/PDF |
| **v1.2** | 3 sett. | Biometrico, EN lang, WebSocket realtime |
| **v2.0** | 6 sett. | Kubernetes, IA avanzata, Multi-tenant |

## 📚 Risorse Aggiuntive

- [Specifica Tecnica Completa → 100+ pagine][file:1]
- [API Swagger Docs → localhost:8080/swagger-ui.html]
- [Docker Compose → docker-compose.yml]
- [Esempi Service → AIExtractionService.java]
- [Dashboard Grafici → ng2-charts + PrimeNG]

## 🤝 Contributi

Frontend sviluppo
npm install
npm run dev:serve

Backend sviluppo
mvn spring-boot:run

Test completi
npm run test:e2e
mvn test

text

**Issues benvenuti!** ⭐ Star se utile.

---

*PayPeek - La tua intelligenza finanziaria in tasca*  
`Made with ❤️ for Italian workers`
