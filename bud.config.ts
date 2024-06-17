import { bud } from "@roots/bud";

bud
  .html({
    replace: {
      APP_DESCRIPTION: "Game of Life in TypeScript",
    },
    template: "src/index.html",
  })
  .minimize()
  .runtime(false);
