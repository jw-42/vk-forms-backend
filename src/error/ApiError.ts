export class ApiError extends Error {
    status: any;

    constructor(status: number, message: string) {
        super();
        this.status = status;
        this.message = message;
    }

    static badRequest(message: string = `one of the parameters is invalid or not provided`) {
        return new ApiError(400, message);
    }

    static  unauthorized(message: string = 'Unauthorized') {
        return new ApiError(401, message);
    }

    static  forbidden(message: string = 'Access denied') {
        return new ApiError(403, message);
    }

    static  notFound(message: string = 'Not Found') {
        return new ApiError(404, message);
    }

    static  notAllowed(message: string = 'Method Not Allowed') {
        return new ApiError(405, message);
    }

    static  tooManyRequests(message: string = 'Too many requests') {
        return new ApiError(429, message);
    }

    static  unavailableForLegalReasons(message: string) {
        return new ApiError(451, message);
    }

    static  internal(message: string = 'Internal Server Error') {
        return new ApiError(500, message);
    }

}