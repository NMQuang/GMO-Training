class ApiResponseSuccess {

    constructor(message, resultCode, error = [], data, result = 'Success') {
        this.result = result;
        this.message = message;
        this.resultCode = resultCode;
        this.error = error;
        this.data = data;
    }
}

export default ApiResponseSuccess;