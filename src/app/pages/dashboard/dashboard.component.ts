import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { ChartModule } from 'primeng/chart';
import { HttpClient } from '@angular/common/http';
import { AdDropdownComponent } from '../../toolbox/ad-dropdown/ad-dropdown.component';
import { AdCardComponent } from '../../toolbox/ad-card/ad-card.component';
import { AdButtonComponent } from '../../toolbox/ad-button/ad-button.component';
import { AdDialogComponent } from '../../toolbox/ad-dialog/ad-dialog.component';
import { AdChiplistComponent } from '../../toolbox/ad-chiplist/ad-chiplist.component';
import { FormsModule } from '@angular/forms';
import { ThemeService } from '../../core/services/theme.service';
import { TranslateService } from '@ngx-translate/core';
import { FileService } from '../../core/services/file.service';
import { PayslipDto } from '../../core/dto/payslip.dto';
import { firstValueFrom } from 'rxjs';

@Component({
    selector: 'app-dashboard',
    standalone: true,
    imports: [
        CommonModule,
        TranslateModule,
        ChartModule,
        AdDropdownComponent,
        AdCardComponent,
        AdButtonComponent,
        AdDialogComponent,
        AdChiplistComponent,
        FormsModule
    ],
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

    salaryData: any;
    salaryOptions: any;

    expensesData: any;
    expensesOptions: any;

    holidaysData: any;
    holidaysOptions: any;

    years: any[] = [];
    selectedYear: any;

    // Dashboard Creation
    isNewDashboardDialogVisible: boolean = false;
    dashboardCreationStep: number = 1;
    selectedChartType: any = null;
    selectedDataItems: any[] = [];

    chartTypes = [
        { type: 'bar', labelKey: 'DASHBOARD.CHART_TYPES.BAR', icon: 'assets/images/charts/bar-placeholder.png' },
        { type: 'line', labelKey: 'DASHBOARD.CHART_TYPES.LINE', icon: 'assets/images/charts/line-placeholder.png' },
        { type: 'pie', labelKey: 'DASHBOARD.CHART_TYPES.PIE', icon: 'assets/images/charts/pie-placeholder.png' },
        { type: 'doughnut', labelKey: 'DASHBOARD.CHART_TYPES.DOUGHNUT', icon: 'assets/images/charts/doughnut-placeholder.png' }
    ];

    dataItems: any[] = [];
    allPayslips: PayslipDto[] = [];

    constructor(
        private http: HttpClient,
        private themeService: ThemeService,
        private translate: TranslateService,
        private fileService: FileService
    ) { }

    ngOnInit(): void {
        this.initFilters();
        this.initChartOptions();
        this.loadDashboardData();

        // Subscribe to theme changes to update charts
        this.themeService.theme$.subscribe(() => {
            this.initChartOptions();
        });

        this.initDataItems();
        this.translate.onLangChange.subscribe(() => {
            this.initDataItems();
        });
    }

    initDataItems() {
        this.translate.get([
            'DASHBOARD.DATA_ITEMS.SALARY',
            'DASHBOARD.DATA_ITEMS.HOLIDAYS',
            'DASHBOARD.DATA_ITEMS.PERMISSIONS',
            'DASHBOARD.DATA_ITEMS.THIRTEENTH',
            'DASHBOARD.DATA_ITEMS.FOURTEENTH'
        ]).subscribe(translations => {
            this.dataItems = [
                { label: translations['DASHBOARD.DATA_ITEMS.SALARY'], value: 'salary' },
                { label: translations['DASHBOARD.DATA_ITEMS.HOLIDAYS'], value: 'holidays' },
                { label: translations['DASHBOARD.DATA_ITEMS.PERMISSIONS'], value: 'permissions' },
                { label: translations['DASHBOARD.DATA_ITEMS.THIRTEENTH'], value: '13th' },
                { label: translations['DASHBOARD.DATA_ITEMS.FOURTEENTH'], value: '14th' }
            ];
        });
    }

    openNewDashboardDialog() {
        this.isNewDashboardDialogVisible = true;
        this.dashboardCreationStep = 1;
        this.selectedChartType = null;
        this.selectedDataItems = [];
    }

    selectChartType(type: any) {
        this.selectedChartType = type;
        this.dashboardCreationStep = 2;
    }

    confirmCreation() {
        // Logic to create the new chart would go here
        this.isNewDashboardDialogVisible = false;
    }

    cancelCreation() {
        this.isNewDashboardDialogVisible = false;
    }

    initFilters() {
        const currentYear = new Date().getFullYear();
        this.years = [
            { label: currentYear.toString(), value: currentYear },
            { label: (currentYear - 1).toString(), value: currentYear - 1 },
            { label: (currentYear - 2).toString(), value: currentYear - 2 }
        ];
        this.selectedYear = this.years[0].value;
    }

    onYearChange(event: any) {
        // Handle dropdown change logic if needed, usually ngModel handles the value update
        // but we need to re-process data when year changes
        this.processData();
    }

    async loadDashboardData() {
        try {
            this.allPayslips = await firstValueFrom(this.fileService.getFiles());
            console.log(this.allPayslips);

            this.processData();
        } catch (error) {
            console.error('Error loading dashboard data', error);
            // Fallback or empty state could be handled here
        }
    }

    processData() {
        if (!this.allPayslips) return;

        const selectedYearVal = this.selectedYear;
        const yearPayslips = this.allPayslips.filter(p => {
            // Assuming extractedData.periodo.anno is "2025" or similar string
            return parseInt(p.extractedData.periodo.anno) === selectedYearVal;
        });


        // Sort by month (assuming mese is string 1..12 or local name, need robust parsing if it's "Gennaio")
        // NOTE: The DTO says 'mese' is string. Often it's a Name. We need a mapper.
        // If the backend returns "01", "02" etc it is easier. If "Gennaio", we need a map.
        // Assuming numerical or standard IT names for now.
        // Let's try to map typical Italian month names or just parse int.

        yearPayslips.sort((a, b) => {
            const monthA = this.parseMonth(a.extractedData.periodo.mese);
            const monthB = this.parseMonth(b.extractedData.periodo.mese);
            return monthA - monthB;
        });


        this.updateSalaryTrend(yearPayslips);
        this.updateIncomeAnalysis(yearPayslips); // Replaces Expenses
        this.updateHolidays(yearPayslips);
    }

    parseMonth(monthStr: string): number {
        if (!monthStr) return 0;
        const m = monthStr.toLowerCase().trim();
        if (!isNaN(parseInt(m))) return parseInt(m);

        const monts = ['gennaio', 'febbraio', 'marzo', 'aprile', 'maggio', 'giugno',
            'luglio', 'agosto', 'settembre', 'ottobre', 'novembre', 'dicembre'];
        const idx = monts.indexOf(m);
        return idx >= 0 ? idx + 1 : 0;
    }

    parseCurrency(val: string | number): number {
        if (typeof val === 'number') return val;
        if (!val) return 0;
        // Italian format: 1.234,56 -> replace . with nothing, replace , with .
        let clean = val.replace(/\./g, '').replace(',', '.');
        // clean non-numeric except . and -
        clean = clean.replace(/[^0-9.-]/g, '');
        return parseFloat(clean);
    }

    updateSalaryTrend(payslips: PayslipDto[]) {
        const labels = payslips.map(p => p.extractedData.periodo.mese);
        const data = payslips.map(p => p.extractedData.totali.netto_a_pagare);

        console.log(labels);
        console.log(data);

        const dataset = {
            label: 'Net Salary',
            data: data,
            fill: false,
            borderColor: '#4bc0c0',
            tension: 0.4
        };

        this.salaryData = {
            labels: labels,
            datasets: [dataset]
        };
    }

    updateIncomeAnalysis(payslips: PayslipDto[]) {
        // Aggregate all "competenza" vs "trattenuta" from all payslips of the year?
        // Or maybe just average? Usually dashboard shows totals for the year.
        let totalCompetenze = 0;
        let totalTrattenute = 0;

        payslips.forEach(p => {
            // Summing from corpo_busta
            if (p.extractedData.corpo_busta) {
                p.extractedData.corpo_busta.forEach(item => {
                    totalCompetenze += this.parseCurrency(item.competenza);
                    totalTrattenute += this.parseCurrency(item.trattenuta);
                });
            }
        });

        this.expensesData = {
            labels: ['Competenze', 'Trattenute'],
            datasets: [
                {
                    data: [totalCompetenze, totalTrattenute],
                    backgroundColor: [
                        "#4CAF50", // Green
                        "#FF5252"  // Red
                    ],
                    hoverBackgroundColor: [
                        "#66BB6A",
                        "#FF8A80"
                    ]
                }
            ]
        };
    }

    updateHolidays(payslips: PayslipDto[]) {
        // Get the LATEST payslip to see current balance
        if (payslips.length === 0) {
            this.holidaysData = { labels: [], datasets: [] };
            return;
        }

        const latest = payslips[payslips.length - 1]; // Sorted by month already

        // Ferie
        const ferieMaturato = this.parseCurrency(latest.extractedData.contatori_ratei.ferie.maturato);
        const ferieGoduto = this.parseCurrency(latest.extractedData.contatori_ratei.ferie.goduto);

        // Permessi
        const permMaturato = this.parseCurrency(latest.extractedData.contatori_ratei.permessi_rol.maturato);
        const permGoduto = this.parseCurrency(latest.extractedData.contatori_ratei.permessi_rol.goduto);

        this.holidaysData = {
            labels: ['Ferie', 'Permessi'],
            datasets: [
                {
                    label: 'Maturate',
                    backgroundColor: '#42A5F5',
                    data: [ferieMaturato, permMaturato]
                },
                {
                    label: 'Godute',
                    backgroundColor: '#FFA726',
                    data: [ferieGoduto, permGoduto]
                }
            ]
        };
    }

    initChartOptions() {
        const documentStyle = getComputedStyle(document.documentElement);
        const textColor = documentStyle.getPropertyValue('--text-color');
        const textColorSecondary = documentStyle.getPropertyValue('--text-color-secondary');
        const surfaceBorder = documentStyle.getPropertyValue('--surface-border');

        this.salaryOptions = {
            maintainAspectRatio: false,
            aspectRatio: 0.6,
            plugins: {
                legend: {
                    labels: {
                        color: textColor
                    }
                }
            },
            scales: {
                x: {
                    ticks: {
                        color: textColorSecondary
                    },
                    grid: {
                        color: surfaceBorder,
                        drawBorder: false
                    }
                },
                y: {
                    ticks: {
                        color: textColorSecondary
                    },
                    grid: {
                        color: surfaceBorder,
                        drawBorder: false
                    }
                }
            }
        };

        this.expensesOptions = {
            plugins: {
                legend: {
                    labels: {
                        usePointStyle: true,
                        color: textColor
                    }
                }
            }
        };

        this.holidaysOptions = {
            maintainAspectRatio: false,
            aspectRatio: 0.8,
            plugins: {
                legend: {
                    labels: {
                        color: textColor
                    }
                }
            },
            scales: {
                x: {
                    ticks: {
                        color: textColorSecondary,
                        font: {
                            weight: 500
                        }
                    },
                    grid: {
                        color: surfaceBorder,
                        drawBorder: false
                    }
                },
                y: {
                    ticks: {
                        color: textColorSecondary
                    },
                    grid: {
                        color: surfaceBorder,
                        drawBorder: false
                    }
                }
            }
        };
    }
}
