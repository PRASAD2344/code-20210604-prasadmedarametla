const expect = require('chai').expect;
const {processBatch} = require('../src/util/bmi_caluculator')

describe('Test cases for utility methods', () => {
    it('Check if we get correct records and overweight count', () => {
        let data = [
            {
                "key": 0,
                "value": {
                    "Gender": "Male",
                    "HeightCm": 171,
                    "WeightKg": 96
                }
            },
            {
                "key": 1,
                "value": {
                    "Gender": "Male",
                    "HeightCm": 161,
                    "WeightKg": 85
                }
            },
            {
                "key": 2,
                "value": {
                    "Gender": "Male",
                    "HeightCm": 180,
                    "WeightKg": 77
                }
            },
            {
                "key": 3,
                "value": {
                    "Gender": "Female",
                    "HeightCm": 166,
                    "WeightKg": 62
                }
            },
            {
                "key": 4,
                "value": {
                    "Gender": "Female",
                    "HeightCm": 150,
                    "WeightKg": 70
                }
            },
            {
                "key": 5,
                "value": {
                    "Gender": "Female",
                    "HeightCm": 167,
                    "WeightKg": 82
                }
            }
        ];
        let isStart = true;
        let {contentStr, overWeightCount} = processBatch({data, isStart});
        expect(overWeightCount).is.equal(1);
        expect(contentStr).is.equal('{"Gender":"Male","HeightCm":171,"WeightKg":96,"BMI":"32.8","BMIRange":"Moderately Obese","HealthRisk":"Medium Risk"},{"Gender":"Male","HeightCm":161,"WeightKg":85,"BMI":"32.8","BMIRange":"Moderately Obese","HealthRisk":"Medium Risk"},{"Gender":"Male","HeightCm":180,"WeightKg":77,"BMI":"23.8","BMIRange":"Normal Weight","HealthRisk":"Low Risk"},{"Gender":"Female","HeightCm":166,"WeightKg":62,"BMI":"22.5","BMIRange":"Normal Weight","HealthRisk":"Low Risk"},{"Gender":"Female","HeightCm":150,"WeightKg":70,"BMI":"31.1","BMIRange":"Moderately Obese","HealthRisk":"Medium Risk"},{"Gender":"Female","HeightCm":167,"WeightKg":82,"BMI":"29.4","BMIRange":"Overweight","HealthRisk":"Enhanced Risk"}');
    });
    it('Check if we ignore record if it is invalid', () => {
        let data = [{
            "key": 0,
            "value": {
                "Gender": "Female",
                "HeightCm": '167',
                "WeightKg": 82
            }
        }, {
            "key": 1,
            "value": {
                "Gender": "Female",
                "HeightCm": 167,
                "WeightKg": null
            }
        }];
        let isStart = true;
        let {contentStr, overWeightCount} = processBatch({data, isStart});
        expect(overWeightCount).is.equal(0);
        expect(contentStr).is.equal('');
    });
})

