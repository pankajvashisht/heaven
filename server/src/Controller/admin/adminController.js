const Db = require('../../../libary/sqlBulider');
const app = require('../../../libary/CommanMethod');
const ApiError = require('../../Exceptions/ApiError');
let DB = new Db();

class adminController {
	constructor() {
		this.limit = 20;
		this.offset = 1;
		this.login = this.login.bind(this);
		this.allUser = this.allUser.bind(this);
		this.transaction = this.transaction.bind(this);
	}
	async login(req, res) {
		const { body } = req;
		try {
			let login_details = await DB.find('admins', 'first', {
				conditions: {
					email: body.email,
					status: 1,
				},
			});
			if (login_details) {
				if (app.createHash(body.password) != login_details.password)
					throw 'Wrong Email or password';
				delete login_details.password;
				let token = await app.UserToken(login_details.id, req);
				await DB.save('admins', {
					id: login_details.id,
					token: token,
				});
				login_details.token = token;
				if (login_details.profile.length > 0) {
					login_details.profile = app.ImageUrl(login_details.profile);
				}
				return app.success(res, {
					message: 'User login successfully',
					data: login_details,
				});
			}

			throw 'Wrong Email or password';
		} catch (err) {
			app.error(res, err);
		}
	}
	async allUser(req) {
		let offset = req.params.offset !== undefined ? req.params.offset : 1;
		let limit = req.params.limit !== undefined ? req.params.limit : 20;
		offset = (offset - 1) * limit;
		let conditions = '';
		if (req.query.q.length > 0 && req.query.q !== 'undefined') {
			conditions +=
				" where name like '%" +
				req.query.q +
				"%' or email like '%" +
				req.query.q +
				"%'";
		}
		let query =
			'select * from users ' +
			conditions +
			' order by id desc limit ' +
			offset +
			' , ' +
			limit;
		const total = await DB.first(
			`select count(*) as total from users ${conditions}`
		);
		const result = {
			pagination: { page: offset, total: total[0].total, limit: limit },
			result: app.addUrl(await DB.first(query), 'profile'),
		};
		return result;
	}

	async editSeed(Request) {
		const { body } = Request;
		const checkSeed = await DB.find('seeds', 'first', {
			conditions: {
				id: body.id,
			},
		});
		const transectionInfo = await DB.find('transactions', 'first', {
			conditions: {
				type_id: body.id,
			},
		});
		const transactions = {
			id: transectionInfo.id,
			amount: body.balance_based_per || transectionInfo.amount,
			church_name: body.church_name || transectionInfo.church_name,
			total: transectionInfo.total,
		};
		if (checkSeed.balance_based_per !== parseInt(body.balance_based_per)) {
			const userInfo = await DB.find('users', 'first', {
				conditions: {
					id: checkSeed.user_id,
				},
			});
			const revrseAmount = userInfo.total_amount - transectionInfo.amount;
			transactions.total = revrseAmount + parseInt(body.balance_based_per);
			await DB.save('users', {
				id: checkSeed.user_id,
				amount: transactions.total,
			});
		}
		await DB.save('transactions', transactions);
		await DB.save('seeds', body);
		return body;
	}

	async editTithe(Request) {
		const { body } = Request;
		const transectionInfo = await DB.find('transactions', 'first', {
			conditions: {
				type_id: body.id,
			},
		});
		const transactions = {
			id: transectionInfo.id,
			amount: body.balance || transectionInfo.amount,
			petitions: body.petitions || transectionInfo.petitions,
			church_name: body.church_name || transectionInfo.church_name,
			total: transectionInfo.total,
		};
		const revrseAmount = transectionInfo.total - body.balance;
		transactions.total = revrseAmount + parseInt(body.balance);
		await DB.save('transactions', transactions);
		await DB.save('tithe', body);
		return body;
	}

	async editAlms(Request) {
		const { body } = Request;
		const transectionInfo = await DB.find('transactions', 'first', {
			conditions: {
				type_id: body.id,
			},
		});
		const transactions = {
			id: transectionInfo.id,
			amount: body.amount || transectionInfo.amount,
			church_name: body.name || transectionInfo.church_name,
			total: transectionInfo.total,
		};
		const revrseAmount = transectionInfo.total - body.amount;
		transactions.total = revrseAmount + parseInt(body.amount);
		await DB.save('transactions', transactions);
		await DB.save('alms', body);
		return body;
	}
	async seeds(req) {
		let offset = req.params.offset !== undefined ? req.params.offset : 1;
		let limit = req.params.limit !== undefined ? req.params.limit : 20;
		offset = (offset - 1) * limit;
		let conditions = '';
		if (req.query.q.length > 0 && req.query.q !== 'undefined') {
			conditions +=
				" where name like '%" +
				req.query.q +
				"%' or email like '%" +
				req.query.q +
				"%'";
		}
		let query =
			'select users.name,users.profile,seeds.* from seeds join users on (users.id = seeds.user_id) ' +
			conditions +
			' order by id desc limit ' +
			offset +
			' , ' +
			limit;
		const total = await DB.first(
			`select count(*) as total from seeds join users on (users.id = seeds.user_id) ${conditions}`
		);
		const result = {
			pagination: { page: offset, total: total[0].total, limit: limit },
			result: app.addUrl(await DB.first(query), 'profile'),
		};
		return result;
	}
	async tithe(req) {
		let offset = req.params.offset !== undefined ? req.params.offset : 1;
		let limit = req.params.limit !== undefined ? req.params.limit : 20;
		offset = (offset - 1) * limit;
		let conditions = '';
		if (req.query.q.length > 0 && req.query.q !== 'undefined') {
			conditions +=
				" where name like '%" +
				req.query.q +
				"%' or email like '%" +
				req.query.q +
				"%'";
		}
		let query =
			'select users.name,users.profile,tithe.* from tithe join users on (users.id = tithe.user_id) ' +
			conditions +
			' order by id desc limit ' +
			offset +
			' , ' +
			limit;
		const total = await DB.first(
			`select count(*) as total from tithe join users on (users.id = tithe.user_id) ${conditions}`
		);
		const result = {
			pagination: { page: offset, total: total[0].total, limit: limit },
			result: app.addUrl(await DB.first(query), 'profile'),
		};
		return result;
	}

