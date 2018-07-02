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

				var contactsTotalDisplay = $("#contactTotalDisplay");
				var contacts = response;

				contactsTotalDisplay.html('');

				for (var i = contacts.length - 1; i >= 0; i--) {
					var contact = contacts[i];

					contactsTotalDisplay.append(
						'<div class="col-3">'+
							'<div class="card">'+
								'<div class="card-header">'+
									contact.organization_name+
									'<span class="float-right">'+
										'<a href="#/domains/contacts/edit/'+contact.id+'">'+
											'<i class="fal fa-chevron-right"></i>'+
										'</a>'+
									'</span>'+
								'</div>'+
								'<div class="card-body p-2">'+
									'<div class="account-image-holder">'+
										'<img src="https://api.adorable.io/avatars/285/'+contact.email+'" class="account-image-circle"/><br/>'+
										'<p>'+
											'<b>'+contact.first_name+' '+contact.last_name+'</b><br/>'+
											contact.email+
										'</p>'+
									'</div>'+
									'<span class="bottom-text">'+
										'<small>'+
											'Last Updated: <span data-toggle="tooltip" title="'+moment(contact.update_at).format('MM/DD/YY hh:mm A')+'">'+moment(contact.updated_at).fromNow()+'</span>'+
										'</small>'+
									'</span>'+
								'</div>'+
							'</div>'+
						'</div>'
					);

					$("select[name='domainRegistrant']").append('<option value="'+contact.id+'">'+contact.first_name+' '+contact.last_name+'</option>');
				}

				$('[data-toggle="tooltip"]').tooltip();

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

				$('[data-toggle="tooltip"]').tooltip();
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

$(document).ready(function(){
	setTimeout(function() {
		$("#generalInfo").hide();
		$("#register").hide();
		$("#transfer").hide();
		$("#services").hide();
		$("#addDomainFooter").hide();
		$(".input-group-prepend").hide();
	}, 10);
})

function checkDomainAvailabilty(inForm) {
	if(!inForm)
	{
		var domainNameToCheck = $("#domainNameToCheck").val();
		var checkDomainContainer = $("#checkDomainContainer");
		var checkDomainFooter = $("#checkDomainFooter");
		checkDomainContainer.html('<h4 class="text-center text-info"><i class="fal fa-spinner-third fa-spin"></i></h4><p class="text-center">Checking '+domainNameToCheck+'...</p>');
		checkDomainFooter.hide();
	} else {
		var domainNameToCheck = $("input[name='domainName']").val();
		if(domainNameToCheck)
		{
			$(".input-group-prepend").show().html('<span class="input-group-text" id="basic-addon1"><i class="fal fa-spinner fa-spin"></i></span>');
		}
	}
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
			if(!inForm){
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
			} else {
				if(response.data.available) {
					$(".input-group-prepend").show().html('<span class="input-group-text" id="basic-addon1"><i class="fal fa-check text-success"></i></span>');
					$(".domain-status").removeClass('d-none').addClass('text-success').html('That domain is available!');
					$("#addDomainBtn").attr('disabled', false);
				} else {
					$(".input-group-prepend").show().html('<span class="input-group-text" id="basic-addon1"><i class="fal fa-times text-danger"></i></span>');	
					$(".domain-status").removeClass('d-none').addClass('text-danger').html('That domain is not available!');	
					$("#addDomainBtn").attr('disabled', true);	
				}
			}
		}).catch(function(error) {
			console.log(error);
		})
	} else {
		if(!inForm)
		{
			checkDomainFooter.show();
			checkDomainContainer.html('<div class="form-group"><input type="url" class="form-control" placeholder="Enter Domain Name" name="DomainName" id="domainNameToCheck"/></div>');
		}
	}
}

function createContact() {
	var label = $("input[name='label']").val();
	var first_name = $("input[name='first_name']").val();
	var last_name = $("input[name='last_name']").val();
	var first_name = $("input[name='first_name']").val();
	var email = $("input[name='email']").val();
	var organization_name = $("input[name='organization_name']").val();
	var job_title = $("input[name='job_title']").val();
	var phone = $("input[name='phone']").val();
	var fax = $("input[name='fax']").val();
	var address1 = $("input[name='address1']").val();
	var address2 = $("input[name='address2']").val();
	var city = $("input[name='city']").val();
	var state_province = $("input[name='state_province']").val();
	var postal_code = $("input[name='postal_code']").val();

	if(first_name && last_name && email && phone && address1 && city && state_province && postal_code) {

		if(organization_name){
			if(!job_title){
				console.log('Job title required with organization name!');
				return false;
			}
		}

		let data = {
			'label' : label,
			'first_name' : first_name,
			'last_name' : last_name,
			'organization_name' : organization_name,
			'job_title' : job_title,
			'address1' : address1,
			'address2' : address2,
			'city' : city,
			'state_province' : state_province,
			'postal_code' : postal_code,
			'country' : 'US',
			'email' : email,
			'phone' : phone,
			'fax' : fax
		}

		let fetchData = {
			method: 'POST',
			body: JSON.stringify(data),
			headers: {
				'Accept' : 'application/json',
				'Content-Type': 'application/json'
			}
		}
		fetch('https://us-central1-bloo-61290.cloudfunctions.net/createContact', fetchData).then((resp) => resp.json()).then(function(response) {
			getContacts();
			toggleTab('contacts');
		}).catch(function(error) {
			console.log(error);
		})

	} else {
		console.log('Not all requied fields are completed!');
	}
}

function toggleTab(tab) {
	$("#selectType").fadeIn(function(){
		$("#generalInfo").fadeOut();
		$("#services").fadeOut();
		$("#register").fadeOut();
		$("#transfer").fadeOut();
		$("#addDomainFooter").fadeOut();
	})
	$("#domainsTab a[href='#"+tab+"']").tab('show');
}

function setRegistrationType(type) {
	$("#selectType").fadeOut(function(){ 
		$("#generalInfo").fadeIn();
		$("#"+type).fadeIn();
		$("#addDomainFooter").fadeIn();
		if(type == 'register') {
			$("input[name='domainName']").attr("onblur", "checkDomainAvailabilty(true)");
		}
		if(type == 'services') {
			$("#domainAddons").hide();
			$("#addDomainFooter #addDomainBtn").attr('registrationType', 'services').html('Use Domain Services');
		} else {
			$("#addDomainFooter #addDomainBtn").attr('registrationType', type).html(type.toUpperCase()+' domain');
		}
	});
}

function finishAddingDomain() {
	var regType = $("#addDomainBtn").attr('registrationtype');
}