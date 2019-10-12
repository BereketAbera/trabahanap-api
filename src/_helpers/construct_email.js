module.exports = function constructEmail(user){
    const msg = {
        to: user.email,
        from: "support@trabahanap-backend.herokuapp.com",
        subject: "Email Verification",
        text: "Click hear to activate your account.",
        html: `
            <table cellpadding="0" cellspacing="0" width="600" align="center" style="font-size:0">
	            <tbody>
	                <tr>
		                <td style="margin:0;padding:5px 15px;background:#ff5722;color:#ffffff;font-size:25px;font-family:Verdana" align="left" valign="middle">
			                Email Varification
		                </td>
	                </tr>
	                <tr>
		                <td>
			                <table cellpadding="0" cellspacing="0" bgcolor="#ffffff" width="600" style="padding:0px 33px 0px 33px;color:#4a4a4a;font-family:'Helvetica Neue',Arial,'Helvetica CY','Nimbus Sans L',sans-serif;font-size:16px;line-height:28px">
				                <tbody>
				                    <tr>
					                    <td style="padding-top:30px;padding-bottom:20px">
						                    <h4>
							                    Click <a href="${process.env.HOST_URL}/auth/email_verification?token=${user.emailVerificationToken}&email=${user.email}" target="_blank">hear ${process.env.HOST_URL}/verification?token=${user.emailVerificationToken}</a> to activate your account.
						                    </h4>
				                </tbody>
			                </table>
		                </td>
	                </tr>
	            </tbody>
            </table>`
    }

    return msg;
}