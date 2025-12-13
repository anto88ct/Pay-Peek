export interface FileItem {
    id: string;
    name: string;
    url: string;
    type: 'pdf';
    size?: number;
    uploadDate: string;
}

export interface MonthFolder {
    id: string;
    month: number; // 1-12
    name: string; // e.g., "January"
    files: FileItem[];
}

export interface YearFolder {
    id: string;
    year: number;
    color: string;
    months: MonthFolder[];
}
