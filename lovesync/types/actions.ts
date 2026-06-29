export type ActionResult<TData = void> = {
  success: boolean;
  error?: string;
  data?: TData;
};