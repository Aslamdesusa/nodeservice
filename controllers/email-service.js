const _ = require('lodash');
const base = require('./base');
const dns = require('dns');
const whois = require('whois');
const net = require('net');
const { DomainHelper, FileHelper, EmailHelper } = require('../modules');
const Validations = require('../validation');

class EmailService extends base {
	constructor(ctx, _next) {
		super(ctx, _next);
	}

	async emailVerify() {
		const queryParams = this.ctx.query;
		const { error, value } = Validations.Email.EmailSchema.validate(queryParams);
		if (error) {
			this.errorList['107'].message = _.size(error.details) > 0 ? error.details[0].message : "Validation Failed";
			this._throwError('107');
		}
		const disposableDomainFilePath = this.ctx.config.paths.disposable_domain_db_path
		const trustedDomainFilePath = this.ctx.config.paths.trusted_domain_db_path
		const splitEmail= value.email.split('@');
		const user = splitEmail[0];
		const domain = splitEmail[1];

		try {
			const disposableDomains = await this.ctx.disposableDomains;
			const trustedDomains = await this.ctx.trustedDomains;
			const isDisposable = await DomainHelper.isDisposableDomain(domain, disposableDomains, trustedDomains);
			const isEmailExist = await EmailHelper.isEmailExist(value.email);
			this.ctx.body = {
				success: true,
				message: '',
				data: {
					valid: isEmailExist,
					user: user,
					email: value.email,
					disposable: isDisposable,
				}
			};
		} catch (error) {
			console.error(error);
		}
	}
}

module.exports = EmailService;
