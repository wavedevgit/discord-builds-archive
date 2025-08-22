const fs = require("fs/promises");
async function downloadInfoJson(commit) {
  const url = `https://raw.githubusercontent.com/Wumpus-Central/discrapper-canary/${commit}/info.json`;
  const res = await fetch(url);
  const data = await res.text();
  return data.startsWith("{") ? JSON.parse(data) : data;
}
const exists = async (path) => {
  try {
    await fs.readFile(path);
    return true;
  } catch {
    return false;
  }
};
async function main() {
  const commits = JSON.parse(await fs.readFile("./latest.json", "utf-8"));

  for (let commit of commits) {
    if (await exists("./builds/" + commit + ".html")) continue;
    console.log("new", commit);
    await fs.writeFile("last_commit", commit, "utf-8");
    const data = await downloadInfoJson(commit);
    if (typeof data === "string") {
      console.log("err", data);
      continue;
    }
    data.ref = commit;
    await fs.writeFile(
      "./builds/" + data.versionHash + ".json",
      JSON.stringify(data)
    );
  }
}

main();
