const axios = require("axios");
const environment = require("../environmets/environmet");
const paymentService = require("../services/payment.service");
const userService = require("../services/user.service");

function addSubscription(req, res, next) {
  const { type, name } = req.body;
  const UserId = req.user.sub;

  if (!type || !name || !UserId) {
    res.status(200).json({ success: false, error: "invalid request" });
    return;
  }

  addSubscriptionHandler({ ...req.body, UserId })
    .then(subscription => res.status(200).json({ success: true, subscription }))
    .catch(err => next("Internal Server Error! Try again"));
}

function purchaseSubscription(req, res, next) {
  purchaseSubscriptionHandler(req.params.id)
    .then(subscription => res.status(200).json({ success: true, subscription }))
    .catch(err => next("Internal Server Error! Try again"));
}

function getUserSubscription(req, res, next) {
  const UserId = req.user.sub;

  getUserSubscriptionHandler(UserId)
    .then(subscription => res.status(200).json({ success: true, subscription }))
    .catch(err => next("Internal Server Error! Try again"));
}

function getSubscriptions(req, res, next) {
  getAllSubscriptionsHandler()
    .then(subscriptions =>
      res.status(200).json({ success: true, subscriptions })
    )
    .catch(err => next("Internal Server Error! Try again"));
}

function getSubscriptionById(req, res, next) {
  getSubscriptionHandlerById(req.params.id)
    .then(subscriptions =>
      res.status(200).json({ success: true, subscriptions })
    )
    .catch(err => next("Internal Server Error! Try again"));
}

function getBalance(req, res, next) {
  getBalanceHandlerById(req.params.id)
    .then(balance => res.status(200).json({ success: true, balance }))
    .catch(err => next("Internal Server Error! Try again"));
}

function getSubscriptionByCompId(req, res, next) {
  getSubscriptionHandlerByCompId(
    req.params.compId,
    req.query.page || 0,
    req.query.pageSize || 5
  )
    .then(subscriptions =>
      res.status(200).json({ success: true, subscriptions })
    )
    .catch(err => next("Internal Server Error! Try again"));
}
function confirmPayment(req, res, next) {
  confirmPaymentById(req.params.id, req.user.sub, req.body)
    .then(payment =>
      payment
        ? res.status(200).json({ success: true, payment })
        : res
            .status(200)
            .json({ success: false, error: "Something went wrong" })
    )
    .catch(err => next("Internal Server Error! Try again"));
}



function depositMoney(req, res, next) {
  depositMoneyByCompany(req.params.id,req.user.sub, req.body)
    .then(deposit =>
      deposit
        ? res.status(200).json({ success: true, deposit })
        : res
            .status(200)
            .json({ success: false, error: "Something went wrong" })
    )
    .catch(err => next("Internal Server Error! Try again"));
}

async function depositMoneyByCompany(compId,userId, body) {
  const deposit = await paymentService.depositMoneyForCompany({ compId, body,userId });
  // console.log(deposit);
  if (deposit.data) {
    return deposit.data;
  }
}

async function confirmPaymentById(id, userId, body) {
  const res = await paymentService.updateConfirmPaymentByTransaction(id, body);
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

async function getSubscriptionHandlerByCompId(id, page, pageSize) {
  const pager = {
    pageSize: parseInt(pageSize),
    totalItems: 0,
    totalPages: 0,
    currentPage: parseInt(page)
  };
  const offset = (page - 1) * pager.pageSize;
  const limit = pager.pageSize;

  const res = await paymentService.getSubscriptionByCompanyId(id,offset,limit);
  if (res.data.success) {
   
    pager.totalItems = res.data.subscription.total
    pager.totalPages = Math.ceil(pager.totalItems / pager.pageSize);
    return {subs:res.data.subscription.sub,pager};
  }
}

async function getSubscriptionHandlerById(id) {
  const res = await paymentService.getSubscriptionById(id);
  // console.log(res.data)
  if (res.data.success) {
    return res.data.subscription;
  }
}

async function getBalanceHandlerById(id) {
  const res = await paymentService.getBalanceByCompanyId(id);
  // console.log(res.data);
  if (res.data.success) {
    return res.data.balance;
  }
}
async function getAllSubscriptionsHandler() {
  const res = await paymentService.getAllSubscriptions();
  // console.log(res.data)
  if (res.data.success) {
    return res.data.subscriptions;
  }
}

async function purchaseSubscriptionHandler(id) {
  const purchase = await axios.post(`${environment}/payment/purchase/cv/${id}`);
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
  confirmPayment,
  depositMoney,
  getBalance
};
