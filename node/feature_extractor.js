const constants=require('../commons/constants.js');
const featuresFunctions=require('../commons/featureFunctions.js');
const utils=require('../commons/utils.js');

const fs=require('fs');

console.log("EXTRACTING FEATURES...");

const samples=JSON.parse(
    fs.readFileSync(constants.SAMPLES)
);

for(const sample of samples){
    const paths=JSON.parse(
        fs.readFileSync(
            constants.JSON_DIR+"/"+sample.id+".json"
        )
    );

    const functions=featuresFunctions.inUse.map(f=>f.function(paths))
    sample.point= functions;
    
}

console.log("GENERATING SPLITS");

const trainingAmount=samples.length*0.5;

const training=[];
const testing =[];

for(let i=0;i<samples.length;i++){
    if(i<trainingAmount){
        training.push(samples[i]);
    }else{
        testing.push(samples[i]);
    }
}

//Normalize only the training data
const minMax=utils.normalizePoints(training.map(s=>s.point));

//Normalize testing with minMax from training normalization
utils.normalizePoints(testing.map(s=>s.point),minMax);

const featureNames=featuresFunctions.inUse.map(f=>f.name);

fs.writeFileSync(
    constants.features,
    JSON.stringify({
        featureNames,
        samples:samples.map(s=>{
           return{
            point:s.point,
            label:s.label
           }
        })
    })
)

fs.writeFileSync(constants.FEATURES_JS,
    `const features=
    ${JSON.stringify({featureNames,samples})}
    ;`
);

fs.writeFileSync(
    constants.TRAINING,
    JSON.stringify({
        featureNames,
        samples:training.map(s=>{
           return{
            point:s.point,
            label:s.label
           }
        })
    })
)

fs.writeFileSync(constants.TRAINING_CSV,
    utils.toCSV([...featureNames,"Label"],
        training.map(a=>[...a.point, a.label])
    )
);
fs.writeFileSync(constants.TRAINING_JS,
    `const training=
    ${JSON.stringify({featureNames,samples:training})}
    ;`
);

fs.writeFileSync(
    constants.TESTING,
    JSON.stringify({
        featureNames,
        samples:testing.map(s=>{
           return{
            point:s.point,
            label:s.label
           }
        })
    })
)

fs.writeFileSync(constants.TESTING_CSV,
    utils.toCSV([...featureNames,"Label"],
        testing.map(a=>[...a.point, a.label])
    )
);
fs.writeFileSync(constants.TESTING_JS,
    `const testing=
    ${JSON.stringify({featureNames,samples:testing})}
    ;`
);

fs.writeFileSync(constants.MIN_MAX_JS,
    `const minMax=
    ${JSON.stringify(minMax)}
    ;`
    
)

console.log("Done!");
 
