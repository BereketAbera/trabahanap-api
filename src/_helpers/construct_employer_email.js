
const constants = require('./../../constants');

module.exports = function constractStafferEmail(email,firstName, token){
    const msg = {
        to: email,
        from: "support@trabahanap.com",
        subject: "Employer Invitations",
        text: "Click hear to accept invitation",
        html: `
		<div>
  <div id="yiv9943655852">
    <style type="text/css">
      #yiv9943655852 html {
        font-size: 100%;
      }

      #yiv9943655852 body {
        margin: 0;
        font-family: Helvetica, Arial, sans-serif;
        font-size: 14px;
        line-height: 18px;
        color: #0e1724;
        background-color: #fff;
      }

      #yiv9943655852 a {
        color: #0087e0;
        text-decoration: none;
        border: 0;
      }

      #yiv9943655852 a:hover {
        color: #139ff0;
        text-decoration: underline;
      }

      #yiv9943655852 p {
        padding: 0 !important;
        margin: 0 !important;
        color: #0e1724;
      }

      #yiv9943655852 img {
        border: none;
      }
    </style>
    <div>
      <table
        align="center"
        height="100%"
        width="100%"
        border="0"
        cellspacing="0"
        cellpadding="0"
        bgcolor="#f0f0f0"
      >
        <tbody>
          <tr>
            <td>
              <table
                width="690"
                align="center"
                border="0"
                cellspacing="0"
                cellpadding="0"
              >
                <tbody>
                  <tr style="background-color:#f0f0f0;">
                    <td width="100%" align="center">
                      <a
                        rel="nofollow"
                        target="_blank"
                        href="https://trabahanap.com"
                        ><img
                          src="https://trabahanap.com/assets/img/th_logo-2.png"
                          alt="TrabaHanap"
                          style="display:block;padding:30px;"
                          width="80"
                          border="0"
                      /></a>
                    </td>
                  </tr>
                  <tr>
                    <td width="100%" align="center">
                      <table
                        width="690"
                        cellspacing="0"
                        cellpadding="0"
                        border="0"
                        bgcolor="#ffffff"
                        align="center"
                      >
                        <tbody>
                          <tr>
                            <td
                              style="color:#0E1724;text-align:left;font-family:Helvetica, Arial, sans-serif;font-size:16px;line-height:28px;"
                              width="100%"
                              align="center"
                            ></td>
                          </tr>
                          <tr>
                            <td align="center" width="100%">
                              <table
                                width="100%"
                                align="center"
                                border="0"
                                cellspacing="0"
                                cellpadding="0"
                              >
                                <tbody>
                                  <tr bgcolor="#ffffff">
                                    <td>
                                      <table
                                        width="630"
                                        align="center"
                                        border="0"
                                        cellspacing="0"
                                        cellpadding="0"
                                      >
                                        <tbody>
                                          <tr>
                                            <td colspan="3" height="40"></td>
                                          </tr>
                                          <tr>
                                            <td colspan="3">
                                              <h1
                                                style="font-family:Helvetica, Arial, sans-serif;color:#1f2836;font-size:30px;line-height:27px;font-weight:bold;padding:0;margin:0;font-size:36px;line-height:43px;"
                                              >
                                                Welcome to TrabaHanap.com
                                              </h1>
                                              <br /><br />
                                              <p
                                                style="font-family:Helvetica, Arial, sans-serif;color:#1f2836;font-size:18px;line-height:27px;font-weight:bold;padding:0;margin:0;"
                                              >
                                                Hi ${firstName}
                                              </p>
                                            </td>
                                          </tr>
                                          <tr>
                                            <td colspan="3" height="12"></td>
                                          </tr>
                                          <tr>
                                            <td colspan="3">
                                              <p
                                                style="font-family:Helvetica, Arial, sans-serif;color:#1f2836;font-size:18px;line-height:27px;font-weight:normal;padding:0;margin:0;"
                                              >
                                                Welcome to Trabahanap.com.
                                                Please click the button below to
                                                verify your email address and
                                                reset your password. By
                                                confirming your account, future
                                                Trabahanap notifications will be
                                                sent to this email.
                                              </p>
                                            </td>
                                          </tr>
                                          <tr>
                                            <td colspan="3" height="40"></td>
                                          </tr>
                                          <tr>
                                            <td width="30"></td>
                                            <td align="left">
                                              <table
                                                width="260"
                                                border="0"
                                                cellpadding="0"
                                                cellspacing="0"
                                              >
                                                <tbody>
                                                  <tr>
                                                    <td
                                                      align="center"
                                                      height="44"
                                                      style="border-radius:8px;font-weight:bold;font-family:Helvetica, Arial, sans-serif;background-color:#aa111d;"
                                                    >
                                                      <span
                                                        style="font-family:Helvetica, Arial, sans-serif;font-weight:bold;"
                                                        ><a
                                                          rel="nofollow"
                                                          target="_blank"
                                                          href="${constants.HOST_URL}/auth/reset_password/${email}/${token}"
                                                          style="font-weight:bold;color:#ffffff;text-decoration:none;font-size:18px;line-height:44px;display:block;width:100%;"
                                                          >Accept Invitation
                                                        </a></span
                                                      >
                                                    </td>
                                                  </tr>
                                                </tbody>
                                              </table>
                                            </td>
                                          </tr>

                                          <tr>
                                            <td colspan="3" height="40"></td>
                                          </tr>
                                          <tr>
                                            <td
                                              colspan="3"
                                              style="padding:0;margin:0;font-size:1;line-height:0;"
                                            >
                                              <p
                                                style="font-family:Helvetica, Arial, sans-serif;color:#1f2836;font-size:18px;line-height:27px;font-weight:normal;padding:0;margin:0;"
                                              >
                                                Link not working? Please paste
                                                this into your browser
                                                <a
                                                  rel="nofollow"
                                                  target="_blank"
                                                  href="${constants.HOST_URL}/auth/reset_password/${email}/${token}"
                                                  style="font-weight:bold;text-decoration:none;color:#217dc6;"
                                                >
                                                  ${constants.HOST_URL}/auth/reset_password/${email}/${token}</a
                                                >
                                              </p>
                                            </td>
                                          </tr>
                                          <tr>
                                            <td colspan="3" height="40"></td>
                                          </tr>
                                          <tr>
                                            <td
                                              colspan="3"
                                              style="padding:0;margin:0;font-size:1;line-height:0;"
                                            >
                                              <p
                                                style="font-family:Helvetica, Arial, sans-serif;color:#1f2836;font-size:18px;line-height:27px;font-weight:normal;padding:0;margin:0;"
                                              >
                                                If you didn’t request this
                                                please contact us immediately
                                              </p>
                                            </td>
                                          </tr>

                                          <tr>
                                            <td colspan="3" height="40"></td>
                                          </tr>
                                        </tbody>
                                      </table>
                                    </td>
                                  </tr>
                                </tbody>
                              </table>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                      <table
                        width="690"
                        cellspacing="0"
                        cellpadding="0"
                        bgcolor="#ffffff"
                        border="0"
                        align="center"
                      >
                        <tbody>
                          <tr>
                            <td>
                              <div
                                style="font-size:18px;line-height:20px;padding:0px 30px;"
                              >
                                Regards,
                              </div>
                              <div
                                style="font-size:18px;line-height:26px;font-weight:bold;padding:0px 30px;"
                              >
                                TrabaHanap Team
                              </div>
                            </td>
                          </tr>
                          <tr>
                            <td height="30"></td>
                          </tr>
                        </tbody>
                      </table>
                    </td>
                  </tr>
                </tbody>
              </table>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</div>`
    }

    return msg;
}

