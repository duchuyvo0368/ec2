import { HttpException, HttpStatus } from '@nestjs/common';

export class AuthFailureError extends HttpException {
    constructor(message = 'Unauthorized') {
        super(message, HttpStatus.UNAUTHORIZED);
    }
}

export class NotFoundError extends HttpException {
    constructor(message = 'Not Found') {
        super(message, HttpStatus.NOT_FOUND);
    }
}
export class FORBIDDEN extends HttpException {
    constructor(message = 'Forbidden') {
        super(message, HttpStatus.FORBIDDEN);
    }
}
export class ConflictRequestError extends HttpException {
    constructor(message = 'Conflict Error') {
        super(message, HttpStatus.CONFLICT);
    }
}

export class BadRequestError extends HttpException {
    constructor(message = 'Bad Request Error') {
        super(message, HttpStatus.BAD_REQUEST);
    }
}

