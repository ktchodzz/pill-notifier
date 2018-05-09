$('#editAlarmCancel').on('click', function () {
    $('#editalarm').hide()
    $('#mainlayout').show()
})

$('#editAlarmConfirm').on('click', function () {
    onEditAlarmConfirm(storage.getItem('currentno'))
})

$('#addAlarmCancel').on('click', function () {
    $('#addalarm').hide()
    $('#mainlayout').show()
})

$('#addAlarmConfirm').on('click', function () {
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

$('.div-alarmList').on('change', 'input[type="checkbox"]', function () {
    var no = $(this).parent().parent().parent().attr('id')
    if ($(this).prop('checked')) {
        editActiveAlarm(no, true)
    } else {
        editActiveAlarm(no, false)
    }
})

$('#deleteAlarm').on('click', function () {
    $('#modal-deleteAlarm').modal()
})

$('#cancelDelete').on('click', function () {
    $('.modal').modal('hide')
})

$('#confirmDelete').on('click', function () {
    $('.modal').modal('hide')
    deleteAlarm(storage.getItem('currentno'))
})

function addAlarm() {
    var hour = $('#addalarm .timepicker').val().split(':')[0]
    var minute = $('#addalarm .timepicker').val().split(':')[1]
    var name = $('#addalarm #pillName').val();
    var amount = $('#addalarm #pillAmount').val();
    var time = $("#addalarm input[name='eatTime']:checked").val()
    var notes = $("#addalarm #pillNotes").val();
    db.sqlBatch([
        ['INSERT INTO Alarm VALUES (?,?,?,?,?,?,?,?,?)', [alarmlength + 1, name, hour, minute, amount, time, notes, '', true]],
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
    var name = $('#editalarm #pillName').val();
    var amount = $('#editalarm #pillAmount').val()
    var time = $("#editalarm input[name='eatTime']:checked").val()
    var notes = $('#editalarm #pillNotes').val()
    db.sqlBatch([
        ['UPDATE Alarm SET name = ?, hour = ?, minute = ?, amount = ?, time = ?, notes = ?, active = ? WHERE no = ' + no, [name, hour, minute, amount, time, notes, true]],
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
