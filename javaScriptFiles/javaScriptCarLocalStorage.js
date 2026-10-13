const LOCAL_STORAGE_KEY = "carArray";

export function init_javaScriptCarLocalStorage()
{
    let addCarBtn = document.getElementById("btnAddCar");
    let cancelBtn = document.getElementById("cancel-button");
    let htmlElement = document.getElementById("data-table-body");
    let clearTextFieldsBtn = document.getElementById("btnClearTextFields");

    let inputCarName = document.getElementById("txtCarName");
    let inputCarYear = document.getElementById("txtCarYear");
    let inputCarPrice = document.getElementById("txtCarPrice");
    let inputCarModel = document.getElementById("txtCarModel");

    let editCarBtn = document.createElement("input");
    editCarBtn.type = "button";
    editCarBtn.value = "Ret";
    editCarBtn.style.display = "none";
    addCarBtn.insertAdjacentElement("afterend", editCarBtn);

    let editingCarId = null;
    let carArray = getCarsFromLocalStorage();

    function getCarsFromLocalStorage() {
        let carsAsJson = localStorage.getItem(LOCAL_STORAGE_KEY);
        return carsAsJson ? JSON.parse(carsAsJson) : [];
    }

    function saveCarsInLocalStorage() {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(carArray));
    }

    function carAge(carYear) {
        let carAge = new Date().getFullYear() - carYear;
        return carAge;
    }

    function clearInputFields() {
        inputCarName.value = "";
        inputCarYear.value = "";
        inputCarPrice.value = "";
        inputCarModel.value = "";
    }

    function enterEditMode(objektParameter) {
        editingCarId = objektParameter.carId;
        inputCarName.value = objektParameter.carName;
        inputCarYear.value = objektParameter.carYear;
        inputCarPrice.value = objektParameter.carPrice;
        inputCarModel.value = objektParameter.carModel ?? "";

        addCarBtn.style.display = "none";
        editCarBtn.style.display = "";
        cancelBtn.style.display = "";
    }

    function validateInputFields() {
        if (inputCarName.value.trim() == "") {
            alert("Car Name can't be empty");
            return false;
        }
        if (inputCarYear.value.trim() == "") {
            alert("Car Year can't be empty");
            return false;
        }
        if (!(inputCarYear.value >= 1990 && inputCarYear.value <= 2026)) {
            alert("Car Year must be between 1990 and 2026");
            return false;
        }

        if (inputCarPrice.value.trim() == "") {
            alert("Car Price can't be empty");
            return false;
        }
        return true;
    }

    function exitEditMode() {
        editingCarId = null;
        clearInputFields();

        addCarBtn.style.display = "";
        editCarBtn.style.display = "none";
        cancelBtn.style.display = "none";
    }

    addCarBtn.addEventListener("click", () => {
        if (!validateInputFields()) {
            return;
        }

        let carId = carArray.length > 0 ? carArray[carArray.length - 1].carId + 1 : 1;
        let newCar = {
            carId: carId,
            carName: inputCarName.value,
            carYear: inputCarYear.value,
            carPrice: inputCarPrice.value,
            carModel: inputCarModel.value
        };

        carArray.push(newCar);
        saveCarsInLocalStorage();
        clearInputFields();
        renderTable();
    })

    editCarBtn.addEventListener("click", () => {
        if (!validateInputFields()) {
            return;
        }

        let car = carArray.find(car => car.carId === editingCarId);
        car.carName = inputCarName.value;
        car.carYear = inputCarYear.value;
        car.carPrice = inputCarPrice.value;
        car.carModel = inputCarModel.value;

        saveCarsInLocalStorage();
        exitEditMode();
        renderTable();
    })

    cancelBtn.addEventListener("click", () => {
        exitEditMode();
    })

    clearTextFieldsBtn.addEventListener("click", () => {
        clearInputFields();
    })

    function renderTable() {
        htmlElement.innerHTML = "";

        carArray.forEach(objektParameter => {
            let render = `
                <td>${objektParameter.carId}</td>
                <td>${objektParameter.carName}</td>
                <td>${objektParameter.carYear}</td>
                <td>${carAge(objektParameter.carYear)}</td>
                <td>${objektParameter.carPrice}</td>
                <td>${objektParameter.carModel ?? ""}</td>
                <td>
                    <button class="delete-btn">Slet</button>
                    <button class="edit-btn">Ret</button>
                </td>
            `;
            let row = document.createElement("tr");
            row.innerHTML = render;
            htmlElement.appendChild(row);

            row.querySelector(".delete-btn").addEventListener("click", () => {
                htmlElement.removeChild(row);
                carArray = carArray.filter(car => car.carId !== objektParameter.carId);
                saveCarsInLocalStorage();

                if (editingCarId === objektParameter.carId) {
                    exitEditMode();
                }
            });

            row.querySelector(".edit-btn").addEventListener("click", () => {
                enterEditMode(objektParameter);
            })
        })
    }

    renderTable();
}
