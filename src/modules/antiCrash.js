module.exports = (client) => {
  process.on("unhandledRejection", (reason, p) => {
    console.log("🔴 [AntiCrash]: Unhandled Rejection/Catch");
    console.log(reason);
  });
  process.on("uncaughtException", (err, origin) => {
    console.log("🔴 [AntiCrash]: Uncaught Exception/Catch");
    console.log(err);
  });
  process.on("uncaughtExceptionMonitor", (err, origin) => {
    console.log("🔴 [AntiCrash]: Uncaught Exception/Catch (MONITOR)");
    console.log(err);
  });
  process.on("multipleResolves", (type, promise, reason) => {
    console.log("🔴 [AntiCrash]: Multiple Resolves");
    if (reason === "Error: Cannot perform IP discovery - socket closed") return;
    console.log(type);
  });
};
