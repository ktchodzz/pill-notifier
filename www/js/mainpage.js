$('.footer-menu button').on('click', function () {
    $('.footer-menu button').removeClass('active')
    $(this).addClass('active')
})

$('#alarmButton').on('click', function () {
    $('.main').hide()
    $('#alarm').show()
})

$('#profileButton').on('click', function () {
    $('.main').hide()
    $('#profile').show()
})

$('.div-alarmList').on('click', '.alarmlist', function (event) {
    if (event.target.nodeName == "SPAN" || event.target.nodeName == "INPUT") {
    } else {
        no = $(this).attr('id')
        editAlarmValue(no)
        storage.setItem('currentno', no)
    }
})

$('#addAlarmButton').on('click', function () {
    $('#mainlayout').hide()
    $('#addalarm').show()
    $('#addalarm .timepicker').val('00:00')
    $('#addalarm #pillName').val('')
    $('#addalarm #pillAmount').val(1)
    $("#addalarm input[name='eatTime']").filter("[value='before']").click();
    $('#addalarm #pillNotes').val('')
    $('#addalarm .timepicker').clockTimePicker({
        i18n: {
            okButton: 'ตกลง',
            cancelButton: 'ยกเลิก'
        },
    });

})

function editAlarmValue(no) {
    db.executeSql('SELECT no AS no, name AS name, hour AS hour, minute AS minute, amount AS amount, time AS time, notes as notes, sound AS sound, active AS active FROM Alarm WHERE no = ' + no, [], function (rs) {
        $('#editalarm .timepicker').val(rs.rows.item(0).hour + ':' + rs.rows.item(0).minute)
        $('#editalarm #pillName').val(rs.rows.item(0).name)
        $('#editalarm #pillAmount').val(rs.rows.item(0).amount)
        if (rs.rows.item(0).time == 'before')
            $("#editalarm input[name='eatTime']").filter("[value='before']").attr('checked', true);
        else if (rs.rows.item(0).time == 'after')
            $("#editalarm input[name='eatTime']").filter("[value='after']").attr('checked', true);
        $('#editalarm #pillNotes').val(rs.rows.item(0).notes)
        $('#mainlayout').hide()
        $('#editalarm').show(function () {
            $('#editalarm .timepicker').clockTimePicker({
                i18n: {
                    okButton: 'ตกลง',
                    cancelButton: 'ยกเลิก'
                },
            });
        })
    }, function (error) {
        console.log('SELECT SQL statement ERROR: ' + error.message);
    });
}
