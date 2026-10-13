export function init_DynamiskSideCallbackMedObjektParameterTilCallbackFunktion(objektParameter)
{
    console.log(objektParameter);
    let htmlComponent = document.getElementById("UdfyldtFraCallbackFunktion");
    htmlComponent.innerHTML = "Overført Objekt : ";
    htmlComponent.innerHTML += "Car Id : " + objektParameter.carId + " ";
    htmlComponent.innerHTML += "Car Name : " + objektParameter.carName + " ";
    htmlComponent.innerHTML += "Car Price : " + objektParameter.carPrice + " ";
    htmlComponent.innerHTML += "Car Year : " + objektParameter.carYear + " ";
}