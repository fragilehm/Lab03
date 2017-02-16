const http = require('http');
const fs = require('fs');
const util = require('util');
const qs = require('querystring');



const port = 6547;
const pageTemplate = fs.readFileSync('index.html.template', 'utf-8');
const guestBookEntries = [];

function send (response) {
	let entries = '';
    for(entry of guestBookEntries){

    	entries += `<p>${entry.name}</p><p>${entry.message}</p>`;
    	//entries += '<p>'
    }
	const page = util.format(pageTemplate, entries);
	response.writeHead(200, {
		'Content-Type' : 'text/html'
	});

	response.write(page);
	response.end();
}
function redirect(response, location){
	response.writeHead(302, {
		'Location': location 
	});
	response.end();
}
const server = http.createServer((request, response) => { // => similar as function (request, response)
	if(request.method == 'POST')
	{
		let body = '';
	    request.setEncoding('utf-8');
	    request.on('data', (chunk) => {
	   		body += chunk;

	    });
	    request.on('end', () => {
	    	const postData = qs.parse(body);
	  		console.log(postData);
	  		guestBookEntries.push(postData);
	  		redirect(response,'/');
	    });

	    //[{name: "", message: ""}, {name: "", message: ""}]
	    //"<p>Muhamed"</p><p>HI</p><p>Sergey</p>
	}
	else if(request.method == 'GET')
	{
		send(response);
		
		//reply();
	}
    
});

server.listen(port, () => {
	//console.log("The server is listening on port ${port}");
		//console.log("The server is listening on port ${port}");
	console.log("The server is listening on port " + port);


});
// scp -r greeter duisheev_e@auca.space:~/