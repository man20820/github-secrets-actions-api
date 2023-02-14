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
  const insert = async (owner, repo, name, value) => {
    const result = await octokit.request('POST /repos/{owner}/{repo}/actions/variables', {
      owner,
      repo,
      name,
      value
    })
    return result.status
  }

  const rawdata = fs.readFileSync('.vars', 'utf8')
  const data = dotenv.parse(rawdata)
  console.log(data)


  const keys = Object.keys(data)
  for (let index = 0; index < keys.length; index++) {
    const keyName = keys[index]
    const value = data[keyName]
    // console.log(value)
    // const response = await insert(owner, repo, keyName, value)
    // console.log(response)
  }
})()
