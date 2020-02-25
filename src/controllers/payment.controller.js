const axios = require("axios");
const environment = require("../environmets/environmet");
const paymentService = require('../services/payment.service');

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

function getSubscriptions(req, res, next) {
  getAllSubscriptionsHandler()
    .then(subscriptions => res.status(200).json({ success: true, subscriptions }))
    .catch(err => next(err));
}

function getSubscriptionById(req, res, next) {

  getSubscriptionHandlerById(req.params.id)
    .then(subscriptions => res.status(200).json({ success: true, subscriptions }))
    .catch(err => next(err));
}

function getSubscriptionByCompId(req, res, next) {
  getSubscriptionHandlerByCompId(req.params.compId)
    .then(subscriptions => res.status(200).json({ success: true, subscriptions }))
    .catch(err => next(err));
}
function confirmPayment(req, res, next) {
  confirmPaymentById(req.params.id)
    .then(payment => payment ? res.status(200).json({ success: true, payment }) : res.status(200).json({ success: false, error: 'Something went wrong' }))
    .catch(err => next(err));
}
async function confirmPaymentById(id) {
  const res = await paymentService.updateConfirmPaymentByTransaction(id);
  if (res.data.success) {
    return res.data.payment;
  }
}


async function addSubscriptionHandler(data) {
  const res = await axios.post(`${environment}/payment/buy_plan`, data);
  // console.log(res.data)
  if (!res || !res.data.success) {
    throw "something went wrong";
  }

  return res.data.subscription;
}

async function getUserSubscriptionHandler(UserId) {
  const res = await axios.get(
    `${environment}/payment/subscription/TRABAHANAP/${UserId}`
  );

  // console.log(res.data)

  if (!res || !res.data.success) {
    throw "something went wrong";
  }

  return res.data.subscription;
}


async function getSubscriptionHandlerByCompId(id) {
  const res = await paymentService.getSubscriptionByCompanyId(id);
  if (res.data.success) {
    return res.data.subscription;
  }
}


async function getSubscriptionHandlerById(id) {
  const res = await paymentService.getSubscriptionById(id);
  // console.log(res.data)
  if (res.data.success) {
    return res.data.subscription;
  }
}
async function getAllSubscriptionsHandler() {
  const res = await paymentService.getAllSubscriptions();
  // console.log(res.data)
  if (res.data.success) {
    return res.data.subscriptions
  }
}

async function purchaseSubscriptionHandler(id) {
  const purchase = await axios.post(`${environment}/payment/purchase/cv/${id}`)
  //console.log(purchase.data)
  if (!purchase || !purchase.data.success) {
    throw "something went wrong";
  }

  return purchase.data.subscription;

}

module.exports = {
  addSubscription,
  getUserSubscription,
  purchaseSubscription,
  getSubscriptions,
  getSubscriptionById,
  getSubscriptionByCompId,
  confirmPayment
};
