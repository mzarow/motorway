export const isServerErrorCode = (httpCode: number) => httpCode >= 500 && httpCode <= 599;
