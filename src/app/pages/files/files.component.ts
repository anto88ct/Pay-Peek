import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FileService } from '../../core/services/file.service';
import { HttpEventType } from '@angular/common/http';

// Toolbox Components
import { AdInputComponent } from '../../toolbox/ad-input/ad-input.component';
import { AdDialogComponent } from '../../toolbox/ad-dialog/ad-dialog.component';
import { AdButtonComponent } from '../../toolbox/ad-button/ad-button.component';
import { AdYearPickerComponent } from '../../toolbox/ad-year-picker/ad-year-picker.component';
import { AdMonthPickerComponent } from '../../toolbox/ad-month-picker/ad-month-picker.component';
import { AdColorPickerComponent } from '../../toolbox/ad-color-picker/ad-color-picker.component';
import { AdFileUploaderComponent } from '../../toolbox/ad-fileuploader/ad-fileuploader.component';
import { AdCardComponent } from '../../toolbox/ad-card/ad-card.component';
import { UserFileTemplateComponent } from './user-file-template/user-file-template.component';

// Models
import { YearFolder, MonthFolder, FileItem } from '../../core/dto/file-system.dto';
import { NotificationService } from 'src/app/core/services/notification.service';
import { FileItemDto } from 'src/app/core/dto/file-item.dto';
import { PayrollTemplate } from 'src/app/core/dto/payroll-template.dto';
import { PayslipDto } from 'src/app/core/dto/payslip.dto';

@Component({
    selector: 'app-files',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,

        AdInputComponent,
        AdDialogComponent,
        AdButtonComponent,
        AdYearPickerComponent,
        AdMonthPickerComponent,
        AdColorPickerComponent,
        AdFileUploaderComponent,
        AdCardComponent,
        UserFileTemplateComponent
    ],
    templateUrl: './files.component.html',
    styleUrls: ['./files.component.scss']
})
export class FilesComponent implements OnInit {
    // Data
    folders: YearFolder[] = [];
    filteredFolders: YearFolder[] = [];

    // Navigation State
    currentView: 'root' | 'year' = 'root';
    selectedYearFolder: YearFolder | null = null;

    // Search
    searchQuery: string = '';

    // Dialogs State
    showYearDialog: boolean = false;
    showMonthDialog: boolean = false;
    showChoiceDialog: boolean = false;
    showUploadDialog: boolean = false;
    showTemplateFormDialog: boolean = false;

    // Upload Mode
    uploadMode: 'mass' | 'template' = 'mass';

    // Forms Data
    newYearData = {
        year: new Date().getFullYear(),
        color: '#18BC9C',
        file: null
    };

    newMonthData = {
        month: new Date().getMonth() + 1,
        file: null
    };

    // Template Form Data
    templateFormData: any = {};

    // Template State
    templateExists: boolean = false;
    isUploadingTemplate: boolean = false;
    uploadProgress: number = 0;

    // Payslip Upload State
    payslipFiles: File[] = [];

    constructor(private fileService: FileService, private notificationService: NotificationService,) { }

    ngOnInit() {
        this.loadData();
    }

    readonly MONTH_NAMES = [
        '', 'Gennaio', 'Febbraio', 'Marzo', 'Aprile', 'Maggio', 'Giugno',
        'Luglio', 'Agosto', 'Settembre', 'Ottobre', 'Novembre', 'Dicembre'
    ];

    readonly YEAR_COLORS = [
        '#18BC9C', '#3498DB', '#9B59B6', '#F39C12', '#E74C3C', '#34495E'
    ];

    loadData() {
        this.fileService.getFiles()
            .subscribe({
                next: (data) => {
                    console.log("LOADED DATA", data);

                    this.processPayslips(data);
                    this.filterFolders();
                },
                error: (err) => console.error('Error loading files', err)
            });
    }

