export interface DirectoryData {
  name: string;
  isDirectory: boolean;
  extension: string | null;
  subDirectory: DirectoryData[] | null;
  rootPath: string;
}

export interface DefaultData{
  HomeDir : string,
  isUpdate : ApiResultData | null,
}

export interface ApiResultData {
    result : 'success' | 'error';
    data : string;
}