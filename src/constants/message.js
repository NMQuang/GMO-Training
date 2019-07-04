var constant = {};

// message error for validating data input
constant.MSG_ERROR_0 = '%p should be enter';
constant.MSG_ERROR_1 = '%p should be integer';
constant.MSG_ERROR_2 = '%p should be alpha';
constant.MSG_ERROR_3 = '%p should not be empty, should be from %p to %p character';
constant.MSG_ERROR_4 = '%p shound be format email.'

// message for processing data success
constant.MSG_SUCCESS_0 = 'Fetch all %p successfully';
constant.MSG_SUCCESS_1 = 'Fetch a %p successfully';
constant.MSG_SUCCESS_2 = 'Create %p successfully';
constant.MSG_SUCCESS_3 = 'Update %p successfully';
constant.MSG_SUCCESS_4 = 'Delete %p successfully';

// message for processing data failed
constant.MSG_FAILED_0 = 'Not found %p. Fetch failed';
constant.MSG_FAILED_1 = 'Not found %p. Update failed';
constant.MSG_FAILED_2 = 'Not found %p. Delete failed';
constant.MSG_FAILED_3 = 'Not found %p. Login failed';

// message for authentication
constant.MSG_AUTH_0 = 'Successful to authenticate %p'
constant.MSG_AUTH_1 = 'No %p provided'
constant.MSG_AUTH_2 = 'Failed to authenticate %p'
constant.MSG_AUTH_3 = 'Invalid request. %p not found'
constant.MSG_AUTH_4 = '%p has expired.'

export default constant;