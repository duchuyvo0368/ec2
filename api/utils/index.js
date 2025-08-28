"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GlobalExceptionFilter = exports.convertToObject = exports.updateNestedObjectPaser = exports.removeUnderfinedObject = exports.unGetSelectData = exports.getSelectData = exports.getInfoData = void 0;
exports.filterFields = filterFields;
exports.isValidUrl = isValidUrl;
const lodash_1 = require("lodash");
const mongoose_1 = require("mongoose");
const logger_1 = require("../utils/logger");
const common_1 = require("@nestjs/common");
const getInfoData = ({ fields = [], objects = {}, }) => {
    return (0, lodash_1.pick)(objects, fields);
};
exports.getInfoData = getInfoData;
const getSelectData = ({ select = [], }) => {
    return Object.fromEntries(select.map((el) => [el, 1]));
};
exports.getSelectData = getSelectData;
const unGetSelectData = ({ unSelect = [], }) => {
    return Object.fromEntries(unSelect.map((el) => [el, 0]));
};
exports.unGetSelectData = unGetSelectData;
const removeUnderfinedObject = (obj) => {
    Object.keys(obj).forEach((key) => {
        if (obj[key] === undefined) {
            delete obj[key];
        }
    });
    return obj;
};
exports.removeUnderfinedObject = removeUnderfinedObject;
const updateNestedObjectPaser = (obj) => {
    const final = {};
    Object.keys(obj).forEach((key) => {
        if (typeof obj[key] === 'object' &&
            obj[key] !== null &&
            !Array.isArray(obj[key])) {
            const nested = (0, exports.updateNestedObjectPaser)(obj[key]);
            Object.keys(nested).forEach((nestedKey) => {
                final[`${key}.${nestedKey}`] = nested[nestedKey];
            });
        }
        else {
            final[key] = obj[key];
        }
    });
    return final;
};
exports.updateNestedObjectPaser = updateNestedObjectPaser;
const convertToObject = (id) => {
    return new mongoose_1.Types.ObjectId(id);
};
exports.convertToObject = convertToObject;
let GlobalExceptionFilter = class GlobalExceptionFilter {
    catch(exception, host) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse();
        const request = ctx.getRequest();
        const status = exception instanceof common_1.HttpException
            ? exception.getStatus()
            : common_1.HttpStatus.INTERNAL_SERVER_ERROR;
        const message = exception instanceof common_1.HttpException
            ? exception.getResponse()
            : exception.message;
        logger_1.logger.error(`[${request.method}] ${request.url}: ${JSON.stringify(message)}`);
        response.status(status).json({
            status: 'error',
            code: status,
            message: typeof message === 'string' ? message : message['message'],
        });
    }
};
exports.GlobalExceptionFilter = GlobalExceptionFilter;
exports.GlobalExceptionFilter = GlobalExceptionFilter = __decorate([
    (0, common_1.Catch)()
], GlobalExceptionFilter);
const meFields = ['_id', 'name', 'email', 'bio', 'avatar', 'phone', 'birthday'];
const friendFields = ['_id', 'name', 'email', 'bio', 'avatar'];
const strangerFields = ['_id', 'name', 'avatar'];
function filterFields(obj, fields) {
    return Object.fromEntries(Object.entries(obj).filter(([key]) => fields.includes(key)));
}
function isValidUrl(url) {
    try {
        const parsed = new URL(url); // Nếu sai sẽ throw
        return parsed.protocol === 'http:' || parsed.protocol === 'https:';
    }
    catch (_) {
        return false;
    }
}
//# sourceMappingURL=index.js.map