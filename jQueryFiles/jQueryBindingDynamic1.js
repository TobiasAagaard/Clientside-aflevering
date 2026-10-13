import '../javaScriptFiles/Shared.js';

let ButtonAddedCounter = 0;

let ButtonAddedClass;
let CurrentEditItem;
let CurrentDeleteItem;

const textBoxDefaultText = "Init Text";

export function init_jQueryBindingDynamic1()
{
    let ButtonAddedCounter = 0;
    
    let ButtonAddedClass = $(".ButtonsAdded1");

    let CurrentEditItem;
    let CurrentDeleteItem;

    $("#btnAddNewButton1").on('click', function () {
        ButtonAddedCounter++;

        let WorkStringCell0 = "<td>" + ButtonAddedCounter + "</td>";

        let WorkString1 = "<input id='btnDynamic" + ButtonAddedCounter + "' ";
        WorkString1 += "value='btnDynamic_" + ButtonAddedCounter + "' ";
        WorkString1 += "type='button'";
        WorkString1 += " />";
        let WorkStringCell1 = "<td>" + WorkString1 + "</td>";

        let WorkString2 = "<input id='btnEditDynamic" + ButtonAddedCounter + "' ";
        WorkString2 += "value='btnEditDynamic_" + ButtonAddedCounter + "' ";
        WorkString2 += "type='button'";
        WorkString2 += " />";
        let WorkStringCell2 = "<td>" + WorkString2 + "</td>";

        let WorkString3 = "<input id='btnDeleteDynamic" + ButtonAddedCounter + "' ";
        WorkString3 += "value='btnDeleteDynamic_" + ButtonAddedCounter + "' ";
        WorkString3 += "type='button'";
        WorkString3 += "class='deleteClass'";
        WorkString3 += " />";
        let WorkStringCell3 = "<td>" + WorkString3 + "</td>";
        
        let NewRowHTML = "<tr>" + WorkStringCell0 + WorkStringCell1 + 
                        WorkStringCell2 + WorkStringCell3 + "</tr>";
        $("#DataTable tbody").append(NewRowHTML);

        ButtonAddedClass.removeClass("None");
    });

    $(".ButtonsAdded1").on("click", '[id^="btnEditDynamic"]', function(e) {
        CurrentEditItem = $(this);
        CurrentDeleteItem = CurrentEditItem.parent().next().find("input[type='button']");
        $("#txtEditItem1").val($(this).val());
        $(".EditItem1").removeClass("None");
    });

    $(".ButtonsAdded1").on("click", '[id^="btnDeleteDynamic"]', function(e) {
        let DeleteResult = confirm("Do you really wish to delete : " + $(this).val())
        if (DeleteResult) 
        {
            EditItemHere = $(this).parent().prev().find("input[type='button']");
            if ((EditItemHere).val() == $("#txtEditItem1").val())
            {
                $("#txtEditItem1").val("");
                $(".EditItem1").addClass("None");
            }
            $(this).closest("tr").remove();
            if (1 == $("#DataTable tr").length) {
                ButtonAddedClass.addClass("None");
                ButtonAddedCounter = 0;
            }
        }
    });

    $("#txtEditItem1").on("input", function() {
        CurrentEditItem.val($("#txtEditItem1").val());
        let EditString = CurrentEditItem.val();
        let SubString = EditString.substring(EditString.indexOf('_') + 1);
        let DeleteString = CurrentDeleteItem.val().substring(0, CurrentDeleteItem.val().indexOf('_'));
        CurrentDeleteItem.val(DeleteString + "_" + SubString);
        $("#txtEditItem1").width(jQueryCalculateWidthOnControl($("#txtEditItem1")));
    });

    function jQueryCalculateWidthOnControl(Control_Object) {
        ControlWidth = Control_Object.val().length;
        return (ControlWidth * 9 + 25);
    }
}