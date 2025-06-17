export class ResponseUtilities {
  static responseWrapper(
    success: boolean,
    message: string,
    status: number = 200,
    data: any = null,
    error: any = null,
  ) {
    return {
      success,
      message,
      status,
      data,
      error,
    };
  }
}
