const ApiController = require('./ApiController');
const Db = require('../../../libary/sqlBulider');
const ApiError = require('../../Exceptions/ApiError');
const app = require('../../../libary/CommanMethod');
let apis = new ApiController();
let DB = new Db();
module.exports = {
	addSeed: async (request) => {
		const required = {
			church_name: request.body.church_name,
			return_expection: request.body.return_expection,
			earth_measure: request.body.earth_measure,
			heaven_measure: request.body.heaven_measure,
			balance_based_per: request.body.balance_based_per,
			date: request.body.date || app.currentTime,
			amount: request.body.amount,
			description: request.body.description,
			user_id: request.body.user_id,
		};
		const requestData = await apis.vaildation(required, {});
		requestData.date = app.convertUTC(requestData.date);
		const insert_id = await DB.save('seeds', requestData);
		requestData.turn_over = requestData.sale_cost = requestData.gross_income = requestData.time = requestData.petitions = requestData.balance =
			'';
		const transactions = {
			type: 1,
			user_id: requestData.user_id,
			amount: requestData.amount,
			type_id: insert_id,
			description: requestData.description,
			church_name: requestData.church_name,
			total:
				parseFloat(request.body.userInfo.total_amount) +
				parseFloat(requestData.amount),
			full_details: JSON.stringify(requestData),
			date: requestData.date,
		};
		updateUserAmount({
			amount: transactions.total,
			user_id: requestData.user_id,
		});
		addTransacrions(transactions);
		requestData.id = insert_id;
		return {
			message: 'Seed added successfully ',
			data: requestData,
		};
	},
	editSeed: async (request) => {
		const required = {
			seed_id: request.body.seed_id,
		};
		const nonRequired = {
			church_name: request.body.church_name,
			return_expection: request.body.return_expection,
			earth_measure: request.body.earth_measure,
			heaven_measure: request.body.heaven_measure,
			balance_based_per: request.body.balance_based_per,
			amount: request.body.amount,
			description: request.body.description,
			user_id: request.body.user_id,
			date: request.body.date,
		};
		const requestData = await apis.vaildation(required, nonRequired);
		const checkSeedID = await DB.find('seeds', 'first', {
			conditions: {
				id: requestData.seed_id,
				user_id: requestData.user_id,
			},
		});
		if (!checkSeedID) throw new ApiError('Invaild seed id', 422);
		requestData.id = requestData.seed_id;
		const type_id = await DB.save('seeds', requestData);
		const transectionInfo = await DB.find('transactions', 'first', {
			conditions: {
				type_id,
				user_id: requestData.user_id,
			},
		});
		const transactions = {
			id: transectionInfo.id,
			amount: requestData.amount || transectionInfo.amount,
			description: requestData.description || transectionInfo.description,
			church_name: requestData.church_name || transectionInfo.church_name,
			total: transectionInfo.total,
			date: requestData.date || transectionInfo.date,
		};
		if (requestData.amount) {
			const revrseAmount =
				request.body.userInfo.total_amount - transectionInfo.amount;
			transactions.total = revrseAmount + parseFloat(requestData.amount);
		}
		updateUserAmount({
			amount: transactions.total,
			user_id: requestData.user_id,
		});
		addTransacrions(transactions);
		return {
			message: 'Seed Edit successfully ',
			data: requestData,
		};
	},
	editTithe: async (Request) => {
		const required = {
			tithe_id: Request.body.tithe_id,
		};
		const nonRequired = {
			church_name: Request.body.church_name,
			turn_over: Request.body.turn_over,
			sale_cost: Request.body.sale_cost,
			gross_income: Request.body.gross_income || '0',
			time: Request.body.time,
			petitions: Request.body.petitions,
			balance: Request.body.balance,
			description: Request.body.description,
			user_id: Request.body.user_id,
			date: Request.body.date,
		};
		const requestData = await apis.vaildation(required, nonRequired);
		const checkTitheID = await DB.find('tithe', 'first', {
			conditions: {
				id: requestData.tithe_id,
				user_id: requestData.user_id,
			},
		});
		if (!checkTitheID) throw new ApiError('Invaild tithe_id id', 422);
		requestData.id = requestData.tithe_id;
		const type_id = await DB.save('tithe', requestData);
		const transectionInfo = await DB.find('transactions', 'first', {
			conditions: {
				type_id,
				user_id: requestData.user_id,
			},
		});
		const transactions = {
			id: transectionInfo.id,
			petitions: requestData.petitions || transectionInfo.petitions,
			amount: requestData.balance || transectionInfo.amount,
			description: requestData.description || transectionInfo.description,
			church_name: requestData.church_name || transectionInfo.church_name,
			total: transectionInfo.total,
			date: requestData.date || transectionInfo.date,
		};
		if (requestData.balance) {
			const revrseAmount = transectionInfo.total - requestData.balance;
			transactions.total = revrseAmount + parseFloat(requestData.balance);
		}
		addTransacrions(transactions);
		return {
			message: 'Tithe Edit successfully ',
			data: requestData,
		};
	},

	addTithe: async (Request) => {
		const required = {
			church_name: Request.body.church_name,
			turn_over: Request.body.turn_over,
			sale_cost: Request.body.sale_cost,
			gross_income: Request.body.gross_income || '0',
			time: Request.body.time,
			petitions: Request.body.petitions,
			balance: Request.body.balance,
			description: Request.body.description,
			user_id: Request.body.user_id,
			date: Request.body.date || app.currentTime,
		};
		const requestData = await apis.vaildation(required, {});
		const insert_id = await DB.save('tithe', requestData);
		requestData.id = insert_id;
		requestData.return_expection = requestData.earth_measure = requestData.heaven_measure = requestData.balance_based_per =
			'';
		const transactions = {
			type: 2,
			user_id: requestData.user_id,
			amount: requestData.balance,
			type_id: insert_id,
			petitions: requestData.petitions,
			church_name: requestData.church_name,
			description: requestData.description,
			total:
				Request.body.userInfo.total_amount + parseFloat(requestData.balance),
			full_details: JSON.stringify(requestData),
			date: requestData.date,
		};
		//updateUserAmount({amount:transactions.total, user_id: requestData.user_id});
		addTransacrions(transactions);
		return {
			message: 'Tithe added successfully ',
			data: requestData,
		};
	},
	myamount: (Request) => {
		return {
			message: 'My Balance',
			data: { balance: Request.body.userInfo.total_amount },
		};
	},
	filterBalance: async (Request) => {
		const { from_date = 0, to_date = 0, type = 0 } = Request.query;
		const { user_id } = Request.body;
		const types = parseFloat(type) === 3 ? 'date' : 'date';
		let conditions = `where user_id = ${user_id} and ${types} > ${app.dateToUnixTime(
			`${from_date} 00:00:00`
		)} and ${types} < ${app.dateToUnixTime(`${to_date} 23:59:00`)}`;
		conditions +=
			parseFloat(type) !== 0 ? ` and type = ${type}` : ` and type in (1,2)`;
		const result = await DB.first(
			`select IFNULL(sum(amount), 0) as total from transactions ${conditions} `
		);
		return {
			message: 'My Balance',
			data: { balance: result.length > 0 ? result[0].total : 0 },
		};
	},

	withdrawal: async (Request) => {
		const required = {
			amount: Request.body.amount,
			description: Request.body.description || 'no descriptions',
			date: Request.body.date || app.currentTime,
			user_id: Request.body.user_id,
			full_details: JSON.stringify("{'no':'data'}"),
			type: 3,
		};
		const requestData = await apis.vaildation(required, {});
		let users_amount = Request.body.userInfo.total_amount;
		if (requestData.amount > users_amount) {
			throw new ApiError(`you have only ${users_amount}`);
		}
		requestData.total = users_amount - requestData.amount;
		const updateUser = {
			id: requestData.user_id,
			total_amount: requestData.total,
		};
		requestData.full_details = JSON.stringify({
			church_name: '',
			turn_over: '',
			sale_cost: '',
			gross_income: '',
			time: '',
			petitions: '',
			balance: '',
			description: '',
			user_id: '',
			return_expection: '',
			earth_measure: '',
			heaven_measure: '',
			balance_based_per: '',
		});
		DB.save('users', updateUser);
		const insert_id = await DB.save('transactions', requestData);
		requestData.transactions_id = insert_id;
		return {
			message: 'withdrawal amount successfully ',
			data: requestData,
		};
	},
	getInApp: async (Request) => {
		const required = {
			gmail_account: Request.query.gmail_account,
		};
		const requestData = await apis.vaildation(required, {});
		const result = await DB.find('in_app_parchase', 'first', {
			conditions: {
				gmail_account: requestData.gmail_account,
			},
		});
		return {
			message: 'get successfully ',
			data: result ? result : {},
		};
	},
	addAlms: async (Request) => {
		const required = {
			user_id: Request.body.user_id,
			name: Request.body.name,
			amount: Request.body.amount,
			description: Request.body.description,
			date: Request.body.date || app.currentTime,
		};
		const requestData = await apis.vaildation(required, {});
		const insert_id = await DB.save('alms', requestData);
		requestData.id = insert_id;
		requestData.return_expection = requestData.earth_measure = requestData.heaven_measure = requestData.balance_based_per =
			'';
		const transactions = {
			type: 4,
			user_id: requestData.user_id,
			amount: requestData.amount,
			type_id: insert_id,
			church_name: requestData.name,
			description: requestData.description,
			total:
				Request.body.userInfo.total_amount + parseFloat(requestData.amount),
			full_details: JSON.stringify(requestData),
			date: requestData.date,
		};
		//updateUserAmount({amount:transactions.total, user_id: requestData.user_id});
		addTransacrions(transactions);
		return {
			message: 'Alms added successfully ',
			data: requestData,
		};
	},
	editAlms: async (Request) => {
		const required = {
			alms_id: Request.body.alms_id,
			user_id: Request.body.user_id,
		};
		const nonRequired = {
			name: Request.body.name,
			amount: Request.body.amount,
			description: Request.body.description,
			date: Request.body.date,
		};
		const requestData = await apis.vaildation(required, nonRequired);
		const checkAlmsID = await DB.find('alms', 'first', {
			conditions: {
				id: requestData.alms_id,
				user_id: requestData.user_id,
			},
		});
		if (!checkAlmsID) throw new ApiError('Invaild alms_id id', 422);
		requestData.id = requestData.alms_id;
		const type_id = await DB.save('alms', requestData);
		const transectionInfo = await DB.find('transactions', 'first', {
			conditions: {
				type_id,
				user_id: requestData.user_id,
			},
		});
		const transactions = {
			id: transectionInfo.id,
			user_id: requestData.user_id,
			amount: requestData.amount || transectionInfo.amount,
			church_name: requestData.name || transectionInfo.church_name,
			description: requestData.description || transectionInfo.description,
			date: requestData.date || transectionInfo.date,
		};
		if (requestData.amount) {
			const revrseAmount = transectionInfo.total - requestData.amount;
			transactions.total = revrseAmount + parseFloat(requestData.amount);
		}
		addTransacrions(transactions);
		return {
			message: 'Alms Edit successfully ',
			data: requestData,
		};
	},
	addInApp: async (Request) => {
		const required = {
			gmail_account: Request.body.gmail_account,
			token: Request.body.token,
			amount: Request.body.token,
			time: Request.body.token,
		};
		const requestData = await apis.vaildation(required, {});
		requestData.date = app.currentTime + 86400 * 30;
		const result = await DB.find('in_app_parchase', 'first', {
			conditions: {
				gmail_account: requestData.gmail_account,
			},
		});
		if (result) {
			requestData.id = result.id;
		}
		await DB.save('in_app_parchase', requestData);
		return {
			message: 'Add successfully',
			data: [],
		};
	},

	webHook: async (Request) => {
		const required = {
			code: Request.body.code,
			token: Request.body.token,
			amount: Request.body.token,
			time: Request.body.token,
		};
		const requestData = await apis.vaildation(required, {});
		requestData.date = app.currentTime + 86400 * 30;
		const result = await DB.find('in_app_parchase', 'first', {
			conditions: {
				gmail_account: requestData.gmail_account,
			},
		});
		if (result) {
			requestData.id = result.id;
		}
		await DB.save('in_app_parchase', requestData);
		return {
			message: 'Add successfully',
			data: [],
		};
	},
	transactions: async (Request) => {
		const required = {
			user_id: Request.body.user_id,
			offset: Request.params.offset || 1,
			limit: Request.query.limit || 20,
		};
		const requestData = await apis.vaildation(required, {});
		const offset = (requestData.offset - 1) * requestData.limit;
		const result = await DB.find('transactions', 'all', {
			conditions: {
				user_id: requestData.user_id,
			},
			limit: [offset, requestData.limit],
			orderBy: ['id desc'],
		});
		const final = result.map((value, key) => {
			if (value.full_details.length > 0) {
				value.full_details = JSON.parse(value.full_details);
			}
			return value;
		});
		return {
			message: 'My transactions',
			data: final,
		};
	},
	deleteTransaction: async (Request) => {
		const required = {
			user_id: Request.body.user_id,
			transaction_id: Request.body.transaction_id,
		};
		const requestData = await apis.vaildation(required, {});
		const result = await DB.find('transactions', 'first', {
			conditions: {
				user_id: requestData.user_id,
				id: requestData.transaction_id,
			},
		});
		if (!result) {
			throw new ApiError(`Invaild transaction_id id`);
		}
		if (result.type == 1 || result.type == 2) {
			const table = result.type == 1 ? 'seeds' : 'tithe';
			DB.first(`delete from ${table} where id = ${requestData.type_id}`);
		}
		await DB.first(
			`delete from transactions where id = ${requestData.transaction_id}`
		);
		return {
			message: 'Transactions deleted',
			data: [],
		};
	},
	sendTransaction: async (Request) => {
		const { type = 0, to_date = 0, from_date = 0, user_id } = Request.body;
		const types = parseFloat(type) === 3 ? 'date' : 'date';
		let conditions = `where user_id = ${user_id}`;
		if (to_date !== 0 && from_date !== 0) {
			conditions += ` and ${types} > ${app.dateToUnixTime(
				from_date,
				'00',
				'20'
			)} and ${types} < ${app.dateToUnixTime(`${to_date}`, '23', '59')}`;
		}
		if (parseFloat(type) !== 0) {
			conditions += ` and type = ${type}`;
		}
		const result = await DB.first(
			`select * from transactions ${conditions} limit 1000`
		);
		let mail = {
			to: Request.body.userInfo.email,
			subject: 'Your Transactions',
			template: 'transaction',
			data: {
				information: result,
			},
		};
		setTimeout(() => {
			app.send_mail(mail);
		}, 100);
		return {
			message: 'Mail send successfully',
			data: [],
		};
	},
};

const updateUserAmount = ({ amount, user_id }) => {
	DB.save('users', {
		total_amount: amount,
		id: user_id,
	});
	return true;
};

const addTransacrions = (trabsactions) => {
	DB.save('transactions', trabsactions);
	return true;
};
