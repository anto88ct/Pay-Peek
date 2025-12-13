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

    constructor(
        private http: HttpClient,
        private themeService: ThemeService,
        private translate: TranslateService
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
        console.log('Creating dashboard:', {
            type: this.selectedChartType,
            data: this.selectedDataItems
        });
        this.isNewDashboardDialogVisible = false;
    }

    cancelCreation() {
        this.isNewDashboardDialogVisible = false;
    }

    initFilters() {
        this.years = [
            { label: '2025', value: 2025 },
            { label: '2024', value: 2024 },
            { label: '2023', value: 2023 }
        ];
        this.selectedYear = this.years[0];
    }

    loadDashboardData() {
        this.http.get<any>('assets/data/dashboard-data.json').subscribe(data => {
            this.salaryData = data.salaryTrend;
            this.expensesData = data.expensesBreakdown;
            this.holidaysData = data.holidays;
        });
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
