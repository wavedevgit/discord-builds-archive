const fs = require("fs/promises");

async function main() {
  const files = await fs.readdir("./builds");
  for (let file of files) {
    const data = await fs.readFile("./builds/" + file, "utf-8");
    try {
      const manifest = JSON.parse(data);
      await fs.writeFile(
        "./builds/" + file,
        JSON.stringify({
          versionHash: manifest.versionHash,
          buildNumber: manifest.buildNumber,
          builtAt: manifest?.globalEnv?.BUILT_AT,
          globalEnv: manifest.globalEnv,
          ref: manifest.ref,
        })
      );
    } catch (err) {
      console.log(data);
      console.log(err, file);
      await fs.rm("./builds/" + file);
    }
  }
}
main();
