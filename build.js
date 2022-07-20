import { build } from 'esbuild'
import { rmSync } from 'node:fs'
import path from 'node:path/win32'
let makeAllPackagesExternalPlugin = {
    name: 'make-all-packages-external',
    setup(build) {
      let filter = /^[^.\/]|^\.[^.\/]|^\.\.[^\/]/ // Must not start with "/" or "./" or "../"
      build.onResolve({ filter }, args => ({ path: args.path, external: true }))
    },
}

rmSync('dist', { recursive: true, force: true });

build({
    plugins: [makeAllPackagesExternalPlugin],
    bundle: true,
    format: 'esm',
    platform: 'node',
    target: 'node16',
    entryPoints: ['./src/main.ts'],
    outfile: './dist/cli.js'
}).then(() => console.log('Build completed.'))
.catch(err => console.error(err));