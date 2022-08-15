//RELLENAR LA TABLA DE IMAGENES ALEATORIAS
function rellenarCards(){
    let repetidos=[];
    let num=0;
    let repetir;
    $(".back").hide("fast",()=>{
        $(".front").show("fast")
    });

    for(let i=0;i<cards.length;i++){
        num=0;
        do{
            repetir=false;
            num=Math.floor(Math.random()*(8-0)+0);
            repetidos.sort();

            if(repetidos.length>0)
                if(repetidos[repetidos.indexOf(num)]==repetidos[repetidos.indexOf(num)+1])
                    repetir=true;
                else{
                    repetir=false;
                    repetidos.push(num);
                }
            else repetidos.push(num);

        }while(repetir)
        cards[i].attr({
            "src":src[num]
        });
    }
}
//ANIMACION DEL MENSAJE
function mensaje(texto){
    $("#mensaje").text(texto);
    $("#mensaje").animate({
        opacity:"1",
        top:"50px"
    },1500).animate({
            opacity:0,
            top:"100px"
        },2000,function(){
            $("#mensaje").css("top",0)
        })
}
//MENSAJES EN MODAL
function modal(titulo,mensaje,imagen){
    if(imagen=="ganar")
        imagen="./img/ganar.jpg";
    else
        if(imagen=="derrota")
            imagen="./img/derrota.jpg";
        else
            imagen="./img/bienvenida.webp";
    
    $(".modal-content").css({
        "background-image":`url(${imagen}), linear-gradient(to right,rgb(114, 114, 114),rgb(155, 155, 155))`,
        "background-position":"center",
        "background-size":"cover",
        "background-blend-mode":"darken"
    })
    $(".modal-header").html(`<h3>${titulo}</h3>`);
    $(".modal-body").html(`<h3>${mensaje}</h3>`);
    $("#btnModal").trigger( "click" );
}
//TIEMPO DE JUEGO
let inicio=0,ahora=0,timer=0;

function empezarTiempo(){
    if(inicio==0){
        let h=0,m=0,s=0,cont=0;
        inicio=new Date().getTime();
        timer=setInterval(function(){
            ahora=new Date().getTime();
            s=((ahora-inicio)/1000).toFixed(0);
            if((s-(60*cont))==60){
                m++;
                cont++;
            }
            if(m==60){
                h++;
                m=0;
            }

            if(h==0 && m==0)
                $("#tiempo").text(`${s-(60*cont)}s`)
            else 
                if(h==0 && m>0)
                    $("#tiempo").text(`${m}m:${s-(60*cont)}s`)
                else 
                    $("#tiempo").text(`${h}h:${m}m:${s-(60*cont)}s`)
        },1000);
    }
}
//DETENER EL TIEMPO TRANSCURRIDO
function detenerTiempo(){
        let aux=((ahora-inicio)/1000).toFixed(0);
        clearInterval(timer);
        inicio=0;
        return aux;
}
//OBTENER EL TIEMPO DEL LOCALSTORAGE PARA MOSTRARLO
function mostrarTiempo(tiempo){
    let h=0,m=0,s=0;
    if(tiempo==undefined || tiempo == 0)
        return "No registrado aún."
    else{
        tiempo=parseInt(tiempo);
        h=Math.floor((tiempo/3600)).toFixed(0);
        if(h==0){
            m=(Math.floor((tiempo/60))).toFixed(0);
            if(m==0)
                s=tiempo;
            else
                s=tiempo-(m*60)
        }else{
            m=Math.floor(((tiempo-(h*3600))/60)).toFixed(0);
            s=tiempo-(m*60);
        }
        return `${h}h:${m}m:${s}s`
    }
}
//INICIALIZANDO ARREGLOS
let src=['./img/img1.jpg','./img/img2.jpg','./img/img3.jpg','./img/img4.jpg','./img/img5.jpg','./img/img6.jpg','./img/img7.jpg','./img/img8.jpg'];
let cards=[$("#back1"),$("#back2"),$("#back3"),$("#back4"),$("#back5"),$("#back6"),$("#back7"),$("#back8"),$("#back9"),$("#back10"),$("#back11"),$("#back12"),$("#back13"),$("#back14"),$("#back15"),$("#back16"),];

