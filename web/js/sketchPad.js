class SketchPad{
    constructor(container, onUpdate=null, size=400){
        this.canvas = document.createElement("canvas");
        this.canvas.width = size;
        this.canvas.height = size;
        this.canvas.style = `
            background-color:white;
            box-shadow: 0px 0px 10px 2px red;
        `;
        
        container.appendChild(this.canvas);

        const lineBreaker=document.createElement("br");
        container.appendChild(lineBreaker);

        this.undoBtn=document.createElement("button");
        this.undoBtn.innerHTML="UNDO";
        container.appendChild(this.undoBtn);


        // to draw on this canvas we need to get canvas context
        this.ctx = this.canvas.getContext("2d");

        this.onUpdate = onUpdate;

        this.reset();
        this.#addEventListeners();
    }

    reset(){
        this.paths=[];
        this.isDrawing=false;
        this.#reDraw();
    }

    #addEventListeners(){
        this.canvas.onmousedown=(evt)=>{
            const mouse=this.#getMouse(evt);
            this.paths.push([mouse]);
            this.isDrawing=true;
        }

        this.canvas.onmousemove=(evt)=>{
            if(this.isDrawing){
                const mouse=this.#getMouse(evt);
                const lastPath=this.paths[this.paths.length-1];
                lastPath.push(mouse);
                this.#reDraw();
            }
            
        }

        //setting the event onthe document for mouseup prevent drawing extrapolation
        document.onmouseup=()=>{
            this.isDrawing=false;
        }

        //Customizing for touch Devices
        this.canvas.ontouchstart=(evt)=>{
            const loc=evt.touches[0];
            this.canvas.onmousedown(loc);
        }

        this.canvas.ontouchmove=(evt)=>{
            const loc=evt.touches[0];
            this.canvas.onmousemove(loc);
        }
        //setting the event onthe document for mouseseend prevent drawing extrapolation
        document.ontouchend=()=>{
            this.canvas.onmouseup();
        }

        this.undoBtn.onclick=()=>{
            this.paths.pop();
            this.#reDraw();
        }

    }

    

    #reDraw(){
        this.ctx.clearRect(0,0, 
            this.canvas.width,this.canvas.height);
        //implement draw utility obj. this object has fxn called path
        draw.paths(this.ctx,this.paths);
        if(this.paths.length>0){
            this.undoBtn.disabled=false;
        }else{
            this.undoBtn.disabled=true;
        }

        this.triggerUpdate();
        
    }

    triggerUpdate(){
        if(this.onUpdate){
            this.onUpdate(this.paths)
        }
    }


    #getMouse=(evt)=>{
        const rect=this.canvas.getBoundingClientRect();
        return [
            Math.round(evt.clientX-rect.left),
            Math.round(evt.clientY-rect.top)
        ];
    }
}