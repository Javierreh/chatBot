var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var Telegraf = require('telegraf');
var userData = require('./models/userData');


// var indexRouter = require('./routes/index');
// var usersRouter = require('./routes/users');

var app = express();


const BOT_TOKEN = '874070600:AAEXKhRGOhlshZEEBxNtu_1oQl0M6Ob_jRk';

const bot = new Telegraf(BOT_TOKEN);
app.use(bot.webhookCallback('/secret-path'));
bot.telegram.setWebhook('https://aa714a1a.ngrok.io/secret-path');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({
  extended: false
}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// bot.use((ctx) => {
//   console.log(ctx.from)
//   console.log(ctx.message.from.username)
// })


// app.use('/', indexRouter);
// app.use('/users', usersRouter);

app.get('/', (req, res) => {
  res.render('index', { title: 'Express' })
})

app.post('/secret-path', (req, res) => {
  console.log('entra')
  res.send('Hello World!')
})

app.post('/enviarmsg', (req, res) => {
	// res.json(req.body.mensaje)

	userData.allUsers().then((rows) => {
		for (row of rows) {
			bot.telegram.sendMessage(row.id_telegram, req.body.mensaje)
		}
		res.send('Mensaje enviado');
	})

	// bot.telegram.sendMessage(562153487, 'HOLA hamijos')
})

bot.command('info', (ctx) => ctx.reply('/random: "mensaje" - Envia un mensaje a un usuario aleatorio'));

bot.command('creators', (ctx) => ctx.reply(`Creadores: Javi, Raquel, Esteban y Víctor`));

bot.command('start', async (ctx) => {
	let rows = await userData.comprobar(ctx.from.id)
	if (rows.length != 1) {
		userData.insert(ctx.from)
	}
	else {
		console.log("Usuario existente");
	}
});


bot.command('random', (ctx) => {
	userData.randomUser().then((rows) => {
		bot.telegram.sendMessage(rows[0].id_telegram, ctx.message.text)
	});
	console.log(ctx.message.text);
});


// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
