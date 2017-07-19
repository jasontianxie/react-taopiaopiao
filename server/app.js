var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
let fs = require('fs');

var routes = require('./routes/route_app');

var app = express();
var ejs = require('ejs');

app.set('views', path.join(__dirname, 'views'));//为app设置变量，有些变量时保留名，比如这里的views和view engine，可以用app.get来获取变量：http://www.expressjs.com.cn/4x/api.html#app.set
app.set('view engine', 'ejs');

app.engine('.html', ejs.__express);//为扩展名文件配置模板引擎：http://www.expressjs.com.cn/4x/api.html#app.engine。通常设置了上面的app.set('views', path.join(__dirname, 'views'));和app.set('view engine', 'ejs');就不用app.engine了，express会自动调用模板引擎。那么什么时候要用app.engine呢，两种情况下要用，第一：模板引擎没有提供__express方法，第二：模板引擎要解析其他后缀名的文件。比如这里，ejs模板本来是解析.ejs后缀的文件，但是这里需要解析html，所以要用app.engine
app.set('view engine', 'html');// app.set('view engine', 'ejs');

app.use(favicon(path.join(__dirname, 'favicon', 'favicon.ico')));//app.use为路由增加中间件，当访问这个路由的时候，就会调用这个中间件。http://www.expressjs.com.cn/4x/api.html#app.use
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));//express管理静态资源：http://www.expressjs.com.cn/4x/api.html#express.static

//处理webpack服务请求
app.get('/__webpack_hmr', function(req, res) {
  res.send('')
})

app.get(/\/movie\/hot\//, routes.hot);
app.get(/\/movie\/cinema\//, routes.cinema);
app.get(/\/movie\/info\//, routes.info);
app.get(/\/movie\/evaluation\//, routes.evaluation);
app.get(/\/movie\/coming\//, routes.coming);
app.get(/\/movie\/coming\/[\w\W]*/, routes.comingLimit);

app.get('/movie/swiper', routes.swiper);
app.get('/movie/city', routes.city);
app.get('/movie/cinema_detail', routes.cinema_detail);


app.get('/app', routes.index);
app.get('/', (req, res) => {
    res.redirect('app');
});
app.get(/\/movie\/detail\//, routes.index);
app.get(/\/cinema/, routes.index);

app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
