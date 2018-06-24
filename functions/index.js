const functions = require('firebase-functions');
const express = require('express');
const cors = require('cors')({ origin: true });
const bodyParser = require('body-parser');
const request = require('request');
const dnsimple = require('dnsimple')({ baseUrl: 'https://api.sandbox.dnsimple.com', accessToken: functions.config().dnsimple.access });

const app = express();
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

/***********************************************************
|
| DNS Simple Integration
|
***********************************************************/

/**
*
* Function Name: Check Domain Availability
*
* Purpose: Check the registration availability of a domain
*
* @param {domainName} The domain name to check
*
*
*/

exports.checkDomainAvailability = functions.https.onRequest((req, res) => {
	cors(req, res, () => {
		if(req.method == 'POST') {
			checkAuthorization().then((response) => {
				var accountId = response;
				var domainName = req.body.domainName;
				dnsimple.registrar.checkDomain(accountId, domainName).then((response) => {
					res.status(200).send(response);
				}).catch(error => {
					res.status(500).send(error);
				});
			}).catch(error => (
				res.status(500).send(error)
			));
		} else {
			res.status(405).send('Method Not Allowed');
		}
	});
});

/**
*
* Function Name: List Domains
*
* Purpose: Lists all the domains on an account
*
* 
*
*
*/

exports.listDomains = functions.https.onRequest((req, res) => {
	cors(req, res, () => {
		if(req.method == 'GET') {
			checkAuthorization().then((response) => {
				var accountId = response;
				dnsimple.domains.allDomains(accountId).then((response) => {
					res.status(200).send(response);
				}).catch(error => {
					res.status(500).send(error);
				});
			}).catch(error => (
				res.status(500).send(error)
			));
		} else {
			res.status(405).send('Method Not Allowed');
		}
	});
});

/**
*
* Function Name: List Domain
*
* Purpose: Lists the details of a single domain
*
* @param {domainName} The domain name to get
*
*
*/

exports.listDomain = functions.https.onRequest((req, res) => {
	cors(req, res, () => {
		if(req.method == 'POST') {
			checkAuthorization().then((response) => {
				var accountId = response;
				var domainName = req.body.domainName;
				dnsimple.domains.getDomain(accountId, domainName).then((response) => {
					res.status(200).send(response);
				}).catch(error => {
					res.status(500).send(error);
				});
			}).catch(error => (
				res.status(500).send(error)
			));
		} else {
			res.status(405).send('Method Not Allowed');
		}
	});
});

/**
*
* Function Name: Create Domain
*
* Purpose: Creates a domain on an account
*
* @param {domainName} The domain name to create
*
*
*/

exports.createDomain = functions.https.onRequest((req, res) => {
	cors(req, res, () => {
		if(req.method == 'POST') {
			checkAuthorization().then((response) => {
				var accountId = response;
				var domainName = req.body.domainName;
				dnsimple.domains.createDomain(accountId, domainName).then((response) => {
					res.status(200).send(response);
				}).catch(error => {
					res.status(500).send(error);
				});
			}).catch(error => (
				res.status(500).send(error)
			));
		} else {
			res.status(405).send('Method Not Allowed');
		}
	});
});

/**
*
* Function Name: Delete Domain
*
* Purpose: Delete a domain from an account.
*
* @param {domainName} The domain name to delete
*
*
*/

exports.deleteDomain = functions.https.onRequest((req, res) => {
	cors(req, res, () => {
		if(req.method == 'DELETE') {
			checkAuthorization().then((response) => {
				var accountId = response;
				var domainName = req.body.domainName;
				dnsimple.domains.deleteDomain(accountId, domainName).then((response) => {
					res.status(200).send(response);
				}).catch(error => {
					res.status(500).send(error);
				});
			}).catch(error => (
				res.status(500).send(error)
			));
		} else {
			res.status(405).send('Method Not Allowed');
		}
	});
});


/**
* PRIVATE FUNCTION
*
* Function Name: Check Authorization
*
* Purpose: Fetches the account id for the authorized account
*
* This function is private and not accessible via outside 
* sources.
*
*/

var checkAuthorization = function() {
	return new Promise(function(resolve, reject){
		dnsimple.identity.whoami().then((response) => {
			var accountID = response.data.account.id;
			resolve(accountID);
		}).catch((error) => {
			reject(error);
		});
	});
}


/***********************************************************
|
| END DNS Simple Integration
|
***********************************************************/