class nodemailer {
 constructor(oauth){
    this.mail = {};
    this.oauth = oauth;
    this.html;
 }

 subject(subject){
    this.subject = subject;
    return this;
 }

 to(to){
    this.to = to;
    return this;
 }

 html(mailTemplate, data = {}){
    const ejs = require('ejs');
    const filePath = "mails/" + mailTemplate;
    this.html = ejs.render(filePath, data);
    return this;
 }

 body(data){
    this.mail = data;
    return this;
 }

 send(){
    const nodemailer = require('nodemailer');
    try {
        console.log("i am here");
      var transporter = nodemailer.createTransport(this.oauth);
      var mailOptions = {
        to: this.to,
        subject: this.subject,
        html: this.html
      }
      transporter.sendMail(mailOptions, function(error, info) {
        if (error) {
          // eslint-disable-next-line no-console
          console.log('i am check error ', error);
        } else {
          // eslint-disable-next-line no-console
          console.log('Email sent: ' + info.response);
        }
      });
    } catch (err) {
      // eslint-disable-next-line no-console
      console.log(err);
      return;
    }
 }

}

module.exports = nodemailer;