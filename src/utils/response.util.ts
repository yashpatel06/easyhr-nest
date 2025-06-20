import { PipelineStage } from 'mongoose';
import { PaginationOptions, PaginationResponse } from 'src/types/common';

export class ResponseUtilities {
  /**
   * Formats a unified JSON response.
   * @param success - Indicates if the operation was successful.
   * @param message - Descriptive message for the response.
   * @param status - HTTP status code (default: 200).
   * @param data - Payload data (default: null).
   * @param error - Error information (default: null).
   */
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

  /**
   * Generates a unified pagination response with metadata.
   * @param records - The paginated records array.
   * @param currentPage - The current page number.
   * @param limitPerPage - Number of records per page.
   * @param total - Optional total record count.
   * @param options - Optional configuration (isFacet, custom keys)
   * @returns Paginated response with metadata
   */
  static formatPaginatedResponse<T>(
    records: any[],
    currentPage: number,
    limitPerPage: number,
    total?: number,
    options?: PaginationOptions,
  ): PaginationResponse<T> {
    const {
      isFacet = true,
      dataKey = 'data',
      totalKey = 'total',
    } = options || {};

    const totalRecords = isFacet
      ? (records[0]?.[totalKey]?.[0]?.[totalKey] ?? 0)
      : total || 0;
    const data = isFacet ? records[0]?.[dataKey] || [] : records;

    const totalPages = Math.ceil(totalRecords / limitPerPage);
    const hasNextPage = currentPage < totalPages;
    const hasPreviousPage = currentPage > 1;
    const from = data.length ? (currentPage - 1) * limitPerPage + 1 : 0;
    const to = data.length ? from + data.length - 1 : 0;

    return {
      records: data,
      currentPage,
      pages: totalPages,
      total: totalRecords,
      from,
      to,
      hasNextPage,
      hasPreviousPage,
      nextPage: hasNextPage ? currentPage + 1 : null,
      previousPage: hasPreviousPage ? currentPage - 1 : null,
    };
  }

  /**
   * Creates MongoDB aggregation facet stage for pagination.
   * @param skip - Number of records to skip.
   * @param limitPerPage - Number of records per page.
   * @returns Aggregation pipeline facet stage
   */
  static facetStage(
    skip: number,
    limitPerPage: number,
    dataPipeline: PipelineStage[] = [],
  ) {
    return [
      {
        $facet: {
          data: [
            { $skip: skip },
            { $limit: limitPerPage },
            ...(Array.isArray(dataPipeline) ? (dataPipeline as any) : []),
          ],
          total: [{ $count: 'total' }],
        },
      },
    ];
  }

  /**
   * Calculates the number of documents to skip for pagination.
   * @param currentPage - Current page number.
   * @param limitPerPage - Number of records per page.
   * @returns Number of documents to skip.
   */
  static calculateSkip(currentPage: number, limit: number) {
    return (currentPage - 1) * limit;
  }
}
