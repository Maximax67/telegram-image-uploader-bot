export interface MessageDocument {
  file_name: string;
  mime_type: string;
  file_id: string;
  file_unique_id: string;
  file_size: number;
  [key: string]: any;
}
