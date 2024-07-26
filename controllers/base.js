class base {
	constructor(ctx, _next) {
		this.ctx = ctx;
		this._next = _next;
		// for error handling
		this.errors = [];
		this.statusCode = null;
		this.errorList = {
			'101': { statusCode: 400, code: '101', codeMsg: 'API_KEY_MISSING', message: "API Key is not found in request headers or query params" },
			'102': { statusCode: 400, code: '102', codeMsg: 'INVALID_API_KEY', message: "API Key supplied with the request is invalid. Please cross verify the API Key!" },
			'103': { statusCode: 400, code: '103', codeMsg: 'USER_ACCOUNT_INACTIVE', message: "User account is not active" },
			'104': { statusCode: 400, code: '104', codeMsg: 'ACCOUNT_INACTIVE', message: "Account is not active" },
			'105': { statusCode: 400, code: '105', codeMsg: 'IP_NOT_WHITELISTED', message: "User IP is not whitelisted" },
			'106': { statusCode: 400, code: '106', codeMsg: 'INSUFFICIENT_PERMISSION', message: "Insufficient permissions to do the current operation" },
			'107': { statusCode: 400, code: '107', codeMsg: 'VALIDATION_ERROR', message: "Please fill the required fields" },
			'108': { statusCode: 400, code: '108', codeMsg: 'DATA_SAVING_FAILED', message: "Internal Error while saving the data. If the problem persist contact the support" },
			'109': { statusCode: 400, code: '109', codeMsg: 'RESOURCE_NOT_FOUND', message: "Resource not found with given ID" },
			'110': { statusCode: 400, code: '110', codeMsg: 'CUSTOM_FIELDS_ERROR', message: "Please fill the required fields" },
			'111': { statusCode: 400, code: '111', codeMsg: 'RESOURCE_DELETED', message: "Resource is in deleted state" },
			'112': { statusCode: 500, code: '112', codeMsg: 'SERVICE_NOT_AVAILABLE', message: "One or more service for the current operation is not available at the moment" },
			'113': { statusCode: 401, code: '113', codeMsg: 'UNAUTHORIZID_USER', message: "The email or password you enterd is incorrect" },
		
		};
	}
	_throwError(code) {
		let errMap = this.errorList[code];
		if (!errMap) {
			throw new Error('INTERNAL_ERROR');
		}
		this.errors = [errMap];
		this.statusCode = errMap.statusCode;
		let e = new Error(JSON.stringify({ error: errMap }));
		e.status = errMap.statusCode;
		throw e;
	}
}

module.exports = base;
