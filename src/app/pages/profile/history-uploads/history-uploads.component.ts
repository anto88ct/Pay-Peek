import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AdButtonComponent } from '../../../toolbox/ad-button/ad-button.component';
import { FileService } from '../../../core/services/file.service';
import { PayslipDto } from '../../../core/dto/payslip.dto';
import { finalize } from 'rxjs/operators';

interface MonthStatus {
    number: number; // 0-11 or 1-12, let's use 1-12
    name: string;
    hasFile: boolean;
    fileCount: number;
}

interface YearHistory {
    year: number;
    months: MonthStatus[];
}

@Component({
    selector: 'app-history-uploads',
    standalone: true,
    imports: [CommonModule, RouterLink, AdButtonComponent],
    templateUrl: './history-uploads.component.html',
    styleUrls: ['./history-uploads.component.scss']
})
export class HistoryUploadsComponent implements OnInit {
    isLoading = false;
    historyData: YearHistory[] = [];

    readonly monthsNames = [
        'Gennaio', 'Febbraio', 'Marzo', 'Aprile', 'Maggio', 'Giugno',
        'Luglio', 'Agosto', 'Settembre', 'Ottobre', 'Novembre', 'Dicembre'
    ];

    constructor(private fileService: FileService) { }

    ngOnInit(): void {
        this.loadData();
    }

    loadData(): void {
        this.isLoading = true;
        this.fileService.getFiles()
            .pipe(finalize(() => this.isLoading = false))
            .subscribe({
                next: (files: PayslipDto[]) => {
                    this.processFiles(files);
                },
                error: (err) => {
                    console.error('Error fetching files:', err);
                    // Handle error if needed
                }
            });
    }

    private processFiles(files: PayslipDto[]): void {
        const grouped = new Map<number, Set<number>>(); // Year -> Set of Month indices (0-11)

        // Initialize structure if needed or just build it
        files.forEach(file => {
            if (file.extractedData && file.extractedData.periodo) {
                const year = parseInt(file.extractedData.periodo.anno);
                const monthName = file.extractedData.periodo.mese; // Assuming this is the name or we need to parse it? 
                // Based on dto, periodo.mese is string. It might be "Gennaio" or "01". 
                // Let's safe-check or try to parse. 
                // If it comes as string name, we need to map it. 
                // If it comes as number string "01", "1", etc.

                let monthIndex = -1;
                // Try parsing as number
                if (!isNaN(parseInt(monthName))) {
                    monthIndex = parseInt(monthName) - 1;
                } else {
                    // Try matching name (case insensitive)
                    monthIndex = this.monthsNames.findIndex(m => m.toLowerCase() === monthName.toLowerCase());
                }

                if (!isNaN(year) && monthIndex >= 0 && monthIndex < 12) {
                    if (!grouped.has(year)) {
                        grouped.set(year, new Set<number>());
                    }
                    grouped.get(year)?.add(monthIndex);
                }
            }
        });

        // Get all unique years from data, plus maybe current year if not present?
        // User wants to see history. If no files, maybe just show current year.
        let years = Array.from(grouped.keys()).sort((a, b) => b - a);

        // If no years found (empty data), default to current year
        if (years.length === 0) {
            years = [new Date().getFullYear()];
        }

        this.historyData = years.map(year => {
            const activeMonths = grouped.get(year) || new Set<number>();

            const months: MonthStatus[] = this.monthsNames.map((name, index) => ({
                number: index + 1,
                name: name,
                hasFile: activeMonths.has(index),
                fileCount: 0 // We could count them if we want, but boolean is requested "vedi se ... ha caricato"
            }));

            return {
                year,
                months
            };
        });
    }
}
