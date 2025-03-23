const utils={};

utils.flaggedUsers=[1663053145814,1663855255706,1664521772545];

utils.styles={
    guiter:{color:'blue',text:'🎸'},
    pencile:{color:'magenta',text:'🥖'},
    clock:{color:'lightgray',text:'⏲'},
    car:{color:'gray',text:'🚓'},
    fish:{color:'red',text:'🐠'},
    house:{color:'yellow',text:'🏡'},
    tree:{color:'green',text:'🌳'},
    bicycle:{color:'cyan',text:'🚲'}
}

utils.styles["?"]={color:'red', text:'❓'}

utils.formatPercentage=(n)=>{
    return (n*100).toFixed(2)+"%";
}

utils.printProgress=(count,max)=>{
    process.stdout.clearLine();
    process.stdout.cursorTo(0);
    const percent=utils.formatPercentage(
        count/max
    );
    process.stdout.write(count+"/"+max+
        "("+percent+")"
    );
}

utils.groupBy=(objArray,key)=>{
    const groups={};
    for(let obj of objArray){
        const val=obj[key];
        if(groups[val]==null){
            groups[val]=[];
        }
        groups[val].push(obj);
    }
    return groups;
}

utils.distance=(p1,p2)=>{
    return Math.sqrt(
       (p1[0]-p2[0])**2+
       (p1[1]-p2[1])**2
    );
}

utils.getNearest=(loc,points,k=1)=>{
    const obj=points.map((val,ind)=>{
        return {ind,val};
    });
    const sorted=obj.sort((a,b)=>{
        return utils.distance(loc,a.val)-
                utils.distance(loc,b.val)
    })
    const indices=sorted.map((obj)=>obj.ind);
    return indices.slice(0,k);
} 
 
/* utils.getNearest=(loc,points)=>{
    let minDist=Number.MAX_SAFE_INTEGER;
    let nearestIndex=0;

    for(let i=0;i<points.length;i++){
        const points=points[i];
        const d=utils.distance(loc,points);

        if(d<minDist){
            minDist=d;
            nearestIndex=i;
        }
    }
    return nearestIndex;
 }
 */

 



// [["bike", 60], ["motorbike", 200], ["car", 300],
// ["helicopter", 400], ["airplane", 1000], ["rocket", 28800]]
 utils.invLerp=(a,b,v)=>{
    return (v-a)/(b-a);
 }

 utils.getMean=(points)=>{
    let x=0;
    let y=0;
    const pointsLength=points.length;
    for(let i=0;i<pointsLength;i++){
        x+=points[i][0];
        y+=points[i][1];
    }
    const meanX=(x/pointsLength);
    const meanY=(y/pointsLength);

    return {meanX,meanY,x,y};
 }

 utils.getStandardDeviation=(points)=>{
    let pointsX=0;
    let pointsY=0;
    const {meanX,meanY,x,y}=utils.getMean(points);
    for(let i=0;i<points.length;i++){
        pointsX+=(points[i][0]-meanX)**2;
        pointsY+=(points[i][1]-meanY)**2;
    }
    const stdX=Math.sqrt(pointsX/x);
    const stdY=Math.sqrt(pointsY/y);

    return {stdX,stdY};
 }

utils.standardize=(points)=>{
    const {meanX,meanY}=utils.getMean(points);
    const {stdX,stdY}=utils.getStandardDeviation(points)

    for(let i=0;i<points.length;i++){
        points[i][0]=points[i][0]-(meanX/stdX);
        points[i][1]=points[i][1]-(meanY/stdY);
    }
}


 utils.normalizePoints=(points,minMax)=>{
    let min, max;
    const dimensions=points[0].length;
    if(minMax){
        min=minMax.min;
        max=minMax.max;
    }else{
        min=[...points[0]];
        max=[...points[0]];
        for(let i=1;i<points.length;i++){
            for(let j=0;j<dimensions;j++){
                min[j]=Math.min(min[j],points[i][j]);
                max[j]=Math.max(max[j],points[i][j]);
            }
            
        }
    }

    for(let i=0;i<points.length;i++){
       for(let j=0;j<dimensions;j++){
         points[i][j]=utils.invLerp(min[j],max[j],points[i][j]);
        }
    }
    return {min,max};
 }

utils.toCSV=(headers,samples)=>{
    let str=headers.join(",")+ "\n";
    for(const sample of samples){
        str+=sample.join(",")+"\n";
    }
    return str;
}


if(typeof module!=='undefined'){
    module.exports=utils;
}
