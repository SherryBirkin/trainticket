const HisCity = (props)=>{
    const {hisCityList,cityClickHandle,origSelCity}=props;

    if(hisCityList.length===0||!origSelCity){return null;}

    const {name:origSelCityName,code:origSelCityCode}=origSelCity;
    const showHisCityList=hisCityList.slice(0,6);   //最多显示6个历史选择
    return (
        <div className="hisCity commonCityContainer">
            <div className="commonCityTitle" id="cityHash_his">历史选择</div>
            <div className="commonCityContent">
                {showHisCityList.map((hisCityItem,hisCityInd)=>{
                    if(!hisCityItem)return null;
                    const {name,code}=hisCityItem;
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
};

export default HisCity;