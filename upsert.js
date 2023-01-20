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
  const getPubKey = async (owner, repo) => {
    const pubkey = await octokit.request('GET /repos/{owner}/{repo}/actions/secrets/public-key', {
      owner,
      repo
    })
    return pubkey.data
  }

  const upsert = async (owner, repo, secretName, encryptedValue, keyId) => {
    const result = await octokit.request('PUT /repos/{owner}/{repo}/actions/secrets/{secret_name}', {
      owner,
      repo,
      secret_name: secretName,
      encrypted_value: encryptedValue,
      key_id: keyId
    })
    return result.status
  }

  const rawdata = fs.readFileSync('.secrets', 'utf8')
  const data = dotenv.parse(rawdata)
  console.log(data)

  const pubKey = await getPubKey(owner, repo)
  const encrypt = async (pubkey, secret) => {
    await sodium.ready
    const binkey = sodium.from_base64(pubkey, sodium.base64_variants.ORIGINAL)
    const binsec = sodium.from_string(secret)
    const encBytes = sodium.crypto_box_seal(binsec, binkey)
    const output = sodium.to_base64(encBytes, sodium.base64_variants.ORIGINAL)
    return output
  }

  const secretKeys = Object.keys(data)
  for (let index = 0; index < secretKeys.length; index++) {
    const keyName = secretKeys[index]
    const value = data[keyName]
    const encrypted = await encrypt(pubKey.key, value)
    const response = await upsert(owner, repo, keyName, encrypted, pubKey.key_id)
    console.log(response)
  }
})()
