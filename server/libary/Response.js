const app = require('./CommanMethod');
const response = (fn) => async (req, res) => {
  try {
    const data = await fn(req, res);
    res.status(200).send({
      success: true,
      code: 200,
      message: 'done',
      data,
    });
  } catch (error) {
    return app.error(res, error);
  }
};

const Apiresponse = (fn) => async (req, res) => {
  try {
    const { data, message } = await fn(req, res);
    res.status(200).send({
      success: true,
      code: 200,
      message: message,
      data:data,
    });
  } catch (error) {
    return app.error(res, error);
  }
};

module.exports =  response, Apiresponse;