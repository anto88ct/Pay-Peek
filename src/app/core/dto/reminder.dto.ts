export interface Reminder {
    email: string;
    fullName: string;
    targetMonthName: string;
    targetYear: number;
    foundFiles: string[];
    missingFiles: string[];
    frontendMessage: string;
    isComplete: boolean;
}
