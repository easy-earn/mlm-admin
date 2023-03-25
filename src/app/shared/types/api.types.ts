// New Generic response type
export interface ApiResponse<Type> {
  count?: number;
  result?: Type;
  message: string;
  success: boolean;
  error?: any;
}
