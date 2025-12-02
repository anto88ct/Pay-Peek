PayPeek - README
PayPeek è una PWA mobile-first per l'analisi intelligente delle buste paga tramite IA. L'applicazione estrae automaticamente dati chiave (stipendio, ferie, permessi, ROL, contributi) da PDF, rileva anomalie e offre dashboard interattive con grafici e trend.​

Architettura
Frontend: Angular 16 PWA + Bootstrap 5 + PrimeNG 20 (tabelle, calendari, charts). Lazy loading, i18n (IT/EN), temi dark/light, layout mobile-first.​

Backend: Spring Boot REST API con JWT, MongoDB per dati, MinIO per storage PDF. Modulo IA dedicato con OCR Tesseract + pattern matching per estrazione dati.​

DevOps: Docker Compose (frontend, backend, MongoDB, MinIO, Redis), CI/CD pronto per Kubernetes. Testing Cypress E2E + JUnit.​

Funzionalità Principali
Upload PDF buste paga con elaborazione asincrona

Estrazione IA stipendio netto/lordo, ferie residue, permessi, ROL, contributi

Dashboard KPI, grafici trend 12 mesi, filtri mese/anno, export PDF/Excel

Anomalie rilevamento automatico (calo stipendio, ferie elevate)

Sicurezza JWT, OTP email, bcrypt, HTTPS, rate limiting

UX multilingua IT/EN, temi dark/light/system, PWA installabile

Stack Tecnologico
Componente	Tecnologie
Frontend	Angular 16, PrimeNG 20, Bootstrap 5, RxJS, ngx-translate
Backend	Spring Boot 3.1, MongoDB, MinIO S3, Tesseract OCR
Sicurezza	JWT, BCrypt, Redis OTP cache
DevOps	Docker Compose, Cypress, JUnit, Prometheus/Grafana ready
Setup Locale (Docker Compose)
bash
git clone <repo>
cd pay-peek
cp .env.example .env  # Configura SMTP, JWT_SECRET, MinIO
docker-compose up -d
# Frontend: http://localhost:4200
# Backend: http://localhost:8080/swagger-ui.html
Roadmap MVP
Fase 1 (4 settimane): Upload PDF, OCR base, dashboard semplice IT/EN

Fase 2 (4 settimane): Dark mode, anomalie, export, grafici avanzati

Fase 3: Onboarding biometrico, modelli IA avanzati, Kubernetes​

Contributo
text
# Frontend
npm install
npm run dev

# Backend  
mvn spring-boot:run
