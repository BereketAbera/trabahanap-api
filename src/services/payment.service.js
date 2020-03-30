const environment = require("../environmets/environmet");
const axios = require("axios");

async function getAllSubscriptions() {
  const applicationId = "TRABAHANAP";
  return await axios.get(
    `${environment}/payment/subscription/${applicationId}`
  );
}
async function getSubscriptionById(id) {
  // const applicationId = 'TRABAHANAP'
  return await axios.get(
    `${environment}/payment/subscription_transaction/${id}`
  );
}
async function getSubscriptionByCompanyId(compId,page,pageSize){
    return await axios.get(`${environment}/payment/company/subscription_transaction/${compId}?page=${page}&pageSize=${pageSize}`);   
}
async function updateConfirmPaymentByTransaction(id,body){
    return await axios.put(`${environment}/payment/subscription_transaction/${id}`,{...body});   
}

async function depositMoneyForCompany(data){
    return await axios.post(`${environment}/payment/deposit`,{...data});   
}

async function getBalanceByCompanyId(id){
    return await axios.get(`${environment}/payment/balance/${id}`);
}

async function getSubscriptionByCompanyId(compId) {
  return await axios.get(
    `${environment}/payment/company/subscription_transaction/${compId}`
  );
}
async function updateConfirmPaymentByTransaction(id) {
  return await axios.put(
    `${environment}/payment/subscription_transaction/${id}`
  );
}

async function getAllPlanTypes() {
  return await axios
    .get(`${environment}/payment/payment_plan_types`)
    .catch(err => console.log(err));
}

async function getPlanType(id) {
  return await axios
    .get(`${environment}/payment/payment_plan_types/${id}`)
    .catch(err => console.log(err));
}

async function createPaymentPlanType(payment_plan_type) {
  //   console.log(payment_plan_type);
  return await axios
    .post(`${environment}/payment/payment_plan_types`, payment_plan_type)
    .catch(err => console.log(err));
}

async function updatePaymentPlanType(payment_plan_type) {
  return await axios
    .put(`${environment}/payment/payment_plan_types`, payment_plan_type)
    .catch(err => console.log(err));
}

module.exports = {
  getAllSubscriptions,
  getSubscriptionById,
  getSubscriptionByCompanyId,
  updateConfirmPaymentByTransaction,
  getAllPlanTypes,
  createPaymentPlanType,
  updatePaymentPlanType,
  getPlanType,
  depositMoneyForCompany,
  getBalanceByCompanyId,
};

