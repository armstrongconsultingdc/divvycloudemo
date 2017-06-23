angular.
module('amazonApp').
component('addKeyField', {
    template: '<button ng-click="ValidateKeyLengths()">Generate Key Data' + '</button>'
    , controller: ['$scope', '$http', function ($scope, $http) {
        
        // Set the required key length here.
        var req_key_length = 5;
        
        // Let's use a function to validate at least key lengths.
        $scope.ValidateKeyLengths = function() {
            
            // First, get everything out of the text area.
            var keys_bulk = document.getElementById("api_keys_list").value.split('\n');
            
            // Now go through each item to ensure that each key
            // meets the key length requirements.
            
            // Make a flag to indicate which keys have failed.
            var failed_keys = [];
            
            for(i = 0; i < keys_bulk.length; i++)
            {
                // Parse out blank lines.
                if(keys_bulk[i].trim != " ")
                {
                    
                    // Check the length of the key.
                    if(keys_bulk[i].length != req_key_length)
                    {
                        
                        failed_keys.push(keys_bulk[i]);
                        
                    }
                    
                }                
                
            }
            
            // Now see if we have any failed keys.
            //if(failed_keys.length > 0)
            //{
                
                //alert("Sorry, but the following keys are not the proper length \n---------------------------\n\n" + failed_keys.join('\n'));
                
            //} else {
            
                // Clear the table.
                $('#results_table tbody').html('');
                
                // Now send each key.
                for(i = 0; i < keys_bulk.length; i++)
                {
                    // Proceed with the API call.
                    $scope.SendApiRequest(keys_bulk[i]);
                }
                
            //}
            
        }
        
        // The actual API request function.
        $scope.SendApiRequest = function (key_list) {
            
            // Send the request.
            $http({
                method: "POST"
                , url: "http://127.0.0.1:5000/retrieve_key_info"
                , data: {
                    'keys': key_list
                , }
            }).then(function successCallback(response) {
                
                // Parse the returned string to determine what we've got.
                //console.log(response.data);
                //console.log(response.data.split('#'));
                var bulk_response = response.data.split('#');
                
                // Remove the last element in this array since it does
                // not contain any information.
                bulk_response.pop();
                
                // We now have individual instances in the array.
                // Continue processing the string...
                
                // The string splitting function here assumes that
                // each record coming from Flask is unique.  A further
                // development would be to create logic for records
                // that are *not* unique (i.e. multiple network interfaces, etc...)
                
                // jQuery BEGIN.
                
                // Replace intermediary characters, then split.
                for(i = 0; i < bulk_response.length; i++)
                {
                    bulk_response[i] = bulk_response[i].replace('|', '^');
                    bulk_response[i] = bulk_response[i].replace('*', '^');
                    bulk_response[i] = bulk_response[i].replace('{', '^');
                    bulk_response[i] = bulk_response[i].replace('}', '^');
                    bulk_response[i] = bulk_response[i].replace('[', '^');
                    bulk_response[i] = bulk_response[i].replace(']', '^');
                    bulk_response[i] = bulk_response[i].replace(';', '');
                    
                    // Dump to the table.
                    bulk_response[i] = bulk_response[i].split('^');
                    
                    // Make a string to create the HTML.
                    var row_out = "<tr><td>" + key_list.split('~')[0] + "</td><td>" + key_list.split('~')[1] + "</td><td>" + key_list.split('~')[2] + "</td><td>";
                    
                    for(j = 0; j < bulk_response[i].length; j++)
                    {
                        row_out = row_out + bulk_response[i][j] + '</td><td>';
                    }
                    
                    row_out = row_out + "</td><tr>";
                    
                    // Write to the table.                    
                    $('#results_table tbody').append(row_out);
                }
                
                // jQuery END.
                
                $scope.message = "";
            }).catch(function (data) {
                
                // Make a string to create the HTML.
                var failed_row = "<tr><td>" + key_list.split('~')[0] + "</td><td>" + key_list.split('~')[1] + "</td><td>" + key_list.split('~')[2] + "</td><td colspan='10' style='background: red; color: white; text-align: center'>INVALID KEY INFORMATION</td>";
                
                // Write to the table.                    
                $('#results_table tbody').append(failed_row);
                
            });
            
        }
    }]
});