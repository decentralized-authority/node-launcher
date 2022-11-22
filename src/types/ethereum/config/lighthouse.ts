export const base = `---
`

export const validator = `- enabled: true
  voting_public_key: "{{PUBLIC_KEY}}"
  description: ""
  type: local_keystore
  voting_keystore_path: /root/keystore/validators/{{KEYSTORE_PATH}}
  voting_keystore_password_path: /root/secrets/password
`