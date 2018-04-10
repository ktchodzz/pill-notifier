var username;
var email;
var password;
var confirmpassword;
var firstname;
var lastname;
var dateofbirth;
var gender;
var number;
var status;
var playerid;
var myimg;
var currentplayerid = ''
var currentchatkey = ''
var currentchatfriend = ''
var currentfimg = ''

$('.chat-input input').css('width', $(window).width() - 55)

$(document).ready(function (e) {
    document.addEventListener("backbutton", onBackKeyDown, false);
});

function onBackKeyDown() {
    if ($('#chatroom').is(':visible')) {
        currentplayerid = ''
        currentchatkey = ''
        currentchatfriend = ''
        currentfimg = ''
        $('#chatroom').hide()
        $('#mainlayout').show()
    } else if ($('#register').is(':visible')) {
        $('#register').hide("slide", { direction: "right" }, 500, function () {
            $('#login').show("fade");mainheader
            $('#mainheader').show("fade");
        });
    } else if ($('#forgetpass').is(':visible')) {
        $('#forgetpass').hide("slide", { direction: "right" }, 500, function () {
            $('#login').show("fade");
        });
    } else if ($('#beforeregister').is(':visible')) {
        $('#beforeregister').hide("slide", { direction: "right" }, 500, function () {
            $('#mainheader').show("fade");
            $('#login').show("fade");
        });
    } else if ($('#bgquiz').is(':visible')) {
        $('#test2q').hide("slide", { direction: "right" }, 500, function () {
            $('#mainheader').show("fade");
            $('#login').show("fade");
        });
        $('#test9q').hide("slide", { direction: "right" }, 500, function () {
            $('#mainheader').show("fade");
            $('#login').show("fade");
        });
        $('#bgquiz').hide("slide", { direction: "right" }, 500, function () {
            $('#mainheader').show("fade");
            $('#login').show("fade");
        });
    } else if ($('#register').is(':visible')) {
        $('#register').hide("slide", { direction: "right" }, 500, function () {
            $('#mainheader').show("fade");
            $('#login').show("fade");
        });
    } else if ($('#pin').is(':visible')) {
        $('#pin').hide("slide", { direction: "right" }, 500, function () {
            $('#mainheader').show("fade");
            $('#login').show("fade");
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
    } else if ($('#newtest2q').is(':visible')) {
        $('#newtest2q').hide()
        $('#mainlayout').show()
    } else if ($('#newtest9q').is(':visible')) {
        $('#newtest9q').hide()
        $('#mainlayout').show()
    } else if ($('#newtest8q').is(':visible')) {
        $('#newtest8q').hide()
        $('#mainlayout').show()
    } else if ($('.modal').is(':visible')) {
        $('.modal').modal('hide')
    } else if ($('#friend').is(':visible')) {
        $('#friend').hide()
        $('#mainlayout').show()
    } else if ($('#callcenter').is(':visible')) {
        $('#callcenter').hide()
        $('#mainlayout').show()
    } else if ($('#knowledge').is(':visible')) {
        $('#knowledge').hide()
        $('#mainlayout').show()
    } else if ($('#knowledge-detail').is(':visible')) {
        $('#knowledge-detail').hide()
        $('#knowledge').show()
    } else if ($('#entertain').is(':visible')) {
        $('#entertain').hide()
        $('#mainlayout').show()
    } else if ($('#ent-detail').is(':visible')) {
        $('#iframe').hide()
        $('iframe').hide()
        $('iframe').each(function () {
            $(this).attr('src', $(this).attr('src'))
        })
        $('#ent-detail').hide()
        $('#ent-detail .knowledge-body').hide()
        $('#entertain').show()
    } else if ($('#iframe').is(':visible')) {
        $('#iframe').hide()
        $('iframe').hide()
        $('#ent-detail').show()
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
    console.log(db);
    
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
            for (i = 0; i < alarmlength; i++) {
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

var notificationReceivedCallback = function (jsonData) {
    if ($('#chatroom').is(':visible')) {
        var date = new Date();
        var day = date.getDate();
        var month = date.getMonth();
        var hour = date.getHours();
        var min = date.getMinutes();
        if (day.toString().length < 2)
            day = '0' + day
        if (month.toString().length < 2)
            month = '0' + month
        if (hour.toString().length < 2)
            hour = '0' + hour
        if (min.toString().length < 2)
            min = '0' + min
        var html = ''
        html += '<div class="msg-l">'
        html += '<div class="col-xs-2">'
        html += '<img src="images/testpro.png" class="img-circle">'
        html += '</div>'
        html += '<div class="col-xs-10">'
        html += '<p >' + jsonData.payload.additionalData.msg + '</p>'
        html += '<span>' + month + '/' + day + ' - ' + hour + ':' + min + '</span>'
        html += '</div>'
        html += '</div>'
        $('.chat-body').append(html)
        $('.chat-body').scrollTop($('.chat-body')[0].scrollHeight);
    }
};


document.addEventListener('deviceready', function () {
    window.plugins.OneSignal
        .startInit("8eff264c-84d7-45e1-bbbb-31b5de488f2c")
        .handleNotificationOpened(notificationOpenedCallback)
        // .handleNotificationReceived(notificationReceivedCallback)
        .inFocusDisplaying(window.plugins.OneSignal.OSInFocusDisplayOption.None)
        .endInit();

}, false);



function setvalue() {
    firebase.database().ref('chat/chat1/m2').set({
        msg: 'dfgdsfg',
        read: false,
        sender: 'gg',
        timestamp: '12;99'
    });
}

function queryfirebase() {
    var ref = firebase.database().ref("chat/chat1");
    ref.once("value").then(function (snapshot) {
        snapshot.forEach(function (childSnapshot) {
            console.log(childSnapshot.child('msg').val())
        });
        var m1 = snapshot.child("m1").exists() // {first:"Ada",last:"Lovelace"}
        var msg = snapshot.child("m1/msg").val(); // "Ada"
    });
}


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
        console.log(displayName)
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
    })
}
