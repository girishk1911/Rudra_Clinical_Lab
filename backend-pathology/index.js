// Importing required modules
const express = require('express');
const bodyParser = require('body-parser');
const AWS = require('aws-sdk');
const { v4: uuidv4 } = require('uuid');
const cors = require('cors');
const app = express();
const port = 5000;

// Use the cors middleware to enable Cross-Origin Resource Sharing
app.use(cors());

// Configure AWS with region, access key, and secret access key
AWS.config.update({
    region: 'us-east-1',
    accessKeyId: 'AKIAVRUVUPHHVA2YJE4K',
    secretAccessKey: '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'
});

// DynamoDB connectivity
const dynamoDB = new AWS.DynamoDB.DocumentClient();

// Use body-parser middleware to parse JSON requests
app.use(bodyParser.json());


// API to get data for all patients
app.get('/patients-data', async (req, res) => {
    const params = {
        TableName: 'Patients'
    };
    try {
        const data = await dynamoDB.scan(params).promise();
        res.json(data.Items);
    } catch (error) {
        console.error('Error fetching data from DynamoDB:', error);
        res.status(500).send('Internal Server Error');
    }
});

// API to create a new patient
app.post('/patients', (req, res) => {
    const patient = { id: uuidv4(), ...req.body };
    const params = {
        TableName: 'Patients',
        Item: patient
    };

    dynamoDB.put(params, (err, data) => {
        if (err) {
            res.status(500).json({ error: err });
        } else {
            res.status(201).json({ message: 'Patient created successfully', patient });
        }
    });
});

// API to delete a patient by ID
app.delete('/patients/:id', (req, res) => {
    const { id } = req.params;
    const params = {
        TableName: 'Patients',
        Key: { id }
    };

    dynamoDB.delete(params, (err, data) => {
        if (err) {
            res.status(500).json({ error: err });
        } else {
            res.status(200).json({ message: 'Patient deleted successfully' });
        }
    });
});

// API to update a patient's details by ID
app.put('/patients/:id', (req, res) => {
    const { id } = req.params;
    const updateExpression = 'set #name = :name, #age = :age, #address = :address, #mobile = :mobile, #examinedBy = :examinedBy, #examinedDate = :examinedDate, #selectedTest = :selectedTest, #reportDate = :reportDate';
    const expressionAttributeNames = {
        '#name': 'name',
        '#age': 'age',
        '#address': 'address',
        '#mobile': 'mobile',
        '#examinedBy': 'examinedBy',
        '#examinedDate': 'examinedDate',
        '#selectedTest': 'selectedTest',
        '#reportDate': 'reportDate'
    };
    const expressionAttributeValues = {
        ':name': req.body.name,
        ':age': req.body.age,
        ':address': req.body.address,
        ':mobile': req.body.mobile,
        ':examinedBy': req.body.examinedBy,
        ':examinedDate': req.body.examinedDate,
        ':selectedTest': req.body.selectedTest,
        ':reportDate': req.body.reportDate
    };
    const params = {
        TableName: 'Patients',
        Key: { id },
        UpdateExpression: updateExpression,
        ExpressionAttributeNames: expressionAttributeNames,
        ExpressionAttributeValues: expressionAttributeValues,
        ReturnValues: 'UPDATED_NEW'
    };

    dynamoDB.update(params, (err, data) => {
        if (err) {
            res.status(500).json({ error: err });
        } else {
            res.status(200).json({ message: 'Patient updated successfully', data });
        }
    });
});

// Start the server and listen on the specified port
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});

// API to get a specific patient's data by ID
app.get('/patients/:id', (req, res) => {
    const { id } = req.params;
    const params = {
        TableName: 'Patients',
        Key: { id }
    };

    dynamoDB.get(params, (err, data) => {
        if (err) {
            res.status(500).json({ error: err });
        } else {
            res.status(200).json(data.Item);
        }
    });
});

//---------------------------------------------------------------------------------------------------------------------------------------------------
// API to create a new lab test
app.post('/labTest', (req, res) => {
    const labTest = { id: uuidv4(), ...req.body };
    const params = {
        TableName: 'labTest',
        Item: labTest
    };

    dynamoDB.put(params, (err, data) => {
        if (err) {
            res.status(500).json({ error: err });
        } else {
            res.status(201).json({ message: 'Test created successfully', labTest });
        }
    });
});

// API to get all lab tests
app.get('/labTest', async (req, res) => {
    const params = {
        TableName: 'labTest',
    };
    try {
        const data = await dynamoDB.scan(params).promise();
        res.json(data.Items);
    } catch (error) {
        console.error('Error fetching data from DynamoDB:', error);
        res.status(500).send('Internal Server Error');
    }
});

//-------------------------------------------------------------------------------------------------------------------------------------------------

// API to create a new patient report
app.post('/savePatientReport', (req, res) => {
    const patientReport = { id: uuidv4(), ...req.body };
    const params = {
        TableName: 'PatientReport',
        Item: patientReport
    };

    dynamoDB.put(params, (err, data) => {
        if (err) {
            res.status(500).json({ error: err });
        } else {
            res.status(201).json({ message: 'Patient report saved successfully', patientReport });
        }
    });
});

// API to get a specific patient's lab report by ID
app.get('/patientLabReport/:id', async (req, res) => {
    const { id } = req.params;
    const params = {
        TableName: 'Patients',
        Key: { id }
    };
    try {
        const data = await dynamoDB.get(params).promise();
        res.json(data.Item);
    } catch (error) {
        console.error('Error fetching data from DynamoDB:', error);
        res.status(500).send('Internal Server Error');
    }
});

// API to update a patient report result by ID
app.put('/patient-report/:id', (req, res) => {
    const { id } = req.params;
    const { result } = req.body;
    const params = {
        TableName: 'Patients',
        Key: { id },
        UpdateExpression: 'set #result = :result, #status = :status',
        ExpressionAttributeNames: {
            '#result': 'result',
            '#status': 'status'
        },
        ExpressionAttributeValues: {
            ':result': result,
            ':status': 'Completed',
        },
        ReturnValues: 'UPDATED_NEW'
    };

    dynamoDB.update(params, (err, data) => {
        if (err) {
            res.status(500).json({ error: err });
        } else {
            res.status(200).json({ message: 'Patient report saved', data });
        }
    });
});
