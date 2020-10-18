const express = require('express');
const bodyParser = require('body-parser');
const router =express.Router();
const app = express()
app.use(bodyParser.urlencoded({
  extended: true
}))

const http = require('http');
const fs = require('fs');
const json = require('./data.json');
var file;

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
  });

const server = http.createServer(function(req, res){
	let file

	try{
		file = fs.readFileSync('./index.html');
	}
	catch(e){
		res.writeHead(404, {'content-type': 'text/plain'});
		res.write('404 File Not Found!');
		res.end();
		return;
	}

	if(file){
		res.writeHead(200, {'content-type': 'text/html'});
		res.write(file);
		res.end();
	}

/*******GETS THE FORM DATA************/
	req.on('data', (data)=>{
		var arr = decodeURIComponent(data).replace(/\+/g, ' ').replace('id=', '')
				.replace('title=', '').replace('price=', '').replace('description=', '').replace('date', '').split('&');

		var node = json.head;
		var next;

/****TURNS JSON INTO LINKED LIST OF FORM INPUT********/
	while(node){
		next = node.head;

		if(node.head == null){
            node.head = { id: arr[0], title: arr[1], price: arr[2], description:arr[3], date: arr[4]};
            

/**********WRITES THE NEW JSON TO THE JSON FILE****************/
			fs.writeFile('./data.json', JSON.stringify(json, null, 2), (err)=>{
				if(err){
					throw err;
				}
			});
			break;
		}
		else {
			node = next;
        }
        
	}

    });
    router.post('/display', (req, res) => {
        res.render('Book ID:' + req.body.book + '<br>Title : ' + req.body.title + '<br/>Price:' + req.body.price  );
        console.log(req.body);
      });
      

}).listen(3000, ()=>{console.log('Server running on 3000');});