// Create web server

var http = require('http');
var url = require('url');
var fs = require('fs');
var qs = require('querystring');

// Create server
http.createServer(function (req, res) {
    // Parse the request containing file name
    var pathname = url.parse(req.url).pathname;
    // Parse the POST data
    var postData = '';
    req.setEncoding('utf8');
    req.addListener('data', function (chunk) {
        postData += chunk;
    });
    req.addListener('end', function () {
        // Handle the request
        route(pathname, postData, res);
    });
}).listen(8080);

// Handle the request
function route(pathname, postData, res) {
    console.log("Request for " + pathname + " received.");
    // Route the request to the appropriate handler
    if (pathname == "/getComments") {
        getComments(res);
    } else if (pathname == "/addComment") {
        addComment(postData, res);
    } else {
        // Handle invalid request
        console.log("Invalid request");
    }
}

// Get comments from file
function getComments(res) {
    // Read comments from file
    fs.readFile('comments.json', 'utf8', function (err, data) {
        if (err) {
            console.log(err);
        } else {
            console.log(data.toString());
            // Send comments to client
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(data);
        }
    });
}

// Add comment to file
function addComment(postData, res) {
    // Parse the POST data
    var query = qs.parse(postData);
    // Read comments from file
    fs.readFile('comments.json', 'utf8', function (err, data) {
        if (err) {
            console.log(err);
        } else {
            // Parse the JSON data
            var comments = JSON.parse(data);
            // Add new comment
            comments.push(query);
            // Write comments to file
            fs.writeFile('comments.json', JSON.stringify(comments), 'utf8', function (err) {
                if (err) {
                    console.log(err);
                } else {
                    console.log("New comment added");
                }
            });
            // Send comments to client
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(comments));

