import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BaseService } from './base.service';
import { YearFolder, MonthFolder } from '../dto/file-system.dto';
import { FileItemDto } from '../dto/file-item.dto';
import { PayslipDto } from '../dto/payslip.dto';
import { PayrollTemplate } from '../dto/payroll-template.dto';

@Injectable({
    providedIn: 'root'
})
export class FileService extends BaseService {

    constructor(http: HttpClient) {
        super(http);
    }

    getFiles(): Observable<PayslipDto[]> {
        return this.get<PayslipDto[]>('/files/all');
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

    massUpload(files: File[]): Observable<FileItemDto[]> {
        const formData = new FormData();
        files.forEach(file => formData.append('files', file));
        return this.post<FileItemDto[]>('/files/payslips/upload', formData);
    }

    getUserFileTemplate(userId: string): Observable<PayrollTemplate[]> {
        return this.get<PayrollTemplate[]>(`/files/templates/${userId}`);
    }

    generatePayslipsTemplate(file: File): Observable<any> {
        const formData = new FormData();
        formData.append('file', file);

        // Aggiungiamo reportProgress e observe: 'events'
        return this.http.post(`${this.apiUrl}/files/build-template`, formData, {
            reportProgress: true,
            observe: 'events'
        });
    }

    confirmTemplate(data: any): Observable<any> {
        return this.post<any>('/files/confirm-template', data);
    }
}
