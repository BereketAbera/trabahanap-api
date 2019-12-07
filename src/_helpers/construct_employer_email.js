
const constants = require('./../../constants');

module.exports = function constractStafferEmail(email, token){
    const msg = {
        to: email,
        from: "support@trabahanap.com",
        subject: "Employer Invitations",
        text: "Click hear to accept invitation",
        html: `
            <table cellpadding="0" cellspacing="0" width="600" align="center" style="font-size:0">
	            <tbody>
	                <tr>
		                <td style="margin:0;padding:5px 15px;background:#ff5722;color:#ffffff;font-size:25px;font-family:Verdana" align="left" valign="middle">
			                Employer Invitation
						</td>
						
	                </tr>
	                <tr>
		                <td>
			                <table cellpadding="0" cellspacing="0" bgcolor="#ffffff" width="600" style="padding:0px 33px 0px 33px;color:#4a4a4a;font-family:'Helvetica Neue',Arial,'Helvetica CY','Nimbus Sans L',sans-serif;font-size:16px;line-height:28px">
								<tbody>
								   
				                    <tr>
										<td style="padding-top:30px;padding-bottom:20px">
											<div align="center" bgcolor="#348eda" style="box-sizing:border-box; width:250px;margin-top:0; margin-bottom:0; margin-left:auto;margin-right:auto;padding:0;font-family:'Open Sans','Helvetica Neue','Helvetica',Helvetica,Arial,sans-serif;font-size:16px;vertical-align:top;background-color:#348eda;border-radius:2px;text-align:center" valign="top">
												<a href="${constants.HOST_URL}/auth/employer_password/${email}/${token}" style="box-sizing:border-box;border-color:#348eda;font-weight:400;text-decoration:none;display:inline-block;margin:0;color:#ffffff;background-color:#348eda;border:solid 1px #348eda;border-radius:2px;font-size:14px;padding:12px 45px" target="_blank" >Accept Invitation</a>
											</div>
										</div>
				                </tbody>
			                </table>
		                </td>
	                </tr>
	            </tbody>
            </table>`
    }

    return msg;
}