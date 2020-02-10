// require('dotenv').config();

const constants = require('./../../constants');

module.exports = function constractStafferEmail(firstName, email, token){
    const msg = {
        to: email,
        from: "support@trabahanap.com",
        subject: "Staffer Invitations",
        text: "Click hear to accept invitation",
        html: `
		<div style="display: flex-box; flex-direction: column; width: 35rem; justify-content: center; align-self: center;">
    <div style="margin:1rem 0;display: block;">
        <span style="font-size: 1.2rem; font-weight: 300; color:black"> Dear ${firstName},  </span>
    </div>

    <div style="margin: rem 0; display: block;color:black">
        You have been provided a staff adminstration access to Trabahanap.com. 
        Please click the button below to verify your email address and reset your password.
         By confirming your account, you will assume the admin staff privilege right away.

    </div>

    <div style="margin: 1rem 2rem;display: block;">
        <div style="box-sizing:border-box; width:250px;margin-top:0;font-family:'Open Sans','Helvetica Neue','Helvetica',Helvetica,Arial,sans-serif;font-size:16px;vertical-align:top;background-color:#aa111d;border-radius:3px;text-align:center;border:solid 2px #e2d0cb;"
            valign="top">
            <a href="${constants.HOST_URL}/auth/reset_password/${email}/${token}" style="box-sizing:border-box;border-color:#aa111d;font-weight:400;text-decoration:none;display:inline-block;margin:0;color:#ffffff;background-color:#aa111d;border:solid 1px #aa111d;border-radius:2px;font-size:14px;padding:12px 45px" target="_blank" >Accept Invitation</a>		
        </div>
    </div>

    <div style="margin: 1rem 0; width: 40rem;display: block;">
        <span>
            Link not working? Please paste this into your browser
             <a href="${constants.HOST_URL}/auth/reset_password/${email}/${token}" target="_blank">${constants.HOST_URL}/auth/reset_password/${email}/${token}
        
            </a>
           
            </span>

    </div>
    <div style="margin: 1rem 0; width: 40rem;display: block;">
        <span style="margin: 1rem 0; color:black" >
            If you didn’t request this please contact us immediately
        </span>
    </div>
    <div>
        <span style="color:black;">
            TrabaHanap Team <br> 
            Thank you, 
        </span>

    </div>
</div>`
    }

    return msg;
}
