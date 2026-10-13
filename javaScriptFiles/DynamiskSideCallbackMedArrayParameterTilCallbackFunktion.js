export function init_DynamiskSideCallbackMedArrayParameterTilCallbackFunktion(arrayParameter)
{
    let htmlComponent = document.getElementById("UdfyldtFraCallbackFunktion");
    htmlComponent.innerHTML = "Overført Array : ";
    let arraySum = 0;
    for (let counter = 0; counter < arrayParameter.length; counter++)
    {
        htmlComponent.innerHTML += arrayParameter[counter] + " ";
        arraySum += arrayParameter[counter];
    }
    htmlComponent.innerHTML += "<br />";
    htmlComponent.innerHTML += "Sum : " + arraySum;
}