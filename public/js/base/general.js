$(function() {
    $body = $("body");
    $loading = $(".loading-screen");
    $("body").click(function() {
        $(".dropdown.active").removeClass("active");
        $(".dropdown-menu").slideUp();
        $(".fa-plus").rotate({
            endDeg: 0,
            persist: true,
            duration: 0.5,
            easing: "ease-in"
        });
    });

    hasPermission();
});

function hasPermission() {
    var hasPermission = $("#hasPermission").val();

    if (hasPermission != undefined) {
        setTimeout(function() {
            toastr.error(
                "Você não tem permissão de acesso a esta funcionalidade."
            );
        }, 500);
    }
}

// Ajax Request - if (success) { return true } else { return false }
function requestAjax(method_request, uri, data_request = []) {
    var result = $.ajax({
        method: method_request,
        url: uri,
        dataType: "json",
        data: data_request,
        timeout: 2000,
        async: false
    });

    if (result.status == 200 || result.status == 201) {
        return { code: result.status, data: result.responseJSON, status: true };
    } else if(result.status == 'timeout' || result.status == 408){
        return { code: result.status, data: result.responseJSON, status: 'timeout' };
    } else {
        return {
            code: result.status,
            data: result.responseText,
            status: false
        };
    }
}

function btnDropdown(id) {
    event.stopPropagation();
    $("#dropdown-" + id).slideToggle();
    $("div.active .fa-plus").rotate({
        endDeg: 0,
        persist: true,
        duration: 0.5,
        easing: "ease-in"
    });
    $("div.active .dropdown-menu").slideUp();
    $("div.active").removeClass("active");
    $("div." + id).addClass("active");
    if (
        $("#icon-plus-" + id).css("transform") ==
        "matrix(-0.707107, -0.707107, 0.707107, -0.707107, 0, 0)"
    ) {
        $("div." + id).removeClass("active");
        $("#icon-plus-" + id).rotate({
            endDeg: 0,
            persist: true,
            duration: 0.5,
            easing: "ease-in"
        });
    } else {
        $("#icon-plus-" + id).rotate({
            endDeg: 225,
            persist: true,
            duration: 0.5,
            easing: "ease-in"
        });
    }
}

//jquery rotate animation - http://jsfiddle.net/Anatol/T6kDR/
$.fn.rotate = function(options) {
    var $this = $(this),
        prefixes,
        opts,
        wait4css = 0;
    prefixes = ["-Webkit-", "-Moz-", "-O-", "-ms-", ""];
    opts = $.extend(
        {
            startDeg: false,
            endDeg: 360,
            duration: 1,
            count: 1,
            easing: "linear",
            animate: {},
            forceJS: false
        },
        options
    );

    function supports(prop) {
        var can = false,
            style = document.createElement("div").style;
        $.each(prefixes, function(i, prefix) {
            if (style[prefix.replace(/\-/g, "") + prop] === "") {
                can = true;
            }
        });
        return can;
    }

    function prefixed(prop, value) {
        var css = {};
        if (!supports.transform) {
            return css;
        }
        $.each(prefixes, function(i, prefix) {
            css[prefix.toLowerCase() + prop] = value || "";
        });
        return css;
    }

    function generateFilter(deg) {
        var rot, cos, sin, matrix;
        if (supports.transform) {
            return "";
        }
        rot = deg >= 0 ? (Math.PI * deg) / 180 : (Math.PI * (360 + deg)) / 180;
        cos = Math.cos(rot);
        sin = Math.sin(rot);
        matrix =
            "M11=" +
            cos +
            ",M12=" +
            -sin +
            ",M21=" +
            sin +
            ",M22=" +
            cos +
            ',SizingMethod="auto expand"';
        return "progid:DXImageTransform.Microsoft.Matrix(" + matrix + ")";
    }

    supports.transform = supports("Transform");
    supports.transition = supports("Transition");

    opts.endDeg *= opts.count;
    opts.duration *= opts.count;

    if (supports.transition && !opts.forceJS) {
        // CSS-Transition
        if (/Firefox/.test(navigator.userAgent)) {
            wait4css =
                (!options || !options.animate) &&
                (opts.startDeg === false || opts.startDeg >= 0)
                    ? 0
                    : 25;
        }
        $this.queue(function(next) {
            if (opts.startDeg !== false) {
                $this.css(
                    prefixed("transform", "rotate(" + opts.startDeg + "deg)")
                );
            }
            setTimeout(function() {
                $this
                    .css(
                        prefixed(
                            "transition",
                            "all " + opts.duration + "s " + opts.easing
                        )
                    )
                    .css(
                        prefixed("transform", "rotate(" + opts.endDeg + "deg)")
                    )
                    .css(opts.animate);
            }, wait4css);

            setTimeout(function() {
                $this.css(prefixed("transition"));
                if (!opts.persist) {
                    $this.css(prefixed("transform"));
                }
                next();
            }, opts.duration * 1000 - wait4css);
        });
    } else {
        // JavaScript-Animation + filter
        if (opts.startDeg === false) {
            opts.startDeg = $this.data("rotated") || 0;
        }
        opts.animate.perc = 100;

        $this.animate(opts.animate, {
            duration: opts.duration * 1000,
            easing: $.easing[opts.easing] ? opts.easing : "",
            step: function(perc, fx) {
                var deg;
                if (fx.prop === "perc") {
                    deg =
                        opts.startDeg +
                        ((opts.endDeg - opts.startDeg) * perc) / 100;
                    $this
                        .css(prefixed("transform", "rotate(" + deg + "deg)"))
                        .css("filter", generateFilter(deg));
                }
            },
            complete: function() {
                if (opts.persist) {
                    while (opts.endDeg >= 360) {
                        opts.endDeg -= 360;
                    }
                } else {
                    opts.endDeg = 0;
                    $this.css(prefixed("transform"));
                }
                $this.css("perc", 0).data("rotated", opts.endDeg);
            }
        });
    }

    return $this;
};

