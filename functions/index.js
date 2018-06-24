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
				dnsimple.domains.createDomain(accountId, {'name': domainName}).then((response) => {
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
*
* Function Name: List Collaborators
*
* Purpose: List collaborators for a specified domain
*
* @param {domainName} The domain name to list collaborators on
*
*
*/

exports.listCollaborators = functions.https.onRequest((req, res) => {
	cors(req, res, () => {
		if(req.method == 'POST') {
			checkAuthorization().then((response) => {
				var accountId = response;
				var domainName = req.body.domainName;
				dnsimple.collaborators.listCollaborators(accountId, domainName, {sort: 'email:asc'}).then((response) => {
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
* Function Name: Add Collaborator
*
* Purpose: Add a collaborator to a specified domain
*
* @param {domainName} The domain name to list collaborators on
*
* @param [collaborator] The collaborators email
*/

exports.addCollaborator = functions.https.onRequest((req, res) => {
	cors(req, res, () => {
		if(req.method == 'POST') {
			checkAuthorization().then((response) => {
				var accountId = response;
				var domainName = req.body.domainName;
				var collaborator = req.body.collaborator;
				dnsimple.collaborators.addCollaborator(accountId, domainName, {"email": collaborator}).then((response) => {
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
* Function Name: Remove Collaborator
*
* Purpose: Remove a collaborator from a specified domain
*
* @param {domainName} The domain name to list collaborators on
*
* @param {collaboratorId} The collaborators ID
*/

exports.removeCollaborator = functions.https.onRequest((req, res) => {
	cors(req, res, () => {
		if(req.method == 'DELETE') {
			checkAuthorization().then((response) => {
				var accountId = response;
				var domainName = req.body.domainName;
				var collaboratorId = req.body.collaboratorId;
				dnsimple.collaborators.removeCollaborator(accountId, domainName, collaboratorId).then((response) => {
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
* Function Name: List Email Forwards
*
* Purpose: Lists email forwards for a specified domain
*
* @param {domainName} The domain name to list collaborators on
*
* 
*/

exports.listEmailForwards = functions.https.onRequest((req, res) => {
	cors(req, res, () => {
		if(req.method == 'POST') {
			checkAuthorization().then((response) => {
				var accountId = response;
				var domainName = req.body.domainName;
				dnsimple.domains.listEmailForwards(accountId, domainName, {sort: 'from:asc'}).then((response) => {
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
* Function Name: list Email Forward
*
* Purpose: Lists a specific email forward for a specified domain
*
* @param {domainName} The domain name to list collaborators on
*
* @param {forwardId} The ID of the email forward
*/

exports.listEmailForward = functions.https.onRequest((req, res) => {
	cors(req, res, () => {
		if(req.method == 'POST') {
			checkAuthorization().then((response) => {
				var accountId = response;
				var domainName = req.body.domainName;
				var forwardId = req.body.forwardId;
				dnsimple.domains.getEmailForward(accountId, domainName, forwardId).then((response) => {
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
* Function Name: Create Email Forward
*
* Purpose: Create an email forward for a specified domain
*
* @param {domainName} The domain name to list collaborators on
*
* @param {from} The from email address
*
* @param {to} The to email address
*
*/

exports.createEmailForward = functions.https.onRequest((req, res) => {
	cors(req, res, () => {
		if(req.method == 'POST') {
			checkAuthorization().then((response) => {
				var accountId = response;
				var domainName = req.body.domainName;
				var fromAddress = req.body.fromAddress;
				var toAddress = req.body.toAddress;
				dnsimple.domains.listEmailForwards(accountId, domainName, {'from' : fromAddress, 'to' : toAddress}).then((response) => {
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
* Function Name: Remove an Email Forward
*
* Purpose: Delete a specified email forward for a specified domain
*
* @param {domainName} The domain name to list collaborators on
*
* @param {forwardId} The forward ID to delete 
*/

exports.removeEmailForward = functions.https.onRequest((req, res) => {
	cors(req, res, () => {
		if(req.method == 'DELETE') {
			checkAuthorization().then((response) => {
				var accountId = response;
				var domainName = req.body.domainName;
				var forwardId = req.body.forwardId;
				dnsimple.domains.listEmailForwards(accountId, domainName, forwardId).then((response) => {
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