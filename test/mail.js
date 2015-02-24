var nodemailer = require("nodemailer");

var smtpTransport = nodemailer.createTransport("SMTP",{
    host: "in-v3.mailjet.com",
    port: 25,
    auth: {
        user: "483886442b3301f5896804a56d1b3727",
        pass: "8cd6cbd93743f62608896d2f8936dfbc"
    }
});

smtpTransport.sendMail({
        from: "Pasuta_V@ukr.net", // sender address
        to: "vitaly@attracti.com>", // comma separated list of receivers
        subject: "Hello ✔", // Subject line
        text: "Hello world ✔" // plaintext body
    },
    function(error, response) {
        if (error) {
            console.log(error);
        } else {
            console.log("Message sent: " + response.message);
        }
    }
);