import {FileItemDto} from "./file-item.dto";

export interface MonthFolderDto{
  id: string;
  month: number;
  name: string;
  files: FileItemDto[];
}
