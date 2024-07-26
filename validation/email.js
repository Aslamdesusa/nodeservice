const Joi = require('@hapi/joi');

const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;

let EmailSchema = Joi.object({
	email: Joi.string().required().regex(emailRegex).message('Invalid Email Format!'),
})
module.exports = {
	EmailSchema
}