const router = require('express').Router();
const StreamArray = require('stream-json/streamers/StreamArray');
const Batch = require('stream-json/utils/Batch');
const {chain} = require('stream-chain');
const vblaze = require('vblaze');
const {processBatch} = require('../util/bmi_calculator')

let nanoJobPool;

(async () => {
    const {nanoJob} = await vblaze(4);
    nanoJobPool = nanoJob;
})();

router.post('/process', (req, res) => {

    {
        res.setHeader('Content-type', 'application/json');
        res.write('{"data":[');
    }

    let isStart = true;
    let promises = [];
    const jsonStream = chain([
        req,
        StreamArray.withParser(),
        new Batch({batchSize: 10000})
    ]);

    jsonStream.on('data', async (data) => {
        promises.push(processBatchAndWriteToResponse({data, isStart, res}));
        if (isStart) {
            isStart = false;
        }
    });

    jsonStream.on('end', () => {
        Promise.all(promises).then((values) => {
            let overWeightCount = 0;
            values.forEach(value => {
                overWeightCount = overWeightCount + value;
            })
            res.write(`], "overWeightCount": ${overWeightCount} }`);
            res.end();
        });
    });

});

const processBatchAndWriteToResponse = async ({data, isStart, res}) => {
    let {contentStr, overWeightCount} = await nanoJobPool(processBatch, {data, isStart});
    res.write(contentStr);
    return overWeightCount;
}

module.exports = {
    router,
}
