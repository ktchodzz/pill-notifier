var username;
var email;
var password;
var confirmPassword;
var dateofbirth;
var gender;

$(document).ready(function (e) {
    document.addEventListener("backbutton", onBackKeyDown, false);
});

function onBackKeyDown() {
    if ($('#register').is(':visible')) {
        $('#register').hide("slide", { direction: "right" }, 500, function () {
            $('#login').show("fade");
            $('#mainHeader').show("fade");
        });
    } else if ($('#editalarm').is(':visible')) {
        $('#editalarm').hide()
        $('#mainlayout').show()
    } else if ($('#addalarm').is(':visible')) {
        $('#addalarm').hide()
        $('#mainlayout').show()
    } else if ($('.modal').is(':visible')) {
        $('.modal').modal('hide')
    }
};


var storage = window.localStorage;
var html = '<option value="">ปี</option>';
var date = new Date();
var years = date.getFullYear();
for (i = 0; i <= 80; i++) {
    html += '<option value="' + (years - i) + '">' + (years - i) + '</option>'
}

$('#year').append(html)

var db = null;
var alarmlength;

document.addEventListener('deviceready', function () {
    db = window.sqlitePlugin.openDatabase({
        name: 'mydb.db',
        location: 'default'
    });
    createAlarmDatabase()
    createAlarmList()
});


function createAlarmDatabase() {
    db.sqlBatch([
        'CREATE TABLE IF NOT EXISTS Alarm (no, name, hour, minute, amount, time, notes, sound, active)',
    ], function () {
        console.log('Populated database OK');
    }, function (error) {
        console.log('SQL batch ERROR: ' + error.message);
    });
}

function createAlarmList() {
    $('.div-alarmList').empty()
    db.executeSql('SELECT no AS no, name AS name, hour AS hour, minute AS minute, amount AS amount, time AS time, notes AS notes, sound AS sound, active AS active FROM Alarm ORDER BY hour, minute, no', [],
        function (rs) {
            alarmlength = rs.rows.length
            alarmArray = [];
            for (i = 0; i < alarmlength; i++) {
                var alarmObj = new Object();
                alarmObj.no = rs.rows.item(i).no;
                alarmObj.name = rs.rows.item(i).name;
                alarmObj.hour = rs.rows.item(i).hour;
                alarmObj.minute = rs.rows.item(i).minute;
                alarmObj.amount = rs.rows.item(i).amount;
                alarmObj.time = rs.rows.item(i).time;
                alarmObj.notes = rs.rows.item(i).notes;
                alarmObj.active = rs.rows.item(i).active;
                alarmArray.push(alarmObj);
                createAlarm(alarmObj);
            }

            var user = firebase.auth().currentUser;
            if (user) {
                firebase.database().ref().child('userprofile/' + user.displayName)
                    .update({ alarmList: alarmArray });
            }
        }, function (error) {
            console.log('SELECT SQL statement ERROR: ' + error.message);
        });
}

function createAlarm(alarmObj) {
    html = '<div id="' + alarmObj.no + '" class="alarmlist"><div class="info">' +
        '<h3>' + alarmObj.name + '</h3>' +
        '<p>' + alarmObj.hour + ':' + alarmObj.minute + '</p>' +
        '<p>' + alarmObj.amount + ' เม็ด ';

    if (alarmObj.time == 'before') {
        html += 'ก่อนรับประทานอาหาร</p></div>';
    } else {
        html += 'หลังรับประทานอาหาร</p></div>';
    }

    if (alarmObj.active == 'true') {
        html += '<div class="checkAlarm"><label class="switch"><input type="checkbox" checked=true><span class="slider round"></span></label></div></div>'
    } else {
        html += '<div class="checkAlarm"><label class="switch"><input type="checkbox"><span class="slider round"></span></label></div></div>'
    }


    $('.div-alarmList').append(html)

    if (alarmObj.active == 'true') {
        initAlarm(alarmObj.no)
    }
}

