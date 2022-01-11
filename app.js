const express = require('express');

const app = express();

app.use('/users', (req, res, next) => {
	res.send('Hello from Users page');
});

app.use('/', (req, res, next) => {
	res.send('Hello from Homepage');
});

app.listen(3000);