import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseService } from './base.service';
import { Job } from '../dto/job.dto';
import { City } from '../dto/city.dto';
import { Nationality } from '../dto/nationality.dto';

@Injectable({
    providedIn: 'root'
})
export class LookupService extends BaseService {

    getJobs(): Observable<Job[]> {
        return this.get<Job[]>('/support/jobs');
    }

    getCities(): Observable<City[]> {
        return this.get<City[]>('/support/cities');
    }

    getNationalities(): Observable<Nationality[]> {
        return this.get<Nationality[]>('/support/nationalities');
    }

}
