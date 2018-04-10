var pin
var dataurl
var register = false
var upload = false

$('#registerbtn').on('click', function () {
    $('#login').hide("slide", { direction: "left" }, 500, function () {
        $('#register').show()
        $('#mainheader').hide()
    });
})

$('#registerconfirm').on('click', function () {
    username = $('#username').val().replace(/\s/g, '')
    email = $('#email').val().replace(/\s/g, '')
    password = $('#password').val().replace(/\s/g, '')
    confirmpassword = $('#confirmpassword').val().replace(/\s/g, '')
    dateofbirth = $('#day').val() + '/' + $('#month').val() + '/' + $('#year').val()
    gender = $('#gender').val()
    window.plugins.OneSignal.getIds(function (ids) {
        playerid = ids.userId
        checkusername(username)
    })
})

function checkusername(username) {
    var ref = firebase.database().ref("userprofile");
    ref.once("value").then(function (snapshot) {
        var check = snapshot.child(username).exists()
        if (check) {
            alert('มีชื่อผู้ใช้นี้อยู่ในระบบแล้ว')
        } else {
            if (password != confirmpassword) {
                alert('รหัสผ่านไม่ตรงกัน')
            } else {
                $('#mainheader').hide()
                $('#register').hide("slide", { direction: "left" }, 500, function () {
                    registertodb()
                    $('#mainlayout').show()
                    $('#alarm').show()
                });
            }
        }
    })
}

function registertodb() {
    firebase.database().ref('userprofile/' + username.toString()).set({
        dateofbirth: dateofbirth.toString(),
        gender: gender.toString(),
        email: email,
        username: username.toString(),
        playerid: playerid
    }).then(function () {
        register = true
        createuser()
    })
}

function createuser() {
    if (register) {
        firebase.auth()
            .createUserWithEmailAndPassword(email.toString(), password.toString())
            .catch(function (error) {
                var errorCode = error.code;
                var errorMessage = error.message;
                console.log(errorMessage);
            }).then(function () {
                var user = firebase.auth().currentUser;
                user.updateProfile({
                    displayName: username.toString(),
                }).then(function () {
                    console.log("successfully created the user ")
                }).catch(function (error) {
                    console.log("Error: ", error);
                });
            })
    }
}