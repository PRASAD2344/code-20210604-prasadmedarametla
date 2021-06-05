const express = require('express');
const helmet = require('helmet');

const app = express();
const port = process.env.PORT || "3000";

app.use(helmet());

const json_process_controller = require('./controller/json_process_controller')
app.use('/', json_process_controller.router)

app.listen(port, () => {
    console.log('Listening on port: ', port);
}).on('error', (e) => {
    console.log('Error happened: ', e.message)
});
