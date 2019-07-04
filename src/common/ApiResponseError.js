class ApiResponseError {

    constructor(data, message, result = 'FAILED') {
        this.result = result;
        this.data = data;
        this.message = message;
    }

}

export default ApiResponseError;