export type Toast = {
  message: string;
  type: string;
  dismissible: boolean;
  timeout: number;
};

export type ToastRecord = Toast & { id: number };
