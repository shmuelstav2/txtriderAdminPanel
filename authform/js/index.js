

var MyApp ={
    currentUser: undefined,
    myHeaders: undefined,
    baseUrl:"http://txtrider.co/"
};


$("#login-button").click(function(event) {

     event.preventDefault();
     /********************************************\
      *             get authentication data
      ********************************************/

     console.log("begin authentication process")
     var inputs = $('#myForm :input');
     var values = {};
     inputs.each(function () {
         values[this.name] = $(this).val();
     });
     console.log(`password: ${values.password}`)
     console.log(`email: ${values.email}`)
     // do a thing, possibly async, then…
     console.log("begin authentication process")
     if (values.password && values.email) {
         console.log("email and password exist")
         var user = {
             email: values.email,
             password: values.password
         };
     }
     else {
         changeViewLoginFailed(data);
         console.log(" problem with email and password exist")
         return;
     }

     /********************************************\
      *             check login with the server
      ********************************************/
     fetch(MyApp.baseUrl+'api/publisher/auth/login',
         {
             headers: {
                 'Accept': 'application/json',
                 'Content-Type': 'application/json'
             },
             method: "POST",
             body: JSON.stringify({email: user.email, password: user.password})
         })
         .then(res => {
             if (res.status === 200){
                 res.json().then(function(user) {
                     console.log(user);
                     // store user details and jwt token in local storage to keep user logged in between page refreshes
                     localStorage.setItem('currentUser', JSON.stringify(user));
                     changeViewLoginSuccess();
                 })
             }
             else{
                 res.json().then(function(object) {
                     console.log(object.error)
                     changeViewLoginFailed(object.error);
                 })
             }
         })
         .catch(err => {
             changeViewLoginFailed(err);
             console.log(err)// Success!
             console.log("after the error program continue")
         })
 })


 /********************************************\
  *  Change the view after the authentication process
  ********************************************/


 function changeViewLoginSuccess() {
     console.log("Change view Login success")
     $('form').fadeOut(500);
     $('.wrapper').addClass('form-success');
     window.location.href = "../../ad/adminpanel/adminpanel.html";
 }


 function changeViewLoginFailed(data) {
     console.log("changeViewLoginFailed")
     document.getElementById("message").innerHTML = data;
     console.log("error: " + data)
 }
