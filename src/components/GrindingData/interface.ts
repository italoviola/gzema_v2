export type FieldState = {
  value: string | number;
  edit: boolean;
  error: boolean;
  message: string | undefined;
};

export type FormState = {
  [key: string]: FieldState;
};
