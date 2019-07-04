class ApiResponseSuccess {

    constructor(data, message, result = 'SECCESS') {
        this.result = result;
        this.data = data;
        this.message = message;
    }

}

export default ApiResponseSuccess;