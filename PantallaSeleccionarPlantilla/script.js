   window.onload= function()
    {
      llenarPlantillas();


    }
    function llenarPlantillas()
    {

         const Plantillas = [
                { id: 1, title: "Cuestionario de Historia Argentina", img:"historiaArgentina.webp" },
                { id: 2, title: "Cuestionario Sobre Alicia en el pais de las maravillas", img:"Alicia.webp" },
                { id: 3, title: "Custionario sobre Geografia", img:"geografia.webp" }
            ];

            const container = document.getElementById("plantillas");

            
            for (let i of Plantillas) {
                const   div = document.createElement("div");
                div.classList.add("plantilla-item")

                const p = document.createElement("p");
                p.textContent = i.title;
                div.appendChild(p);

                const imagen = document.createElement("img");
                imagen.src = i.img;

                const btn = document.createElement("button");
                btn.textContent = "Usar esta plantilla";
                btn.id= "btn"
                btn.classList.add("btn");
                btn.classList.add("btn-naranja");
                btn.type = "button";

               
                btn.addEventListener("click", () => {
                    seleccionarPlantilla(i.id, i.title);
                });
                div.appendChild(imagen);
                div.appendChild(btn);
                container.appendChild(div);
            }
    }
     function seleccionarPlantilla(id, title) {
            
            alert("Elegiste la plantilla: " + title + " (ID: " + id + ")");
        }
   