// require('dotenv').config();

const constants = require('./../../constants');

module.exports = function constractStafferEmail(firstName, email, token){
    const msg = {
        to: email,
        from: "support@trabahanap.com",
        subject: "Staffer Invitations",
        text: "Click hear to accept invitation",
        html: `
		<table cellpadding="0" cellspacing="0" width="600" align="center" style="font-size:0">
		<tbody>
			<tr>
				<td style="margin:0;padding:6px 15px;color:#0e0d0d;font-size:25px;font-family:Verdana" align="left" ><h5>
						Dear ${firstName}, 
				</h5> </td>
				<br/>
			</tr>
			<tr>
	 
				<td style="margin:0;padding:5px 15px;color:#0e0d0d;font-size:18px;font-family:Verdana" align="left" valign="middle">
				Welcome to Trabahanap.com. Please click the button below to verify your email address and reset your password. By confirming your account, future Trabahanap notifications will be sent to this email.
				</td>
			</tr>
			<tr>
				<td>
					<table cellpadding="0" cellspacing="0" bgcolor="#ffffff" width="600" style="padding:0px 33px 0px 33px;color:#4a4a4a;font-family:'Helvetica Neue',Arial,'Helvetica CY','Nimbus Sans L',sans-serif;font-size:16px;line-height:28px">
						<tbody>
							<tr>
								<td style="padding-top:30px;padding-bottom:20px">
									<div  style="box-sizing:border-box; width:250px;margin-top:0; margin-bottom:0; margin-left:auto;margin-right:auto;padding:0;font-family:'Open Sans','Helvetica Neue','Helvetica',Helvetica,Arial,sans-serif;font-size:16px;vertical-align:top;background-color:#aa111d;border-radius:3px;text-align:center;border:solid 2px #e2d0cb;" valign="top">
									<a href="${constants.HOST_URL}/auth/reset_password/${email}/${token}" style="box-sizing:border-box;border-color:#348eda;font-weight:400;text-decoration:none;display:inline-block;margin:0;color:#ffffff;background-color:#aa111d;border:solid 1px #348eda;border-radius:2px;font-size:14px;padding:12px 45px" target="_blank" >Accept Invitation</a>								</div>
						</tbody>
					</table>
				</td>
			</tr>
			
			<tr style="margin:0;padding:5px 15px;color:#0e0d0d;font-size:18px;font-family:Verdana" align="left">
				<td><h6>
						Link not working? Please paste this into your browser <a href="${constants.HOST_URL}/auth/reset_password/${email}/${token}" target="_blank">${constants.HOST_URL}/auth/reset_password/${email}/${token}</a>
				</h6> 
				<span>If you didn’t request this please contact us immediately</span></td>
			</tr>
			<tr style="margin:0;padding:5px 15px;color:#0e0d0d;font-size:18px;font-family:Verdana">
			<td>
				<span>Thank You,<br>
						TrabaHanap Team</span>
			</td>
		</tr>
		</tbody>
	</table>`
    }

    return msg;
}
