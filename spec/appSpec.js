describe("Sci-CAFE", function() {
    var request = require("request")
    var url = "http://localhost:3000/api/"
    const mongoose = require('mongoose');
    const Event = require('../models/event');

    describe("Login Controller",function() {
        describe("User registration",function() {

            let user1 = {
                "position": "student",
                "program": [],
                "role": "admin",
                "events": [],
                "programs": [],
                "email": "JaneDoe@csula.edu",
                "password": "123",
                "firstname": "Jane",
                "lastname": "Doe",
                "unit": "CS DEPARTMENT",
                "username": "janedoe"
            };
    
            let user2 = {
                "position": "student",
                "program": [],
                "role": "admin",
                "events": [],
                "programs": [],
                "email": "JaneDoe@csula.edu",
                "username": "janedoe1"
            };
    
            describe("Success",function() {
                it("Success", function(done) {
                    request.post({url: url +"register", json:user1}, function(error, response, body) {
                        expect(body.success).toBe(true);
                        expect(body.msg).toBe( "Successful created new user.");
                        expect(response.statusCode).toBe(200);
                    done();
                    });
                });
            });
    
            describe("Failure",function() {
                it("Failure due to missing required field(s)", function(done) {
                    request.post({url: url +"register", json:user2}, function(error, response, body) {
                        expect(body.success).toBe(false);
                        expect(body.msg).toBe( "Failure due to missing required field(s)");
                        expect(response.statusCode).toBe(200);
                    done();
                    });
                });
            });
    
        });
    
        describe("User Login",function() {
    
            let user1 = {
                "password": "1234",
                "username": "admin"
            };
    
            let user2 = {
                "password": "1234",
                "username": "adminxx"
            };
    
            describe("Success",function() {
                it("Success", function(done) {
                    request.post({url: url +"login", json:user1}, function(error, response, body) {
                        token = body.token;
                        expect(body.token).not.toBeNull();
                        expect(response.statusCode).toBe(200);
                    done();
                    });
                });
            });
    
            describe("Failure",function() {
                it("Failure due to incorrect credentials", function(done) {
                    request.post({url: url +"login", json:user2}, function(error, response, body) {
                        expect(body.success).toBe(false);
                        expect(body.msg).toBe( "Authentication failed. User not found.");
                        expect(response.statusCode).toBe(401);
                    done();
                    });
                });
            });
    
        });
    });

    describe("Program Controller",function() {
        describe("Get all programs",function() {
            describe("Success",function() {
                it("Success", function(done) {
                    request.get({url: url +"program"}, function(error, response, body) {
                        jsonBody = JSON.parse(body)
                        id = jsonBody[1]._id;
                        expect(jsonBody[0].name).toBe("First Program");
                        expect(jsonBody[1].name).toBe("Second Program");
                        expect(response.statusCode).toBe(200);
                    done();
                    });
                });
            });
        });
    
        describe("Get a program (by id)",function() {
            describe("Success",function() {
                it("Success", function(done) {
                    request.get({url: url +"program/"+id}, function(error, response, body) {
                        jsonBody = JSON.parse(body)
                        expect(jsonBody.name).toBe("Second Program");
                        expect(response.statusCode).toBe(200);
                    done();
                    });
                });
            });
        });

        describe("Create a new program",function() {

            let newProgram = {
                "name":"new program"
            }

            describe("Success",function() {
                it("Success", function(done) {
                    var options = {
                        url: url + "program",
                        headers: {
                            'Authorization': token
                        },
                        json:newProgram
                    };
                    request.post(options, function(error, response, body) {
                        expect(response.statusCode).toBe(200);
                        expect(body.success).toBe(true);
                        expect(body.msg).toBe( "Successful created new Program.");
                    done();
                    });
                });
            });

            describe("Failure",function() {
                it("Failure due to access control", function(done) {
                    request.post({url:url+"program", json:newProgram}, function(error, response, body) {
                        expect(response.statusCode).toBe(401);
                        expect(response.statusMessage).toBe("Unauthorized");
                    done();
                    });
                });
            });
        });

        describe("Edit a program",function() {
            let newProgram = {
                "name":"edited program"
            }
            it("Success", function(done) {
                var options = {
                    url: url + "program/" + id,
                    headers: {
                        'Authorization': token
                    },
                    json:newProgram
                };
                request.patch(options, function(error, response, body) {
                    expect(response.statusCode).toBe(200);
                    expect(body.success).toBe(true);
                    expect(body.msg).toBe( "Successful edited Program.");
                done();
                });
            });
        });

    });

    describe("Event Controller",function() {
        
        describe("Add an attendee to an event",function() {

            let attendees = {
                "attendees":"5bfb64355d353727a12c3140"
            }

            describe("Success", function() {
                it("Success", function(done) {
                    var options = {
                        url: url + "event/0000007b179513121d220d42",
                        headers: {
                            'Authorization': token
                        },
                        json:attendees
                    };
                    request.patch(options, function(error, response, body) {
                        expect(response.statusCode).toBe(200);
                        expect(body.success).toBe(true);
                        expect(body.msg).toBe( "Successful add an attendee to event.");
                    done();
                    });
                });
            });

        });

        describe("Get all attendees of an event	",function() {

            describe("Success", function() {
                it("Success", function(done) {
                    var options = {
                        url: url + "event/0000007b179513121d220d42/attendees",
                        headers: {
                            'Authorization': token
                        }
                    };
                    request.get(options, function(error, response, body) {
                        jsonBody = JSON.parse(body);
                        expect(response.statusCode).toBe(200);
                        expect(jsonBody[0].username).toBe( "yichen");
                        expect(jsonBody[1].username).toBe( "admin");
                        expect(jsonBody[2].username).toBe( "attendee");
                    done();
                    });
                });
            });
            
        });

        describe("Create a new Event",function() {

            let event1 = { 
                "startTime": "2018-11-01T07:00:00.000Z",
                "endTime": "2018-11-01T07:00:00.000Z",
                "attendees": "5bfa77a037c5eb1e8cad7fcb",
                "status": "sumbitted",
                "name": "new event",
                "description":"It's a new event",
                "organizer": "5bfa77a037c5eb1e8cad7fcc"
            }

            event2 = { 
                "startTime": "2018-11-01T07:00:00.000Z",
                "endTime": "2018-11-01T07:00:00.000Z"
            }

            describe("Success",function() {
                it("Success", function(done) {
                    var options = {
                        url: url + "event",
                        headers: {
                            'Authorization': token
                        },
                        json:event1
                    };
                    request.post(options, function(error, response, body) {
                        expect(response.statusCode).toBe(200);
                        expect(body.success).toBe(true);
                        expect(body.msg).toBe( "Successful created a new Event.");
                    done();
                    });
                });
            });

            describe("Failure",function() {
                it("Failure due to missing required field(s)", function(done) {
                    var options = {
                        url: url + "event",
                        headers: {
                            'Authorization': token
                        },
                        json:event2
                    };
                    request.post(options, function(error, response, body) {
                        expect(response.statusCode).toBe(200);
                        expect(body.success).toBe(false);
                        expect(body.msg).toBe( "Failure due to missing required field(s)");
                    done();
                    });
                });
            });
        });

        describe("Approve an event",function() {
            describe("Success",function(){
                it("Success", function(done) {
                    var options = {
                        url: url + "event/" + "0000007b179513121d220d42" + "/approve",
                        headers: {
                            'Authorization': token
                        }
                    };
                    request.patch(options, function(error, response, body) {
                        jsonBody = JSON.parse(body);
                        expect(response.statusCode).toBe(200);
                        expect(jsonBody.success).toBe(true);
                        expect(jsonBody.msg).toBe( "Successful approve an event.");
                    done();
                    });
                });
            });

            describe("Failure",function(){
                it("Failure due to access control", function(done) {
                    var options = {
                        url: url + "event/"+ "0000007b179513121d220d42" +"/approve",
                    };
                    request.patch(options, function(error, response, body) {
                        expect(response.statusCode).toBe(401);
                        expect(response.statusMessage).toBe("Unauthorized");
                    done();
                    });
                });
            });
        });

        describe("Reject an event",function() {
            eid = "5bfb55aa58b003077190bc4a";
            describe("Success", function() {
                it("Success", function(done) {
                    var options = {
                        url: url + "event/"+ "0000007b179513121d220d42" +"/reject",
                        headers: {
                            'Authorization': token
                        }
                    };
                    request.patch(options, function(error, response, body) {
                        jsonBody = JSON.parse(body);
                        expect(response.statusCode).toBe(200);
                        expect(jsonBody.success).toBe(true);
                        expect(jsonBody.msg).toBe( "Successful reject an event.");
                    done();
                    });
                });
            });

            describe("Failure", function() {
                it("Failure due to access control", function(done) {
                    var options = {
                        url: url + "event/"+ "0000007b179513121d220d42" +"/reject",
                    };
                    request.patch(options, function(error, response, body) {
                        expect(response.statusCode).toBe(401);
                        expect(response.statusMessage).toBe("Unauthorized");
                    done();
                    });
                });
            });
        });

    });
});