    processPayslips(payslips: PayslipDto[]) {
        const yearMap = new Map<number, YearFolder>();

        payslips.forEach(payslip => {
            // Extract Year
            let year = 0;
            const extractYear = payslip.extractedData?.periodo?.anno;
            if (extractYear) {
                const cleanYear = extractYear.toString().replace(/\D/g, '');
                if (cleanYear.length === 4) {
                    year = parseInt(cleanYear, 10);
                } else if (cleanYear.length === 2) {
                    year = 2000 + parseInt(cleanYear, 10);
                }
            }

            if (!year && payslip.createdAt) {
                year = new Date(payslip.createdAt).getFullYear();
            }

            if (!year) year = new Date().getFullYear();

            // Extract Month
            let month = 0;
            const extractMonth = payslip.extractedData?.periodo?.mese;
            if (extractMonth) {
                month = this.parseMonth(extractMonth);
            }

            if (!month && payslip.createdAt) {
                month = new Date(payslip.createdAt).getMonth() + 1;
            }
            if (!month) month = 1;

            // Get or Create Year Folder
            let yearFolder = yearMap.get(year);
            if (!yearFolder) {
                yearFolder = {
                    id: year.toString(),
                    year: year,
                    color: this.YEAR_COLORS[year % this.YEAR_COLORS.length],
                    months: []
                };
                yearMap.set(year, yearFolder);
            }

            // Get or Create Month Folder
            let monthFolder = yearFolder.months.find(m => m.month === month);
            if (!monthFolder) {
                monthFolder = {
                    id: `${year}-${month}`,
                    month: month,
                    name: this.MONTH_NAMES[month] || 'Unknown',
                    files: []
                };
                yearFolder.months.push(monthFolder);
            }

            // Create File Item
            const fileItem: FileItem = {
                id: payslip.id || `temp-${Math.random()}`,
                name: payslip.fileName || `Busta Paga ${this.MONTH_NAMES[month]} ${year}`,
                url: '',
                type: 'pdf',
                size: 0,
                uploadDate: payslip.createdAt || new Date().toISOString()
            };

            // Avoid duplicates in month folder
            if (!monthFolder.files.some(f => f.id === fileItem.id)) {
                monthFolder.files.push(fileItem);
            }
        });

        // Convert Map to Array and Sort
        this.folders = Array.from(yearMap.values()).sort((a, b) => b.year - a.year);

        this.folders.forEach(f => {
            f.months.sort((a, b) => a.month - b.month);
        });
    }

    parseMonth(monthStr: string): number {
        if (!monthStr) return 0;
        const normalized = monthStr.toString().trim().toLowerCase();

        const numeric = parseInt(normalized);
        if (!isNaN(numeric) && numeric >= 1 && numeric <= 12) {
            return numeric;
        }

        if (normalized.includes('gen')) return 1;
        if (normalized.includes('feb')) return 2;
        if (normalized.includes('mar')) return 3;
        if (normalized.includes('apr')) return 4;
        if (normalized.includes('mag')) return 5;
        if (normalized.includes('giu')) return 6;
        if (normalized.includes('lug')) return 7;
        if (normalized.includes('ago')) return 8;
        if (normalized.includes('set')) return 9;
        if (normalized.includes('ott')) return 10;
        if (normalized.includes('nov')) return 11;
        if (normalized.includes('dic')) return 12;

        if (normalized.includes('jan')) return 1;
        if (normalized.includes('feb')) return 2;
        if (normalized.includes('mar')) return 3;
        if (normalized.includes('apr')) return 4;
        if (normalized.includes('may')) return 5;
        if (normalized.includes('june')) return 6;
        if (normalized.includes('july')) return 7;
        if (normalized.includes('aug')) return 8;
        if (normalized.includes('sept')) return 9;
        if (normalized.includes('oct')) return 10;
        if (normalized.includes('nov')) return 11;
        if (normalized.includes('dec')) return 12;

        return 0;
    }

    // Template Status Handler
    onTemplateStatusChange(status: boolean) {
        this.templateExists = status;
    }

    onViewDetails(data: any) {
        console.log(data);

        this.templateFormData = data;
        this.showTemplateFormDialog = true;
    }

    // Navigation
    openYearFolder(folder: YearFolder) {
        this.selectedYearFolder = folder;
        this.currentView = 'year';
        this.searchQuery = ''; // Reset search when entering folder
        this.filterFolders();
    }

