import {MonthFolderDto} from "./mouth-folder.dto";

export interface YearsFolderDto {
  id: string;
  year: number;
  color: string;
  month: MonthFolderDto[];
}
