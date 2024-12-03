import express from 'express';
import {ConflictError, InternalServerError, UnprocessableEntityError} from '../../utils/errors.js';
import {APIResponse} from "../../utils/responses.js";
import mapValidationErrors from "../../utils/mapValidationErrors.js";
import Employee from "../../models/Employee.js";

/**
 * Product controller
 * @type {Router}
 */
const employees = express.Router();

const currentVersion = process.env.API_VERSION;
const docsUrl = `${process.env.APP_URL}/docs/api/${currentVersion}/employees`;

/**
 * @route   POST /api/v1/employees
 * @desc    Add a new employee
 * @access  Public
 */
employees.post('/', async (req, res, next) => {
    const {firstName, lastName, username, password} = req.body;
    const endpointDocsUrl = `${docsUrl}#add-an-employee`;
    const employee = new Employee({username, password, firstName, lastName});
    const validated = await employee.validateSync();

    if (validated) {
        throw new UnprocessableEntityError('Employee validation failed.')
            .withCode('VALIDATION_ERROR')
            .withDetails(mapValidationErrors(validated.errors))
            .withDocsUrl(endpointDocsUrl);
    }

    await employee.setEmpId()
        .catch(err => {
            if (err) {
                throw new InternalServerError('Internal Server Error')
                    .withCode('SERVER_ERROR')
                    .withDetails('Unable to generate a new employee ID.')
                    .withDocsUrl(endpointDocsUrl);
            }
            next();
        });

    await employee.save({
        validateBeforeSave: true
    }).then(employee => {
        return new APIResponse(req)
            .withStatusCode(201)
            .withCode('RESOURCE_CREATED')
            .withDocsUrl(endpointDocsUrl)
            .send({
                message: 'Employee successfully created.',
                employee: employee,
            });
    }).catch(err => {
        if (err.code === 11000) {
            throw new ConflictError('Employee with username already exists.')
                .withCode('RESOURCE_ALREADY_EXISTS')
                .withDocsUrl(endpointDocsUrl)
                .withDetails('Please change the username and try again.');
        }
        throw new InternalServerError('Internal Server Error')
            .withCode('RESOURCE_NOT_CREATED')
            .withDetails('Unable to create a new employee, please try again.')
            .withDocsUrl(endpointDocsUrl);
    }).catch(next);
});

export default employees;