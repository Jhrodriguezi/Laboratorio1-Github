const express = require('express');
const routes = express.Router();
const path = require('path');

routes.get("/", (req, res)=>{
        res.sendFile(path.resolve(__dirname, '../views/login.html'));
    }
);

routes.post("/register", async (req, res) => {
    
})

module.exports = routes;