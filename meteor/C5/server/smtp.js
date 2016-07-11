
Meteor.startup(function () {

    Accounts.emailTemplates.siteName = "c5.boomhifive.com";
    Accounts.emailTemplates.from = "C5 Admin <c5@boomhifive.com>";
    Accounts.emailTemplates.enrollAccount.subject = function (user) {
        return "Welcome to C5, " + user.profile.name;
    };
    Accounts.emailTemplates.resetPassword.from = function () {
       // Overrides value set in Accounts.emailTemplates.from when resetting passwords
       return "C5 Admin <c5@boomhifive.com>";
    };
    Accounts..emailTemplates.resetPassword.text = function(user, url){
        var text = "this is the text, " + user.profile.name ;
        text += "\n the url is " + url;
        return text;
    };


    process.env.MAIL_URL = 'smtp://c5@boomhifive.com:Un1c0rn5@smtp.sendgrid.net:587';
});

