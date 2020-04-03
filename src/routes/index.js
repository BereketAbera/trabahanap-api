const app = (module.exports = require("express")());
const ROLE = require("../_helpers/role");
const autorize = require("../_helpers/autorize");
require("../database/connection");

app.use("/api/auth", require("./auth"));
app.use("/api/applicant", autorize(ROLE.APPLICANT), require("./applicant"));
app.use(
  "/api/employer",
  autorize([ROLE.EMPLOYER, ROLE.STAFFER]),
  require("./employer")
);
app.use(
  "/api/admin",
  autorize([ROLE.ADMIN, ROLE.ADMINSTAFF, ROLE.ADMINADS]),
  require("./admin")
);
app.use("/api/", require("./anonymous"));

// the catch all route
app.all("/*", (req, res) => {
  res.status(404).send({ msg: "not found" });
});