function importAlarm(alarmArray) {
    alarmArray.forEach((alarmObj, index) => {
        db.sqlBatch([
            ['INSERT INTO Alarm VALUES (?,?,?,?,?,?,?,?,?)', [index, alarmObj.name, alarmObj.hour, alarmObj.minute, alarmObj.amount, alarmObj.time, alarmObj.notes, '', true]],
        ], function () {
            console.log('SQL batch ERROR: ' + error.message);
        }, function (error) {
            console.log('SQL batch ERROR: ' + error.message);
        });
    });
}

function initAlarm(no) {
    db.executeSql('SELECT no AS no, name AS name, hour AS hour, minute AS minute, amount AS amount, time AS time,notes as notes, sound AS sound FROM Alarm WHERE no = ' + no, [],
        function (rs) {
            var d = new Date()
            var name = rs.rows.item(0).name
            var hour = parseInt(rs.rows.item(0).hour)
            var minute = parseInt(rs.rows.item(0).minute)
            var amount = rs.rows.item(0).amount
            var time = rs.rows.item(0).time
            var notes = rs.rows.item(0).notes
            var sound = rs.rows.item(0).sound
            sound = 'file://sounds/alert.mp3'
            if (hour < d.getHours()) {
                d.setDate(d.getDate() + 1)
            } else if (hour == d.getHours()) {
                if (minute < d.getMinutes()) {
                    d.setDate(d.getDate() + 1)
                }
            }
            var date = d.getDate()
            var month = d.getMonth() + 1
            if (time == 'before') {
                time = 'ก่อนรับประทานอาหาร'
            } else if (time == 'after') {
                time = 'หลังรับประทานอาหาร'
            }
            cordova.plugins.notification.local.schedule({
                id: no,
                title: name,
                text: amount + 'เม็ด ' + time,
                sound: sound,
                trigger: { every: { month: month, day: date, hour: hour, minute: minute } }
            });
        }, function (error) {
            console.log('SELECT SQL statement ERROR: ' + error.message);
        });
}

// onesignal-------------------------------------

var notificationOpenedCallback = function (jsonData) {
    console.log('notificationOpenedCallback: ' + JSON.stringify(jsonData));
};

document.addEventListener('deviceready', function () {
    window.plugins.OneSignal
        .startInit("8eff264c-84d7-45e1-bbbb-31b5de488f2c")
        .handleNotificationOpened(notificationOpenedCallback)
        // .handleNotificationReceived(notificationReceivedCallback)
        .inFocusDisplaying(window.plugins.OneSignal.OSInFocusDisplayOption.None)
        .endInit();

}, false);

// check state login-----------------------------------

firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
        var displayName = user.displayName || "";
        var email = user.email;
        var emailVerified = user.emailVerified;
        var photoURL = user.photoURL;
        var isAnonymous = user.isAnonymous;
        var uid = user.uid;
        var providerData = user.providerData;
        initUserProfile(displayName.toString());
    } else {
        console.log('logout')
        $('#mainHeader').show()
        $('#login').show("slide", { direction: "right" }, 500);
    }
});


function initUserProfile(displayName) {
    var ref = firebase.database().ref("userprofile/" + displayName);
    ref.once("value").then(function (snapshot) {
        username = snapshot.child("username").val() || "";
        if (snapshot.child("username").exists() && username === displayName) {
            username = snapshot.child("username").val()
            email = snapshot.child("email").val()
            dateofbirth = snapshot.child("dateofbirth").val()
            gender = snapshot.child("gender").val()
            if (snapshot.child("alarmList").val()) {
                $('.div-alarmList').empty()
                alarmList = snapshot.child("alarmList").val();
                db.sqlBatch([
                    ['DROP TABLE IF EXISTS Alarm'],
                ], function () {
                    createAlarmDatabase();
                    importAlarm(alarmList);
                    createAlarmList();
                }, function (error) {
                    console.log('SQL batch ERROR: ' + error.message);
                });
            }

            $('.myName').text("Username    :  "+username)
            $('.myEmail').text("Email      :  "+email)
            $('.myDateOfBirth').text("Birth Date  :  "+dateofbirth)


            if (gender == 'ชาย') {
                $('.gender').text("Gender  : Male")
            } else {
                $('.gender').text("Gender  : Female")
            }

            $('#mainlayout').show()
            $('#alarm').show()
        }
    })
}
