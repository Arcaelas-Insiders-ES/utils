#! ts-node
const { build } = require("esbuild")
const { promises } = require("fs")

function naming(dirname) {
    return {
        name: "resolution_name",
        setup(build) {
            build.onLoad({ filter: /\.test\.ts$/ }, async args => {
                const content = await promises.readFile(args.path, 'utf-8')
                return {
                    contents: content.replace("../src/", dirname),
                    loader: "ts",
                }
            })
        }
    }
}

build({
    entryPoints: ["./src/index.ts"],
    outfile: "./lib/index.js",
    bundle: true,
    minify: true,
    platform: "neutral",
    format: "cjs",
})


// Test Files
build({
    entryPoints: ["./test/index.test.ts"],
    outfile: "./test/index.test.cjs",
    bundle: false,
    minify: false,
    platform: "neutral",
    format: "cjs",
    plugins: [
        naming('../lib'),
    ]
})
build({
    entryPoints: ["./test/index.test.ts"],
    outfile: "./test/index.test.mjs",
    bundle: false,
    minify: false,
    platform: "neutral",
    format: "esm",
    plugins: [
        naming('../lib'),
    ]
})

