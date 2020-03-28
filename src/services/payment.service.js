const environment = require("../environmets/environmet");
const axios = require("axios");

async function getAllSubscriptions() {
    const applicationId = 'TRABAHANAP'
    return await axios.get(`${environment}/payment/subscription/${applicationId}`);
}
async function getSubscriptionById(id) {
    // const applicationId = 'TRABAHANAP'
    return await axios.get(`${environment}/payment/subscription_transaction/${id}`);
}
async function getSubscriptionByCompanyId(compId,page,pageSize){
    return await axios.get(`${environment}/payment/company/subscription_transaction/${compId}?page=${page}&pageSize=${pageSize}`);   
}
async function updateConfirmPaymentByTransaction(id,body){
    return await axios.put(`${environment}/payment/subscription_transaction/${id}`,{...body});   
}
async function payExemptApiService(id,body){
    return await axios.put(`${environment}/payment/pay/exempt/${id}`,{...body});   
}
async function depositMoneyForCompany(data){
    return await axios.post(`${environment}/payment/deposit`,{...data});   
}

async function getBalanceByCompanyId(id){
    return await axios.get(`${environment}/payment/balance/${id}`);
}
async function payFromBalance(id){
    return await axios.get(`${environment}/payment/pay/${id}`);   
}
module.exports = {
    getAllSubscriptions,
    getSubscriptionById,
    getSubscriptionByCompanyId,
    updateConfirmPaymentByTransaction,
    payExemptApiService,
    depositMoneyForCompany,
    getBalanceByCompanyId,
    payFromBalance
};
