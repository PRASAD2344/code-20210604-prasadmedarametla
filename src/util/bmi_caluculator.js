const processBatch = ({data, isStart}) => {
    let contentStr = '';
    let overWeightCount = 0;
    data.forEach(obj => {
        let value = obj.value;
        if (!(typeof value.HeightCm == "number" && isFinite(value.HeightCm))) {
            console.error('Please verify json, height should be numeric', value);
            return;
        }
        if (!(typeof value.WeightKg == "number" && isFinite(value.WeightKg))) {
            console.error('Please verify json, weight should be numeric', value);
            return;
        }
        let heightInMeters = value.HeightCm / 100;
        value.BMI = (value.WeightKg / (heightInMeters * heightInMeters)).toFixed(1);
        if (value.BMI <= 18.4) {
            value.BMIRange = 'Under Weight';
            value.HealthRisk = 'Malnutrition Risk';
        } else if (value.BMI > 18.4 && value.BMI <= 24.9) {
            value.BMIRange = 'Normal Weight';
            value.HealthRisk = 'Low Risk';
        } else if (value.BMI > 24.9 && value.BMI <= 29.9) {
            value.BMIRange = 'Overweight';
            value.HealthRisk = 'Enhanced Risk';
        } else if (value.BMI > 29.9 && value.BMI <= 34.9) {
            value.BMIRange = 'Moderately Obese';
            value.HealthRisk = 'Medium Risk';
        } else if (value.BMI > 34.9 && value.BMI <= 39.9) {
            value.BMIRange = 'Severely Obese';
            value.HealthRisk = 'High Risk';
        } else if (value.BMI > 39.9) {
            value.BMIRange = 'Very Severely Obese';
            value.HealthRisk = 'Very High Risk';
        }
        if (value.BMIRange === 'Overweight') {
            overWeightCount++;
        }
        contentStr = contentStr + (isStart ? '' : ',') + JSON.stringify(value);
        isStart = false;
    });
    return {
        contentStr,
        overWeightCount,
    };
}

module.exports = {
    processBatch
}
