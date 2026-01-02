import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class LoaderService {
    private loadingSubject = new BehaviorSubject<boolean>(false);
    public loading$ = this.loadingSubject.asObservable();
    private requestCount = 0;
    private timeoutId: any;
    private readonly DELAY_MS = 300; // 300ms delay

    show() {
        this.requestCount++;
        if (this.requestCount === 1) {
            this.timeoutId = setTimeout(() => {
                if (this.requestCount > 0) {
                    this.loadingSubject.next(true);
                }
            }, this.DELAY_MS);
        }
    }

    hide() {
        this.requestCount--;
        if (this.requestCount <= 0) {
            this.requestCount = 0;
            if (this.timeoutId) {
                clearTimeout(this.timeoutId);
                this.timeoutId = null;
            }
            this.loadingSubject.next(false);
        }
    }
}
