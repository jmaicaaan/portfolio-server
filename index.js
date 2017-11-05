const express = require('express');
const githubAPI = require('github');
const github = new githubAPI({});

const app = express();
const port = process.env.PORT || 3000

app.get('/repo/:username', (req, res) => {
  let username = req.params['username'];
  if (!username) {
    res.send('No username parameter has found');
    return;
  }
  github.repos.getForUser({
    username: username
  }).then((response) => {
    res.send(response);
  }).catch((err) => {
    res.sendStatus(500);
    res.send(err);
  });
});

app.listen(port, () => console.log('Example app listening on port 3000!'));