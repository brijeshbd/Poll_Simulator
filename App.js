const express = require("express");
const path = require('path');
const hbs = require('hbs');

let candidates = [];
let result = [];
let votes = new Set();
let totalcandidate = 0;
let won = 0, m1 = 0, m2 = 0, runner = 0;
const app = express();
const PORT = process.env.PORT || 4000;
app.set('views', path.join(__dirname, '/view'));
app.set('view engine', 'hbs');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', function (req, res) {
    res.render('index');
});

app.get('/addCandidates', function (req, res) {
    res.render('addCandidates', { cans: candidates });
});

app.post('/add', function (req, res) {
    candidates.push({ name: req.body.name, votes: 0 });
    totalcandidate++;
    res.redirect('addCandidates');
});

app.get('/vote', function (req, res) {
    res.render('vote', { cans: candidates, msg: "" });
});

app.post('/votecount', function (req, res) {
    if (req.body.id.length == 0) {
        res.render('vote', { cans: candidates, msg: "Please Enter your ID" });
    }
    if (votes.has(req.body.id)) {
        res.render('vote', { cans: candidates, msg: "Sorry ! you can vote only once" });
    }
    else {
        votes.add(req.body.id);
        for (let i = 0; i < totalcandidate; i++) {
            if (candidates[i].name == req.body.vote) {
                candidates[i].votes++;
            }
        }
        res.render('vote', { cans: candidates, msg: "Thank you for voting" });
    }
});

app.get('/pollresult', function (req, res) {

    if (candidates.length == 0) {
        res.redirect("/");
    }

    for (let i = 0; i < totalcandidate; i++) {
        if (candidates[i].votes > m1) {
            m2 = m1; runner = won;
            m1 = candidates[i].votes;
            won = i;
        } else if (candidates[i].votes < m1 && candidates[i].votes > m2) {
            m2 = candidates[i].votes;
            runner = i;
        }
    }

    result.push({ name: candidates[won].name, votes: candidates[won].votes });
    result.push({ name: candidates[runner].name, votes: candidates[runner].votes });
    res.render('pollresult', { ress: result });
});

app.get('/votingsummary', function (req, res) {
    res.render('votingsummary', { cans: candidates });
});

(async function runServer() {
    await app.listen(PORT);
    console.log(`Server Started at PORT ${PORT}`);
})();