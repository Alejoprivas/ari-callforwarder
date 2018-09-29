let MailListener = require("mail-listener2");
 
let mailListener = new MailListener({
  username: "XXX",
  password: "XXX",
    host: "imap.gmail.com",
    port: 993, // imap port
    tls: true,
    tlsOptions: {rejectUnauthorized: true},
    mailbox: "INBOX", // mailbox to monitor
    searchFilter: ["UNSEEN"], // the search filter being used after an IDLE notification has been retrieved
    markSeen: true, // all fetched email willbe marked as seen and not fetched next time
    fetchUnreadOnStart: true, // use it only if you want to get all unread email on lib start. Default is `false`,
    mailParserOptions: {streamAttachments: false}, // options to be passed to mailParser lib.
    attachments: false, // download attachments as they are encountered to the project directory
    attachmentOptions: {directory: "attachments/"} // specify a download directory for attachments
  });

mailListener.start(); // start listening 
 
mailListener.on("server:connected", function(){
  console.log("imapConnected");
});
 
mailListener.on("server:disconnected",  (err) => { 
    console.log('imapDisconnected');
    console.log(err);
    mailListener.stop(); 
    mailListener.start(); }
);
 
mailListener.on("error", function(err){
  console.log(err);
});
 

function IsJsonString(str) {
    try {
        JSON.parse(str);
    } catch (e) {
        return false;
    }
    return true;
}

mailListener.on("mail", function(mail, seqno, attributes){
let s = mail.text.replace(/\\n/g, "\\n")  
               .replace(/\\'/g, "\\'")
               .replace(/\\"/g, '\\"')
               .replace(/\\&/g, "\\&")
               .replace(/\\r/g, "\\r")
               .replace(/\\t/g, "\\t")
               .replace(/\\b/g, "\\b")
               .replace(/\\f/g, "\\f");    
 s = s.replace(/[\u0000-\u0019]+/g,""); 
if(IsJsonString(s)){   
let myObj = JSON.parse(s);
  let alarmConfigObj =  alarmConfig.findOne({ 'idAlarma': myObj.idAlarma }, function (err, alarmConfig) {
    myObj.fecha = new Date(myObj.evento.eventoFecha+' '+myObj.evento.eventoHora);
    myObj.fecha2 = moment().format('L hh:mm:ss');
    myObj.url = alarmConfig.url;
    myObj.direccion = alarmConfig.direccion, 
    myObj.passw = alarmConfig.passw,
    alarmEvent.create(myObj);
      console.log('alarma')
                    });
}else{
    console.log('not a json')
} 
}); 

module.exports = MailListener