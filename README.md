>### PreRequisites
1. Install `Node.js` and `NPM` on your local machine

>### Running locally
1. We can run our application locally by typing `npm start`.

>### Decisions
1. Given json, how input was given & how output is expected. I am thinking of: 
    1. Input was send as request body and the output should be populated as response body. So, we will be developing express app
    2. Input was file and the output should be a file. So, we will be developing console(file processing) application  
   For ease of testing, I am going with Option 1. As we are dealing with streams, Option 1 can easily replaced with Option 2.
2. Chart was specified to derive BMI Range from BMI value. Correspondingly no chart was given to calculate Health Risk.  
   So, assuming that we should use the same ranges to derive Health Risk. Basically each BMI Range is mapped to Health Risk by index.

>### Design
1. Given a large file, to reduce memory footprint I am using streams to read request body & write response body.
2. Writing to response for each record is time-consuming, so implemented batching. In this application, we will process 10,000 records
   and write to response at a time. 
3. How we derive 10,000 as batch size? It depends on memory-consumption and also after a certain increase/decrease in batch size response time will stay constant or decrease. By observation, I set that value.
4. Overweight Count - Each batch will return corresponding overweight count, and at the end we will sum-up all values to derive required count.
5. Used worker threads to deal with CPU intensive operations; mainly batch processing 

>### CI/CD Pipeline
1. I am using CircleCI & Heruko for continuous integration & deployment purposes. More information can be found at https://circleci.com/blog/continuous-deployment-to-heroku/
2. We can access my deployed application at https://code-20210604-prasadmedarametl.herokuapp.com/
3. Testcases should be passed inorder to deploy to heroku, and please take a look at git commit history for failed & succeeded builds.

>### Potential Improvements
1. We are maintaining an array of promises to check if worker threads were completed before ending the response stream. For huge batch numbers, this will be memory hungry.
   So, we should optimize it but not right now.

>### Metrics
1. When tested locally with a file containing `11,31,040` records, it was taking `19` seconds on average.
   I configured max number of worker threads as `4`, as mine is a `4` core CPU.
2. Please don't do a load testing on heruko deployed url, as I haven't corrected/checked the configurations of deployment.

>### Demo
1. [Did loom recording, please watch it to see how this application will work](https://www.loom.com/share/405c901886854f77ac7066c3bfdfec70)

>### Endpoint
**URI:** http://localhost:3000/process  
**Method Type:** POST  
**Sample Request Body:**
```json
[
  {
    "Gender": "Male",
    "HeightCm": 171,
    "WeightKg": 96
  },
  {
    "Gender": "Male",
    "HeightCm": 161,
    "WeightKg": 85
  },
  {
    "Gender": "Male",
    "HeightCm": 180,
    "WeightKg": 77
  },
  {
    "Gender": "Female",
    "HeightCm": 166,
    "WeightKg": 62
  },
  {
    "Gender": "Female",
    "HeightCm": 150,
    "WeightKg": 70
  },
  {
    "Gender": "Female",
    "HeightCm": 167,
    "WeightKg": 82
  }
]
```
**Sample Response Body:**
```json
{
    "data": [
        {
            "Gender": "Male",
            "HeightCm": 171,
            "WeightKg": 96,
            "BMI": "32.8",
            "BMIRange": "Moderately Obese",
            "HealthRisk": "Medium Risk"
        },
        {
            "Gender": "Male",
            "HeightCm": 161,
            "WeightKg": 85,
            "BMI": "32.8",
            "BMIRange": "Moderately Obese",
            "HealthRisk": "Medium Risk"
        },
        {
            "Gender": "Male",
            "HeightCm": 180,
            "WeightKg": 77,
            "BMI": "23.8",
            "BMIRange": "Normal Weight",
            "HealthRisk": "Low Risk"
        },
        {
            "Gender": "Female",
            "HeightCm": 166,
            "WeightKg": 62,
            "BMI": "22.5",
            "BMIRange": "Normal Weight",
            "HealthRisk": "Low Risk"
        },
        {
            "Gender": "Female",
            "HeightCm": 150,
            "WeightKg": 70,
            "BMI": "31.1",
            "BMIRange": "Moderately Obese",
            "HealthRisk": "Medium Risk"
        },
        {
            "Gender": "Female",
            "HeightCm": 167,
            "WeightKg": 82,
            "BMI": "29.4",
            "BMIRange": "Overweight",
            "HealthRisk": "Enhanced Risk"
        }
    ],
    "overWeightCount": 1
}
```
