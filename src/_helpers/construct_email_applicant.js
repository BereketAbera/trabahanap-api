// require('dotenv').config();

const constants = require("./../../constants");

module.exports = function construct_email_applicant(user) {
  const msg = {
    to: user.email,
    from: "support@trabahanap.com",
    subject: "Email Verification",
    text: "Click hear to activate your account.",
    html: `
		<div style="display: flex; flex-direction: column; width: 35rem; justify-content: center; align-self: center;">
    <div style="">
        <span style="font-size: 1.2rem; font-weight: 300;"> Magandang araw ${user.firstName}, </span>
    </div>

    <div style="margin: 1rem 0; ">
		Maraming salamat sa pag-register sa TrabaHanap! I-click ang pulang button sa ibaba upang 
		maumpisahan mo na ang paghahanap ng trabahong swak at malapit sa'yo! 
    </div>

    <div style="margin: 1rem 2rem;">
        <div style="box-sizing:border-box; width:250px;margin-top:0;font-family:'Open Sans','Helvetica Neue','Helvetica',Helvetica,Arial,sans-serif;font-size:16px;vertical-align:top;background-color:#aa111d;border-radius:3px;text-align:center;border:solid 2px #e2d0cb;"
            valign="top">
            <a href="${constants.HOST_URL}/auth/email_verification?token=${user.emailVerificationToken}&email=${user.email}" style="box-sizing:border-box;border-color:#eb0909;font-weight:400;text-decoration:none;display:inline-block;margin:0;color:#ffffff;background-color:#aa111d;border-radius:2px;font-size:14px;padding:12px 45px" target="_blank" >Verify Email</a>
        </div>
    </div>

    <div style="margin: 1rem 0; display: flexbox; width: 40rem;">
        <span style="align-self: left;">
            Hindi bumubukas ang confirm email button? I-paste ito sa iyong web browser: 
            <a href="${constants.HOST_URL}/auth/email_verification?token=${user.emailVerificationToken}&email=${user.email}" target="_blank">${constants.HOST_URL}/auth/email_verification?token=${user.emailVerificationToken}&email=${user.email} </a>
           
            </span>

    </div>
    <div style="margin: 1rem 0; display: flexbox; width: 40rem;">
        <span style="margin: 1rem 0;" >
            Para sa ibang katanungan, maaaring  mag-iwan ng mensahe sa aming support email address.
        </span>
    </div>
    <div>
        <span>
        Thank you, <br> 
        TrabaHanap Team 
        </span>

    </div>
</div>`
  };

  return msg;
};
