import React from "react";

const HotCity = (props)=>{
    const {hotCityList,cityClickHandle,origSelCity}=props;

    if(hotCityList.length===0||!origSelCity){return null;}
    const {name:origSelCityName,code:origSelCityCode}=origSelCity;
    return (
        <div className="hotCity commonCityContainer">
            <div className="commonCityTitle" id="cityHash_hot">热门城市</div>
            <div className="commonCityContent">
                {hotCityList.map((hotCityItem,hotCityInd)=>{
                    const {name,code}=hotCityItem;
                    return (
                        <div 
                            className={`commonCityBlock ${origSelCityName===name&&origSelCityCode===code?"commonCityBlockSel":""}`}
                            key={code}
                            onClick={()=>cityClickHandle(code)}
                        >
                            {name}
                        </div>
                    )
                })}
            </div>
        </div>
    );
}

export default HotCity;