//LOAD DE LA PAGINA
$(document).ready(function(){
    $("#mensaje").css("opacity",0);
    $("#aciertos").text("0")
    $("#botones-modal").hide();
    rellenarCards();
    modal("¡BIENVENIDO A STAR WARS MEMORY!","Darth Vader te ha desafiado a un duelo, si no lo detenemos aquí, destruirá la tierra con la estrella de la muerte, ¡ERES NUESTRA ÚLTIMA ESPERANZA!")
    if(localStorage.getItem("tiempo1")!=null){
        $("#mejorTiempo").text(mostrarTiempo(localStorage.getItem("tiempo1")))
    }
    $("#click").text("CLICKEA PARA EMPEZAR")
    $("#click").animate({
        opacity:"1",
        top:"40px"
    },2000);

    //ACTIVANDO EL SONIDO DE RESPIRACION
    let volver=true;
$(document).click(()=>{

        if(volver){
            respiracion.volume=20/100;
            respiracion.play();
            respiracion.loop=true;
            volver=false;
        }
});

    let srcPrevio=0,frontPrevio=0,frontActual=0,aciertos=0;
    let respiracion=new Audio("./sounds/respiracion.mp3");
    let marcha=new Audio("./sounds/imperialMarch.mp3");
    let onda=new Audio("./sounds/onda.mp3");
    let error=new Audio("./sounds/error.mp3");
    let acertado=new Audio("./sounds/acierto.mp3")
    let victoria=new Audio("./sounds/victoria.mp3")
    //CLICK A LA CARTA
    $(".front").click(function(event){

        //REPRODUCIENDO LOS SONIDOS
        marcha.volume=50/100     
        marcha.play();
        marcha.loop=true;

        empezarTiempo();
        $("#click").animate({
            opacity:"0",
            top:"100px"
        },2000);

        if($("#mensaje").css("opacity")==0){
            if($(event.target).attr("id")!=frontPrevio){
                if($(event.target).attr("id")!=frontActual){
                    onda.play()
                    onda.currentTime = 0;
                    if(frontPrevio==0){
                        frontPrevio=$(event.target).attr("id");
                    }
                    else{
                        frontActual=$(event.target).attr("id");
                    }
                    $(this).fadeOut("fast",function(){
                        $("#"+$(this.nextElementSibling).attr("id")).show("fast",function(){
                            if(srcPrevio==0){
                                srcPrevio=$(this).attr("src");
                                idBackPrevio=$(this).attr("id");
                            }else{
                                if(srcPrevio==$(this).attr("src")){
                                    srcPrevio=0;
                                    let interval,cont=0,actual;
                                    actual=$(this).attr("id")
                                    interval=setInterval(function(){
                                        if(cont%2==0){
                                            $("#"+actual).css({"box-shadow":"0px 0px 10px 5px rgb(57, 255, 83)"})
                                            $("#"+idBackPrevio).css({"box-shadow":"0px 0px 10px 5px rgb(57, 255, 83)"})
                                        }else{
                                            $("#"+actual).css({"box-shadow":"0px 0px 10px 5px rgb(83, 206, 255)"})                                           
                                            $("#"+idBackPrevio).css({"box-shadow":"0px 0px 10px 5px rgb(83, 206, 255)"})
                                        }
                                        cont++
                                        if(cont==6)
                                            clearInterval(interval)
                                    },300)
                                    acertado.play();
                                    acertado.currentTime=0;
                                    mensaje("¡ACERTASTE!")
                                    frontPrevio=0;
                                    frontActual=0;
                                    aciertos+=1;
                                    $("#aciertos").text(aciertos)
                                    if(aciertos==8){
                                        respiracion.pause();
                                        marcha.pause();
                                        victoria.play()
                                        $("#botones-modal").show();
                                        modal("¡FELICIDADES DERROTASTE A DARTH VADER!","¡Has derrotado a Darth Vader en su propio juego!, gracias a esto, has salvado a la tierra y pronto la estrella de la muerte ¡SERÁ DESTRUIDA!","ganar")
                                        if(localStorage.getItem("tiempo1")==null){
                                            localStorage.setItem("tiempo1",detenerTiempo());
                                            $("#mejorTiempo").text(mostrarTiempo(localStorage.getItem("tiempo1")));
                                        }else{
                                            let nuevo = parseInt(detenerTiempo());
                                            let viejo = parseInt(localStorage.getItem("tiempo1"));
                                            if(nuevo<viejo){
                                                localStorage.setItem("tiempo1",nuevo)
                                                $(".modal-body").append("<h3 id='nuevaMarca'>¡BATISTE UNA NUEVA MARCA PERSONAL!</h3> <style>#nuevaMarca{color:red;}</style>")
                                                $("#mejorTiempo").text(mostrarTiempo(localStorage.getItem("tiempo1")));
                                            }
                                        }
                                    }
                                }else{
                                    srcPrevio=0;
                                    let interval,cont=0,actual;
                                    actual=$(this).attr("id")
                                    interval=setInterval(function(){
                                        if(cont%2==0){
                                            $("#"+actual).css({"box-shadow":"0px 0px 10px 5px red"})
                                            $("#"+idBackPrevio).css({"box-shadow":"0px 0px 10px 5px red"})
                                        }else{
                                            $("#"+actual).css({"box-shadow":"0px 0px 10px 5px rgb(83, 206, 255)"})                                           
                                            $("#"+idBackPrevio).css({"box-shadow":"0px 0px 10px 5px rgb(83, 206, 255)"})
                                        }
                                        cont++
                                        if(cont==6)
                                            clearInterval(interval)
                                    },300)
                                    mensaje("¡FALLASTE!")
                                    error.play();
                                    error.volume=40/100
                                    error.currentTime=0;
                                    setTimeout(()=>{
                                        $(this).hide("fast",function(){
                                            $("#"+frontActual).show("fast");
                                        });
                                        $("#"+idBackPrevio).hide("fast",function(){
                                            $("#"+frontPrevio).show("fast",function(){
                                                frontPrevio=0;
                                                frontActual=0;
                                            });
                                            
                                        });
                                    },3000);
                                }
                            }
                        })
                    })
                }
            }
        }
    });

    //VOLVER A JUGAR
    $(".replay").click(function(){
        marcha.pause();
        marcha.src="./sounds/imperialMarch.mp3";
        respiracion.volume=20/100;
        respiracion.play();
        respiracion.loop=true;

        rellenarCards();
        detenerTiempo();
        aciertos=0;
        srcPrevio=0;
        frontPrevio=0;
        frontActual=0;
        $("#aciertos").text("0");
        $("#tiempo").text("0s");
    });
});