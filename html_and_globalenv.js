const fs = require("fs/promises");
let c = 0;
let a = 0;
async function getHtml(builds, versionHash, i, total) {
  // use cache or use my api
  let html;
  try {
    html = await fs.readFile("./builds/" + versionHash + ".html", "utf-8");
  } catch {}
  if (html) c += 1;
  if (!html) {
    a += 1;
    html = await (
      await fetch(
        "https://dc-old-builder.happyendermandev.workers.dev/?build_hash=" +
          versionHash
      )
    ).text();
  }
  console.clear();
  console.log("PROGRESS:", i, "/", total, "     -    ", (i / total) * 100, "%");
  console.log("CACHE HIT:", c, "API HIT:", a);
  return html;
}
const getGlobalEnv = (html) => {
  eval(
    html
      .match(/window\.GLOBAL_ENV\s*=\s*({[\s\S].+?<\/script>)/gm)?.[0]
      .replace("</script>", "")
      .replace("window.GLOBAL_ENV", "globalThis.GLOBAL_ENV")
  );
  return globalThis.GLOBAL_ENV;
};
async function main() {
  const files = await fs.readdir("./builds");
  const builds = JSON.parse(await fs.readFile("./builds.json", "utf-8"));
  for (let file of files) {
    if (file.endsWith(".html")) continue;
    const [i, total] = [files.findIndex((f) => f === file) + 1, files.length];
    const data = await fs.readFile("./builds/" + file, "utf-8");
    try {
      const manifest = JSON.parse(data);
      const html = await getHtml(builds, manifest.versionHash, i, total);
      await fs.writeFile(
        "./builds/" + file,
        JSON.stringify({
          versionHash: manifest.versionHash,
          buildNumber: manifest.buildNumber,
          globalEnv: getGlobalEnv(html),
          ref: manifest.ref,
        })
      );
      await fs.writeFile(
        "./builds/" + manifest.versionHash + ".html",
        html,
        "utf-8"
      );
    } catch (err) {
      console.log(err, file);
    }
  }
}
main();
