const fs = require("fs/promises");
const formatter = require("html-formatter");

async function main() {
  const files = await fs.readdir("./builds");
  for (let file of files) {
    if (file.endsWith(".json")) continue;
    const data = await fs.readFile("./builds/" + file, "utf-8");
    await fs.writeFile(
      "./builds/" + file,
      formatter.render(
        data
          .replaceAll(/nonce=".+?"/gm, "")
          .replaceAll(/integrity=".+?"/gm, "")
          .replaceAll("<script >", "<script>")
      ),
      "utf-8"
    );
  }
}
main();