//Ajax with files
function requestAjaxFiles(method_request, uri, data_request = []) {
    var result = $.ajax({
        method: method_request,
        url: uri,
        dataType: "json",
        data: data_request,
        timeout: 2000,
        async: false,
        contentType: false,
        processData: false
    });

    if (result.status == 200 || result.status == 201) {
        return { code: result.status, data: result.responseJSON, status: true };
    } else if(result.status == 'timeout' || result.status == 408){
        return { code: result.status, data: result.responseJSON, status: 'timeout' };
    } else {
        return {
            code: result.status,
            data: result.responseText,
            status: false
        };
    }
}

// Add loading
function addLoading() {
    $loading.addClass("active");
}

// Remove loading
function removeLoading($time = 200) {
    setTimeout(function() {
        $loading.removeClass("active");
    }, $time);
}

// Create tooltips (Tooltips need this because they are opt-in)
function loadTooltip() {
    $(".tooltips").tooltip({ trigger: "hover" });
}

// Return "feedback" to inputs - Related to Validator
function addErrorValidate(id, data) {
    errors = JSON.parse(data);
    $.each(errors.errors, function(idx, obj) {
        $("#" + id)
            .find('[name^="' + idx + '"]')
            .parents("div.input-group")
            .addClass("has-danger");
        $("#" + id)
            .find('[name^="' + idx + '"]')
            .parents("div.form-group")
            .addClass("has-danger");
        $("#" + id)
            .find('[name^="' + idx + '"]')
            .parents("div.label")
            .addClass("has-danger");
        $("#" + id)
            .find("#feedback-" + idx)
            .html(obj);
        $("#" + id)
            .find("#feedback-" + idx)
            .attr("tabindex", -1);
        $("#" + id)
            .find("#feedback-" + idx)
            .focus();
        //Checks if the input is an array and adds the error message to each item
        if (idx.slice(-1) == 0 || idx.slice(-1) > 0) {
            $("#feedback-" + idx.slice(0, -2) + "\\" + "." + idx.slice(-1)
            ).html(obj);
        }
    });
}

// Clear "feedback" of inputs - Related to Validator
function clearErrorValidate(id) {
    $("#" + id)
        .find(".input-group")
        .removeClass("has-danger");
    $("#" + id)
        .find(".form-group")
        .removeClass("has-danger");
    $("#" + id)
        .find(".text-danger")
        .html("");
}

// Adiciona um efeito de "carregando" nos labels
function loadingEffect() {
    string =
        "<span style='font-size: 24px;font-weight: bold;'>.</span>" +
        "<span style='font-size: 20px;'>.</span>" +
        "<span style='font-size: 20px;'>.</span>";
    $(".label-loading").html(string);
    count = 0;
    setInterval(function() {
        count++;
        if (count == 1) {
            string =
                "<span style='font-size: 24px;font-weight: bold;'>.</span>" +
                "<span style='font-size: 20px;'>.</span>" +
                "<span style='font-size: 20px;'>.</span>";
        } else if (count == 2) {
            string =
                "<span style='font-size: 20px;'>.</span>" +
                "<span style='font-size: 24px;font-weight: bold;'>.</span>" +
                "<span style='font-size: 20px;'>.</span>";
        } else if (count == 3) {
            string =
                "<span style='font-size: 20px;'>.</span>" +
                "<span style='font-size: 20px;'>.</span>" +
                "<span style='font-size: 24px;font-weight: bold;'>.</span>";
            count = 0;
        }
        $(".label-loading").html(string);
    }, 350);
}

function secondsTimeSpanToHMS(s) {
    var h = Math.floor(s/3600); //Get whole hours
    s -= h*3600;
    var m = Math.floor(s/60); //Get remaining minutes
    s -= m*60;
    return (h < 10 ? "0"+h : h)+":"+(m < 10 ? '0'+m : m)+":"+(s < 10 ? '0'+s : s); //zero padding on minutes and seconds
}

function dateTimeToStringBR($datetime, $time = false, $date_separator = false) {
        // Return null when datetime is empty or null
        if($datetime == null || $datetime == "") {
            return "null";
        }
        // Capture Date
        var separator = "-";
        var formattedDate = new Date($datetime.trim());
        var day = formattedDate.getDate();
        day += 1;  // JavaScript Days are 0-11        
        if (day.toString().length == 1) {
            day = "0" + day;
        }

        var month =  formattedDate.getMonth();      
        month += 1;  // JavaScript months are 0-11
        if (month.toString().length == 1) {
            month = "0" + month;
        }

        var year = formattedDate.getFullYear();

        //Configures the date separator when informed
        if($date_separator) {
            separator = $date_separator;
        }

        var date_formated = (day + separator + month + separator + year);

        // Capture Time
        if($time == true) {
            var hours = formattedDate.getHours();
            if (hours.toString().length == 1) {
                hours = "0" + hours;
            }

            var minutes = formattedDate.getMinutes();
            if (minutes.toString().length == 1) {
                minutes = "0" + minutes;
            }

            var seconds = formattedDate.getSeconds();
            if (seconds.toString().length == 1) {
                seconds = "0" + seconds;
            }            

            var time_formated = (hours + ":" + minutes + ":" + seconds);
            return (date_formated + " &nbsp;&nbsp" + time_formated);

        } else {
            return (date_formated);
        }

}