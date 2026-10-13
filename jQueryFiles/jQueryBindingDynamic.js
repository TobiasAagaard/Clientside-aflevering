import '../javaScriptFiles/Shared.js';

let ButtonAddedCounter = 0;

let ButtonAddedClass;
let CurrentEditItem;
let CurrentDeleteItem;

const textBoxDefaultText = "Init Text";

export function init_jQueryBindingDynamic(numberOfButtonsToInsertOnStartup = 3)
{
    function AddNewButton()
    {
        ButtonAddedCounter++;
        ButtonAddedClass = $(".ButtonsAdded");

        var WorkStringCell0 = "<td>" + ButtonAddedCounter + "</td>";

        var WorkString1 = "<input id='btnDynamic" + ButtonAddedCounter + "' ";
        WorkString1 += "value='btnDynamic" + ButtonAddedCounter + "' ";
        WorkString1 += "type='button'";
        WorkString1 += " />";
        var WorkStringCell1 = "<td>" + WorkString1 + "</td>";

        var WorkString2 = "<input id='btnEditDynamic" + ButtonAddedCounter + "' ";
        WorkString2 += "value='btnEditDynamic_" + ButtonAddedCounter + "' ";
        WorkString2 += "type='button'";
        WorkString2 += " />";
        var WorkStringCell2 = "<td>" + WorkString2 + "</td>";

        var WorkString3 = "<input id='btnDeleteDynamic" + ButtonAddedCounter + "' ";
        WorkString3 += "value='btnDeleteDynamic_" + ButtonAddedCounter + "' ";
        WorkString3 += "type='button'";
        WorkString3 += " />";
        var WorkStringCell3 = "<td>" + WorkString3 + "</td>";
        
        var NewRowHTML = "<tr>" + WorkStringCell0 + WorkStringCell1 + 
                        WorkStringCell2 + WorkStringCell3 + "</tr>";
        $(".ContentFrameForHTMLFiles #DataTable tbody").append(NewRowHTML);
        
        ButtonAddedClass.removeClass("None");
        $("#txtEditItem").val(textBoxDefaultText);
    }

    $(document).on("click", ".ContentFrameForHTMLFiles #btnAddNewButton", function() {
        AddNewButton();
    });

    $(document).on("click", ".ContentFrameForHTMLFiles [id^='btnEditDynamic']", function(e) {
        CurrentEditItem = $(this);
        CurrentDeleteItem = CurrentEditItem.parent().next().find("input[type='button']");
        $(".ContentFrameForHTMLFiles #txtEditItem").val($(this).val());
        $(".ContentFrameForHTMLFiles .EditItem").removeClass("None");
    });

    $(document).on("click", ".ContentFrameForHTMLFiles [id^='btnDeleteDynamic']", function(e) {
        let DeleteResult = confirm("Do you really wish to delete : " + $(this).val())
        if (DeleteResult) {
            let EditItemHere = $(this).parent().prev().find("input[type='button']");
            if ((EditItemHere).val() == $("#txtEditItem").val())
            {
                $("#txtEditItem").val("");
                $(".EditItem").addClass("None");
            }

            $(this).closest("tr").remove();
            if (1 == $("#DataTable tr").length) {
                ButtonAddedClass.addClass("None");
                ButtonAddedCounter = 0;
            }
        }
    });

    $(document).on("input", ".ContentFrameForHTMLFiles #txtEditItem", function() {
        CurrentEditItem.val($("#txtEditItem").val());
        let EditString = CurrentEditItem.val();
        let SubString = EditString.substring(EditString.indexOf('_') + 1);
        let DeleteString = CurrentDeleteItem.val().substring(0, CurrentDeleteItem.val().indexOf('_'));
        CurrentDeleteItem.val(DeleteString + "_" + SubString);
        $("#txtEditItem").width(jQueryCalculateWidthOnControl($("#txtEditItem")));
    });

    function jQueryCalculateWidthOnControl(Control_Object) {
        ControlWidth = Control_Object.val().length;
        return (ControlWidth * 9 + 25);
    }

    for (let counter = 0; counter < numberOfButtonsToInsertOnStartup; counter++)
    {
        AddNewButton();
    }
}