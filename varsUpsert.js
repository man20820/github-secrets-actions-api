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
  let page = 1
  let allVars = []
  while (true) {
  const getVars = async (owner, repo) => {
    const vars = await octokit.request('GET /repos/{owner}/{repo}/actions/variables', {
      owner,
      repo,
      page
    })
    return vars.data
  }
  const listVars = await getVars(owner, repo)
  allVars = allVars.concat(listVars.variables);
  if (listVars.variables.length < 10) {
    break; // end of results
  }
  page++
}
  const edit = async (owner, repo, name, value) => {
    const result = await octokit.request('PATCH /repos/{owner}/{repo}/actions/variables/{name}', {
      owner,
      repo,
      name,
      value
    })
    return result.status
  }

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
  //console.log(data)

  const keys = Object.keys(data)
  const objectVar = Object.keys(allVars)

  let existingVars = []
  let newVars = []
  
  // console.log(listVars.variables)
  
  
  for (let index = 0; index < objectVar.length; index++) {
    const element = objectVar[index];
    value = allVars[element]
    console.log(value.name)
    console.log(existingVars.push(value.name))
    // const clear = await edit(owner, repo, keyName, value)
    // console.log(clear)
  }
  console.log(existingVars)

  for (let index = 0; index < keys.length; index++) {
    const element = keys[index];
    value = data[element]
    console.log(element)
    const existing = existingVars.includes(element)
    console.log(existing)
    if (existing == true) {
      const clear = await edit(owner, repo, element, value)
      console.log(clear)
    } else {
      // console.log(owner)
      // console.log(repo)
      // console.log(element, "haii")
      // console.log(value, "haloo")
      const clear = await insert(owner, repo, element, value)
      console.log(clear)
    }
  }

})()
