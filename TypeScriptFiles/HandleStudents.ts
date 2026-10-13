import '../javaScriptFiles/Shared.js';

const WorkingMode = {
    Saving: "Saving",
    Editing: "Editing",
} as const;

const EditStudentClassName: string = "EditStudent";
const DeleteStudentClassName: string = "DeleteStudent";
const MinNumberOfCharactersInName: number = 3;
const MinStudentAge: number = 15;
const MaxStudentAge: number = 70;

const HideClassCSSName: string = "DontShowControl";
const HideClassButtonValue: string = "Luk ned for TypeScript Function Overload Demo !!!";
const ShowClassButtonValue: string = "Luk op for TypeScript Function Overload Demo !!!";

let btnClearTextFields: JQuery<HTMLElement>;
let btnAddNewStudent: JQuery<HTMLElement>;
let studentTableId: JQuery<HTMLElement>;
let txtStudentName: JQuery<HTMLElement>;
let txtStudentAge: JQuery<HTMLElement>;
let btnEditStudent: JQuery<HTMLElement>;
let btnSkipEditStudent: JQuery<HTMLElement>;
let StudentDataRows: JQuery<HTMLElement>;
let TypeScriptDemo: JQuery<HTMLElement>;
let NumberOfObjectsOnClass: JQuery<HTMLElement>;
let btnTypeScriptFunctionOverloadDemo: JQuery<HTMLElement>;
let TestFunctionOverload: JQuery<HTMLElement>;
let txtStudentAdd1: JQuery<HTMLElement>;
let txtStudentAdd2: JQuery<HTMLElement>;

let StudentList: Student[] = [];

let StudentNameSave: string;
let StudentAgeSave: number;
let StudentIdSave: number;
let ThisSave: JQuery<HTMLElement>;

class Student {
    private _studentId: number;
    private _studentName: string;
    private _studentAge: number;

    private static _numberOfObjectCreatedOnClass: number = 0;
    private static _nextStudentIdNumber: number = 0;

    get StudentID(): number {
        return this._studentId;
    }

    set StudentAge(StudentAge: number) {
        this._studentAge = StudentAge;
    }

    get StudentAge(): number {
        return (this._studentAge);
    }

    set StudentName(StudentName: string) {
        this._studentName = StudentName;
    }

    get StudentName(): string {
        return (this._studentName);
    }

    static set NumberOfObjectCreatedOnClass(NumberOfObjects: number) {
        Student._numberOfObjectCreatedOnClass = NumberOfObjects;
    }

    static get NumberOfObjectCreatedOnClass(): number {
        return (Student._numberOfObjectCreatedOnClass);
    }

    constructor(StudentAge: number, StudentName: string) {
        this._studentAge = StudentAge;
        this._studentName = StudentName;
        Student._numberOfObjectCreatedOnClass++;
        Student._nextStudentIdNumber++;
        this._studentId = Student._nextStudentIdNumber;
    }

    public AddStudentStuff(Student1: any, Student2: any): any {
        return (Student1 + Student2);
    }

    public static AddStudentStuffStatic(Student1: any, Student2: any): any {
        return (Student1 + Student2);
    }

    public toString(): string {
        return ("Student med ID : " + this._studentId + " og navn : " + this._studentName + " er " + this._studentAge + " år gammmmel !!! ");
    }
}

function AddStudentStuff(Student1: any, Student2: any): any {
    return (Student1 + Student2);
}

function FindIndexInArray(StudentId: number): number {
    let IndexInArray: number = 0;

    while (IndexInArray < StudentList.length) {
        if (StudentList[IndexInArray].StudentID === StudentId) {
            return (IndexInArray);
        }
        IndexInArray++;
    }
    return (-1);
}

function DeleteStudentObject(StudentId: number) {
    const IndexInArray: number = FindIndexInArray(StudentId);

    if (IndexInArray >= 0) {
        StudentList.splice(IndexInArray, 1);
        Student.NumberOfObjectCreatedOnClass = --Student.NumberOfObjectCreatedOnClass;
    }
}

