const migrationAuthService = require("../services/migration_auth.service");
const otherService = require("../services/other.service");
const userService = require("../services/user.service");
const axios = require("axios");
const environment = require("../environmets/environmet");
const CONSTANTS = require("../../constants");
const jwt = require("jsonwebtoken");

const accountSid = "ACbb3139f95a4e46152c305a52ff668c27";
const authToken = "c68cd6a4d8222216c11f22cf4e3e2d22";

const twilio = require("twilio")(accountSid, authToken);

function getUserByEmail(req, res, next) {
  const email = req.params.email;
  if (!email) {
    throw "invalid request";
  }

  getUserByEmailHandler(email)
    .then(user => res.status(200).send({ success: true, user }))
    .catch(err => next("Can not Login"));
}

function validateUser(req, res, next) {
  const user = req.body;
  if (!user.email) {
    throw "invalid request";
  }

  validateUserHandler(user)
    .then(user => res.status(200).send({ success: true, user }))
    .catch(err => next("Internal Server Error! Try again"));
}

function setPassword(req, res, next) {
  const { password, confirmPassword, token } = req.body;
  if (!password || !confirmPassword || !token) {
    throw "invalid request";
  }

  if (password != confirmPassword) {
    throw "password not the same";
  }

  setPasswordHandler({ password, token })
    .then(success => res.status(200).send({ success }))
    .catch(err => next("Internal Server Error! Try again"));
}

function sendSMS(req, res, next) {
  let { email } = req.params;
  if (!email) {
    throw "invalid request";
  }

  sendSMSHandler(email)
    .then(success => res.status(200).send({ success }))
    .catch(err => next("Internal Server Error! Try again"));
}

function confirmSMSPasscode(req, res, next) {
  let { passcode, email } = req.body;
  if (!passcode || !email) {
    throw "invalid request";
  }

  confirmSMSPasscodeHandler(passcode, email)
    .then(user => res.status(200).send({ success: true, user }))
    .catch(err => next("Internal Server Error! Try again"));
}

async function getUserByEmailHandler(email) {
  const user = await migrationAuthService.getUserByEmail(email);

  if (!user) {
    throw "user does not exist";
  }
  let ligUser = await axios.get(`${environment}/auth/user/${email}`);
  ligUser = ligUser.data;
  if (!ligUser || !ligUser.success || !ligUser.user) {
    throw "something went wrong";
  }

  ligUser = ligUser.user;
  if (ligUser.password == null) {
    return {
      email: ligUser.email,
      hasPassword: false,
      hasPhoneNumber: !!user.phoneNumber,
      phoneNumber: user.phoneNumber.slice(user.phoneNumber.length - 4)
    };
  } else {
    return {
      email: ligUser.email,
      hasPassword: true
    };
  }
}

async function validateUserHandler(user) {
  const validUser = await migrationAuthService.getUserByEmail(user.email);
  if (!validUser) {
    throw "user does not exist";
  }
  let count = 0;
  validUser.firstName.toLowerCase() == user.firstName.toLowerCase()
    ? count++
    : "";
  validUser.lastName.toLowerCase() == user.lastName.toLowerCase()
    ? count++
    : "";
  validUser.phoneNumber == user.phoneNumber ? count++ : "";

  // console.log(user);
  if (count >= 2) {
    return {
      email: validUser.email,
      valid: true,
      token: jwt.sign(
        { email: validUser.email, fromEmail: false },
        CONSTANTS.JWTPASSWORDSECRET,
        { expiresIn: "5m" }
      )
    };
  } else {
    return {
      email: validUser.email,
      valid: false
    };
  }
}

async function setPasswordHandler(obj) {
  try {
    var decoded = jwt.verify(obj.token, CONSTANTS.JWTPASSWORDSECRET);
  } catch {
    throw "invalid token";
  }

  let ligUser = await axios.post(`${environment}/auth/set_password`, {
    email: decoded.email,
    password: obj.password
  });

  await userService.updateUserByEmail(decoded.email, {
    verifiedByEmail: decoded.fromEmail
  });

  ligUser = ligUser.data;
  // console.log(ligUser);
  if (ligUser.success) {
    return true;
  } else {
    false;
  }
}

async function sendSMSHandler(email) {
  const randomNumber = Math.floor(Math.random() * 900000) + 100000;
  const user = await userService.getUserByEmail(email);
  if (!user) {
    throw "invalid request";
  }
  const saveToken = await otherService.saveToken(randomNumber, email);

  if (!saveToken) {
    throw "something went wrong";
  }

  let phoneNumber = user.phoneNumber;
  if (phoneNumber[0] != "+") {
    phoneNumber = "+" + phoneNumber;
  }

  const messageSent = await twilio.messages.create({
    to: phoneNumber,
    from: "+17039409429",
    body: `Comfirmation No: ${randomNumber}`
  });

  if (!messageSent) {
    return false;
  }

  return true;
}

async function confirmSMSPasscodeHandler(passcode, email) {
  const user = await migrationAuthService.getUserByEmail(email);
  if (!user) {
    throw "user not found";
  }

  const token = await otherService.getTokenByEmailAndToken(email, passcode);
  if (!token) {
    throw "can not verify";
  }

  // console.log(email, passcode);

  if (token.token != passcode) {
    throw "invalid passcode";
  }

  await otherService.updateToken(token.token, { expired: true });

  return {
    email: user.email,
    valid: true,
    token: jwt.sign({ email: user.email }, CONSTANTS.JWTPASSWORDSECRET, {
      expiresIn: "5m"
    })
  };
}

module.exports = {
  getUserByEmail,
  validateUser,
  setPassword,
  sendSMS,
  confirmSMSPasscode
};
