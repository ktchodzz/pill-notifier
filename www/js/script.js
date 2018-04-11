var username;
var email;
var password;
var confirmpassword;
var dateofbirth;
var gender;

$(document).ready(function (e) {
    document.addEventListener("backbutton", onBackKeyDown, false);
});

function onBackKeyDown() {
    if ($('#register').is(':visible')) {
        $('#register').hide("slide", { direction: "right" }, 500, function () {
            $('#login').show("fade");
            $('#mainheader').show("fade");
        });
    } else if ($('#editalarm').is(':visible')) {
        $('#editalarm').hide()
        $('#mainlayout').show()
    } else if ($('#addalarm').is(':visible')) {
        $('#addalarm').hide()
        $('#mainlayout').show()
    } else if ($('#setting').is(':visible')) {
        $('#setting').hide()
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
    initlalarmtable()
    initalarmlist()
    initalert()
});


function initlalarmtable() {
    db.sqlBatch([
        'CREATE TABLE IF NOT EXISTS Alarm (no, name, hour, minute, amount, time, sound, active)',
    ], function () {
        console.log('Populated database OK');
    }, function (error) {
        console.log('SQL batch ERROR: ' + error.message);
    });
}

function initalarmlist() {
    $('.div-alarmlist').empty()
    db.executeSql('SELECT no AS no, name AS name, hour AS hour, minute AS minute, amount AS amount, time AS time, sound AS sound, active AS active FROM Alarm ORDER BY hour, minute, no', [],
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
                alarmObj.active = rs.rows.item(i).active;
                alarmArray.push(alarmObj);

                html = '<div id="' + rs.rows.item(i).no + '" class="alarmlist"><div class="info">'
                html += '<h3>' + rs.rows.item(i).name + '</h3>'
                html += '<p>' + rs.rows.item(i).hour + ':'
                html += rs.rows.item(i).minute + '</p>'
                html += '<p>' + rs.rows.item(i).amount + ' เม็ด '
                if (rs.rows.item(i).time == 'before')
                    html += 'ก่อนรับประทานอาหาร</p></div>'
                else
                    html += 'หลังรับประทานอาหาร</p></div>'
                if (rs.rows.item(i).active == 'true')
                    html += '<div class="checkalarm"><label class="switch"><input type="checkbox" checked=true><span class="slider round"></span></label></div></div>'
                else
                    html += '<div class="checkalarm"><label class="switch"><input type="checkbox"><span class="slider round"></span></label></div></div>'
                $('.div-alarmlist').append(html)
                if (rs.rows.item(i).active == 'true')
                    initalarm(rs.rows.item(i).no)
            }

            var user = firebase.auth().currentUser;
            console.log(user);
            if (user) {
                firebase.database().ref().child('userprofile/' + user.displayName)
                    .update({ alarmList: alarmArray });
            }
        }, function (error) {
            console.log('SELECT SQL statement ERROR: ' + error.message);
        });
}

function initalarm(no) {
    db.executeSql('SELECT no AS no, name AS name, hour AS hour, minute AS minute, amount AS amount, time AS time, sound AS sound FROM Alarm WHERE no = ' + no, [],
        function (rs) {
            var d = new Date()
            var name = rs.rows.item(0).name
            var hour = parseInt(rs.rows.item(0).hour)
            var minute = parseInt(rs.rows.item(0).minute)
            var amount = rs.rows.item(0).amount
            var time = rs.rows.item(0).time
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

function initalert() {
    var d = new Date()
    var hour = 8
    var minute = 0
    if (hour < d.getHours()) {
        d.setDate(d.getDate() + 1)
    } else if (hour == d.getHours()) {
        if (minute < d.getMinutes()) {
            d.setDate(d.getDate() + 1)
        }
    }
    var date = d.getDate()
    var month = d.getMonth() + 1
    cordova.plugins.notification.local.schedule({
        id: 100,
        title: 'ตื่นๆๆๆ เช้าแล้วววว',
        text: 'เช้าแล้วกินข้าวด้วยน้าา',
        sound: 'file://sounds/เช้า.mp3',
        trigger: { every: { month: month, day: date, hour: hour, minute: minute } }
    });

    var d = new Date()
    var hour = 12
    var minute = 0
    if (hour < d.getHours()) {
        d.setDate(d.getDate() + 1)
    } else if (hour == d.getHours()) {
        if (minute < d.getMinutes()) {
            d.setDate(d.getDate() + 1)
        }
    }
    var date = d.getDate()
    var month = d.getMonth() + 1
    cordova.plugins.notification.local.schedule({
        id: 101,
        title: 'เที่ยงแล้ววว',
        text: 'เที่ยงแล้วกินข้าวด้วยน้าา',
        sound: 'file://sounds/เที่ยง.mp3',
        trigger: { every: { month: month, day: date, hour: hour, minute: minute } }
    });

    var d = new Date()
    var hour = 18
    var minute = 0
    if (hour < d.getHours()) {
        d.setDate(d.getDate() + 1)
    } else if (hour == d.getHours()) {
        if (minute < d.getMinutes()) {
            d.setDate(d.getDate() + 1)
        }
    }
    var date = d.getDate()
    var month = d.getMonth() + 1
    cordova.plugins.notification.local.schedule({
        id: 102,
        title: 'เย็นแล้ววว',
        text: 'เย็นแล้วกินข้าวด้วยน้าา',
        sound: 'file://sounds/เย็น.mp3',
        trigger: { every: { month: month, day: date, hour: hour, minute: minute } }
    });

    var d = new Date()
    var hour = 21
    var minute = 0
    if (hour < d.getHours()) {
        d.setDate(d.getDate() + 1)
    } else if (hour == d.getHours()) {
        if (minute < d.getMinutes()) {
            d.setDate(d.getDate() + 1)
        }
    }
    var date = d.getDate()
    var month = d.getMonth() + 1
    cordova.plugins.notification.local.schedule({
        id: 103,
        title: 'มืดแล้ววว',
        text: 'นอนได้แล้ว ฝันดีค่ะ',
        sound: 'file://sounds/ดึก.mp3',
        trigger: { every: { month: month, day: date, hour: hour, minute: minute } }
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
        console.log(user);

        var displayName = user.displayName || "";
        var email = user.email;
        var emailVerified = user.emailVerified;
        var photoURL = user.photoURL;
        var isAnonymous = user.isAnonymous;
        var uid = user.uid;
        var providerData = user.providerData;
        console.log(displayName.toString())
        inituserprofile(displayName)
    } else {
        console.log('logout')
        $('#mainheader').show()
        $('#login').show("slide", { direction: "right" }, 500);
    }
});


function inituserprofile(displayName) {
    var ref = firebase.database().ref("userprofile/" + displayName.toString());
    ref.once("value").then(function (snapshot) {
        console.log(snapshot);
        console.log(snapshot.child("alarmList").val());
        if (snapshot.child("username").val()) {
            username = snapshot.child("username").val()
            email = snapshot.child("email").val()
            dateofbirth = snapshot.child("dateofbirth").val()
            gender = snapshot.child("gender").val()

            $('.myname').text(username)
            $('.myemail').text(email)
            $('.mydateofbirth').text(dateofbirth)
            if (gender == 'ชาย') {
                $('.mydateofbirth').addClass('male')
            } else {
                $('.mydateofbirth').addClass('female')
            }
            $('#mainlayout').show()
            $('#alarm').show()
        } else {
            setTimeout(inituserprofile(displayName), 500)
        }
    })
}
