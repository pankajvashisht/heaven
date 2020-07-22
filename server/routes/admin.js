const express = require('express');
const router = express.Router();
const { adminController } = require('../src/Controller/admin/index');
const { cross, AdminAuth } = require('../src/middleware/index');
const response = require('../libary/Response');
const { login } = require('../src/Request/adminRequest');
let admin = new adminController();

router.use([cross, AdminAuth]);
router.get('/', function(req, res) {
	res.json(' APi workings ');
});
router.post('/login', login, admin.login);
router.get('/dashboard', response(admin.dashboard));
router.get(
	'/transaction/:offset([0-9]+)?/:limit([0-9]+)?',
	response(admin.transaction)
);
router
	.route('/users/:offset([0-9]+)?/:limit([0-9]+)?')
	.get(response(admin.allUser))
	.post(response(admin.addUser))
	.put(response(admin.updateData))
	.delete(response(admin.deleteData));
router
	.route('/appInfo/')
	.get(response(admin.appInfo))
	.put(response(admin.updateData));
router
	.route('/seeds/:offset([0-9]+)?/:limit([0-9]+)?')
	.get(response(admin.seeds))
	.put(response(admin.editSeed));
router
	.route('/tithe/:offset([0-9]+)?/:limit([0-9]+)?')
	.get(response(admin.tithe))
	.put(response(admin.editTithe));
module.exports = router;
