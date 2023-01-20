require('dotenv').config()
const dotenv = require('dotenv')
const { Octokit } = require('@octokit/core')
const sodium = require('libsodium-wrappers')
const fs = require('fs')

const PAT = process.env.PAT
const owner = process.env.OWNER
const repo = process.env.REPO

const octokit = new Octokit({
  auth: PAT
})

;(async () => {
  const getSecrets = async (owner, repo) => {
    const secrets = await octokit.request('GET /repos/{owner}/{repo}/actions/secrets', {
      owner,
      repo
    })
    return secrets.data
  }
  const listSecrets = await getSecrets(owner, repo)
//   console.log(listSecrets.total_count)
//   console.log(listSecrets.secrets)

  const deleteSecrets = async (owner, repo, secretName) => {
    const secrets = await octokit.request('DELETE /repos/{owner}/{repo}/actions/secrets/{secret_name}', {
        owner: owner,
        repo: repo,
        secret_name: secretName
      })
    return secrets.status
  }

  const objectSecret = Object.keys(listSecrets.secrets)
  for (let index = 0; index < objectSecret.length; index++) {
    const element = objectSecret[index];
    value = listSecrets.secrets[element]
    console.log(value.name)
    const clear = await deleteSecrets(owner, repo, value.name)
    console.log(clear)
  }

})()
