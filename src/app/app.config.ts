import { ApplicationConfig, importProvidersFrom, isDevMode } from '@angular/core';
import { MessageService } from 'primeng/api';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors, withInterceptorsFromDi, HTTP_INTERCEPTORS } from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideServiceWorker } from '@angular/service-worker';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader, TRANSLATE_HTTP_LOADER_CONFIG } from '@ngx-translate/http-loader';
import { ErrorInterceptor } from './core/interceptors/error.interceptor';

import { routes } from './app.routes';
import { tokenInterceptor } from "./core/interceptors/token.interceptor";
import { loaderInterceptorFn } from "./core/interceptors/loader.interceptor";

// Factory function for TranslateHttpLoader
export function createTranslateLoader() {
    return new TranslateHttpLoader();
}

export const appConfig: ApplicationConfig = {
    providers: [
        provideRouter(routes),
        provideHttpClient(
            withInterceptors([tokenInterceptor, loaderInterceptorFn]),
            withInterceptorsFromDi()
        ),
        provideAnimations(),
        provideServiceWorker('ngsw-worker.js', {
            enabled: !isDevMode(),
            registrationStrategy: 'registerWhenStable:30000'
        }),
        // Provide TranslateHttpLoader configuration token
        {
            provide: TRANSLATE_HTTP_LOADER_CONFIG,
            useValue: {
                prefix: './assets/i18n/',
                suffix: '.json'
            }
        },
        importProvidersFrom(
            TranslateModule.forRoot({
                defaultLanguage: 'it',
                loader: {
                    provide: TranslateLoader,
                    useFactory: createTranslateLoader
                }
            })
        ),
        {
            provide: HTTP_INTERCEPTORS,
            useClass: ErrorInterceptor,
            multi: true
        },
        MessageService
    ]
};
