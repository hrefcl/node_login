module.exports = function(app, express) {
    app.mails = {};

    app.mails.validatemail = function(user) {
        var haawi_mail_verification = app.fs.readFileSync('./mandrill/haawi_mail_verification.html').toString();
        var html = haawi_mail_verification;
        html = html.replace("<username>", user.firstname + " " + user.lastname);
        html = html.replace("<active_acount>", '<a style="color:#41c17d;text-decoration:none;font-weight:bold;" href="http://www.haawi.cl/active_acount?code=' + user.token + '">Activar mi cuenta</a>');
        var message = {
            "html": html,
            "subject": "Activar mi cuenta Haawi",
            "from_email": "no-reply@haawi.cl",
            "from_name": "Haawi",
            "to": [{
                "email": user.email,
                "name": user.firstname,
                "type": "to"
            }],
            "headers": {
                "Reply-To": "no-reply@haawi.cl"
            },
            "track_opens": true,
            "track_clicks": true,
            "tags": [
                ""
            ],
            "metadata": {
                "website": "www.haawi.cl"
            },
            "recipient_metadata": [{
                "rcpt": user.email
            }]
        };

        app.mandrill.messages.send({
            "message": message,
            "async": false,
            "ip_pool": "haawi.cl"
        }, function(result) {
            console.log("Email sent");
            console.log(result);
        }, function(e) {
            console.log("Sending  email failed");
            console.log(e);
        });
    };
    app.mails.welcomeMail = function(user) {
        console.log('Se envia Mail de Bienvenida');
        var haawi_mail_verification = app.fs.readFileSync('./mandrill/haawi_mail_welcome.html').toString();
        var html = haawi_mail_verification;
        html = html.replace("<username>", user.firstname + " " + user.lastname);
        //html = html.replace("<active_acount>", 'Bienvenido');
        var message = {
            "html": html,
            "subject": "Bienvenido a Haawi",
            "from_email": "hola@haawi.cl",
            "from_name": "Haawi",
            "to": [{
                "email": user.email,
                "name": user.firstname,
                "type": "to"
            }],
            "headers": {
                "Reply-To": "no-reply@haawi.cl"
            },
            "track_opens": true,
            "track_clicks": true,
            "tags": [
                ""
            ],
            "metadata": {
                "website": "www.haawi.cl"
            },
            "recipient_metadata": [{
                "rcpt": user.email
            }]
        };

        app.mandrill.messages.send({
            "message": message,
            "async": false,
            "ip_pool": "haawi.cl"
        }, function(result) {
            console.log("Email sent");
            console.log(result);
        }, function(e) {
            console.log("Sending  email failed");
            console.log(e);
        });
    }
    app.mails.sendRecoverPassword = function(user, msj) {
        var haawi_mail_verification = app.fs.readFileSync('./mandrill/haawi_mail_recover.html').toString();
        var html = haawi_mail_verification;
        html = html.replace("<username>", user.firstname + " " + user.lastname);
        html = html.replace("<recover_pass>", msj);
        var message = {
            "html": html,
            "subject": "Recuperar Haawi",
            "from_email": "hola@haawi.cl",
            "from_name": "Haawi",
            "to": [{
                "email": user.email,
                "name": user.firstname,
                "type": "to"
            }],
            "headers": {
                "Reply-To": "no-reply@haawi.cl"
            },
            "track_opens": true,
            "track_clicks": true,
            "tags": [
                ""
            ],
            "metadata": {
                "website": "www.haawi.cl"
            },
            "recipient_metadata": [{
                "rcpt": user.email
            }]
        };

        app.mandrill.messages.send({
            "message": message,
            "async": false,
            "ip_pool": "haawi.cl"
        }, function(result) {
            console.log("Email sent");
            console.log(result);
        }, function(e) {
            console.log("Sending  email failed");
            console.log(e);
        });
    }
}
