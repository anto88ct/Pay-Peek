import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FileService } from '../../core/services/file.service';

// Toolbox Components
import { AdInputComponent } from '../../toolbox/ad-input/ad-input.component';
import { AdDialogComponent } from '../../toolbox/ad-dialog/ad-dialog.component';
import { AdButtonComponent } from '../../toolbox/ad-button/ad-button.component';
import { AdYearPickerComponent } from '../../toolbox/ad-year-picker/ad-year-picker.component';
import { AdMonthPickerComponent } from '../../toolbox/ad-month-picker/ad-month-picker.component';
import { AdColorPickerComponent } from '../../toolbox/ad-color-picker/ad-color-picker.component';
import { AdFileUploaderComponent } from '../../toolbox/ad-fileuploader/ad-fileuploader.component';
import { AdCardComponent } from '../../toolbox/ad-card/ad-card.component';

// Models
import { YearFolder, MonthFolder, FileItem } from '../../core/dto/file-system.dto';

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
        AdCardComponent
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

    // Payslip Upload State
    payslipFiles: File[] = [];

    constructor(private fileService: FileService) { }

    ngOnInit() {
        this.loadData();
    }

    loadData() {
        this.fileService.getFiles()
            .subscribe({
                next: (data) => {
                    this.folders = data;
                    this.filterFolders();
                },
                error: (err) => console.error('Error loading files', err)
            });
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
                error: (err) => alert('Error creating year folder')
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
                error: (err) => alert('Error creating month folder')
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
            for (let i = 0; i < files.length; i++) {
                if (files[i].type === 'application/pdf') {
                    this.payslipFiles.push(files[i]);
                }
            }
        }
        // Reset input value to allow selecting same files again if needed
        event.target.value = '';
    }

    uploadPayslips() {
        console.log('Uploading files:', this.payslipFiles);
        this.fileService.uploadPayslips(this.payslipFiles).subscribe({
            next: () => {
                this.payslipFiles = [];
                alert('Payslips uploaded successfully');
            },
            error: (err) => console.error('Upload failed', err)
        });
    }

    cancelPayslipUpload() {
        this.payslipFiles = [];
    }

    // Helpers
    getYearColor(year: number): string {
        const folder = this.folders.find(f => f.year === year);
        return folder ? folder.color : '#18BC9C';
    }
}
