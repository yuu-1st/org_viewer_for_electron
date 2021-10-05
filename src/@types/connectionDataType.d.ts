export interface DirectoryData {
  name: string;
  isDirectory: boolean;
  extension: string | null;
  subDirectory: DirectoryData[] | null;
  rootPath: string;
}
