import { Injectable } from '@angular/core';
import {
    HttpRequest,
    HttpHandler,
    HttpEvent,
    HttpInterceptor,
    HttpHandlerFn,
    HttpInterceptorFn
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { LoaderService } from '../services/loader.service';
import { inject } from '@angular/core';

@Injectable()
export class LoaderInterceptor implements HttpInterceptor {

    constructor(private loaderService: LoaderService) { }

    intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
        if (request.headers.has('X-Skip-Loader')) {
            const newReq = request.clone({ headers: request.headers.delete('X-Skip-Loader') });
            return next.handle(newReq);
        }

        this.loaderService.show();

        return next.handle(request).pipe(
            finalize(() => this.loaderService.hide())
        );
    }
}

// Functional interceptor for use with provideHttpClient(withInterceptors([...]))
export const loaderInterceptorFn: HttpInterceptorFn = (req: HttpRequest<unknown>, next: HttpHandlerFn) => {
    const loaderService = inject(LoaderService);

    if (req.headers.has('X-Skip-Loader')) {
        const newReq = req.clone({ headers: req.headers.delete('X-Skip-Loader') });
        return next(newReq);
    }

    loaderService.show();
    return next(req).pipe(
        finalize(() => loaderService.hide())
    );
};
