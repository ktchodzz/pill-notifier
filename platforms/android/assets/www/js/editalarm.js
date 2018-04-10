

$('#editalarmcancel').on('click',function(){
    $('#editalarm').hide()
    $('#mainlayout').show()
})

$('#editalarmconfirm').on('click',function(){
    editalarmconfirm(storage.getItem('currentno'))
})

$('#addalarmcancel').on('click',function(){
    $('#addalarm').hide()
    $('#mainlayout').show()
})

$('#addalarmconfirm').on('click',function(){
    addnewalarm()
})

$('#alert').on('click',function(){
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

$('.div-alarmlist').on('change', 'input[type="checkbox"]',function(){
    var no = $(this).parent().parent().parent().attr('id')
    if ($(this).prop('checked')) {
        editactive(no, true)
    } else {
        editactive(no, false)
    }
})

function addnewalarm() {
    var hour = $('#addalarm .timepicker').val().split(':')[0]
    var minute = $('#addalarm .timepicker').val().split(':')[1]
    var name = $('#addalarm #pillname').val();
    var amount = $('#addalarm #pillamount').val()
    var time = $("#addalarm input[name='wheneat']:checked").val()
    db.sqlBatch([
        ['INSERT INTO Alarm VALUES (?,?,?,?,?,?,?,?)', [alarmlength+1, name, hour, minute, amount, time, '', true]],
    ], function () {
        initalarmlist()
        $('#addalarm').hide()
        $('#mainlayout').show()
    }, function (error) {
        console.log('SQL batch ERROR: ' + error.message);
    });
}

function editactive(no, active){
    db.sqlBatch([
        ['UPDATE Alarm SET active = ? WHERE no = ' + no, [active]],
    ], function () {
        if (active == false){
            disablealarm(no)
        }else if (active == true){
            initalarm(no)
        }
        console.log('finish')
    }, function (error) {
        console.log('SQL batch ERROR: ' + error.message);
    });
}

function deletealarm(no){
    db.sqlBatch([
        ['DELETE FROM Alarm WHERE no = ' + no, []],
    ], function () {
        console.log('finish')
        disablealarm(no)
        initalarmlist()
        $('#editalarm').hide()
        $('#mainlayout').show()
    }, function (error) {
        console.log('SQL batch ERROR: ' + error.message);
    });
}

$('#deletealarm').on('click',function(){
    $('#modal-deletealarm').modal()
})

$('#canceldelete').on('click',function(){
    $('.modal').modal('hide')
})

$('#confirmdelete').on('click',function(){
    $('.modal').modal('hide')
    deletealarm(storage.getItem('currentno'))
})

function editalarmconfirm(no) {
    var hour = $('#editalarm .timepicker').val().split(':')[0]
    var minute = $('#editalarm .timepicker').val().split(':')[1]
    var name = $('#editalarm #pillname').val();
    var amount = $('#editalarm #pillamount').val()
    var time = $("#editalarm input[name='wheneat']:checked").val()
    db.sqlBatch([
        ['UPDATE Alarm SET name = ?, hour = ?, minute = ?, amount = ?, time = ?, active = ? WHERE no = ' + no, [name, hour, minute, amount, time, true]],
    ], function () {
        console.log('finish')
        initalarmlist()
        $('#editalarm').hide()
        $('#mainlayout').show()
    }, function (error) {
        console.log('SQL batch ERROR: ' + error.message);
    });
}

function disablealarm(no) {
    cordova.plugins.notification.local.cancel(no, function() {
    });
}