import '../javaScriptFiles/Shared.js';

function ShowHideLines(ShowHideText)
{
    $('[name="demoFunction"]').each(function() {
        $(this)[ShowHideText]();
    });
}

export function init_jqueryDemo()
{
    $("#btnShow1").on("click", function() {
        $("#demo").hide();
    });

    $("#btnHide1").on("click", function() {
        $("#demo").show();
    });

    $("#btnShow2").on("click", function() {
        ShowHideLines('show');
    });

    $("#btnHide2").on("click", function() {
        ShowHideLines('hide');
    });

    $("#btnHide3").on("click", function() {
        $("#TagsInOneBlock").hide();
    });

    $("#btnShow3").on("click", function() {
        $("#TagsInOneBlock").show();
    });

    $(".toggle-btn").on("click", function() {
        var data_action = $(this).data("action");
        $('[name="demoFunction"]').each(function() {
            $(this)[data_action]();
        }); 
    });
}