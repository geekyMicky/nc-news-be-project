const express = require("express");
const endpointsJson = require("./endpoints.json");

exports.getAllNews = (req, res) => {
  console.log(endpointsJson);
  res.status(200).send({ endpoints: endpointsJson });
};
