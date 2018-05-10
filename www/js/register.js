var register = false

$('#registerButton').on('click', function () {
    $('#login').hide("slide", { direction: "left" }, 500, function () {
        $('#register').show()
        $('#mainHeader').hide()
    });
})

$('#registerConfirm').on('click', function () {
    username = $('#username').val().replace(/\s/g, '')
    email = $('#email').val().replace(/\s/g, '')
    password = $('#password').val().replace(/\s/g, '')
    confirmPassword = $('#confirmPassword').val().replace(/\s/g, '')
    dateofbirth = $('#dateOfBirth').val().toString()
    gender = $('#gender').val()
    if (!username || !email || !password || !confirmPassword || !dateofbirth || !gender) {
        alert('กรุณากรอกข้อมูลให้ครบถ้วน')
    } else {
        checkUsername(username)
    }
})

function checkUsername(username) {
    var ref = firebase.database().ref("userprofile");
    ref.once("value").then(function (snapshot) {
        var check = snapshot.child(username).exists()
        if (check) {
            alert('มีชื่อผู้ใช้นี้อยู่ในระบบแล้ว')
        } else {
            if (password.length < 6) {
                alert('รหัสผ่านสั้นไป ควรใส่อย่างน้อย 6 อักขระ')
            } else if (password != confirmPassword) {
                alert('รหัสผ่านไม่ตรงกัน')
            } else {
                $('#mainHeader').hide()
                $('#register').hide("slide", { direction: "left" }, 500, function () {
                    registerUser();
                });
            }
        }
    })
}

function registerUser() {
    firebase.database().ref('userprofile/' + username.toString()).set({
        dateofbirth: dateofbirth.toString(),
        gender: gender.toString(),
        email: email,
        username: username.toString()
    }).then(function () {
        register = true;
        createUser();
    })
}

function createUser() {
    var tempName;
    if (register) {
        firebase.auth()
            .createUserWithEmailAndPassword(email.toString(), password.toString())
            .catch(function (error) {
                var errorCode = error.code;
                var errorMessage = error.message;
                console.log(errorMessage);
            }).then(function () {
                var user = firebase.auth().currentUser;
                tempName = username.toString();
                user.updateProfile({
                    displayName: tempName
                }).then(function () {
                    console.log("successfully created the user");
                    console.log(tempName);
                    initUserProfile(tempName)
                }).catch(function (error) {
                    console.log("Error: ", error);
                });
            })
    }
}