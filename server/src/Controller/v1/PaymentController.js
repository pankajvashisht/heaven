const ApiController = require("./ApiController");
const Db = require("../../../libary/sqlBulider");
const ApiError = require('../../Exceptions/ApiError');

let apis = new ApiController();
let DB = new Db();
module.exports = {
  addSeed: async (request) => {
    const required = {
      church_name: request.body.church_name,
      return_expection: request.body.return_expection,
      earth_measure : request.body.earth_measure,
      heaven_measure : request.body.heaven_measure,
      balance_based_per : request.body.balance_based_per,
      amount: request.body.amount,
      description : request.body.description,
      user_id: request.body.user_id,
    };
    const requestData = await apis.vaildation(required, {});
    const insert_id = await DB.save('seeds', requestData);
    const transactions = {
      type: 1,
      user_id: requestData.user_id,
      amount:  requestData.amount,
      type_id: insert_id,
      description: requestData.description,
      total: request.body.userInfo.total_amount+requestData.amount
    };
    updateUserAmount({amount:transactions.total, user_id: requestData.user_id});
    addTransacrions(transactions);
    requestData.id = insert_id;
    return {
      message: "Seed added successfully ",
      data: requestData
    };
  },
  addTithe: async (Request) => {
    const required = {
      church_name: Request.body.church_name,
      turn_over: Request.body.turn_over,
      sale_cost: Request.body.sale_cost,
      gross_income: Request.body.gross_income,
      time: Request.body.time,
      balance: Request.body.balance,
      description: Request.body.description,
      user_id: Request.body.user_id,
    };
    const requestData = await apis.vaildation(required, {});
    const insert_id = await DB.save('tithe', requestData);
    requestData.id = insert_id;
    const transactions = {
      type: 2,
      user_id: requestData.user_id,
      amount:  requestData.balance,
      type_id: insert_id,
      description: requestData.description,
      total: Request.body.userInfo.total_amount+requestData.amount
    };
    updateUserAmount({amount:transactions.total, user_id: requestData.user_id});
    addTransacrions(transactions);
    return {
      message: "Tithe added successfully ",
      data: requestData
    };
  },
  withdrawal: async (Request) => {
    const required = {
      amount: Request.body.amount,
      description: Request.body.description || 'no descriptions',
      user_id: Request.body.user_id,
      type: 3,
    };
    const requestData = await apis.vaildation(required, {});
    let users_amount = Request.body.userInfo.total_amount;
    if(requestData.amount > users_amount){
      throw new ApiError(`you have only ${users_amount}`);
    }
    requestData.total = users_amount - requestData.amount;
    const updateUser = {
      id: requestData.user_id,
      total_amount: requestData.total
    };
    DB.save('users', updateUser);
    const insert_id = await DB.save('transactions', requestData);
    requestData.transactions_id = insert_id;
    return {
      message: "withdrawal amount successfully ",
      data: requestData
    };
  },
  transactions: async (Request) => {
    const required = {
      user_id: Request.body.user_id,
      offset: Request.params.offset || 1,
      limit: Request.query.limit || 20,
    }
    const requestData = await apis.vaildation(required, {});
    const offset = (requestData.offset - 1) * requestData.limit;
    const result = await DB.find('transactions', 'all', {
      conditions:{
        user_id:requestData.user_id
      },
      limit:[offset, requestData.limit],
      orderBy: ['id desc']
    })
    return {
      message: "My transactions",
      data: result,
    };
  },
  
};

const updateUserAmount = ({amount, user_id}) => {
  DB.save('users', {
    total_amount: amount,
    id: user_id
  });
  return true;
};

const addTransacrions = (trabsactions) => {
  DB.save('transactions', trabsactions);
  return true;
};