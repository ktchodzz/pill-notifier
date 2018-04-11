$.widget("lhn.timepicker", {

    setRotate: function (el, deg) {
        el.css("transform", "rotate(" + deg + "deg)");
        el.css("-webkit-transform", "rotate(" + deg + "deg)");
    },

    _create: function () {
        var me = this;
        var container = this.element;
        var mask_el = container.find(".mask");
        var hour_el = container.find(".hour");
        var hour_pt = container.find(".hour .pointer");
        var minute_el = container.find(".minute");
        var minute_pt = container.find(".minute .pointer");
        var meridiem_el = container.find(".meridiem");

        var moving_pt = "";

        container.disableSelection();
        meridiem_el.disableSelection();

        hour_pt.mousedown(function () {
            hour_pt.addClass("hover");
            mask_el.css("z-index", 1000);
            moving_pt = "hour";
        });

        minute_pt.mousedown(function () {
            minute_pt.addClass("hover");
            mask_el.css("z-index", 1000);
            moving_pt = "minute";
        });

        container.mouseup(function () {
            hour_pt.removeClass("hover");
            minute_pt.removeClass("hover");
            mask_el.css("z-index", 0);
            moving_pt = "";
        });

        container.mouseleave(function () {
            hour_pt.removeClass("hover");
            minute_pt.removeClass("hover");
            mask_el.css("z-index", 0);
            moving_pt = "";
        });

        var meridiem = "AM";
        var last_meridiem = "AM";
        meridiem_el.click(function (event) {
            console.log(event.target);
            var tar = $(event.target);
            meridiem_el.find(".ante").removeClass("seleted");
            meridiem_el.find(".post").removeClass("seleted");
            tar.addClass("seleted");
            if (tar.hasClass("ante")) {
                meridiem = "AM";
            } else if (tar.hasClass("post")) {
                meridiem = "PM";
            }

            if (meridiem != last_meridiem) {
                event.hour = hour;
                event.minute = minute;
                event.meridiem = meridiem;
                if (meridiem == "PM" && event.hour != 0) {
                    event.hour24 = hour + 12;
                } else {
                    event.hour24 = hour;
                }
                me._trigger("change", event);
            }

            last_meridiem = meridiem;
        });

        var hour_deg = 0;
        var minute_deg = 0;
        var last_deg = 0;
        var hour = 0;
        var minute = 0;
        var last_minute = 0;
        var last_hour = 0;
        mask_el.mousemove(function (event) {

            var x = event.pageX - container.offset().left;
            var y = event.pageY - container.offset().top;
            var w = 300;
            var h = 300;

            var deg = 180 - (Math.atan((x - w / 2) / (y - h / 2))) * 180 / Math.PI;
            if (y < h / 2 && x < w / 2) {
                deg += 180;
            } else if (y < h / 2 && x >= w / 2) {
                deg -= 180;
            }
            if (moving_pt == "hour") {
                hour = Math.floor(hour_deg / 30);
                hour_deg = (Math.floor(deg / 30)) * 30 + minute_deg / 12;

                me.setRotate(hour_el, hour_deg);
                if (last_minute != minute || last_hour != hour) {
                    event.hour = hour;
                    event.minute = minute;
                    event.meridiem = meridiem;
                    if (meridiem == "PM" && event.hour != 0) {
                        event.hour24 = hour + 12;
                    } else {
                        event.hour24 = hour;
                    }
                    me._trigger("change", event);
                }
                last_hour = hour;
            } else if (moving_pt == "minute") {
                minute = Math.floor(deg / 6);
                minute_deg = (Math.floor(deg / 6)) * 6;
                hour_deg = (Math.floor(hour_deg / 30)) * 30 + minute_deg / 12;
                if (minute < 15 && last_minute > 45) {
                    hour_deg = hour_deg + 30;
                    if (hour == 11) {
                        hour = 0;
                    } else {
                        hour = hour + 1;
                    }
                } else if (minute > 45 && last_minute < 15) {
                    hour_deg = hour_deg - 30;
                    if (hour == 0) {
                        hour = 11;
                    } else {
                        hour = hour - 1;
                    }
                }
                me.setRotate(hour_el, hour_deg);
                me.setRotate(minute_el, minute_deg);
                if (last_minute != minute || last_hour != hour) {
                    event.hour = hour;
                    event.minute = minute;
                    event.meridiem = meridiem;
                    if (meridiem == "PM" && event.hour != 0) {
                        event.hour24 = hour + 12;
                    } else {
                        event.hour24 = hour;
                    }
                    me._trigger("change", event);
                }
                last_minute = minute;
            }


            console.log("x=" + x + ";y=" + y + ";h=" + hour + ";m=" + minute);

        });

    }
});
