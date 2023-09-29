#!/usr/bin/env node

import process from 'node:process'
import open from 'open'
import { getPort } from 'get-port-please'

process.env.HOST = '127.0.0.1'
process.env.PORT = await getPort({ port: 7777 })

await Promise.all([
  import('./dist/server/index.mjs'),
  open(`http://localhost:${process.env.PORT}`),
])
