$('#logoutbtn').on('click', function () {
    firebase.auth().signOut().then(function () {
        // Sign-out successful.
    }).catch(function (error) {
        // An error happened.
    });
    $('#alarmbtn').click()
    $('#setting').hide()
    $('#profile').hide()
    $('#mainlayout').hide()
    $('#login').show()
})

$('#settingcancel').on('click', function () {
    $('#setting').hide()
    $('#mainlayout').show()
})
