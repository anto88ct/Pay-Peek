import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { ChartModule } from 'primeng/chart';
import { HttpClient } from '@angular/common/http';
import { ToolboxModule } from '../../toolbox/toolbox.module';
import { FormsModule } from '@angular/forms';

@Component({
    selector: 'app-dashboard',
    standalone: true,
    imports: [
        CommonModule,
        TranslateModule,
        ChartModule,
        ToolboxModule,
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

    constructor(private http: HttpClient) { }

    ngOnInit(): void {
        this.initFilters();
        this.initChartOptions();
        this.loadDashboardData();
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
