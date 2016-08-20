/**
 * Created by danding on 16/8/20.
 */
var express = require('express');
var app = require('express')();
var static = require("express-static");
var bodyParser=require('body-parser');
var httpProxy = require("http-proxy");
var proxy = httpProxy.createProxyServer({});
var colors=require('colors');
var ulr = require('url');
var fs=require('fs');

app.enable('trust proxy');

app.post('*',function(req,res,next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
    res.header("X-Powered-By",' 3.2.1')
    res.header("Content-Type", "application/json;charset=utf-8");
    next();
});

app.use(static(__dirname + '/public'));
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());

app.post('/')



app.listen(9030);

