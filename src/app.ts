import express from 'express';

const app = express();
const port: number = 3000;

app.get('/', (req, res) => {
    res.send('The sedulous hyena ate the antelope!');
});

app.listen(port, () => {
    console.log('Listening on port: ', port);
}).on('error', (e) => {
    console.log('Error happened: ', e.message)
});