    goBackToRoot() {
        this.selectedYearFolder = null;
        this.currentView = 'root';
        this.searchQuery = '';
        this.filterFolders();
    }

    // Search
    onSearch(query: string) {
        this.searchQuery = query;
        this.filterFolders();
    }

    filterFolders() {
        if (!this.searchQuery) {
            this.filteredFolders = this.folders;
            return;
        }

        const query = this.searchQuery.toLowerCase();

        if (this.currentView === 'root') {
            // Filter Years
            this.filteredFolders = this.folders.filter(f =>
                f.year.toString().includes(query) ||
                f.months.some(m => m.files.some(file => file.name.toLowerCase().includes(query)))
            );
        }
    }

    get displayedMonths(): MonthFolder[] {
        if (!this.selectedYearFolder) return [];
        if (!this.searchQuery) return this.selectedYearFolder.months;

        const query = this.searchQuery.toLowerCase();
        return this.selectedYearFolder.months.filter(m =>
            m.name.toLowerCase().includes(query) ||
            m.files.some(f => f.name.toLowerCase().includes(query))
        );
    }

    // Choice Dialog
    openCreateChoiceDialog() {
        this.showChoiceDialog = true;
    }

    selectCreateFolder() {
        this.showChoiceDialog = false;
        this.openCreateYearDialog();
    }

    selectUploadDocuments() {
        if (!this.templateExists) {
            this.notificationService.showError('Devi caricare prima il template!');
            // Optional: Redirect to template upload or highlight it
            return;
        }
        this.uploadMode = 'mass';
        this.showChoiceDialog = false;
        this.showUploadDialog = true;
    }

    selectCreateTemplate() {
        this.uploadMode = 'template';
        this.showChoiceDialog = false;
        this.showUploadDialog = true;
    }

    // Creation - Year
    openCreateYearDialog() {
        this.newYearData = {
            year: new Date().getFullYear(),
            color: '#18BC9C',
            file: null
        };
        this.showYearDialog = true;
    }

    createYear() {
        if (this.folders.some(f => f.year === this.newYearData.year)) {
            alert('Year folder already exists!');
            return;
        }

        this.fileService.createYearFolder(this.newYearData.year, this.newYearData.color)
            .subscribe({
                next: (newFolder) => {
                    this.folders.push(newFolder);
                    this.showYearDialog = false;
                    this.filterFolders();
                },
                error: (err) => this.notificationService.showError(err)
            });
    }

    // Creation - Month
    openCreateMonthDialog() {
        this.newMonthData = {
            month: new Date().getMonth() + 1,
            file: null
        };
        this.showMonthDialog = true;
    }

    createMonth() {
        if (!this.selectedYearFolder) return;

        if (this.selectedYearFolder.months.some(m => m.month === this.newMonthData.month)) {
            alert('Month folder already exists in this year!');
            return;
        }

        this.fileService.createMonthFolder(this.selectedYearFolder.id, this.newMonthData.month)
            .subscribe({
                next: (newMonth) => {
                    if (this.selectedYearFolder) {
                        this.selectedYearFolder.months.push(newMonth);
                        this.selectedYearFolder.months.sort((a, b) => a.month - b.month);
                    }
                    this.showMonthDialog = false;
                },
                error: (err) => this.notificationService.showError(err)
            });
    }

    // File Upload Handlers
    onYearFileSelect(event: any) {
        // event.files contains the selected files
        this.newYearData.file = event.files[0];
    }

    onMonthFileSelect(event: any) {
        this.newMonthData.file = event.files[0];
    }

    // Payslip Bulk Upload
    triggerPayslipInput() {
        const fileInput = document.getElementById('payslipInput') as HTMLInputElement;
        if (fileInput) {
            fileInput.click();
        }
    }

    onPayslipsSelected(event: any) {
        const files = event.target.files;
        if (files) {
            this.processFiles(files);
        }
        event.target.value = '';
    }

    onFileDrop(event: DragEvent) {
        event.preventDefault();
        event.stopPropagation();
        const files = event.dataTransfer?.files;

        if (files && files.length > 0) {
            this.processFiles(files);
        }
    }

