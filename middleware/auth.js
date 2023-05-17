const jwt = require("jsonwebtoken");



const authenticate = function (req, res, next) {

    try {
        const token = req.headers["x-api-key"]
        if (!token) {
            return res.status(400).send({ status: false, msg: "Token must be present" });}
        const decodedToken = jwt.verify(token, "my-self-key");
        req.decodedToken = decodedToken
        if (decodedToken) {
            next()}
        else {
            return res.status(401).send({ status: false, msg: "Token is invalid" });}
    } catch (err) {
        res.status(500).send({ msg: "Error", error: err.message })}}


        module.exports = {authenticate}