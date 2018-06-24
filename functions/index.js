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