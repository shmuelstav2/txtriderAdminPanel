
var MyApp ={
    currentUser: undefined,
    myHeaders: undefined
};



function getAllClients() {
    MyApp.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    MyApp.myHeaders = new Headers({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + MyApp.currentUser.token
    });

    return fetch('http://localhost/api/admin/users', {
        method: 'GET',
        headers: MyApp.myHeaders,
    })

        .then(response => {
            if (response.status === 200) {
                response.json().then(function(data) {
                    //console.log(object.error)
                    drawTable(data);
                })
               // drawTable(response.json())
              //  return response.json();
            }

            else {
                throw new Error('Something went wrong on api server!');
            }
        })
        .then(response => {
            console.debug(response);
        }).catch(error => {
            console.error(error);
        });
}

getAllClients();


function drawTable(data) {
    for (var i = 0; i < data.length; i++) {
        drawRow(data[i]);
    }
}


function sumKw(data) {
    let sum = 0 ;
    for (var i = 0; i < data.length; i++) {
        sum = sum + data[i].data.length;
        console.log( data[i].data.length)
    }
   return sum;
}

function toDate(dateStr) {
    date = new Date(dateStr);
    year = date.getFullYear();
    month = date.getMonth()+1;
    dt = date.getDate();

    if (dt < 10) {
        dt = '0' + dt;
    }
    if (month < 10) {
        month = '0' + month;
    }

    return (dt+'-' + month + '-'+year);
}
function drawRow(rowData) {
    var row = $("<tr />")
    $("#personDataTable").append(row);
    row.append($("<td>" + rowData._id + "</td>"));
    row.append($("<td>" + rowData.email + "</td>"));
    row.append($("<td>" +toDate(rowData.date_registered) + "</td>"));
    row.append($("<td>" + rowData.websites.length + "</td>"));

    fetch('http://localhost/api/admin/campaign/'+rowData._id, {
        method: 'GET',
        headers: MyApp.myHeaders,
    })
        .then(response => {
            if (response.status === 200) {
                response.json().then(function(data) {
                    console.log(data)
                    row.append($("<td>" + data.result.length + "</td>"));
                    row.append($("<td>" +  sumKw(data.result) + "</td>"));
                  //  drawTable(data);
                })
            }

            else {
                throw new Error('Something went wrong on api server!');
            }
        })
        .then(response => {
            console.debug(response);
        }).catch(error => {
        console.error(error);
    });

}
