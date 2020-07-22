const ApiController = require('./ApiController');
const app = require('../../../libary/CommanMethod');
const Db = require('../../../libary/sqlBulider');
const ApiError = require('../../Exceptions/ApiError');
const DB = new Db();

class UserController extends ApiController {
	constructor() {
		super();
		this.addUser = this.addUser.bind(this);
	}

	async addUser(req) {
		let required = {
			name: req.body.name,
			email: req.body.email,
			phone: req.body.phone,
			password: req.body.password,
			checkexist: 1
		};
		let non_required = {
			device_type: req.body.device_type,
			device_token: req.body.device_token,
			country_code: req.body.country_code,
			country: req.body.country,
			authorization_key: app.createToken(),
			otp: app.randomNumber()
		};

		let request_data = await super.vaildation(required, non_required);
		if (req.files && req.files.profile) {
			request_data.profile = await app.upload_pic_with_await(req.files.profile);
		}
		let insert_id = await DB.save('users', request_data);
		request_data.id = insert_id;
		//this.mails(request_data);
		const usersinfo = await super.userDetails(request_data.id);
		if (usersinfo.profile.length > 0) {
			usersinfo.profile = appURL + 'uploads/' + usersinfo.profile;
		}
		return {
			message: 'User signup successfully',
			data: usersinfo
		};
	}

	async verifyOtp(req) {
		let required = {
			otp: req.body.otp
		};
		let non_required = {};
		let request_data = await super.vaildation(required, non_required);
		if (parseInt(request_data.otp) !== req.body.userInfo.otp) {
			throw new ApiError(' Invaild Otp ');
		}
		req.body.userInfo.status = 1;
		await DB.save('users', req.body.userInfo);
		return {
			message: ' Otp verify Successfully',
			data: await super.userDetails(req.body.userInfo.id)
		};
	}

	async soicalLogin(req) {
		const required = {
			social_id: req.body.social_id,
			social_token: req.body.social_token,
			soical_type: req.body.soical_type
		};
		const non_required = {
			device_type: req.body.device_type,
			device_token: req.body.device_token,
			name: req.body.name,
			email: req.body.email,
			status: 1,
			authorization_key: app.createToken()
		};

		let request_data = await super.vaildation(required, non_required);
		let soical_id = await DB.find('users', 'first', {
			conditions: {
				or: {
					email: request_data.email,
					social_id: request_data.social_id
				}
			},
			fields: [ 'id' ]
		});
		if (soical_id) {
			request_data.id = soical_id.id;
		}
		let id = await DB.save('users', request_data);
		return {
			message: 'User login successfully',
			data: await super.userDetails(id)
		};
	}

	async forgotPassword(req) {
		const required = {
			email: req.body.email,
			otp: app.randomNumber()
		};
		const request_data = await super.vaildation(required, {});
		const user_info = await DB.find('users', 'first', {
			conditions: {
				email: request_data.email
			},
			fields: [ 'id', 'email', 'name' ]
		});
		if (!user_info) throw new ApiError('Email not found');
		user_info.otp = request_data.otp;
		user_info.forgot_password_hash = app.createToken();
		await DB.save('users', user_info);
		const mail = {
			to: request_data.email,
			subject: 'Forgot Password',
			template: 'forgot_password',
			data: {
				first_name: user_info.name,
				last_name: user_info.name,
				url: appURL + 'users/change_password/' + user_info.forgot_password_hash
			}
		};
		setTimeout(() => {
			app.send_mail(mail);
		}, 100);
		return {
			message: 'Mail send you Register email',
			data: []
		};
	}

	async loginUser(req) {
		const required = {
			email: req.body.email,
			password: req.body.password
		};
		const non_required = {
			device_type: req.body.device_type || 0,
			device_token: req.body.device_token || '',
			last_login: app.currentTime,
			authorization_key: app.createToken()
		};

		let request_data = await super.vaildation(required, non_required);
		let login_details = await DB.find('users', 'first', {
			conditions: {
				email: request_data.email
			},
			fields: [
				'id',
				'name',
				'status',
				'email',
				'phone',
				'authorization_key',
				'profile',
				'password',
				'total_amount',
				'country_code',
				'country'
			]
		});
		if (login_details) {
			if (request_data.password !== login_details.password) throw new ApiError('Wrong Email or password');
			delete login_details.password;
			await DB.save('users', {
				id: login_details.id,
				device_type: request_data.device_type,
				device_token: request_data.device_type,
				authorization_key: request_data.authorization_key
			});
			login_details.authorization_key = request_data.authorization_key;
			if (login_details.profile.length > 0) {
				login_details.profile = appURL + 'uploads/' + login_details.profile;
			}
			return {
				message: 'User login successfully',
				data: login_details
			};
		}
		throw new ApiError('Wrong Email or password');
	}

	async appInfo() {
		let app_info = await DB.find('app_informations', 'all');
		return {
			message: 'App Information',
			data: app_info
		};
	}
	async changePassword(req) {
		let required = {
			old_password: req.body.old_password,
			new_password: req.body.new_password
		};
		let request_data = await super.vaildation(required, {});
		const loginInfo = req.body.userInfo;
		if (loginInfo.password !== request_data.old_password) {
			throw new ApiError('Old password is wrong');
		}
		loginInfo.password = request_data.new_password;
		await DB.save('users', loginInfo);
		return {
			message: 'Password change successfully',
			data: []
		};
	}

	async updateProfile(req) {
		let required = {
			id: req.body.user_id
		};
		let non_required = {
			name: req.body.name,
			country_code: req.body.country_code,
			country: req.body.country
		};
		let request_data = await super.vaildation(required, non_required);
		if (req.files && req.files.profile) {
			request_data.profile = await app.upload_pic_with_await(req.files.profile);
		}
		await DB.save('users', request_data);
		const usersinfo = await super.userDetails(request_data.id);
		if (usersinfo.profile.length > 0) {
			usersinfo.profile = appURL + 'uploads/' + usersinfo.profile;
		}
		return {
			message: 'Profile Updated Successfully',
			data: usersinfo
		};
	}

	async logout(req) {
		let required = {
			id: req.body.user_id
		};
		let request_data = await super.vaildation(required, {});
		request_data.authorization_key = '';
		await DB.save('users', request_data);
		return {
			message: 'User Logout successfully',
			data: []
		};
	}

	mails(request_data) {
		let mail = {
			to: request_data.email,
			subject: 'Signup User',
			text: 'Your one time password is ' + request_data.otp + ' Please Dont share with any one eles'
		};
		try {
			app.send_mail(mail);
			return true;
		} catch (error) {
			//
		}
	}
}

module.exports = UserController;
