// Task1: initiate app and run server at 3000

require('dotenv').config();
console.log('MONGO_URI loaded:', Boolean(process.env.MONGO_URI));

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json());

const path=require('path');
app.use(express.static(path.join(__dirname+'/dist/FrontEnd')));
// Task2: create mongoDB connection 


//Task 2 : write api with error handling and appropriate api mentioned in the TODO below

mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('MongoDB Atlas connected successfully'))
    .catch((error) => console.error('MongoDB connection error:', error));

const employeeSchema = new mongoose.Schema({
    name: { type: String, required: true },
    location: { type: String, required: true },
    position: { type: String, required: true },
    salary: { type: Number, required: true }
});

const Employee = mongoose.model('Employee', employeeSchema);








//TODO: get data from db  using api '/api/employeelist'

/* GET: Get all employees */
app.get('/api/employeelist', async (req, res) => {
    try {
        const employees = await Employee.find();
        res.status(200).json(employees);
    } catch (error) {
        res.status(500).json({
            message: 'Error fetching employees',
            error: error.message
        });
    }
});

/* GET: Get one employee by ID */
app.get('/api/employeelist/:id', async (req, res) => {
    try {
        if (!mongoose.isValidObjectId(req.params.id)) {
            return res.status(400).json({
                message: 'Invalid employee ID'
            });
        }

        const employee = await Employee.findById(req.params.id);

        if (!employee) {
            return res.status(404).json({
                message: 'Employee not found'
            });
        }

        res.status(200).json(employee);
    } catch (error) {
        res.status(500).json({
            message: 'Error fetching employee',
            error: error.message
        });
    }
});

/* POST: Add a new employee */
app.post('/api/employeelist', async (req, res) => {
    try {
        const { name, location, position, salary } = req.body;

        if (
            !name || !location || !position ||
            salary === undefined || salary === null ||
            salary === ''
        ) {
            return res.status(400).json({
                message: 'Please provide name, location, position and salary'
            });
        }

        const employee = new Employee({
            name,
            location,
            position,
            salary
        });

        const savedEmployee = await employee.save();
        res.status(201).json(savedEmployee);
    } catch (error) {
        res.status(400).json({
            message: 'Error adding employee',
            error: error.message
        });
    }
});

/* DELETE: Delete an employee by ID */
app.delete('/api/employeelist/:id', async (req, res) => {
    try {
        if (!mongoose.isValidObjectId(req.params.id)) {
            return res.status(400).json({
                message: 'Invalid employee ID'
            });
        }

        const employee = await Employee.findByIdAndDelete(req.params.id);

        if (!employee) {
            return res.status(404).json({
                message: 'Employee not found'
            });
        }

        res.status(200).json({
            message: 'Employee deleted successfully',
            employee
        });
    } catch (error) {
        res.status(500).json({
            message: 'Error deleting employee',
            error: error.message
        });
    }
});

/* PUT: Update an employee */
app.put('/api/employeelist', async (req, res) => {
    try {
        const { _id, id, name, location, position, salary } = req.body;
        const employeeId = _id || id;

        if (!employeeId || !mongoose.isValidObjectId(employeeId)) {
            return res.status(400).json({
                message: 'A valid employee ID is required in _id or id'
            });
        }

        const updatedEmployee = await Employee.findByIdAndUpdate(
            employeeId,
            { name, location, position, salary },
            { new: true, runValidators: true }
        );

        if (!updatedEmployee) {
            return res.status(404).json({
                message: 'Employee not found'
            });
        }

        res.status(200).json(updatedEmployee);
    } catch (error) {
        res.status(400).json({
            message: 'Error updating employee',
            error: error.message
        });
    }
});




//TODO: get single data from db  using api '/api/employeelist/:id'





//TODO: send data from db using api '/api/employeelist'
//Request body format:{name:'',location:'',position:'',salary:''}






//TODO: delete a employee data from db by using api '/api/employeelist/:id'





//TODO: Update  a employee data from db by using api '/api/employeelist'
//Request body format:{name:'',location:'',position:'',salary:''}


//! dont delete this code. it connects the front end file.
app.get('/*', function (req, res) {
    res.sendFile(path.join(__dirname + '/dist/Frontend/index.html'));
});

const PORT = 3000;

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
