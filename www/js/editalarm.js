$('#editalarmcancel').on('click', function () {
    $('#editalarm').hide()
    $('#mainlayout').show()
})

$('#editalarmconfirm').on('click', function () {
    onEditAlarmConfirm(storage.getItem('currentno'))
})

$('#addalarmcancel').on('click', function () {
    $('#addalarm').hide()
    $('#mainlayout').show()
})

$('#addalarmconfirm').on('click', function () {
    addAlarm()
})

$('#alert').on('click', function () {
    var date = new Date()
    date.setMinutes(d.getMinutes + 1)
    cordova.plugins.notification.local.schedule({
        id: 1000,
        title: 'My first notification',
        text: 'Thats pretty easy...',
        sound: 'file://sounds/alert.mp3',
        firstAt: date,
        every: 'day',
    });
})

$('.div-alarmlist').on('change', 'input[type="checkbox"]', function () {
    var no = $(this).parent().parent().parent().attr('id')
    if ($(this).prop('checked')) {
        editActiveAlarm(no, true)
    } else {
        editActiveAlarm(no, false)
    }
})

$('#deletealarm').on('click', function () {
    $('#modal-deletealarm').modal()
})

$('#canceldelete').on('click', function () {
    $('.modal').modal('hide')
})

$('#confirmdelete').on('click', function () {
    $('.modal').modal('hide')
    deleteAlarm(storage.getItem('currentno'))
})

function addAlarm() {
    var hour = $('#addalarm .timepicker').val().split(':')[0]
    var minute = $('#addalarm .timepicker').val().split(':')[1]
    var name = $('#addalarm #pillname').val();
    var amount = $('#addalarm #pillamount').val()
    var time = $("#addalarm input[name='wheneat']:checked").val()
    db.sqlBatch([
        ['INSERT INTO Alarm VALUES (?,?,?,?,?,?,?,?)', [alarmlength + 1, name, hour, minute, amount, time, '', true]],
    ], function () {
        createAlarmList()
        $('#addalarm').hide()
        $('#mainlayout').show()
    }, function (error) {
        console.log('SQL batch ERROR: ' + error.message);
    });
}

function editActiveAlarm(no, active) {
    db.sqlBatch([
        ['UPDATE Alarm SET active = ? WHERE no = ' + no, [active]],
    ], function () {
        if (active == false) {
            disableAlarm(no)
        } else if (active == true) {
            initAlarm(no)
        }
        console.log('finish')
    }, function (error) {
        console.log('SQL batch ERROR: ' + error.message);
    });
}

function deleteAlarm(no) {
    db.sqlBatch([
        ['DELETE FROM Alarm WHERE no = ' + no, []],
    ], function () {
        console.log('finish')
        disableAlarm(no)
        createAlarmList()
        $('#editalarm').hide()
        $('#mainlayout').show()
    }, function (error) {
        console.log('SQL batch ERROR: ' + error.message);
    });
}

function onEditAlarmConfirm(no) {
    var hour = $('#editalarm .timepicker').val().split(':')[0]
    var minute = $('#editalarm .timepicker').val().split(':')[1]
    var name = $('#editalarm #pillname').val();
    var amount = $('#editalarm #pillamount').val()
    var time = $("#editalarm input[name='wheneat']:checked").val()
    db.sqlBatch([
        ['UPDATE Alarm SET name = ?, hour = ?, minute = ?, amount = ?, time = ?, active = ? WHERE no = ' + no, [name, hour, minute, amount, time, true]],
    ], function () {
        console.log('finish')
        createAlarmList()
        $('#editalarm').hide()
        $('#mainlayout').show()
    }, function (error) {
        console.log('SQL batch ERROR: ' + error.message);
    });
}

function disableAlarm(no) {
    cordova.plugins.notification.local.cancel(no, function () {
    });
}