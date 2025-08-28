'use strict';

export const StatusCode = {
    OK: 200,
    CREATED: 201,
} as const;

export const ReasonStatusCode = {
    CREATED: 'Created !',
    OK: 'Success',
} as const;


interface ISuccessResponse {
    message?: string;
    statusCode?: number;
    reasonStatusCode?: string;
    metadata?: Record<string, any>;
}

interface ICreatedOptions {
    options?: Record<string, any>;
    message?: string;
    statusCode?: number;
    reasonStatusCode?: string;
    metadata?: Record<string, any>;
}


export class SuccessResponse {
    message: string;
    statusCode: number;
    metadata: Record<string, any>;
  
    constructor({
      message,
      statusCode = StatusCode.OK,
      reasonStatusCode = ReasonStatusCode.OK,
      metadata = {},
    }: ISuccessResponse) {
      this.message = message || reasonStatusCode;
      this.statusCode = statusCode;
      this.metadata = metadata;
    }
  
    toJSON() {
      return {
        status: 'success',
        message: this.message,
        statusCode: this.statusCode,
        metadata: this.metadata,
      };
    }
  }
  

export class OK extends SuccessResponse {
    constructor({ message, metadata }: { message?: string; metadata?: Record<string, any> }) {
        super({ message, metadata });
    }
}

// 201 CREATED response
export class CREATED extends SuccessResponse {
    options: Record<string, any>;

    constructor({
        options = {},
        message,
        statusCode = StatusCode.CREATED,
        reasonStatusCode = ReasonStatusCode.CREATED,
        metadata,
    }: ICreatedOptions) {
        super({ message, statusCode, reasonStatusCode, metadata });
        this.options = options;
    }
}
