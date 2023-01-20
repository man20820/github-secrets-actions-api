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
  const getVars = async (owner, repo) => {
    const vars = await octokit.request('GET /repos/{owner}/{repo}/actions/variables', {
      owner,
      repo
    })
    return vars.data
  }
  const listVars = await getVars(owner, repo)
  // console.log(listVars.total_count)
  // console.log(listVars.variables)

  const deleteVars = async (owner, repo, name) => {
    const vars = await octokit.request('DELETE /repos/{owner}/{repo}/actions/variables/{name}', {
      owner,
      repo,
      name
    })
    return vars.status
  }

  const objectVar = Object.keys(listVars.variables)
  for (let index = 0; index < objectVar.length; index++) {
    const element = objectVar[index];
    value = listVars.variables[element]
    console.log(value.name)
    const clear = await deleteVars(owner, repo, value.name)
    console.log(clear)
  }

})()
