class ApiResponseError {

    constructor(message, resultCode, error, data = [], result = 'Failed') {
        this.result = result;
        this.message = message;
        this.resultCode = resultCode;
        this.error = error;
        this.data = data;
    }
}

export default ApiResponseError;