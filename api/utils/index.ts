import { pick } from 'lodash';
import mongoose, { Types } from 'mongoose';
import { Request, Response, NextFunction } from 'express';
import { logger } from '../utils/logger';
import {
    ExceptionFilter,
    Catch,
    ArgumentsHost,
    HttpException,
    HttpStatus,
} from '@nestjs/common';


export const getInfoData = ({
    fields = [],
    objects = {},
}: {
    fields: string[];
    objects: Record<string, any>;
}): Record<string, any> => {
    return pick(objects, fields);
};


export const getSelectData = ({
    select = [],
}: {
    select: string[];
}): Record<string, 1> => {
    return Object.fromEntries(select.map((el) => [el, 1]));
};


export const unGetSelectData = ({
    unSelect = [],
}: {
    unSelect: string[];
}): Record<string, 0> => {
    return Object.fromEntries(unSelect.map((el) => [el, 0]));
};

export const removeUnderfinedObject = (obj: Record<string, any>): Record<string, any> => {
    Object.keys(obj).forEach((key) => {
        if (obj[key] === undefined) {
            delete obj[key];
        }
    });
    return obj;
};


export const updateNestedObjectPaser = (obj: Record<string, any>): Record<string, any> => {
    const final: Record<string, any> = {};

    Object.keys(obj).forEach((key) => {
        if (
            typeof obj[key] === 'object' &&
            obj[key] !== null &&
            !Array.isArray(obj[key])
        ) {
            const nested = updateNestedObjectPaser(obj[key]);
            Object.keys(nested).forEach((nestedKey) => {
                final[`${key}.${nestedKey}`] = nested[nestedKey];
            });
        } else {
            final[key] = obj[key];
        }
    });

    return final;
};


export const convertToObject = (id: string): Types.ObjectId => {
    return new Types.ObjectId(id);
};



@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
    catch(exception: any, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const request = ctx.getRequest<Request>();

        const status =
            exception instanceof HttpException
                ? exception.getStatus()
                : HttpStatus.INTERNAL_SERVER_ERROR;

        const message =
            exception instanceof HttpException
                ? exception.getResponse()
                : exception.message;

        logger.error(
            `[${request.method}] ${request.url}: ${JSON.stringify(message)}`,
        );

        response.status(status).json({
            status: 'error',
            code: status,
            message: typeof message === 'string' ? message : message['message'],
        });
    }
}
const meFields = ['_id', 'name', 'email', 'bio', 'avatar', 'phone', 'birthday'];
const friendFields = ['_id', 'name', 'email', 'bio', 'avatar'];
const strangerFields = ['_id', 'name', 'avatar'];

export function filterFields<T extends object>(obj: T, fields: string[]): Partial<T> {
    return Object.fromEntries(
        Object.entries(obj).filter(([key]) => fields.includes(key))
    ) as Partial<T>;
}



export function isValidUrl(url: string): boolean {
    try {
        const parsed = new URL(url); // Nếu sai sẽ throw
        return parsed.protocol === 'http:' || parsed.protocol === 'https:';
    } catch (_) {
        return false;
    }
}