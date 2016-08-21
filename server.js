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

/**
 * page4
 */

app.post('/insurance/projecct_provide',function(req,res) {

    var projects=[
        {name:'车辆损失险',fee:1205},
        {name:'第三者责任险',fee:[1104,870,999]},
        {name:'全车盗抢险',fee:1102},
        {name:'车上人员责任险',fee:[700,600,1000]},
        {name:'驾驶员',fee:200},
        {name:'乘客每人',fee:800},
        {name:'玻璃单独破碎险',fee:300},
        {name:'自燃损失险',fee:800},
        {name:'无法找到第三方',fee:100},
        {name:'新增设备险',fee:350},
        {name:'不计免赔险',fee:360},
        {name:'交强险',fee:400}
    ];
    res.send(projects);
});

/**
 * page5
 */
app.post('/insurance/project_select', function (req, res) {
    var projects=req.body.projects;
    if(projects!==undefined&&projects!==null)
    {
        //TODO:store the list and push it when stuff compulate the result

        res.send({prices:
            [
                {name:'compnay a',fee:1205,detail:{projects:['车辆损失险','乘客每人']}},
                {name:'compnay b',fee:801,detail:{projects:['第三者责任险','驾驶员','自燃损失险','交强险']}},
                {name:'compnay c',fee:999,detail:{projects:['玻璃单独破碎险','乘客每人']}},
                {name:'compnay d',fee:1405,detail:{projects:['无法找到第三方','车辆损失险','自燃损失险','全车盗抢险']}}
            ]});
    }else{
        res.send({re: -1});
    }
});

app.post('/insurance/project_apply',function(req,res) {
    var company_id=req.body.company_id;
    var projects=req.body.projects;
    //TODO: store into redis
    res.send({re:1});
});


app.listen(9030);

