const express = require('express');
const githubAPI = require('github');
const cors = require('cors');
const promise = require('bluebird');
const github = new githubAPI({});

const app = express();
const port = process.env.PORT || 3000

github.authenticate({
  type: 'token',
  token: process.env.TOKEN
});

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
    getBasicDetails(response.data)
      .then((data) => res.send(data));
  }).catch((err) => {
    res.sendStatus(500);
    res.send(err);
  });
});

function getBasicDetails(data) {
  if (data && data.length > 0) {
    return promise.map(data, (repository) => {
      return getRepoLanguage(repository.name)
        .then((language) => {
          if (!repository.fork && repository.description && (language && language.data)) {
            let demo_link = repository.has_pages ? `https://jmaicaaan.github.io/${repository.name}` : '';
            return {
              name: repository.name,
              description: repository.description,
              url: repository.html_url,
              demo_link,
              language: language.data
            }
          }
        });
    })
    .then((res) => {
      return res.filter((repos) => {
        return repos && Object.keys(repos).length
      });
    });
  }
  throw 'No data has found';
}

function getRepoLanguage(repositoryName) {
  if (!repositoryName) {
    return;
  }
  return github.repos.getLanguages({ owner: 'jmaicaaan', repo: repositoryName })
    .then((language) => language);
}

function getUserDetails() {
  return github.users.get({})
    .then((user) => user.data);  
}

app.get('/user', (req, res) => {
  getUserDetails()
    .then((user) => res.send(user));
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));