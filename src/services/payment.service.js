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
async function getSubscriptionByCompanyId(compId){
    return await axios.get(`${environment}/payment/company/subscription_transaction/${compId}`);   
}
async function updateConfirmPaymentByTransaction(id){
    return await axios.put(`${environment}/payment/subscription_transaction/${id}`);   
}

module.exports = {
    getAllSubscriptions,
    getSubscriptionById,
    getSubscriptionByCompanyId,
    updateConfirmPaymentByTransaction,
};
