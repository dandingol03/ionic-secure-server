/**
 * Created by danding on 16/8/20.
 */
var express = require('express');
var app = require('express')();
var server=require('http').createServer();
var WebSocketServer=require('ws').Server;
var wss = new WebSocketServer({server: server});

var static = require("express-static");
var bodyParser=require('body-parser');
var httpProxy = require("http-proxy");
var proxy = httpProxy.createProxyServer({});
var colors=require('colors');
var ulr = require('url');
var fs=require('fs');
var formidable = require('formidable');



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


app.get('/',function(req,res) {
    res.sendFile(__dirname+'/views/index.html');
});

app.post('/upload',function(req,res) {

    var form = new formidable.IncomingForm();
    form.uploadDir =__dirname+'/tmp';
    form.parse(req, function(error, fields, files) {
        console.log(files.upload.path);
        fs.renameSync(files.upload.path, __dirname+'/upload/'+files.upload.name);
        res.setHeader("Content-Type","text/html");
        res.write("i got it ");
        res.end();
    });
});


app.post('/login', function (req, res) {
    res.send({re: 1});
});


/**
 *
 * 车险 coverages
 */

app.get('/insurance/project_provide',function(req,res) {

    var projects=[
        {name:'车辆损失险',fee:1205},
        {name:'第三者责任险',fee:[1104,870,999],selectable:true},
        {name:'全车盗抢险',fee:1102},
        {name:'车上人员责任险',fee:[700,600,1000],selectable:true},
        {name:'驾驶员',fee:200},
        {name:'乘客每人',fee:800},
        {name:'玻璃单独破碎险',fee:300},
        {name:'自燃损失险',fee:800},
        {name:'无法找到第三方',fee:100},
        {name:'新增设备险',fee:350},
        {name:'不计免赔险',fee:360},
        {name:'交强险',fee:400}
    ];
    res.send({projects:projects});
});


//图片下放
app.get('/get/photo/:path',function(req,res) {
    var path=__dirname+'/public/photo/'+req.params.path;
    fs.readFile(path,"binary",function(err,file) {
        if(err)
        {
            res.setHeader("Content-Type","text/plain");
            res.write(error+"\n");
            res.end();
        }
        var imgPath=req.params.path;
        var img_reg=/\.(.*)$/;
        var type=img_reg.exec(imgPath)[1];
        switch(type)
        {
            case 'png':
                res.setHeader("Content-Type","image/png");
                break;
            case 'jpg':
                res.setHeader("Content-Type","image/jpeg");
                break;
            default:
                break;
        }
        res.write(file,"binary");
        res.end();

    });
});

app.post('/post/photo/:path',function(req,res) {
    var path=__dirname+'/public/photo/'+req.params.path;
    fs.readFile(path,"binary",function(err,file) {
        if(err)
        {
            res.setHeader("Content-Type","text/plain");
            res.write(error+"\n");
            res.end();
        }
        var imgPath=req.params.path;
        var img_reg=/\.(.*)$/;
        var type=img_reg.exec(imgPath)[1];
        switch(type)
        {
            case 'png':
                res.setHeader("Content-Type","image/png");
                break;
            case 'jpg':
                res.setHeader("Content-Type","image/jpeg");
                break;
            default:
                break;
        }
        res.write(file,"binary");
        res.end();

    });
});


app.get('/insurance/my_pageinfo',function(req,res) {

    var infos=[
        {title:"个人信息",href:'/#/personInformation'},
        {title:"实名认证",href:''},
        {title:"我的订单",href:''},
        {title:"推荐二维码",href:''},
        {title:"我的股权",href:''},
        {title:"积分提现",href:''}
    ];
    res.send({infos:infos});
});


app.post('/insurance/project_upload',function(req,res) {
    var proj_list=req.query.proj_list;
    if(Object.prototype.toString.call(proj_list)!='[object Array]')
        proj_list = JSON.parse(proj_list);
    //TODO:store the proj_list to redis
    res.send({re: 1});
});

/**
 * page5
 */
app.get('/insurance/project_select', function (req, res) {

        //TODO:store the list and push it when stuff compulate the result
        res.send({prices:
            [
                {name:'compnay a',fee:1205,detail:{projects:['车辆损失险','乘客每人']}},
                {name:'compnay b',fee:801,detail:{projects:['第三者责任险','驾驶员','自燃损失险','交强险']}},
                {name:'compnay c',fee:999,detail:{projects:['玻璃单独破碎险','乘客每人']}},
                {name:'compnay d',fee:1405,detail:{projects:['无法找到第三方','车辆损失险','自燃损失险','全车盗抢险']}}
            ]});

});

app.post('/insurance/project_apply',function(req,res) {
    var company_id=req.body.company_id;
    var projects=req.body.projects;
    //TODO: store into redis
    res.send({re:1});
});

wss.on('connection',function connection(ws) {
    ws.on('message', function incoming(message) {
        console.log('received: %s', message);
    });
    ws.send('something');
});

server.on('request', app);
server.listen(9030);

