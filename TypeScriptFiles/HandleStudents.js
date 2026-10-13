/// reference path="./node_modules/@types(jquery/index.d.ts"
import $ from "jquery";
var WorkingMode;
(function (WorkingMode) {
    WorkingMode[WorkingMode["Saving"] = 0] = "Saving";
    WorkingMode[WorkingMode["Editing"] = 1] = "Editing";
})(WorkingMode || (WorkingMode = {}));
const EditStudentClassName = "EditStudent";
const DeleteStudentClassName = "DeleteStudent";
const MinNumberOfCharactersInName = 3;
const MinStudentAge = 15;
const MaxStudentAge = 70;
const HideClassCSSName = "DontShowControl";
const HideClassButtonValue = "Luk ned for TypeScript Function Overload Demo !!!";
const ShowClassButtonValue = "Luk op for TypeScript Function Overload Demo !!!";
var btnClearTextFields;
var btnAddNewStudent;
var studentTableId;
var txtStudentName;
var txtStudentAge;
var btnEditStudent;
var btnSkipEditStudent;
var StudentDataRows;
var TypeScriptDemo;
var NumberOfObjectsOnClass;
var btnTypeScriptFunctionOverloadDemo;
var TestFunctionOverload;
var txtStudentAdd1;
var txtStudentAdd2;
//var btnAddNewStudent: JQuery<HTMLElement>;
//var studentTableId: JQuery<HTMLElement>;
//var txtStudentName: JQuery<HTMLElement>;
//var txtStudentAge: JQuery<HTMLElement>;
//var StudentDataRows: JQuery<HTMLElement>;
//var TypeScriptDemo: JQuery<HTMLElement>;
//var StudentList = [];
var StudentList = [];
var StudentNameSave;
var StudentAgeSave;
var StudentIdSave;
var ThisSave;
class Student {
    get StudentID() {
        return this._studentId;
    }
    set StudentAge(StudentAge) {
        this._studentAge = StudentAge;
    }
    get StudentAge() {
        return (this._studentAge);
    }
    set StudentName(StudentName) {
        this._studentName = StudentName;
    }
    get StudentName() {
        return (this._studentName);
    }
    static set NumberOfObjectCreatedOnClass(NumberOfObjects) {
        Student._numberOfObjectCreatedOnClass = NumberOfObjects;
    }
    static get NumberOfObjectCreatedOnClass() {
        return (Student._numberOfObjectCreatedOnClass);
    }
    constructor(StudentAge, StudentName) {
        this._studentAge = StudentAge;
        this._studentName = StudentName;
        Student._numberOfObjectCreatedOnClass++;
        Student._nextStudentIdNumber++;
        this._studentId = Student._nextStudentIdNumber;
    }
    AddStudentStuff(Student1, Student2) {
        return (Student1 + Student2);
    }
    static AddStudentStuffStatic(Student1, Student2) {
        return (Student1 + Student2);
    }
    toString() {
        return ("Student med ID : " + this._studentId + " og navn : " + this._studentName + " er " + this._studentAge + " år gammmmel !!! ");
    }
}
Student._numberOfObjectCreatedOnClass = 0;
Student._nextStudentIdNumber = 0;
//function AddStudentStuff(StudentAge1: number, StudentAge2: number): number; 
//function AddStudentStuff(StudentAge1: number, StudentAge2: string): string;
//function AddStudentStuff(StudentAge1: string, StudentAge2: number): string;
//function AddStudentStuff(StudentName1: string, StudentName2: string): string; 
function AddStudentStuff(Student1, Student2) {
    return (Student1 + Student2);
}
function FindIndexInArray(StudentId) {
    var IndexInArray = 0;
    while (IndexInArray < StudentList.length) {
        if (StudentList[IndexInArray].StudentID == StudentId) {
            return (IndexInArray);
        }
        IndexInArray++;
    }
    return (-1);
}
function DeleteStudentObject(StudentId) {
    var IndexInArray;
    IndexInArray = FindIndexInArray(StudentId);
    if (IndexInArray >= 0) {
        StudentList.splice(IndexInArray, 1);
        Student.NumberOfObjectCreatedOnClass = --Student.NumberOfObjectCreatedOnClass;
    }
}
$(document).ready(function () {
    function SpecifyNumberOfObjectsOnClass() {
        $("#NumberOfObjectsOnClass").text("Antal objekter defineret på klasse er : " + Student.NumberOfObjectCreatedOnClass);
    }
    function SwichBetweenSaveAndEditMode(CurrentWorkingMode) {
        if (WorkingMode.Saving == CurrentWorkingMode) {
            btnSkipEditStudent.addClass("DontShowControl");
            btnEditStudent.addClass("DontShowControl");
            btnAddNewStudent.removeClass("DontShowControl");
        }
        else {
            btnSkipEditStudent.removeClass("DontShowControl");
            btnEditStudent.removeClass("DontShowControl");
            btnAddNewStudent.addClass("DontShowControl");
        }
    }
    function GetStoredValuesBack() {
        txtStudentName.val(StudentNameSave);
        txtStudentAge.val(StudentAgeSave);
    }
    function ModifyStudentObject(StudentId) {
        var IndexInArray;
        IndexInArray = FindIndexInArray(StudentId);
        if (IndexInArray >= 0) {
            StudentList[IndexInArray].StudentName = txtStudentName.val();
            StudentList[IndexInArray].StudentAge = txtStudentAge.val();
            return (StudentList[IndexInArray]);
        }
        else {
            return (null);
        }
    }
    function ClearTextFields() {
        txtStudentName.val("");
        txtStudentAge.val("");
    }
    function CheckTextFields() {
        var StudentAgeTest;
        if ($("#txtStudentName").val().length < MinNumberOfCharactersInName) {
            alert("Der skal minimum være " + MinNumberOfCharactersInName.toString() + " karakterer i Student navn !!!");
            return (false);
        }
        try {
            StudentAgeTest = parseInt($("#txtStudentAge").val());
        }
        catch (e) {
            alert(e.message);
            return (false);
        }
        if ((StudentAgeTest >= MinStudentAge) && (StudentAgeTest <= MaxStudentAge)) {
            return (true);
        }
        else {
            alert("Student alder skal ligge i intervallet " + MinStudentAge.toString() +
                " - " + MaxStudentAge.toString() + " !!!");
        }
        return (false);
    }
    $(document).on("click", ".ContentFrameForHTMLFiles #btnClearTextFields", function () {
        ClearTextFields();
    });
    $(document).on("click", ".ContentFrameForHTMLFiles #btnAddNewStudent", function () {
        btnClearTextFields = $("#btnClearTextFields");
        btnAddNewStudent = $("#btnAddNewStudent");
        studentTableId = $("#StudentData");
        txtStudentName = $("#txtStudentName");
        txtStudentAge = $("#txtStudentAge");
        btnEditStudent = $("#btnEditStudent");
        btnSkipEditStudent = $("#btnSkipEditStudent");
        StudentDataRows = $(".StudentDataRows");
        TypeScriptDemo = $("#TypeScriptDemo");
        NumberOfObjectsOnClass = $("#NumberOfObjectsOnClass");
        btnTypeScriptFunctionOverloadDemo = $("#btnTypeScriptFunctionOverloadDemo");
        TestFunctionOverload = $("#TestFunctionOverload");
        txtStudentAdd1 = $("#txtStudentAdd1");
        txtStudentAdd2 = $("#txtStudentAdd2");
        if (CheckTextFields()) {
            var WorkString;
            var Student_Object = new Student(txtStudentAge.val(), txtStudentName.val());
            StudentList.push(Student_Object);
            WorkString = "<tr class = 'Student'>";
            WorkString += "<td class = StudentId>";
            WorkString += Student_Object.StudentID;
            WorkString += "<td class = 'StudentName'>";
            WorkString += Student_Object.StudentName;
            WorkString += "<td class = 'StudentAge'>";
            WorkString += Student_Object.StudentAge;
            WorkString += "<td class = 'StudentDescription'>";
            WorkString += Student_Object.toString();
            WorkString += "<td>";
            WorkString += "<button type='button'";
            WorkString += "value='" + Student_Object.StudentID + "' ";
            WorkString += "class='" + EditStudentClassName + "'";
            WorkString += ">Ret Student (" + Student_Object.StudentID + ") </button>";
            WorkString += "<td>";
            WorkString += "<button type='button'";
            WorkString += "value='" + Student_Object.StudentID + "' ";
            WorkString += "class='" + DeleteStudentClassName + "'";
            WorkString += ">Slet Student (" + Student_Object.StudentID + ") </button>";
            WorkString += "</tr>";
            $(".StudentDataRows").append(WorkString);
            $("#TypeScriptDemo").html(StudentList.toString());
            SpecifyNumberOfObjectsOnClass();
            ClearTextFields();
        }
    });
    $('body').on('click', '.' + DeleteStudentClassName, function () {
        var StudentId = Number($(this).val());
        var CurrentRow = $(this).closest('tr');
        var CurrentRowCells = CurrentRow.children();
        var StudentName = CurrentRowCells.eq(1).text();
        if (confirm("Ønsker du slette den studerende " + StudentName + " ?")) {
            DeleteStudentObject(StudentId);
            CurrentRow.remove();
            TypeScriptDemo.html(StudentList.toString());
            SpecifyNumberOfObjectsOnClass();
        }
    });
    $('body').on('click', '.' + EditStudentClassName, function () {
        var StudentId = Number($(this).val());
        var CurrentRow = $(this).closest('tr');
        var CurrentRowCells = CurrentRow.children();
        var StudentName = CurrentRowCells.eq(1).text();
        var StudentAge = parseInt(CurrentRowCells.eq(2).text());
        StudentNameSave = txtStudentName.val();
        StudentAgeSave = txtStudentAge.val();
        StudentIdSave = StudentId;
        ThisSave = $(this);
        txtStudentName.val(StudentName);
        txtStudentAge.val(StudentAge);
        SwichBetweenSaveAndEditMode(WorkingMode.Editing);
    });
    $(document).on("click", ".ContentFrameForHTMLFiles #btnSkipEditStudent", function () {
        GetStoredValuesBack();
        SwichBetweenSaveAndEditMode(WorkingMode.Saving);
    });
    $(document).on("click", ".ContentFrameForHTMLFiles #btnEditStudent", function () {
        var Student_Object;
        var StudentId = Number(ThisSave.val());
        var CurrentRow = ThisSave.closest('tr');
        var CurrentRowCells = CurrentRow.children();
        CurrentRowCells.eq(1).text(txtStudentName.val());
        CurrentRowCells.eq(2).text(parseInt(txtStudentAge.val()));
        Student_Object = ModifyStudentObject(StudentId);
        if (null != Student_Object) {
            CurrentRowCells.eq(3).text(Student_Object.toString());
        }
        GetStoredValuesBack();
        SwichBetweenSaveAndEditMode(WorkingMode.Saving);
        TypeScriptDemo.html(StudentList.toString());
    });
    $(document).on("click", ".ContentFrameForHTMLFiles #btnTypeScriptFunctionOverloadDemo", function () {
        if (TestFunctionOverload.hasClass(HideClassCSSName)) {
            TestFunctionOverload.removeClass(HideClassCSSName);
            btnTypeScriptFunctionOverloadDemo.val(HideClassButtonValue);
        }
        else {
            TestFunctionOverload.addClass(HideClassCSSName);
            btnTypeScriptFunctionOverloadDemo.val(ShowClassButtonValue);
            txtStudentAdd1.val("");
            txtStudentAdd2.val("");
            $("#txtStudentsAdded").val("");
        }
    });
    function OnlyDigitsInString(InputString) {
        var Counter = 0;
        while (Counter < InputString.length) {
            if ((InputString[Counter] < '0') ||
                (InputString[Counter] > '9')) {
                return (false);
            }
            Counter++;
        }
        return (true);
    }
    $(document).on("click", ".ContentFrameForHTMLFiles #btnAddStudent", function () {
        var OnlyDigitsInString1;
        var OnlyDigitsInString2;
        if (txtStudentAdd1.val().length < 1) {
            alert("Første indtastningsfelt må ikke være tomt !!!");
        }
        else {
            if (txtStudentAdd2.val().length < 1) {
                alert("Andet indtastningsfelt må ikke være tomt !!!");
            }
            else {
                OnlyDigitsInString1 = OnlyDigitsInString(txtStudentAdd1.val());
                OnlyDigitsInString2 = OnlyDigitsInString(txtStudentAdd2.val());
                if (OnlyDigitsInString1 && OnlyDigitsInString2) {
                    $("#txtStudentsAdded").val(AddStudentStuff(parseInt(txtStudentAdd1.val()), parseInt(txtStudentAdd2.val())));
                }
                else {
                    $("#txtStudentsAdded").val(AddStudentStuff(txtStudentAdd1.val(), txtStudentAdd2.val()));
                }
            }
        }
    });
});
//# sourceMappingURL=HandleStudents.js.map