export function init_HandleStudents(): void {
    function SpecifyNumberOfObjectsOnClass(): void {
        $("#NumberOfObjectsOnClass").text(`Antal objekter defineret på klasse er : ${Student.NumberOfObjectCreatedOnClass}`);
    }

    function SwichBetweenSaveAndEditMode(CurrentWorkingMode: typeof WorkingMode.Saving | typeof WorkingMode.Editing): void {
        if (WorkingMode.Saving === CurrentWorkingMode) {
            btnSkipEditStudent.addClass(HideClassCSSName);
            btnEditStudent.addClass(HideClassCSSName);
            btnAddNewStudent.removeClass(HideClassCSSName);
        }
        else {
            btnSkipEditStudent.removeClass(HideClassCSSName);
            btnEditStudent.removeClass(HideClassCSSName);
            btnAddNewStudent.addClass(HideClassCSSName);
        }
    }

    function GetStoredValuesBack(): void {
        txtStudentName.val(StudentNameSave);
        txtStudentAge.val(StudentAgeSave);
    }

    function ModifyStudentObject(StudentId: number): Student | undefined {
        const IndexInArray: number = FindIndexInArray(StudentId);

        if (IndexInArray >= 0) {
            StudentList[IndexInArray].StudentName = txtStudentName.val() as string;
            StudentList[IndexInArray].StudentAge = parseInt(txtStudentAge.val() as string);
            return (StudentList[IndexInArray]);
        }
        else {
            return undefined;
        }
    }

    function ClearTextFields(): void {
        txtStudentName.val("");
        txtStudentAge.val("");
    }

    function CheckTextFields(): boolean {
        const studentNameValue = txtStudentName.val() as string;
        const studentAgeValue = txtStudentAge.val() as string;

        if (studentNameValue.length < MinNumberOfCharactersInName) {
            alert(`Der skal minimum være ${MinNumberOfCharactersInName} karakterer i Student navn !!!`);
            return false;
        }

        const studentAgeTest = parseInt(studentAgeValue);

        if (isNaN(studentAgeTest)) {
            alert("Student alder skal være et tal !!!");
            return false;
        }

        if (studentAgeTest < MinStudentAge || studentAgeTest > MaxStudentAge) {
            alert(`Student alder skal ligge i intervallet ${MinStudentAge} - ${MaxStudentAge} !!!`);
            return false;
        }

        return true;
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
            const studentObject: Student = new Student(parseInt(txtStudentAge.val() as string), txtStudentName.val() as string);
            StudentList.push(studentObject);

            let workString: string = "<tr class = 'Student'>";
            workString += "<td class = StudentId>";
            workString += studentObject.StudentID;
            workString += "<td class = 'StudentName'>";
            workString += studentObject.StudentName;
            workString += "<td class = 'StudentAge'>";
            workString += studentObject.StudentAge;
            workString += "<td class = 'StudentDescription'>"
            workString += studentObject.toString();
            workString += "<td>"
            workString += `<button type='button' value='${studentObject.StudentID}' class='${EditStudentClassName}'>Ret Student (${studentObject.StudentID}) </button>`;
            workString += "<td>";
            workString += `<button type='button' value='${studentObject.StudentID}' class='${DeleteStudentClassName}'>Slet Student (${studentObject.StudentID}) </button>`;
            workString += "</tr>";
            $(".StudentDataRows").append(workString);

            $("#TypeScriptDemo").html(StudentList.toString());
            SpecifyNumberOfObjectsOnClass();
            ClearTextFields();
        }
    });

    $('body').on('click', '.' + DeleteStudentClassName, function (this: HTMLElement) {
        const studentId: number = Number($(this).val());
        const currentRow = $(this).closest('tr');
        const currentRowCells = currentRow.children();
        const studentName = currentRowCells.eq(1).text();

        if (confirm(`Ønsker du slette den studerende ${studentName} ?`)) {
            DeleteStudentObject(studentId);
            currentRow.remove();
            TypeScriptDemo.html(StudentList.toString());
            SpecifyNumberOfObjectsOnClass();
        }
    });

    $('body').on('click', '.' + EditStudentClassName, function (this: HTMLElement) {
        const studentId: number = Number($(this).val());
        const currentRow = $(this).closest('tr');
        const currentRowCells = currentRow.children();
        const studentName: string = currentRowCells.eq(1).text();
        const studentAge: number = parseInt(currentRowCells.eq(2).text());

        StudentNameSave = txtStudentName.val() as string;
        StudentAgeSave = parseInt(txtStudentAge.val() as string);
        StudentIdSave = studentId;
        ThisSave = $(this);

        txtStudentName.val(studentName);
        txtStudentAge.val(studentAge);

        SwichBetweenSaveAndEditMode(WorkingMode.Editing);
    });

    $(document).on("click", ".ContentFrameForHTMLFiles #btnSkipEditStudent", function () {
        GetStoredValuesBack();
        SwichBetweenSaveAndEditMode(WorkingMode.Saving);
    });

    $(document).on("click", ".ContentFrameForHTMLFiles #btnEditStudent", function () {
        const studentObject: Student | undefined = ModifyStudentObject(StudentIdSave);
        if (studentObject) {
            const currentRow = ThisSave.closest('tr');
            const currentRowCells = currentRow.children();
            currentRowCells.eq(1).text(txtStudentName.val() as string);
            currentRowCells.eq(2).text(parseInt(txtStudentAge.val() as string));
            currentRowCells.eq(3).text(studentObject.toString());
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

    function OnlyDigitsInString(InputString: string): boolean {
        let Counter: number = 0;

        while (Counter < InputString.length) {
            const charCode = InputString.charCodeAt(Counter);
            if (charCode < 48 || charCode > 57) { // 48 er '0', 57 er '9'
                return false;
            }
            Counter++;
        }
        return true;
    }

    $(document).on("click", ".ContentFrameForHTMLFiles #btnAddStudent", function () {
        const studentAdd1Value = txtStudentAdd1.val() as string;
        const studentAdd2Value = txtStudentAdd2.val() as string;

        if (studentAdd1Value.length < 1) {
            alert("Første indtastningsfelt må ikke være tomt !!!");
            return;
        }

        if (studentAdd2Value.length < 1) {
            alert("Andet indtastningsfelt må ikke være tomt !!!");
            return;
        }

        const OnlyDigitsInString1 = OnlyDigitsInString(studentAdd1Value);
        const OnlyDigitsInString2 = OnlyDigitsInString(studentAdd2Value);

        if (OnlyDigitsInString1 && OnlyDigitsInString2) {
            $("#txtStudentsAdded").val(AddStudentStuff(parseInt(studentAdd1Value), parseInt(studentAdd2Value)));
        } else {
            $("#txtStudentsAdded").val(AddStudentStuff(studentAdd1Value, studentAdd2Value));
        }
    });
}