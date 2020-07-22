require('dotenv').config();
const mails = {
	default: process.env.Mail || 'smtp',
	gmail: {
		service: 'gmail',
		auth: {
			user: process.env.MAILUSER || '',
			pass: process.env.MAILPASS || ''
		},
		tls: {
			ciphers: 'SSLv3'
		}
	},
	smtp: {
		pool: true,
		host: process.env.MAILHOST || 'smtp.postmarkapp.com',
		port: process.env.MAILPORT || '587',
		secureConnection: false, // use SSL
		auth: {
			user: process.env.MAILUSER || '952a0977-da1b-4970-8c95-5574532d9e1d',
			pass: process.env.MAILPASS || '952a0977-da1b-4970-8c95-5574532d9e1d'
		},
		tls: {
			ciphers: 'SSLv3'
		}
	},
	postmark: {
		auth: {
			apiKey: process.env.POSTMARKAPIKEY || ''
		}
	}
};

module.exports = mails;
