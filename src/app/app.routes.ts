import { Routes } from '@angular/router';
import { AuthGuard } from "./core/guards/auth.guard";
import { LayoutComponent } from './core/layout/layout/layout.component';

export const routes: Routes = [
    { path: '', redirectTo: '/login', pathMatch: 'full' },
    {
        path: 'login',
        loadComponent: () => import('./pages/auth/login/login.component').then(m => m.LoginComponent)
    },

    {
        path: 'auth/terms',
        loadComponent: () => import('./pages/auth/terms/terms.component').then(m => m.TermsComponent)
    },
    {
        path: 'auth/signup',
        loadComponent: () => import('./pages/auth/signup/signup.component').then(m => m.SignupComponent)
    },
    {
        path: 'auth/reset-password',
        loadComponent: () => import('./shared/components/reset-password/reset-password.component').then(m => m.ResetPasswordComponent)
    },


    {
        path: '',
        component: LayoutComponent,
        canActivate: [AuthGuard],
        children: [
            {
                path: 'dashboard',
                loadComponent: () => import('./pages/dashboard/dashboard.component').then(m => m.DashboardComponent)
            },
            {
                path: 'chatbot',
                loadComponent: () => import('./pages/chatbot/chatbot.component').then(m => m.ChatbotComponent)
            },
            {
                path: 'files',
                loadComponent: () => import('./pages/files/files.component').then(m => m.FilesComponent)
            },
            {
                path: 'profile',
                loadComponent: () => import('./pages/profile/profile.component').then(m => m.ProfileComponent)
            },
            {
                path: 'settings',
                loadComponent: () => import('./pages/settings/settings.component').then(m => m.SettingsComponent)
            }
        ]
    },
    {
        path: 'test-components',
        loadComponent: () => import('./pages/test-components/test-components.component').then(m => m.TestComponentsComponent)
    },
    { path: '**', redirectTo: '/login' }
];
