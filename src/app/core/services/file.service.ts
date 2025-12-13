import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BaseService } from './base.service';
import { YearFolder, MonthFolder } from '../dto/file-system.dto';

@Injectable({
    providedIn: 'root'
})
export class FileService extends BaseService {

    constructor(http: HttpClient) {
        super(http);
    }

    getFiles(): Observable<YearFolder[]> {
        return this.get<YearFolder[]>('/files');
    }

    createYearFolder(year: number, color: string): Observable<YearFolder> {
        return this.post<YearFolder>('/files/years', { year, color });
    }

    createMonthFolder(yearId: string, month: number): Observable<MonthFolder> {
        return this.post<MonthFolder>(`/files/years/${yearId}/months`, { month });
    }

    uploadFile(folderId: string, file: File): Observable<any> {
        const formData = new FormData();
        formData.append('file', file);
        return this.post(`/files/folders/${folderId}/upload`, formData);
    }

    uploadPayslips(files: File[]): Observable<any> {
        const formData = new FormData();
        files.forEach(file => formData.append('files', file));
        return this.post('/files/payslips/upload', formData);
    }
}
