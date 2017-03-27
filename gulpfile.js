const gulp = require('gulp');
const mysql = require('mysql');

require('dotenv').config();
const env = process.env;

gulp.task('db:schema', onFinishTaskCallback => {
	const connection = mysql.createConnection({
		'host':	env['GUESTBOOK_DB_HOST'],
		'user':	env['GUESTBOOK_DB_USER'],
		'password':	env['GUESTBOOK_DB_PASSWORD']
	});
	const databaseName = connection.escapeId(env['GUESTBOOK_DB_NAME']);
	const query = 'CREATE SCHEMA IF NOT EXISTS ' + databaseName + ' DEFAULT CHARACTER SET=utf8';
	connection.query(query);
	connection.end(onFinishTaskCallback);
});

gulp.task('db:tables', ['db:s chema'], onFinishTaskCallback => {
	const connection = mysql.createConnection({
		'host':	env['GUESTBOOK_DB_HOST'],
		'user':	env['GUESTBOOK_DB_USER'],
		'password':	env['GUESTBOOK_DB_PASSWORD'],
		'database':env['GUESTBOOK_DB_NAME']
	});
	const query = 
	'CREATE TABLE IF NOT EXISTS `messages` ('	+
	'	messages_id INT UNSIGNED NOT NULL AUTO_INCREMENT, ' +
	'	first_name VARCHAR(128) NOT NULL, ' +
	'	content VARCHAR(1024) NOT NULL, ' +
	'	creation_date DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP, ' +
	'	PRIMARY KEY (`messages_id`)' +
	')';
	
	connection.query(query);
	connection.end(onFinishTaskCallback);
});