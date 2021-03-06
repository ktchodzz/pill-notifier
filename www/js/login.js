$('#login .login').on('click', function () {
    email = $('#loginEmail').val()
    password = $('#loginPassword').val()
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
    $('#mainHeader').show()
})

$('#logoutButton').on('click', function () {
    firebase.auth().signOut().then(function () {
        // Sign-out successful.
        dropAndRecreateAlarmDatabase();
    }).catch(function (error) {
        // An error happened.
        console.log('ERROR: ' + error.message);
    });
    $('.div-alarmList').empty();
    $('#alarmButton').click();
    $('#setting').hide();
    $('#profile').hide();
    $('#mainlayout').hide();
    $('#login').show();
})

function dropAndRecreateAlarmDatabase() {
    db.sqlBatch([
        ['DROP TABLE IF EXISTS Alarm'],
    ], function () {
        console.log("dropped alarm db");
        createAlarmDatabase();
    }, function (error) {
        console.log('SQL batch ERROR: ' + error.message);
    });
}