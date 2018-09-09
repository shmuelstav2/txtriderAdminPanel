$(document).ready(function(){

    $("#clicktest1").click(function () {


    })


    $(document).on('click', '[data-lightbox]', lity);
    $('.lity-close').click(function(){console.log("dvdsv");});
    $( '.lity-close' ).hover(
        function() {
            console.log( "hover" );
        })
    $(document).on('lity:close', function(event, instance) {
        //localStorage.setItem('', localStorage.currentUser);
        localStorage.setItem('currentUser', localStorage.currentAdmin);
    });

    $(document).on('lity:open', function(event, instance) {
        console.log('Lightbox opened');
    });

    $(".iframeLink").click(function () {
        console.log('iframe link');
        console.log(this.value);
        fetch(MyApp.baseUrl+'api/admin/userlogin/'+this.value, {
            method: 'POST',
            headers: MyApp.myHeaders,
        })
            .then(response => {
                if (response.status === 200) {
                    response.json().then(function(user) {
                        localStorage.setItem('currentAdmin', localStorage.currentUser);
                        localStorage.setItem('currentUser', JSON.stringify(user));
                        var instance = lity('http://localhost/admin/index');
                    })
                }
                else {
                    throw new Error('Something went wrong on api server!');
                }
            })
            .then(response => {
                console.debug(response);
            }).catch(error => {
            console.log(error);
        });
    })
});



var MyApp ={
    currentUser: undefined,
    myHeaders: undefined,
    baseUrl:"http://localhost/"
};


function getAllUsers() {
    MyApp.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    MyApp.myHeaders = new Headers({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + MyApp.currentUser.token
    });

    return fetch(MyApp.baseUrl+'api/admin/users', {
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
            console.log(error);
        });
}



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
    row.append($("<td>" + '<button class="iframeLink" name="subject" type="submit" value='+rowData._id+'>'+rowData.email+'</button>' + "</td>"));
    row.append($("<td>" +toDate(rowData.date_registered) + "</td>"));
    row.append($("<td>" + rowData.websites.length + "</td>"));

    fetch(MyApp.baseUrl+'api/admin/campaign/'+rowData._id, {
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

getAllUsers();