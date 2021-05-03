import {useState} from "react";
import {seatTypeArr} from "_jsPath/constants";
import TrainSeatChangeView from "./TrainSeatChangeView";

const TrainBlock=props=>{   //一个列车信息块
    const [seatInfoViewable,setSeatInfoViewable]=useState(false);
    const {trainData}=props;
    const {
        from_station_name:fromName,
        to_station_name:toName,
        start_time:startTime,
        arrive_time:arriveTime,
        lishi:spendTime,
        day_difference:dayDiff,
        station_train_code:trainCode,
        swz_num,swz_price,tz_num,tz_price,zy_num,zy_price,ze_num,ze_price,gr_num,gr_price,
        rw_num,rw_price,yw_num,yw_price,yz_num,yz_price,wz_num,wz_price,
        lowPrice
    }=trainData;
    
    const seatTypeNumArr=[swz_num,tz_num,zy_num,ze_num,gr_num,rw_num,yw_num,yz_num,wz_num];
    const seatTypePriceArr=[swz_price,tz_price,zy_price,ze_price,gr_price,rw_price,yw_price,yz_price,wz_price];
    const seatAvailArr=[];  //存放有票的座位信息
    seatTypeNumArr.forEach((typeNum,typeNumInd)=>{
        if(typeNum==="有"){
            const typeName=seatTypeArr[typeNumInd],
                typePrice=seatTypePriceArr[typeNumInd],
                actualPrice=Number(typePrice)/10;
            if(actualPrice>0){
                seatAvailArr.push({name:typeName,price:actualPrice});
            }
        }
    });  

    if(seatAvailArr.length>0){  //有余票才显示，无余票则返回null
        const spendTimeStr=spendTime.replace(/:/,"时")+"分";
        const dayDiffNum=Number(dayDiff),
            dayDiffStr=dayDiffNum===0?"":"+"+dayDiffNum;

        return (
            <div className="trainBlock">
                <div className="trainCommonPanel trainInfoPanel">
                    <div className="trainCommonItem trainInfo trainInfoStart">
                        <div className="trainStaTime trainStaStartTime">{startTime}</div>
                        <div className="trainStaName">{fromName}</div>
                    </div>
                    <div className="trainCommonItem trainInfo trainInfoDetail">
                        <div className="spendTime">{spendTimeStr}</div>
                        <div className="toRightSep"></div>
                        <div className="trainNamePanel">
                            <span className="trainCode">{trainCode}</span>
                            <span className="trainCardIcon xctrainiconfont icon_mingpian"></span>
                        </div>
                    </div>
                    <div className="trainCommonItem trainInfo trainInfoArrive">
                        <div className="trainStaTime trainStaArriveTime">{arriveTime}</div>
                        <div className="trainStaName">{toName}</div>
                        <div className="diffDay">{dayDiffStr}</div>
                    </div>
                    <div className="trainCommonItem trainInfo trainInfoPrice">
                        <span className="rmbSym lowestPriceText">￥</span>
                        <span className="lowestPrice">{lowPrice}</span>
                        <span className="lowestPriceText">起</span>
                    </div>
                </div>
                <div 
                    className="seatInfoPanelContainer"
                    style={{height:seatInfoViewable?'unset':0}}
                >
                    <div className="trainCommonPanel seatInfoPanel">
                        {seatAvailArr.map((seatAvail,seatAvailInd)=>(
                            <div className="trainCommonItem seatInfo" key={seatAvailInd}>
                                <div className="seatAvailName">{seatAvail.name}</div>
                                <div className="seatAvailPrice">
                                    <span className="seatAvailPriceSym">￥</span>{seatAvail.price}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
                <TrainSeatChangeView 
                    toggleSeatInfo={()=>setSeatInfoViewable(viewable=>!viewable)}
                    seatInfoViewable={seatInfoViewable}
                />
            </div> 
        );
    }else{
        return null;
    }
};

export default TrainBlock;