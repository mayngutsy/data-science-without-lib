const draw=require('../commons/draw.js');
const constants=require('../commons/constants.js');
const utils=require('../commons/utils.js');

const {createCanvas}=require('canvas');
const canvas=createCanvas(400,400);
const ctx=canvas.getContext('2d');

const fs=require('fs');

const fileName=fs.readdirSync(constants.RAW_DIR);
const samples=[];
let id=1;
let generate = false;
fileName.forEach(fn=>{
    const content=fs.readFileSync(
        constants.RAW_DIR+"/"+fn
    );
    //read data from the content
    const {session,student,drawings}=JSON.parse(content);

    //save samples of each labels
    for(let label in drawings){
        samples.push({
            id,
            label,
            student_name:student,
            student_id:session
        });

        const paths=drawings[label];

        fs.writeFileSync(constants.JSON_DIR+"/"+id+".json",
            JSON.stringify(paths));
        
        if(generate){
            generateImageFile(constants.IMG_DIR+"/"+id+ ".png",
            paths);
        }

        utils.printProgress(id,fileName.length*8);
        id++;
    }
})

fs.writeFileSync(constants.SAMPLES, 
    JSON.stringify(samples)
    );

fs.writeFileSync(constants.SAMPLES_JS, 
    "const samples=" + JSON.stringify(samples)+";"
    );

function generateImageFile(outFile, paths){
    ctx.clearRect(0,0,
        canvas.width,canvas.height
    );
    draw.paths(ctx,paths);

    const buffer=canvas.toBuffer("image/png");
    fs.writeFileSync(outFile,buffer);
}
   