//get your token here: https://trello.com/app-key Token link
const APP_KEY = process.env.TRELLO_APP_KEY || "";
const TOKEN = process.env.THELLO_TOKEN || "";

import Rx from "@reactivex/rxjs";
import Trello from "node-trello";

var dateFormat = require('dateformat');
var nodemailer = require('nodemailer');
var schedule = require("./schedule.config");
var email_to = [
  'wah.wong@abc.com'
]

const t = new Trello(APP_KEY, TOKEN);

function cloneBoard(name, callback) {
  return t.post("/1/boards", {
    name: name,
    idOrganization: "opsteam12"
    idBoardSource: "577b357e91f47f23b5e16dbc",
    prefs_permissionLevel: "org"
  }, callback);
}

function getBoard(id, callback) {
  return t.get(`/1/boards/${id}`, {
    lists: "open",
    list_fields: "name",
    fields: "name,desc,url"
  }, callback);
}

function createCard(name, desc, due, idList, callback) {
  return t.post("/1/cards", { name, desc, due, idList }, callback);
}

function main() {
  const d = new Date();
  const w = d.getDay();
  const yymmdd = dateFormat(d, "yyyymmdd");

  const boards$ = Rx.Observable
    .of(...schedule.days)
    .filter(day => +day.dayofweek === w)
    .map(day => Rx.Observable.bindCallback(cloneBoard(`report_${yymmdd}`)))
    .mergeAll()
    .map(board => {
      const { name, id } = board;
      console.log(`[${d}] Created board ${name} with ID: ${id}`);
      return Rx.Observable.bindCallback(getBoard(id));
    })
    .mergeAll();

  const todoLists$ = boards$
    .map(({ url, lists }) => board.lists.map(list => Object.assign({}, list, {board_url: url})))
    .filter(list => list.name === "Todo");

  const cards$ = todoLists$
    .map(list => Rx.Observable
      .of(...day.report)
      .map(task => Rx.Observable.fromPromise(trello.createCard({
        "name": task.account,
        "desc": `${task.schedule}\r\n${task.type}\r\nAM: ${task.am}\r\nRemarks: ${task.remarks}\r\nLead Time: ${task.time}`,
        "due": dateFormat(d, "yyyy-mm-dd") + " 6:00",
        "idList": list.id
      })))
      .mergeAll();
    )
    .mergeAll();

  console.log("Finish adding");
  sendEmail(email_to, 'Report Board created for ' + dateFormat(d, "yyyy-mm-dd"), cardno + " cards created to Todo list\r\n<br/>"+board_url);
}

function sendEmail(recipents, subject, body) {
  var transporter = nodemailer.createTransport('smtps://sys.notifications%40abc.com:1234@smtp.abc.com');
  var mailOptions = {
    from: 'sys.notifications@abc.com', // sender address
    to: recipents.join(','), // list of receivers
    subject: subject, // Subject line
    text: body, // plaintext body
    html: body // html body
  };
  transporter.sendMail(mailOptions, function(error, info){
    if(error){
        return console.log(error);
    }
    console.log('Message sent: ' + info.response);
  });
}

module.exports = main;
