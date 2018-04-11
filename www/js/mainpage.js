$('.footer-menu button').on('click', function () {
    $('.footer-menu button').removeClass('active')
    $(this).addClass('active')
})

$('#alarmbtn').on('click', function () {
    $('.main').hide()
    $('#alarm').show()
})

$('#profilebtn').on('click', function () {
    $('.main').hide()
    $('#profile').show()
})

$('.div-alarmlist').on('click', '.alarmlist', function (event) {
    if (event.target.nodeName == "SPAN" || event.target.nodeName == "INPUT") {
    } else {
        no = $(this).attr('id')
        editAlarmValue(no)
        storage.setItem('currentno', no)
    }
})

$('#addalarmbtn').on('click', function () {
    $('#mainlayout').hide()
    $('#addalarm').show()
    $('#addalarm .timepicker').val('00:00')
    $('#addalarm #pillname').val('')
    $('#addalarm #pillamount').val(1)
    $("#addalarm input[name='wheneat']").filter("[value='before']").click();
    $('#addalarm .timepicker').clockTimePicker({
        i18n: {
            okButton: 'ตกลง',
            cancelButton: 'ยกเลิก'
        },
    });
    
})

function editAlarmValue(no) {
    db.executeSql('SELECT no AS no, name AS name, hour AS hour, minute AS minute, amount AS amount, time AS time, sound AS sound, active AS active FROM Alarm WHERE no = ' + no, [], function (rs) {
        $('#editalarm .timepicker').val(rs.rows.item(0).hour + ':' + rs.rows.item(0).minute)
        $('#editalarm #pillname').val(rs.rows.item(0).name)
        $('#editalarm #pillamount').val(rs.rows.item(0).amount)
        if (rs.rows.item(0).time == 'before')
            $("#editalarm input[name='wheneat']").filter("[value='before']").attr('checked', true);
        else if (rs.rows.item(0).time == 'after')
            $("#editalarm input[name='wheneat']").filter("[value='after']").attr('checked', true);
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