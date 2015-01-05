var Twit = require('twit'),
    t = new Twit( require('./config.json')),
    express = require('express'),
    app = express(),
    server = require('http').createServer(app),
    morgan = require('morgan'),
    _ = require('lodash');

/************************************************************************************************************************
 * Server Setup
 ************************************************************************************************************************/
var port = process.env.PORT || 3456;

server.listen(port, function () {
    console.log('Server listening at port %d', port);
});

app.use(morgan('dev'));
app.use(express.static(__dirname + '/public'));

app.use(function logErrors (err, req, res, next) {
    console.error(err.stack);
    next(err);
});

app.use(function clientErrorHandler (err, req, res, next) {
    if (req.xhr) {
        res.status(500).send({ error: 'Something blew up!' });
    } else {
        next(err);
    }
});

app.use(function errorHandler (err, req, res, next) {
    res.status(500);
    res.render('error', { error: err });
});

/************************************************************************************************************************
 * Loading config
 ************************************************************************************************************************/
/*config.wall = _.map(config.wall, function(hash) {
    return hash.toLowerCase();
});
config.battle = _.map(config.battle, function(hash) {

    return hash.toLowerCase();
});

var tracking = _.union(config.wall, config.battle),
    battleCount = _.zipObject(config.battle, _.range(0, config.battle.length, 0));

console.log(battleCount);
_.forEach(tracking, function(hash) {
    t.track(hash);
});*/


/************************************************************************************************************************
 * App
 ************************************************************************************************************************/
app.get('/', function (req, res) {
    t.get('search/tweets', { q: 'banana since:2011-11-11', count: 100 }, function(err, data, response) {
        if(err) {
            res.send('Error');
            return;
        }

        var sheet = [];
        var head = [];
        head.push("id");
        sheet.push(head);

        for (var i = 0; i < data.statuses.length; i++)
        {
            var tweet = data.statuses[i];

            var row = [];
            row.push(tweet.id);

            sheet.push(row);
        }
        var all = [];
        all.push(sheet);
        res.send(JSON.stringify(all));
    });

});
