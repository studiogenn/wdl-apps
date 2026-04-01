export type ApiResponse<T> = {
  readonly success: boolean;
  readonly data?: T;
  readonly error?: string;
};

export type User = {
  readonly id: string;
  readonly email: string;
  readonly name: string;
  readonly phone?: string;
  readonly cleancloudCustomerId?: number;
};
