const fs = require('fs').promises; // Use the promises API for fs
const dns = require('dns').promises; // Use the promises API for dns
const whois = require('whois');

// Function to check DNS MX records using async/await
const resolveMxRecords = async (domain) => {
	try {
		const addresses = await dns.resolveMx(domain);
		return addresses;
	} catch (err) {
		return []; // Default to true to avoid false positives for reliable domains
	}
};

// Improved function to analyze WHOIS data
const analyzeWhoisData = (data, domain) => {
	// Refined disposable patterns
	const disposablePatterns = [
		/\btemporary\b/i,
		/\banonymous\b/i,
		/\bdisposable\b/i,
		/\btrashmail\b/i,
		/\bprivacy\b/i,
		/\bPrivacy\b/i,
		/\bfake\b/i,
		/\bshort-term\b/i,
		/\bshortterm\b/i,
		// Add more specific patterns if necessary
	];

	// Perform pattern matching on the WHOIS data
	return disposablePatterns.some(pattern => pattern.test(data));
};


// Function to perform WHOIS lookup using async/await
const checkWhois = async (domain) => {
  return new Promise((resolve) => {
		whois.lookup(domain, (err, data) => {
			if (err) {
				// console.error(`WHOIS lookup failed for ${domain}: ${err.message}`);
				resolve(false); // Default to false assuming reliable domain if WHOIS fails
			} else {
				console.log(`WHOIS data for ${domain}:`, data);
				const isDisposable = analyzeWhoisData(data, domain);
				resolve(isDisposable);
			}
		});
	});
};

// Function to check if the domain is known to be disposable
const isKnownDisposable = (domain, disposableDomains) => {
	// Normalize domain for better matching
	const normalizedDomain = domain.toLowerCase().trim();
	return disposableDomains.includes(normalizedDomain);
};

const hasMxRecords = (mxRecords) => {
	if (mxRecords && mxRecords.length > 0) {
		// console.log(`MX records for ${domain}:`, mxRecords);
		return true;
	} else {
		// console.log(`No MX records found for ${domain}.`);
		return false;
	}
}

// Main function to check if a domain is disposable using async/await
const isDisposableDomain = async (domain, disposableDomains, trustedDomains) => {
	// Check if the domain is in the known trusted domains list
	if (trustedDomains.includes(domain.toLowerCase())) {
		return false; // Not disposable
	}
	// Check against the list of known disposable domains
	const isKnown = isKnownDisposable(domain, disposableDomains);
	if (isKnown) {
		console.log(`${domain} is a known disposable domain.`);
		return true;
	}

	// Perform DNS and WHOIS checks
	const mxRecords = await resolveMxRecords(domain);
	const isWhoisDisposable = await checkWhois(domain);

	// Consider the domain disposable if it lacks MX records or matches WHOIS patterns
	if (!hasMxRecords(mxRecords) || isWhoisDisposable) {
		console.log(`${domain} is likely a disposable domain.`);
		return true;
	}
	// console.log(`${domain} does not appear to be disposable.`);
	return false;
};

module.exports = { isDisposableDomain, resolveMxRecords };
