const express = require('express');
const githubAPI = require('github');
const cors = require('cors');
const github = new githubAPI({});

const app = express();
const port = process.env.PORT || 3000

app.use(cors());

app.get('/repo/:username', (req, res) => {
  let username = req.params['username'];
  if (!username) {
    res.send('No username parameter has found');
    return;
  }
  github.repos.getForUser({
    username: username
  }).then((response) => {
    res.send(getBasicDetails(response.data));
  }).catch((err) => {
    res.sendStatus(500);
    res.send(err);
  });
});

function getBasicDetails(data) {
  if (data && data.length) {
    data = data.map((repos) => {
      if (!repos.fork) {
        return {
          name: repos.name,
          description: repos.description, 
          url: repos.html_url,
        }
      }
    }).filter((repos) => {
      return repos && Object.keys(repos).length
    });
    return data;
  }
  throw 'No data has found';
}

app.listen(port, () => console.log(`Example app listening on port ${port}!`));