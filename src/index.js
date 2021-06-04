const express = require('express');
const StreamArray = require('stream-json/streamers/StreamArray');
const Batch = require('stream-json/utils/Batch');
const {chain} = require('stream-chain');
const helmet = require('helmet');

const app = express();
const port = 3000;

app.use(helmet());

app.post('/', (req, res) => {

    {
        res.setHeader('Content-type', 'application/json');
        res.write('{"data":[');
    }

    let isStart = true;
    let overWeightCount = 0;
    const jsonStream = chain([
        req,
        StreamArray.withParser(),
        new Batch({batchSize: 1000})
    ]);

    jsonStream.on('data', data => {
        let str = '';
        data.forEach(obj => {
            let value = obj.value
            if (value.HeightCm == null || value.WeightKg == null) {
                return;
            }
            let heightInMeters = value.HeightCm / 100;
            value.BMI = (value.WeightKg / (heightInMeters * heightInMeters)).toFixed(1);
            Object.assign(value, getBMICategory(value.BMI));
            if (value.BMIRange === 'Overweight') {
                overWeightCount++;
            }
            str = str + (isStart ? '' : ',') + JSON.stringify(value);
            isStart = false;
        });
        res.write(str);
    });

    jsonStream.on('end', () => {
        res.write(`], "overWeightCount": ${overWeightCount} }`);
        res.end();
    });
});

const getBMICategory = (value) => {
    if (value <= 18.4) {
        return {
            BMIRange: 'Under Weight',
            HealthRisk: 'Malnutrition Risk',
        };
    } else if (value > 18.4 && value <= 24.9) {
        return {
            BMIRange: 'Normal Weight',
            HealthRisk: 'Low Risk',
        };
    } else if (value > 24.9 && value <= 29.9) {
        return {
            BMIRange: 'Overweight',
            HealthRisk: 'Enhanced Risk',
        };
    } else if (value > 29.9 && value <= 34.9) {
        return {
            BMIRange: 'Moderately Obese',
            HealthRisk: 'Medium Risk',
        };
    } else if (value > 34.9 && value <= 39.9) {
        return {
            BMIRange: 'Severely Obese',
            HealthRisk: 'High Risk',
        };
    } else if (value > 39.9) {
        return {
            BMIRange: 'Very Severely Obese',
            HealthRisk: 'Very High Risk',
        };
    }
}

app.listen(port, () => {
    console.log('Listening on port: ', port);
}).on('error', (e) => {
    console.log('Error happened: ', e.message)
});
