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
  console.log(page)
  const getVars = async (owner, repo) => {
    const vars = await octokit.request('GET /repos/{owner}/{repo}/actions/variables', {
      owner,
      repo,
      page
    })
    return vars.data
  }
  const listVars = await getVars(owner, repo)
  console.log(listVars, "haii")
  allVars = allVars.concat(listVars.variables);
  if (listVars.variables.length < 10) {
    break; // end of results
  }
  
  page++;
  // console.log(listVars.total_count)
  // console.log(listVars.variables)


}
  const objectVar = Object.keys(allVars)
  // console.log(objectVar)
  for (let index = 0; index < objectVar.length; index++) {
    const element = objectVar[index];
    value = allVars[element]
    console.log(value.name)
    // const clear = await deleteVars(owner, repo, value.name)
    // console.log(clear)
  }
// console.log(allVars, "aaa")

})()
