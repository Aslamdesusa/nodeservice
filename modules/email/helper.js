const DomainHelper = require('../domain');
const net = require('net');

// Helper function to communicate with the SMTP server
const verifyEmailWithServer = (mxHost, email) => {
	return new Promise((resolve) => {
		const socket = net.createConnection(25, mxHost);
		let stage = 0;
		let isValid = false;
		socket.setEncoding('utf8');
		socket.on('data', (data) => {
			if (stage === 0 && data.includes('220')) {
				// Greet the server
				socket.write('HELO example.com\r\n');
				stage++;
			} else if (stage === 1 && data.includes('250')) {
				// Provide the sender's email
				socket.write('MAIL FROM:<verify@example.com>\r\n');
				stage++;
			} else if (stage === 2 && data.includes('250')) {
				// Provide the recipient's email
				socket.write(`RCPT TO:<${email}>\r\n`);
				stage++;
			} else if (stage === 3) {
				if (data.includes('250')) {
				// Email address accepted
					isValid = true;
				}
				socket.write('QUIT\r\n');
			}
		});

		socket.on('end', () => {
			resolve(isValid);
		});

		socket.on('error', (err) => {
			// console.error(`Error connecting to server: ${err.message}`);
			resolve(false);
		});

		socket.on('close', () => {
			if (!isValid) {
				console.log('Email address not valid or server did not respond positively.');
			}
		});
	});
}

// Function to verify email address using SMTP
const isEmailExist = async (email) => {
	const domain = email.split('@')[1];
	const mxRecords = await DomainHelper.resolveMxRecords(domain);
	if (mxRecords.length === 0) {
		// console.error(`No MX records found for domain: ${domain}`);
		return false;
	}

	for (const mx of mxRecords) {
		const isValid = await verifyEmailWithServer(mx.exchange, email);
		return isValid
		if (isValid) {
			return true;
		}
	}
	return false;
}

module.exports = { isEmailExist };