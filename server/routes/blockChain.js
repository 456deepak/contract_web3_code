
const express = require("express");
const blockChainController = require("../controllers/blockChainController");
const contractRouter = express.Router();

contractRouter.get("/getOwner", blockChainController.getOwner);

module.exports = contractRouter;
