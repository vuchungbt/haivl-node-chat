export type ObjectResponse<T> = {
  statusCode: number;
  data: T;
  error?: string;
  message?: string;
};

export type ArrayResponse<T> = {
  statusCode: number;
  data: T[];
  error?: string;
  message?: string;
};
