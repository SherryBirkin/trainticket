import {useMemo} from "react";

const CitySearchRes = props=>{
    const {allCity,searchVal,show,cityClickHandle,searchHash}=props;
    // const cityList=useMemo(
    //     ()=>[].concat(...Object.values(allCity)
    // ),[allCity]);
    // const cityResList=useMemo(
    //     ()=>cityList.filter(cityName=>cityName.includes(searchVal)
    // ,[cityList,searchVal]);
    const cityResList=useMemo(()=>{
        if(!searchHash){return [];}
        const searchArr=Object.keys(searchHash);
        const matchedSearchArr=searchArr.filter(search=>search.includes(searchVal));
        return matchedSearchArr.map(matchedSearch=>searchHash[matchedSearch]);
    },[searchVal,searchHash]);
    
    if(!allCity || !searchVal || !searchHash){return null};
    return (
        <div className="citySearchRes" style={{display:show?"block":"none"}}>
        {
            cityResList.length>0?
            cityResList.map(cityResData=>{
                const {name,code}=cityResData;
                return (
                    <div 
                        className="searchResItem" 
                        key={code}
                        onClick={()=>cityClickHandle(code)}
                    >
                        {name}
                    </div>
                )
            })
            :<div className="noCityRes">找不到相关地名</div>
        }
        </div>
    );
}

export default CitySearchRes;