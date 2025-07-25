const server = require("../../index");
const chai = require("chai");
const chaiHttp = require("chai-http");
const randomEmail = require("random-email");
const employeeSchema = require("../../model/employeeSchema");
const employeeRoutes = require("../routes/employeeRoutes");


chai.should();
chai.use(chaiHttp);

// Creating a new employee test cases
describe("Task API", () => {
    describe("POST /api/employee", () => {
        it("It should show new employee added", (done) => {
            const employee = {
                empName: "Anjali",
                empEmail: "hi@gmail.com",
                empPassword: "Anjali123@",
                empPhoneNo: "7005462305",
                empCity: "Indore",
                empGender: "Female",
                empWorkingStatus: "Working",
                empTechnologies: "Nodejs"
            };
            chai
                .request(server)
                .post("/employee/create")
                .set("Content-Type", "application/x-www-form-urlencoded")
                .field(employee)
                .attach("empProfilePic", "C:/Users/workspace/employee_tracking/uploads/female.png")
                .end((err, res) => {
                    res.should.have.status(201)
                    res.should.be.a("object")
                    res.body.should.have.property("success").eq(true)
                    res.body.should.have.property("message").eq("Employee successfully registered.")
                });
            done();
        });
        // Employee already exists
        //     it("It should show that employee already exists", (done) => {
        //       const employee = {
        //     empName: "Anjali",
        //     empEmail: "aliasger102002@gmail.com",
        //     empPassword: "Anjali123@",
        //     empPhoneNo: "7005462305",
        //     empCity: "Indore",
        //     empGender : "Female",
        //     empWorkingStatus: "Working",
        //     empTechnologies : "Nodejs"
        // };
        //         chai
        //             .request(server)
        //             .post("/employee/login")
        //             .set("Content-Type", "application/x-www-form-urlencoded")
        //             .field(employee)
        //             .attach("empProfilePic", "C:/Users/workspace/employee_tracking/uploads/female.png")
        //             .end((err, res) => {
        //                 res.should.have.status(409)
        //                 res.should.be.a("object")
        //                 res.body.should.have.property("success").eq(false)
        //                 res.body.should.have.property("message").eq("User already exists with the same email!!")
        //         });
        //       done();
        //     });
    });
})