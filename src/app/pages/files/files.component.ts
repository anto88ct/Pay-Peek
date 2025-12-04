import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';

// Toolbox Components
import { AdInputComponent } from '../../toolbox/ad-input/ad-input.component';
import { AdDialogComponent } from '../../toolbox/ad-dialog/ad-dialog.component';
import { AdButtonComponent } from '../../toolbox/ad-button/ad-button.component';
import { AdYearPickerComponent } from '../../toolbox/ad-year-picker/ad-year-picker.component';
import { AdMonthPickerComponent } from '../../toolbox/ad-month-picker/ad-month-picker.component';
import { AdColorPickerComponent } from '../../toolbox/ad-color-picker/ad-color-picker.component';
import { AdFileUploaderComponent } from '../../toolbox/ad-fileuploader/ad-fileuploader.component';

// Models
import { YearFolder, MonthFolder, FileItem } from '../../core/models/file-system.dto';

@Component({
    selector: 'app-files',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        HttpClientModule,
        AdInputComponent,
        AdDialogComponent,
        AdButtonComponent,
        AdYearPickerComponent,
        AdMonthPickerComponent,
        AdColorPickerComponent,
        AdFileUploaderComponent
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

    constructor(private http: HttpClient) { }

    ngOnInit() {
        this.loadData();
    }

    loadData() {
        this.http.get<YearFolder[]>('assets/data/fake-folder-and-files.json')
            .subscribe(data => {
                this.folders = data;
                this.filterFolders();
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

        const newFolder: YearFolder = {
            id: `year-${this.newYearData.year}`,
            year: this.newYearData.year,
            color: this.newYearData.color,
            months: []
        };

        this.folders.push(newFolder);
        this.showYearDialog = false;
        this.filterFolders();
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

        const monthName = new Date(2000, this.newMonthData.month - 1).toLocaleString('default', { month: 'long' });

        const newMonth: MonthFolder = {
            id: `month-${this.selectedYearFolder.year}-${this.newMonthData.month}`,
            month: this.newMonthData.month,
            name: monthName,
            files: []
        };

        this.selectedYearFolder.months.push(newMonth);
        // Sort months
        this.selectedYearFolder.months.sort((a, b) => a.month - b.month);

        this.showMonthDialog = false;
    }

    // File Upload Handlers
    onYearFileSelect(event: any) {
        // event.files contains the selected files
        this.newYearData.file = event.files[0];
    }

    onMonthFileSelect(event: any) {
        this.newMonthData.file = event.files[0];
    }

    // Helpers
    getYearColor(year: number): string {
        const folder = this.folders.find(f => f.year === year);
        return folder ? folder.color : '#18BC9C';
    }
}
