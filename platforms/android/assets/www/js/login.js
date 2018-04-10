$('#login .login').on('click', function () {
    email = $('#loginemail').val()
    password = $('#loginpassword').val()
    firebase.auth()
        .signInWithEmailAndPassword(email.toString(), password.toString())
        .catch(function (error) {
            var errorCode = error.code;
            var errorMessage = error.message;
            alert(errorCode, errorMessage)
        })
})

$('.logout').on('click', function () {
    $('#homebtn').click()
    $('#mainlayout').hide()
    $('#login').show()
    $('#mainheader').show()
})
