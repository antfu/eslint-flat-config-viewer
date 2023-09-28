#!/usr/bin/env node

import process from 'node:process'
import open from 'open'

process.env.HOST = '127.0.0.1'
process.env.PORT = 7081

await Promise.all([
  import('./dist/server/index.mjs'),
  open(`http://localhost:${process.env.PORT}`),
])
