(function () {

	var getAccountDetails = function() {

		fetch("https://us-central1-bloo-61290.cloudfunctions.net/accountDetails").then((resp) => resp.json()).then(function(response) {
			var email = response.data.account.email;
			var identifier = response.data.account.plan_identifier.replace('dnsimple-', '').toUpperCase();
			var lastUpdated = moment(response.data.account.updated_at).fromNow();
			var created = moment(response.data.account.created_at).format('MM/DD/YY hh:mm A')
			$("#domainAccountCircle").attr('src', 'https://api.adorable.io/avatars/285/'+email+'.png');
			$("#email").html(email);
			$("#identifier").html(identifier);
			$("#lastUpdated").html(lastUpdated).attr('title', moment(response.data.account.updated_at).format('MM/DD/YY hh:mm A'));
			$("#created").html(created);
		}).catch(function(error) {
			console.log(error);
		})

	}

	var getContacts = function() {

		fetch("https://us-central1-bloo-61290.cloudfunctions.net/listContacts").then((resp) => resp.json()).then(function(response) {
			if(response.length > 0) {

				console.log(response);

			}
		}).catch(function(error) {
			console.log(error);
		})
	}

	var getDomainNames = function() {

		fetch("https://us-central1-bloo-61290.cloudfunctions.net/listDomains").then((resp) => resp.json()).then(function(response) {
			if(response.length > 0){

				var domainsOverviewTableBody = $("#domainsOverviewTable tbody");
				var domainsTotalTableBody = $("#domainsTotalTable tbody");
				var totalDomains = response.length;
				var domains = response;

				$(".totalDomainCount").html(totalDomains);

				for (var i = domains.length - 1; i >= 0; i--) {
					var domain = domains[i];

					domainsOverviewTableBody.append(
						'<tr>'+
							'<td width="2%" class="text-muted">'+shortState(domain.state)+'</td>'+
							'<td width="94%">'+domain.name+'</td>'+
							'<td width="4%"><a href="" class="btn btn-outline-info btn-sm" data-toggle="tooltip" title="DNS"><i class="fal fa-server"></i></a></td>'+
						'</tr>'

					);

					if(domain.auto_renew)
					{
						var renew = '<span data-toggle="tooltip" title="Auto Renew Enabled"><i class="fal fa-retweet"></i></span>';
					} else {
						var renew = '';
					}

					if(domain.private_whois)
					{
						var private = '<span data-toggle="tooltip" title="Private WHOIS Enabled"><i class="fal fa-user-secret"></i></span>';
					} else {
						var private = '';
					}

					if(domain.expires_on)
					{
						var renew_by = moment(domain.expires_on).format('MMM DD, YYYY');
					} else {
						var renew_by = '<span class="text-muted">n/a</span>';
					}

					domainsTotalTableBody.append(
						'<tr>'+
							'<td width="2%" class="text-muted">'+shortState(domain.state)+'</td>'+
							'<td width="80%">'+domain.name+'</td>'+
							'<td width="4%">'+private+'</td>'+
							'<td width="4%">'+renew+'</td>'+
							'<td width="10%" class="text-center">'+renew_by+'</td>'+
							'<td width="4%"><a href="" class="btn btn-outline-info btn-sm" data-toggle="tooltip" title="DNS"><i class="fal fa-server"></i></a></td>'+
						'</tr>'
					);
				}

				$('[data-toggle="tooltip"]').tooltip({
					'placement' : 'bottom'
				})
			}
		}).catch(function(error) {
			console.log(error);
		})

	}

	var shortState = function(state) {
		return state.substring(0, 1).toUpperCase();
	}

	getAccountDetails();
	getContacts();
	getDomainNames();


}());

function checkDomainAvailabilty() {
	var domainNameToCheck = $("#domainNameToCheck").val();
	var checkDomainContainer = $("#checkDomainContainer");
	var checkDomainFooter = $("#checkDomainFooter");
	checkDomainContainer.html('<h4 class="text-center text-info"><i class="fal fa-spinner-third fa-spin"></i></h4><p class="text-center">Checking '+domainNameToCheck+'...</p>');
	checkDomainFooter.hide();
	if(domainNameToCheck) {
		let data = {
			'domainName' : domainNameToCheck.toLowerCase()
		}
		let fetchData = {
			method: 'POST',
			body: JSON.stringify(data),
			headers: {
				'Accept' : 'application/json',
				'Content-Type': 'application/json'
			}
		}
		fetch('https://us-central1-bloo-61290.cloudfunctions.net/checkDomainAvailability', fetchData).then((resp) => resp.json()).then(function(response) {
			if(response.data.available) {
				checkDomainContainer.html(
					'<h2 class="text-success text-center"><i class="fal fa-check"></i></h2>'+
					'<p class="text-center">'+domainNameToCheck+' is available for registration!</p>'+
					'<p class="text-center">'+
						'<button class="btn btn-sm btn-secondary checkAnother mr-2">Check Another</button>'+
						'<button class="btn btn-sm btn-success">Register Now</button>'+
					'</p>'
				);
			} else {
				checkDomainContainer.html(
					'<h2 class="text-danger text-center"><i class="fal fa-times"></i></h2>'+
					'<p class="text-center">'+domainNameToCheck+' is not available for registration.</p>'+
					'<p class="text-center"><button class="btn btn-sm btn-primary checkAnother">Check Another</button></p>'
				);
			}
			$(".checkAnother").bind("click", function(){
				checkDomainFooter.show();
				checkDomainContainer.html('<div class="form-group"><input type="url" class="form-control" placeholder="Enter Domain Name" name="DomainName" id="domainNameToCheck"/></div>');
			})
		}).catch(function(error) {
			console.log(error);
		})
	} else {
		checkDomainFooter.show();
		checkDomainContainer.html('<div class="form-group"><input type="url" class="form-control" placeholder="Enter Domain Name" name="DomainName" id="domainNameToCheck"/></div>');
	}
}
