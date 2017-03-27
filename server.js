const http = require('http');
const fs = require('fs');
const util = require('util');
const qs = require('querystring');

const validator = require('validator');
const mysql = require('mysql');

require('dotenv').config();

const env = process.env;
const pool = mysql.createPool({
	'host':env['GUESTBOOK_DB_HOST'],
	'user':env['GUESTBOOK_DB_USER'],
	'password':env['GUESTBOOK_DB_PASSWORD'],
	'database':env['GUESTBOOK_DB_NAME']
});

const port = 6553;
const pageTemplate = fs.readFileSync('index.html.template', 'utf-8');

function getEntries(onResultsCallback) {
	const query = 'SELECT * FROM messages';
	pool.query(query, onResultsCallback);
}

function addEntry(postData, onFinishCallBack) {
	const entry = {
		'first_name': postData.name, 
		'content': postData.message
	};
	
	const query = 'INSERT INTO `messages` SET ?';
	pool.query(query, entry, error => {onFinishCallBack(error);});
}
function renderPage(messages) {
	let entries = '';
    for(message of messages){
		const name = validator.escape(message['first_name']);
		const content = validator.escape(message['content']);
    	entries += `<p>${name}</p>` + `<p>${content}</p>`;
    }
	const page = util.format(pageTemplate, entries);
	return page;
}
function send(response, data) {
	response.writeHead(200, {
		'Content-Type' : 'text/html'
	});
	response.write(data);
	response.end();
}
function redirect(response, location){
	response.writeHead(302, {
		'Location': location
	});
	response.end();
}

function receiveBody(request, onReceivedBodyCallback) {
	const bodyLengthLimit = 2048;
	let body = '';
	request.setEncoding('utf-8');
	request.on('data', (chunk) => {
		body += chunk;
		if(body.length > bodyLengthLimit) {
			request.destroy();
		}
	});
	request.on('end', () => {
		const postData = qs.parse(body);
		onReceivedBodyCallback(postData);
	});
}
const server = http.createServer((request, response) => {
	if(request.method == 'POST') {
		receiveBody(request, postData => {
	  		addEntry(postData, error => {
				if(error) {
					console.error('Failed to save a new entry.');
					console.error(error);
				}
				redirect(response, '/');
			});
	    });
	}
	else if(request.method == 'GET') {
		getEntries((error, messages) => {
			if(error) {
				console.error('Failed to get entries.');
				console.error(error);
			}
			const page = renderPage(messages);
			send(response, page);
		});
	}
});

server.listen(port, () => {
	console.log("The server is listening on port " + port);
});