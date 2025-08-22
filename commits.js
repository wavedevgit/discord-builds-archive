const fs = require("fs/promises");
const repo = "wumpus-central/discrapper-canary";

async function downloadInfoJson(commit) {
  const url = `https://raw.githubusercontent.com/${repo}/${commit}/info.json`;
  const res = await fetch(url);
  const data = await res.json();
  return data;
}
async function download(page) {
  const r = await fetch(
    `https://api.github.com/repos/${repo}/commits?per_page=100${
      page !== null ? "&page=" + page : ""
    }`
  );
  const j = await r.json();
  console.log(j[0]);
  if (!Array.isArray(j)) console.log("not array", j);
  return j?.map?.((e) => e.sha);
}
async function main() {
  let result = [];

  const d = await download(null);

  result.push(...d);
  await fs.writeFile("./latest.json", JSON.stringify(result));
}
console.log("done");

main();
