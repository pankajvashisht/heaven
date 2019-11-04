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
      checkexist: 1,
    };
    let non_required = {
      device_type: req.body.device_type,
      device_token: req.body.device_token,
      authorization_key: app.createToken(),
      otp: app.randomNumber(),
    };

    let request_data = await super.vaildation(required, non_required);
    if (req.files && req.files.profile) {
      request_data.profile = await app.upload_pic_with_await(req.files.profile);
    }
    let insert_id = await DB.save('users', request_data);
    request_data.id = insert_id;
    this.mails(request_data);
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
      otp: req.body.otp,
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
      data: await super.userDetails(req.body.userInfo.id),
    };
  }

  async forgotPassword(req) {
    let required = {
      email: req.body.email,
      otp: app.randomNumber(),
    };
    let non_required = {};
    let request_data = await super.vaildation(required, non_required);
    let user_info = await DB.find('users', 'first', {
      conditions: {
        email: request_data.email,
      },
      fields: ['id', 'email'],
    });
    if (!user_info) throw new ApiError('Email not found');
    user_info.otp = request_data.otp;
    await DB.save('users', user_info);
    let mail = {
      to: request_data.email,
      subject: 'Forgot Password',
      text:
        'Your one time password is ' +
        request_data.otp +
        ' Please Dont share with any one eles',
    };
    app.send_mail(mail);
    return {
      message: 'Otp send your register email',
      data: [],
    };
  }

  async loginUser(req) {
    const required = {
      email: req.body.email,
      password: req.body.password,
    };
    const non_required = {
      device_type: req.body.device_type || 0,
      device_token: req.body.device_token || '',
      last_login: app.currentTime,
      authorization_key: app.createToken(),
    };

    let request_data = await super.vaildation(required, non_required);
    let login_details = await DB.find('users', 'first', {
      conditions: {
        email: request_data.email,
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
        'total_amount'
      ],
    });
    if (login_details) {
      if (request_data.password !== login_details.password)
        throw new ApiError('Wrong Email or password');
      delete login_details.password;
      await DB.save('users', {
        id: login_details.id,
        device_type: request_data.device_type,
        device_token: request_data.device_type,
        authorization_key: request_data.authorization_key,
      });
      login_details.authorization_key = request_data.authorization_key;
      if (login_details.profile.length > 0) {
        login_details.profile = appURL + 'uploads/' + login_details.profile;
      }
      return {
        message: 'User login successfully',
        data: login_details,
      };
    }
    throw new ApiError('Wrong Email or password');
  }

  async appInfo() {
    let app_info = await DB.find('app_informations', 'all');
    return {
      message: 'App Information',
      data: app_info,
    };
  }
  async changePassword(req) {
    let required = {
      old_password: req.body.old_password,
      new_password: req.body.new_password,
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
      data: [],
    };
  }

  async updateProfile(req) {
    let required = {
      id: req.body.user_id,
    };
    let non_required = {
      name: req.body.name
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
      data: usersinfo,
    };
  }

  async logout(req) {
    let required = {
      id: req.body.user_id,
    };
    let request_data = await super.vaildation(required, {});
    request_data.authorization_key = '';
    await DB.save('users', request_data);
    return {
      message: 'User Logout successfully',
      data: [],
    };
  }

  mails(request_data) {
    let mail = {
      to: request_data.email,
      subject: 'Signup User',
      text:
        'Your one time password is ' +
        request_data.otp +
        ' Please Dont share with any one eles',
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
