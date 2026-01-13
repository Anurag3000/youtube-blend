const calculateJaccardSimilarity = (arr1=[], arr2=[])=>{
    const set1= new Set(arr1);
    const set2= new Set(arr2);

    const intersection =[...set1].filter(item=>set2.has(item));
    const union = new Set([...set1, ...set2]);

    if(union.size===0) return 0;

    return (intersection.length/union.size)*100;
};

const calculateWeightedJaccard= (arr1, arr2)=>{
    const map1={};
    const map2={};

    arr1.forEach(item => {
        map1[item.name]=item.count;
    });

    arr2.forEach(item=>{
        map2[item.name]= item.count;
    });

    const allKeys=new Set([
        ...Object.keys(map1),
        ...Object.keys(map2)
    ]);

    let intersectionSum=0;
    let unionSum=0;

    allKeys.forEach(key=>{
        const c1=map1[key]||0;
        const c2=map2[key]||0;

        intersectionSum+=Math.min(c1, c2);
        unionSum+=Math.max(c1,c2);
    });

    if(unionSum===0) return 0;
    return (intersectionSum/unionSum)*100;
}

module.exports={
    calculateJaccardSimilarity,
    calculateWeightedJaccard
};