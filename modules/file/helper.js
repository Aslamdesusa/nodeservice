const fs = require('fs').promises; // Use the promises API for fs

// Function to load disposable domains from a file using async/await
const loadConfFile = async (filePath) => {
	try {
		const data = await fs.readFile(filePath, 'utf8'); // Correctly using promises API
		// Split the file by lines, trim spaces, and filter out empty lines
		const domains = data.split('\n').map(domain => domain.trim()).filter(Boolean);
		return domains;
	} catch (err) {
		console.error(`Error reading file: ${err.message}`);
		throw err; // Propagate the error
	}
};

module.exports = { loadConfFile };
