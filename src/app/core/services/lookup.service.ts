import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { shareReplay, map } from 'rxjs/operators';
import { environment } from 'src/enviroments/enviroment';
import { BaseService } from './base.service';
import { Job } from '../dto/job.dto';
import { City } from '../dto/city.dto';
import { Nationality } from '../dto/nationality.dto';

@Injectable({
    providedIn: 'root'
})
export class LookupService extends BaseService {

    private jobsCache$: Observable<Job[]> | null = null;
    private citiesCache$: Observable<City[]> | null = null;
    private nationalitiesCache$: Observable<Nationality[]> | null = null;

    getJobs(): Observable<Job[]> {
        if (!this.jobsCache$) {
            // For now using mock data as backend might not be ready
            // But structured as observable for easy switch
            const mockJobs: Job[] = [
                { descrizione: 'Sviluppatore backend' },
                { descrizione: 'Sviluppatore frontend' },
                { descrizione: 'Designer' },
                { descrizione: 'Project Manager' },
                { descrizione: 'Studente' },
                { descrizione: 'Impiegato' },
                { descrizione: 'Libero professionista' }
            ];

            // REAL CALL: this.http.get<Job[]>(`${this.apiUrl}/jobs`).pipe(shareReplay(1));
            this.jobsCache$ = of(mockJobs).pipe(shareReplay(1));
        }
        return this.jobsCache$;
    }

    getCities(): Observable<City[]> {
        if (!this.citiesCache$) {
            const mockCities: City[] = [
                { codice: 'AG', descrizione: 'Agrigento' },
                { codice: 'MI', descrizione: 'Milano' },
                { codice: 'RM', descrizione: 'Roma' },
                { codice: 'NA', descrizione: 'Napoli' },
                { codice: 'TO', descrizione: 'Torino' },
                { codice: 'CT', descrizione: 'Catania' }
            ];
            // REAL CALL: this.http.get<City[]>(`${this.apiUrl}/cities`).pipe(shareReplay(1));
            this.citiesCache$ = of(mockCities).pipe(shareReplay(1));
        }
        return this.citiesCache$;
    }

    getNationalities(): Observable<Nationality[]> {
        if (!this.nationalitiesCache$) {
            const mockNationalities: Nationality[] = [
                { codice: 'IT', descrizione: 'Italiana' },
                { codice: 'FR', descrizione: 'Francese' },
                { codice: 'DE', descrizione: 'Tedesca' },
                { codice: 'UK', descrizione: 'Inglese' },
                { codice: 'ES', descrizione: 'Spagnola' }
            ];
            // REAL CALL: this.http.get<Nationality[]>(`${this.apiUrl}/nationalities`).pipe(shareReplay(1));
            this.nationalitiesCache$ = of(mockNationalities).pipe(shareReplay(1));
        }
        return this.nationalitiesCache$;
    }

}
