// require('dotenv').config();

const constants = require('./../../constants');

module.exports = function constructEmail(firstName,email,emailVerificationToken){
    const msg = {
        to: email,
        from: "support@trabahanap.com",
        subject: "Email Verification",
        text: "Click hear to activate your account.",
        html: `<div style="width:50rem">
		<table cellpadding="0" cellspacing="0" width="600" align="center" style="font-size:0">
			<tbody>
				<tr>
					<td style="margin-bottom:5rem;padding:6px 15px;color:#0e0d0d;font-size:25px;font-family:Verdana">
						<h5>
							Dear ${firstName},
						</h5>
					</td>
	
				</tr>
				<tr>
	
					<td style="margin:0;padding:5px 15px;color:#0e0d0d;font-size:18px;font-family:Verdana" valign="middle">
						Thank you for signing up with Trabahanap.com. Please click the button below to verify your Company's
						email address. By confirming your account, future Trabahanap notifications will be sent to this
						email. </td>
				</tr>
				<tr>
					<td>
						<table cellpadding="0" cellspacing="0" width="600"
							style="padding:0px 33px 0px 33px;color:#4a4a4a;font-family:'Helvetica Neue',Arial,'Helvetica CY','Nimbus Sans L',sans-serif;font-size:16px;line-height:28px">
							<tbody>
								<tr>
									<td style="padding-top:30px;padding-bottom:20px">
										<div style="box-sizing:border-box; width:250px;margin-top:0; margin-bottom:2rem; margin-left:auto;margin-right:auto;padding:0;font-family:'Open Sans','Helvetica Neue','Helvetica',Helvetica,Arial,sans-serif;font-size:16px;vertical-align:top;background-color:#dd3806;border-radius:3px;text-align:center;border:solid 2px #e2d0cb;"
											valign="top">
											<a href="${constants.HOST_URL}/auth/email_verification?token=${emailVerificationToken}&email=${email}"
												style="box-sizing:border-box;font-weight:400;text-decoration:none;display:inline-block;margin:0;color:#ffffff;background-color:#dd3806;border-radius:2px;font-size:14px;padding:12px 45px"
												target="_blank">Verify</a>
										</div>
	
							</tbody>
						</table>
					</td>
				</tr>
	
				<tr style="margin:0;padding:5px 15px;color:#0e0d0d;font-size:18px;font-family:Verdana">
					<td>
						<h5>
							Link not working? Please paste this into your browser <a
								href="${constants.HOST_URL}/auth/email_verification?token=${emailVerificationToken}&email=${email}"
								target="_blank">${constants.HOST_URL}/auth/email_verification?token=${emailVerificationToken}&email=${email}</a>
						</h5>
						<span>If you didn’t request this please contact us immediately</span>
					</td>
				</tr>
				<tr >
					<td style="margin-top:0rem;padding:10px 0px;color:#0e0d0d;font-size:18px;font-family:Verdana"> 
						<span>Thank You,
						   </span>
					</td>
				   
				</tr>
				<tr>
					<td style="margin-bottom:2rem;padding:5px 0px;color:#0e0d0d;font-size:18px;font-family:Verdana">
						<span> TrabaHanap Team </span>
					 </td>
				</tr>
			</tbody>
		</table>
	</div>`
    }

    return msg;
}