    onDragOver(event: DragEvent) {
        event.preventDefault();
        event.stopPropagation();
    }

    processFiles(files: FileList) {
        // Enforce single file restriction for template mode
        if (this.uploadMode === 'template') {
            if (this.payslipFiles.length > 0) {
                this.notificationService.showError('Puoi caricare solo un file per il template.');
                return;
            }
            if (files.length > 1) {
                this.notificationService.showError('Seleziona un solo file PDF per il template.');
                // Take only the first one
                if (files[0].type === 'application/pdf') {
                    this.payslipFiles = [files[0]];
                }
                return;
            }
        }

        for (let i = 0; i < files.length; i++) {
            if (files[i].type === 'application/pdf') {
                if (this.uploadMode === 'template' && this.payslipFiles.length > 0) {
                    continue; // Already have one
                }
                this.payslipFiles.push(files[i]);
            }
        }
        // Do not close dialog immediately to allow preview
    }

    removeFile(index: number) {
        this.payslipFiles.splice(index, 1);
    }

    confirmUpload() {
        if (this.payslipFiles.length === 0) return;

        if (this.uploadMode === 'mass') {
            this.fileService.massUpload(this.payslipFiles).subscribe({
                next: (results: PayslipDto[]) => {
                    let hasErrors = false;

                    results.forEach(res => {
                        // Controllo se il singolo file ha errori di estrazione
                        if (res.extractionErrors && res.extractionErrors.length > 0) {
                            hasErrors = true;
                            res.extractionErrors.forEach(err => {
                                // Qui 'err' è un ErrorResponseDto che ha la proprietà .message
                                // La tua funzione showError la prenderà correttamente
                                this.notificationService.showError(err, 'Errore File');
                            });
                        }
                    });

                    if (!hasErrors) {
                        this.notificationService.showSuccess('Tutti i file sono stati elaborati correttamente');
                    }

                    this.payslipFiles = [];
                    this.showUploadDialog = false;
                    this.loadData();
                },
                error: (err: any) => {
                    // Errore generico di rete o crash del server
                    this.notificationService.showError(err, 'Errore Server');
                }
            });
        } else if (this.uploadMode === 'template') {
            // For template, we only take the first file
            const file = this.payslipFiles[0];

            this.isUploadingTemplate = true;
            this.uploadProgress = 0;
            this.showUploadDialog = false; // Hide upload dialog, show progress

            this.fileService.generatePayslipsTemplate(file).subscribe({
                next: (event: any) => {
                    if (event.type === HttpEventType.UploadProgress) {
                        this.uploadProgress = Math.round(100 * event.loaded / event.total);
                    } else if (event.type === HttpEventType.Response) {
                        this.isUploadingTemplate = false;
                        this.templateFormData = event.body;
                        this.payslipFiles = [];
                        this.showTemplateFormDialog = true;

                        // Signal template component to refresh? 
                        // Actually, we haven't saved it yet, we just built it. 
                        // Saving happens in confirmTemplateCreation.
                    }
                },
                error: (err: any) => {
                    this.isUploadingTemplate = false;
                    this.showUploadDialog = true; // Re-open on error?
                    this.notificationService.showError(err);
                }
            });
        }
    }

    @ViewChild(UserFileTemplateComponent) templateComponent!: UserFileTemplateComponent;

    // ...

    confirmTemplateCreation() {
        this.fileService.confirmTemplate(this.templateFormData).subscribe({
            next: (response) => {
                this.showTemplateFormDialog = false;
                this.notificationService.showSuccess('Template e Busta Paga salvati correttamente nel sistema');
                this.templateFormData = {};
                this.templateExists = true; // Update local state immediately
                this.loadData();
                if (this.templateComponent) {
                    this.templateComponent.refreshStatus();
                }
            },
            error: (err) => { this.notificationService.showError(err) }
        });
    }

    cancelPayslipUpload() {
        this.payslipFiles = [];
        this.showUploadDialog = false;
    }

    // Helpers
    getYearColor(year: number): string {
        const folder = this.folders.find(f => f.year === year);
        return folder ? folder.color : '#18BC9C';
    }
}
