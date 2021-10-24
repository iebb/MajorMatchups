const express = require("express");
const serverless = require("serverless-http");
const compression = require("compression");
const helmet = require("helmet");
const cors = require("cors");
const history = require("connect-history-api-fallback");
const fetch = require("node-fetch");

const app = express();
const PORT = process.env.PORT || 3000;

if (app.get("env") === "production") {
  app.set("trust proxy", 1);
}

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(
  helmet({
    contentSecurityPolicy: false
  })
);
app.use(compression());
app.use(cors({ origin: true }));
app.use(history());

app.use(
  express.static("dist/web", {
    maxAge: process.env.CACHE_MAX_AGE || "1d"
  })
);

app.get("/api/teams",
  async (req, res) => {
    try {
      const data = await fetch("https://berlin.wa.vg/api/teams.php?tournament=" + req.params.tournament, {
        method: "GET",
      });

      const json = await data.json();

      res.status(json.Status || 200).json(json);
    } catch (err) {
      console.error(err);

      res.status(500).json(err);
    }
  }
);

process.on("unhandledReject", console.warn);
process.on("uncaughtException", console.error);

module.exports.handler = serverless(app);
