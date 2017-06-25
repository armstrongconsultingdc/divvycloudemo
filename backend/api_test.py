# Flask imports
from flask import Flask, request
from flask_cors import CORS, cross_origin

app = Flask(__name__)
CORS(app)

# AWS API imports
import boto3

@app.route('/retrieve_key_info', methods=['POST'])
def key_info_pull():
    
    # First, we need to parse the incoming POST data.
    
    print str(request.get_json()['keys'])
    #print request.data['keys'];
    key_info = str(request.get_json()['keys']).split('~')
    
    ec2 = boto3.client(
    'ec2',
    aws_access_key_id=key_info[0],
    aws_secret_access_key=key_info[1],
    region_name=key_info[2],)

    # Get all of the instances available for these keys.
    api_pull = ec2.describe_instances()

    # Now loop over the number of instances we have,
    # keeping the relevant information.
    print len(api_pull['Reservations'][0]['Instances'])

    # Create a string to hold information about our API results.
    # We'll use separators to logically separate information in the string.
    api_results = ""

    # Go through each reservation.
    for i in range(0, len(api_pull['Reservations'][0]['Instances'])):

        # Make a helper variable to cut down on code length.
        instances_helper = api_pull['Reservations'][0]['Instances'][i]

        #print instances_helper['InstanceId'] + ' ' + instances_helper['InstanceType'] + ' ' + instances_helper['PrivateIpAddress'] + ' ' + instances_helper['PublicIpAddress']

        # Append to api_results.
        api_results = api_results + instances_helper['InstanceId'] + '^' + instances_helper['InstanceType'] + '^' + instances_helper['PrivateIpAddress'] + '^' + instances_helper['PublicIpAddress'] + '|'


        # Check for network interfaces.
        for j in range(0, len(instances_helper['NetworkInterfaces'])):

            # Make a helper variable to cut down on code length.
            ni_helper = instances_helper['NetworkInterfaces'][j]
            
            # Append to api_results.
            api_results = api_results + ni_helper['Association']['PublicIp'] + '*'
            
            if len(ni_helper['Ipv6Addresses']) > 0:
                for k in range(0, len(ni_helper['Ipv6Addresses'])):

                    # Append to api_results.
                    api_results = api_results + ni_helper['Ipv6Addresses'][k]['Ipv6Address'] + '{'
            else:
                    # Append to api_results.
                    api_results = api_results + 'None' + '{'

            # Append to api_results.
            api_results = api_results + ni_helper['NetworkInterfaceId'] + '}'
            api_results = api_results + ni_helper['PrivateIpAddress'] + '['
            
            if len(ni_helper['PrivateIpAddresses']) > 0:
                for l in range(0, len(ni_helper['PrivateIpAddresses'])):
                    api_results = api_results + ni_helper['PrivateIpAddresses'][l]['Association']['PublicIp'] + ']'
                    api_results = api_results + ni_helper['PrivateIpAddresses'][l]['PrivateIpAddress'] + ';'
            else:
                    api_results = api_results + 'None' + ']'
                    api_results = api_results + 'None' + ';'
        
        # Mark the end of the record.
        api_results = api_results + '#'
    
    return api_results



