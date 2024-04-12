require("dotenv").config();
const express = require("express");

module.exports = (client) => {
  const app = express();

  app.get("/", function (req, res) {
    res.send("Hello World");
  });

  app.listen(process.env.DASHBOARD_PORT, () =>
    console.log(
      `🟢 [DASHBOARD] Dashboard được mở ở cổng ${process.env.DASHBOARD_PORT}`
    )
  );
};
