const axios = require("axios");
const environment = require("../environmets/environmet");

function addSubscription(req, res, next) {
  const { type, name } = req.body;
  const UserId = req.user.sub;

  if (!type || !name || !UserId) {
    res.status(200).json({ success: false, error: "invalid request" });
    return;
  }

  addSubscriptionHandler({ ...req.body, UserId })
    .then(subscription => res.status(200).json({ success: true, subscription }))
    .catch(err => next(err));
}

function purchaseSubscription(req, res, next) {

  purchaseSubscriptionHandler(req.params.id)
    .then(subscription => res.status(200).json({ success: true, subscription }))
    .catch(err => next(err));
}

function getUserSubscription(req, res, next) {
  const UserId = req.user.sub;

  getUserSubscriptionHandler(UserId)
    .then(subscription => res.status(200).json({ success: true, subscription }))
    .catch(err => next(err));
}

async function addSubscriptionHandler(data) {
  const res = await axios.post(`${environment}/payment/buy_plan`, data);

  if (!res || !res.data.success) {
    throw "something went wrong";
  }

  return res.data.subscription;
}

async function getUserSubscriptionHandler(UserId) {
  const res = await axios.get(
    `${environment}/payment/subscription/TRABAHANAP/${UserId}`
  );

  if (!res || !res.data.success) {
    throw "something went wrong";
  }

  return res.data.subscription;
}

async function purchaseSubscriptionHandler(id){
  const purchase = await axios.post(`${environment}/purchase/cv/${id}`)

  if (!purchase || !purchase.data.success) {
    throw "something went wrong";
  }

  return purchase.data.subscription;

}

module.exports = {
  addSubscription,
  getUserSubscription,
  purchaseSubscription,
};
