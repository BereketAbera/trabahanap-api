// require('dotenv').config();

const constants = require('./../../constants');

module.exports = function construct_email_applicant(user){
    const msg = {
        to: user.email,
        from: "support@trabahanap.com",
        subject: "Email Verification",
        text: "Click hear to activate your account.",
        html: `
		<table cellpadding="0" cellspacing="0" width="600" align="center" style="font-size:0">
		<tbody>
			<tr>
				<td style="margin:0;padding:6px 15px;color:#0e0d0d;font-size:25px;font-family:Verdana" align="left" ><h5>
                Magandang araw ${user.firstName},
				</h5> </td>
				<br/>
			</tr>
			<tr>
	 
				<td style="margin:0;padding:5px 15px;color:#0e0d0d;font-size:18px;font-family:Verdana" align="left" valign="middle">
				Maraming salamat sa pag-register sa TrabaHanap! I-click ang pulang button sa ibaba upang maumpisahan mo na ang paghahanap ng trabahong swak at malapit sa'yo! 
				</td>
			</tr>
			<tr>
				<td>
					<table cellpadding="0" cellspacing="0" bgcolor="#ffffff" width="600" style="padding:0px 33px 0px 33px;color:#4a4a4a;font-family:'Helvetica Neue',Arial,'Helvetica CY','Nimbus Sans L',sans-serif;font-size:16px;line-height:28px">
						<tbody>
							<tr>
								<td style="padding-top:30px;padding-bottom:20px">
									<div  style="box-sizing:border-box; width:350px;margin-top:0; margin-bottom:0; margin-left:auto;margin-right:auto;padding:0;font-family:'Open Sans','Helvetica Neue','Helvetica',Helvetica,Arial,sans-serif;font-size:16px;vertical-align:top;background-color:#ce2127;border-radius:3px;text-align:center;border:solid 2px #e2d0cb;" valign="top">
										<a href="${constants.HOST_URL}/auth/email_verification?token=${user.emailVerificationToken}&email=${user.email}" style="box-sizing:border-box;border-color:#eb0909;font-weight:400;text-decoration:none;display:inline-block;margin:0;color:#ffffff;background-color:#ce2127;border-radius:2px;font-size:14px;padding:12px 45px" target="_blank" >Verify Email</a>
									</div>
								</div>
						</tbody>
					</table>
				</td>
			</tr>
			
			<tr style="margin:0;padding:5px 15px;color:#0e0d0d;font-size:18px;font-family:Verdana" align="left">
				<td><h6>
                    Hindi bumubukas ang confirm email button? I-paste ito sa iyong web browser: <a href="${constants.HOST_URL}/auth/email_verification?token=${user.emailVerificationToken}&email=${user.email}" target="_blank">${constants.HOST_URL}/auth/email_verification?token=${user.emailVerificationToken}&email=${user.email} </a>
				</h6> 
					<span>Para sa ibang katanungan, maaaring  mag-iwan ng mensahe sa aming support email address.</span></td>
			</tr>
			<tr style="margin:0;padding:3px 15px;color:#0e0d0d;font-size:18px;font-family:Verdana">
			<td>
				<span >Thank you,<br><br>
						TrabaHanap Team</span>
			</td>
		</tr>
		</tbody>
	</table>`
    }

    return msg;
}