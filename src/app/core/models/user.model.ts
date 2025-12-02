// src/app/shared/models/user.model.ts
export interface Preferences {
  language: 'it' | 'en';
  theme: 'light' | 'dark' | 'system';
  emailNotifications: boolean;
}

export interface User {
  id: string;                 // ObjectId MongoDB in stringa
  email: string;
  firstName: string | null;
  lastName: string | null;
  jobType?: string;
  city?: string;
  country?: string;
  profileImageUrl?: string;   // URL immagine profilo
  preferences: Preferences;   // Preferenze lingua, tema, notifiche
  emailVerified: boolean;
  twoFactorEnabled: boolean;
  passKeyEnabled: boolean;    // Se PIN/passKEY è configurato
  biometricEnabled: boolean;  // Se biometria è abilitata
  lastLogin?: Date;
}
