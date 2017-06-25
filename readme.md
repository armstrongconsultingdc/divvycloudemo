# Overview

This project gives the status of EC2 instances in the AWS API.

# Language Specifications

Angular - All .js files use Angular 1.x.
Python - All Python files use Python 1.7.

# Dependencies

Python - You need to (pip) install Flask 0.12.x, requests 2.18.1, and boto3 1.4.4 to use the api_test.py.

# Further refinements to data pulled from AWS API

If you wish to pull different information from the AWS API in api_test.py, see "https://boto3.readthedocs.io/en/latest/reference/services/ec2.html#EC2.Client.describe_instances".

# Individual file notes

### Overall notes

There is no SSL mechanism in place when checking keys on this system.

### add-key-field.component.js

Light error checking for key lengths has been commented out (lines 40 - 46).
I could not get the controller binding to work in this file to produce the table.  Therefore, I used jQuery to display the output.