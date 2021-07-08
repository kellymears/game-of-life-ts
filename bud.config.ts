import type { Framework } from "@roots/bud";

export default (bud: Framework) =>
  bud
    .use([require("@roots/bud-babel"), require("@roots/bud-typescript")])
    .entry("main", ["index.{css,ts}"])
    .template({
      template: "src/index.html",
    });
