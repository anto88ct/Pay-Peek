import { ApplicationConfig, importProvidersFrom, isDevMode } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors, HTTP_INTERCEPTORS } from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideServiceWorker } from '@angular/service-worker';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader, TRANSLATE_HTTP_LOADER_CONFIG } from '@ngx-translate/http-loader';
import { ErrorInterceptor } from './core/interceptors/error.interceptor';

import { routes } from './app.routes';
import { authInterceptorFn } from "./core/interceptors/auth-interceptor-fn";
import { loaderInterceptorFn } from "./core/interceptors/loader.interceptor";

// Factory function for TranslateHttpLoader
export function createTranslateLoader() {
    return new TranslateHttpLoader();
}

export const appConfig: ApplicationConfig = {
    providers: [
        provideRouter(routes),
        provideHttpClient(
            withInterceptors([authInterceptorFn, loaderInterceptorFn])
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
        }
    ]
};
