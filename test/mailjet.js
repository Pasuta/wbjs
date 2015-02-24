var Mailjet = require('mailjet-sendemail');
var mailjet = new Mailjet('483886442b3301f5896804a56d1b3727', '8cd6cbd93743f62608896d2f8936dfbc');

mailjet.sendContent(
    'Pasuta_V@ukr.net',
    ['Pasuta_V@ukr.net', 'bcc:vitaly@attracti.com'],
    'This is a test !',
    'text',
    'Well, this is working !');