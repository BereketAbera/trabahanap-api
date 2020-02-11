// require('dotenv').config();

const constants = require('./../../constants');

module.exports = function constractResetEmail(firstName, email, token) {
	const msg = {
		to: email,
		from: "support@trabahanap.com",
		subject: "Reset Password",
		text: "Click hear to rest password",
		html: `
		<div style="display: block; background: rgb(240, 240, 240);">
    <div style=" display: block;margin-left: auto;margin-right: auto; width: 50%; float:center; padding: 1.8rem; background:white;  flex-direction: column;  justify-content: center; align-self: center;">
        <div style="margin:1rem 0;display: block;">
            <span style="font-size: 1.5rem; font-family: Arial, Helvetica, sans-serif;  font-weight: 600; color:black"> Reset your password? </span>
        </div>
    
        <div style="margin: 1rem 0; display: block;color:black; font-size: 1rem; font-family: sans-serif;  font-weight: 300;">
            You can set a new password now! Click the link below. 
        </div>
    
        <div style="margin: 1rem 2rem;display: block;">
            <div style="box-sizing:border-box; width:250px;margin-top:0;font-family:'Open Sans','Helvetica Neue','Helvetica',Helvetica,Arial,sans-serif; font-weight: 600; font-size:16px;vertical-align:top;background-color:#aa111d;border-radius:3px;text-align:center;border:solid 2px #e2d0cb;"
                valign="top">
                <a href="${constants.HOST_URL}/auth/reset_password/${email}/${token}" style="box-sizing:border-box;border-color:#aa111d;font-family:'Open Sans','Helvetica Neue','Helvetica',Helvetica,Arial,sans-serif; font-weight: 600;text-decoration:none;display:inline-block;margin:0;color:#ffffff;background-color:#aa111d;border:solid 1px #aa111d;border-radius:2px;font-size:14px;padding:12px 45px" target="_blank" >Reset Your Password</a>		
            </div>
        </div>
    
        <div style="margin: 2rem 0; width: 40rem;display: block;">
            <span style="font-family: Arial, Helvetica, sans-serif; font-size: 1rem;">
                Link not working? <br> Please paste this into your browser
                 <a style="display: block;" href="${constants.HOST_URL}/auth/reset_password/${email}/${token}" target="_blank">${constants.HOST_URL}/auth/reset_password/${email}/${token}
            
                </a>
               
                </span>
    
        </div>
        <div style="margin: 1rem 0; width: 40rem;display: block;">
            <span style="margin: 1rem 0; display: block; color:black;font-size: 1rem; font-family: Arial, Helvetica, sans-serif;" >
                If you didn’t request this please contact us immediately
            </span>
        </div>
        <div>
            <span style="font-size: 1rem; display: block; color:black;padding: 1rem 0; font-family: Arial, Helvetica, sans-serif;">
                TrabaHanap Team <br> 
                Thank you, 
            </span>
    
        </div>
    </div>
</div>


`
	}

	return msg;
}