	async alms(req) {
		let offset = req.params.offset !== undefined ? req.params.offset : 1;
		let limit = req.params.limit !== undefined ? req.params.limit : 20;
		offset = (offset - 1) * limit;
		let conditions = '';
		if (req.query.q.length > 0 && req.query.q !== 'undefined') {
			conditions +=
				" where name like '%" +
				req.query.q +
				"%' or email like '%" +
				req.query.q +
				"%'";
		}
		let query =
			'select users.name,users.profile,alms.* from alms join users on (users.id = alms.user_id) ' +
			conditions +
			' order by id desc limit ' +
			offset +
			' , ' +
			limit;
		const total = await DB.first(
			`select count(*) as total from alms join users on (users.id = alms.user_id) ${conditions}`
		);
		const result = {
			pagination: { page: offset, total: total[0].total, limit: limit },
			result: app.addUrl(await DB.first(query), 'profile'),
		};
		return result;
	}

	addUrl(data, key) {
		if (data.length === 0) {
			return [];
		}
		data.forEach((element, keys) => {
			if (!Array.isArray(key)) {
				data[keys][key] = app.ImageUrl(data[keys][key]);
			} else {
				for (let names of key) {
					if (data[keys][names].length > 0) {
						data[keys][names] = app.ImageUrl(data[keys][names]);
					}
				}
			}
		});
		return data;
	}

	async addUser(req) {
		const { body } = req;
		delete body.profile;
		if (req.files && req.files.profile) {
			body.profile = await app.upload_pic_with_await(req.files.profile);
		}
		const result = await DB.first(
			`select * from users where email = '${body.email}' or phone = '${
				body.phone
			}'`
		);
		if (result.length) {
			throw new ApiError('Email or phone is register.Kindly use another');
		}
		return await DB.save('users', body);
	}

	async updateData(req) {
		const { body } = req;
		if (body.id === undefined) {
			throw 'id is missing';
		}
		if (req.files && req.files.url) {
			body.url = await app.upload_pic_with_await(req.files.url);
			delete req.files.url.data;
			body.metadata = JSON.stringify(req.files.url);
		}
		if (req.files && req.files.profile) {
			body.profile = await app.upload_pic_with_await(req.files.profile);
		}
		return await DB.save(body.table, body);
	}

	async deleteData(req) {
		const { body } = req;

		if (body.id === undefined) {
			throw 'id is missing';
		}
		return await DB.first(
			'delete from ' + body.table + ' where id =' + body.id
		);
	}

	async dashboard() {
		const totals = {
			seeds: 0,
			users: 0,
			tithe: 0,
			transactions: 0,
		};

		totals.tithe = await DB.first('select count(*) as total from tithe');
		totals.users = await DB.first('select count(*) as total from users');
		totals.seeds = await DB.first('select count(id) as total from 	seeds');
		totals.transactions = await DB.first(
			'select count(id) as total from 	transactions'
		);
		const alms = await DB.first('select count(id) as total from alms');
		totals.tithe = totals.tithe[0].total;
		totals.users = totals.users[0].total;
		totals.seeds = totals.seeds[0].total;
		totals.transactions = totals.transactions[0].total;
		totals.alms = alms[0].total;
		return totals;
	}

	async appInfo() {
		return await DB.first('select * from app_informations');
	}

	async transaction(req) {
		let offset = req.params.offset !== undefined ? req.params.offset : 1;
		let limit = req.params.limit !== undefined ? req.params.limit : 20;
		offset = (offset - 1) * limit;
		let conditions = '';
		if (req.query.q.length > 0 && req.query.q !== 'undefined') {
			conditions +=
				" where name like '%" +
				req.query.q +
				"%' or email like '%" +
				req.query.q +
				"%'";
		}
		let query =
			'select users.name,users.profile,transactions.* from transactions join users on (users.id = transactions.user_id) ' +
			conditions +
			' order by id desc limit ' +
			offset +
			' , ' +
			limit;
		const total = await DB.first(
			`select count(*) as total from transactions join users on (users.id = transactions.user_id) ${conditions}`
		);
		const result = {
			pagination: { page: offset, total: total[0].total, limit: limit },
			result: app.addUrl(await DB.first(query), 'profile'),
		};
		return result;
	}
}

module.exports = adminController;
