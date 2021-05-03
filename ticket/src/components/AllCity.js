import React,{useMemo} from "react";

const AllCity = (props)=>{
    const {allCity,origSelCity,cityClickHandle}=props;
    const CityContentHtml=useMemo(()=>{
        if(!origSelCity){return null;}
        const {name:origSelCityName,code:origSelCityCode}=origSelCity;
        const allCityKeyValList=Object.entries(allCity);
        const html=allCityKeyValList.map((cityKeyValItem,cityKeyValInd)=>{
            const [key,list]=cityKeyValItem;
            return (
                <div className="cityTypeContainer" key={key}>
                    <div className="cityCap" id={`cityHash_${key}`}>{key}</div>
                    <div className="cityTypeContent">
                        {list.map(cityData=>{
                            const {name,code}=cityData;
                            return (
                                <div 
                                    className={`cityLineBlock ${origSelCityName===name&&origSelCityCode===code?"cityLineBlockSel":""}`} 
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
        });
        return html;
    },[allCity,origSelCity,cityClickHandle]);

    if(!allCity||!origSelCity){return null;}
    return (
        <div className="allCity commonCityContainer">
            <div className="commonCityTitle">站点列表</div>
            <div className="commonCityContent">
                {CityContentHtml}
            </div>
        </div>
    );
}

export default AllCity;