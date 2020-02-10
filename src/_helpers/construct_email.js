// require('dotenv').config();

const constants = require('./../../constants');

module.exports = function constructEmail(firstName,email,emailVerificationToken){
    const msg = {
        to: email,
        from: "support@trabahanap.com",
        subject: "Email Verification",
        text: "Click hear to activate your account.",
        html: `<div style="display: flex; flex-direction: column; width: 35rem; justify-content: center; align-self: center;">
		<div style="">
			<span style="font-size: 1.2rem; font-weight: 300;"> Dear ${firstName}, </span>
		</div>
	
		<div style="margin: 2rem 0; ">
			Thank you for signing up with Trabahanap.com. Please click the button below to verify your Company's
			email address. By confirming your account, future Trabahanap notifications will be sent to this
			email.
		</div>
	
		<div style="margin: 2rem 2rem;">
			<div style="box-sizing:border-box; width:250px;margin-top:0;font-family:'Open Sans','Helvetica Neue','Helvetica',Helvetica,Arial,sans-serif;font-size:16px;vertical-align:top;background-color:#aa111d;border-radius:3px;text-align:center;border:solid 2px #e2d0cb;"
				valign="top">
				<a href="${constants.HOST_URL}/auth/email_verification?token=${emailVerificationToken}&email=${email}"
					style="box-sizing:border-box;font-weight:400;text-decoration:none;display:inline-block;margin:0;color:#ffffff;background-color:#aa111d;border-radius:2px;font-size:14px;padding:12px 45px"
					target="_blank">Verify</a>
			</div>
		</div>
	
		<div style="margin: 2rem 0; display: flexbox; width: 40rem;">
			<span style="align-self: left;">
				Link not working? Please paste this into your browser <a
					href="${constants.HOST_URL}/auth/email_verification?token=${emailVerificationToken}&email=${email}"
					target="_blank">${constants.HOST_URL}/auth/email_verification?token=${emailVerificationToken}&email=${email}</a>
			</span>
	
		</div>
	</div>`
    }

    return msg;
}