import {useContext,useEffect,useState,useMemo, useCallback,useRef} from "react";
import {storeContext} from "@/Reducer";
import {queryTrainReq,formatDateStr,sortObjArr,requestingNotice} from "_jsPath/common";
import "_components/city.scss";
import "./trainlist.scss";
import {useHistory} from "react-router-dom";
import {Icon,Toast} from "antd-mobile";
import Calen from "_components/Calen";
import {SETDATE} from "@/Reducer/actions";
import TrainBlockList from "./TrainBlockList";
import TrainSort from "./TrainSort";

const Trainlist = props=>{  //列车查询结果列表页面
    const {location}=props,
        {query}=location;
    const {
        startCity,
        endCity,
        date,
        dateDispatch,
        passenType,
        codeType,
        sortType,
        timeZone,
    }=useContext(storeContext);
    /** 用来存放是否当前为挂载生命周期，用在useEffect里判断是否为挂载阶段。
     * 在useEffect的方法里执行挂载阶段的代码后，设置本ref对象.current为false，下次执行该useEffect
     * 中的方法时则判断之得知已不在挂载阶段。
    */
    const firstInRef=useRef(true);
    const [trainInfoData,setTrainInfoData]=useState(null);  //经筛选和排序后的用于显示用的数据数组
    const [trainInfoDataOrig,setTrainInfoDataOrig]=useState(null);  //原排列的数据数组，以时间早到晚的顺序
    const [showCalen,setShowCalen]=useState(false);
    const history=useHistory();
    const curMonDayStr=useMemo(()=>formatDateStr(date).replace(/\d{4}-/,""),[date]);//获取日期的“月-日”
    const getYMD=date=>date.toLocaleDateString().replace(/\//g,""); //获取日期的“年月日”（无0）
    const todayYMD=useMemo(()=>getYMD(new Date()),[]);
    const maxYMD=useMemo(()=>getYMD(new Date(Date.now()+1209600000)),[]);
    const curYMD=useMemo(()=>getYMD(date),[date]);
    const showPrevDate=useMemo(()=>todayYMD!==curYMD,[curYMD,todayYMD]); //是否显示“前一天”，选择日期是今天则隐藏
    const showNextDate=useMemo(()=>maxYMD!==curYMD,[curYMD,maxYMD]);   //是否显示“后一天”，选择日期是截止日期则隐藏
    const changeOneDayHandle=useCallback((changeType)=>{    //一天一天地改变选择日期，点击“前一天”“后一天”执行
        const difNum=86400000;
        const pickedTime=date.getTime();
        let targetTime=0;
        switch(changeType){
            case "prev":
                if(!showPrevDate)return false;
                targetTime=pickedTime-difNum;
                break;
            case "next":
            default:
                if(!showNextDate)return false;
                targetTime=pickedTime+difNum;
                break;
        }
        dateDispatch({type:SETDATE,date:new Date(targetTime)});
    },[date,showPrevDate,showNextDate,dateDispatch]);
    const getResData=resData=>{ //从12306返回的数据中提取真正有效的数据
        let tempArr=resData;
        if(resData?.length>0){
            tempArr=resData.map(item=>item.queryLeftNewDTO);
        }
        return tempArr;
    };
    const addLowPrice=data=>{   //给每项列车数据加进最低车票钱
        return data.map(item=>{
            const {swz_price,tz_price,zy_price,ze_price,gr_price,rw_price,yw_price,yz_price,wz_price}=item;
            let arr=[];
            let lPrice=null;
            [swz_price,tz_price,zy_price,ze_price,gr_price,rw_price,yw_price,yz_price,wz_price].forEach(price=>{
                const numPrice=Number(price);
                if(!isNaN(numPrice) && numPrice!==0){
                    arr.push(numPrice/10);
                }
            });
            if(arr.length>0){
                arr.sort((a,b)=>(a-b));
                lPrice=arr[0];
            }
            return {...item,lowPrice:lPrice}
        });
    }
    const filterCodeTypeData=useCallback((data)=>{  //从数据数组中筛选符合列车类型的数据
        switch(codeType){
            case "fast":
                return data.filter(item=>/^(G|D|C)/i.test(item.station_train_code));
            case "normal":
                return data.filter(item=>/^[^(G|D|C)]/i.test(item.station_train_code));
            case "all":
            default:
                return data;
        }
    },[codeType]);
    const filterTimeZoneData=useCallback((data)=>{  //从数据数组中筛选符合出发时间段的数据
        if(timeZone==="all"){
            return data;
        }else{
            const [minTime,maxTime]=timeZone.split("-");
            const minTimeHM=Number( minTime+"00" );
            const maxTimeHM=Number( maxTime+"00" );
            return data.filter(item=>{
                const curStartTimeHM=Number( item.start_time.replace(":","") );
                return (minTimeHM<=curStartTimeHM && curStartTimeHM<=maxTimeHM);
            });
        }
    },[timeZone]);
    const getTrainInfoSortedData=useCallback((data)=>{  //给数据数组根据某字段排序，默认是时间
        switch(sortType){
            case 1:
                return sortObjArr(data,"lishi");
            case 2:
                return sortObjArr(data,"lowPrice");
            case 0:
            default:
                return data;
        }
    },[sortType]);

    useEffect(()=>{ //原数据数组根据一系列筛选和排列
        if(trainInfoDataOrig){
            const filteredData=filterTimeZoneData( filterCodeTypeData(trainInfoDataOrig) ),
                sortedFilteredData=getTrainInfoSortedData(filteredData);
            setTrainInfoData(sortedFilteredData);
        }
    },[trainInfoDataOrig,filterCodeTypeData,filterTimeZoneData,getTrainInfoSortedData]);
    useEffect(()=>{ //如果路由中有列车数据数组带过来，则从这提取
        if(query&&query.indexOf("resData")>-1){
            const result=getResData(JSON.parse(query)["resData"]);
            setTrainInfoDataOrig(addLowPrice(result));
        }
    },[query]);

    useEffect(()=>{ //改变日期后，须重新从12306获取数据
        const getReqData=async ()=>{
            const dateStr=formatDateStr(date);
            const {code:startCode}=startCity,
                {code:endCode}=endCity;
            requestingNotice(Toast);
            const queReqData=await queryTrainReq({dateStr,startCode,endCode,ticketType:passenType});
            Toast.hide();
            const {reqResult,data}=queReqData;
            if(reqResult==="SUCCESS" && data?.length>0){
                const result=getResData(data);
                setTrainInfoDataOrig(addLowPrice(result));
            }else if(reqResult==="ERROR"){
                Toast.info("查询列车失败,请稍后再试！",1);
            }
        };
        const prevFirstIn=firstInRef.current;
        /** 如果不是挂载阶段，或者路由没传列车数据过来，则请求数据。
         * 如果是挂载本页面，且列出数据是home页面经路由传过来的，则无须重复请求。
        */
        if(!prevFirstIn || !query){
            getReqData();
        }
        //改变ref对象的值为false。下次因依赖改变而执行这判断时就表示已经不是第一次进本页面了，即不是挂载生命周期
        //改变ref对象的current不会触发页面重新渲染，依赖也没带上这个，故不会致使重复执行
        firstInRef.current=false; 
    },[date,passenType,startCity,endCity]);

    if(!trainInfoData){return null;}
    return (
        <div className="trainListWin cityWin">
            <div className="trainListWinHead cityWinHead">
                <div className="trainListWinTitle cityWinTitle">
                    <span className="cityWinTitleSta">{startCity.name}</span>
                    <span className="cityWinTitleIcon xctrainiconfont icon_swapright"></span>
                    <span className="cityWinTitleSta">{endCity.name}</span>
                </div>
                <div className="trainDateContent">
                    <div 
                        onClick={()=>changeOneDayHandle("prev")}
                        className={`trainDatePanel ${showPrevDate?"":"trainDatePanelDisabled"}`}
                    >
                        <Icon type="left" className="trainDateIcon" size="cx"></Icon>
                        <span className="trainDateText">前一天</span>
                    </div>
                    <div className="trainDatePanel" onClick={()=>setShowCalen(true)}>
                        <span className="trainDateText">{curMonDayStr}</span>
                        <Icon type="down" className="trainDateIcon" size="cx"></Icon>
                    </div>
                    <div 
                        onClick={()=>changeOneDayHandle("next")}
                        className={`trainDatePanel ${showNextDate?"":"trainDatePanelDisabled"}`}
                    >
                        <span className="trainDateText">后一天</span>
                        <Icon type="right" className="trainDateIcon" size="cx"></Icon>
                    </div>
                </div>
                <div className="cityWinReturn" onClick={()=>history.push("/home")}>
                    <Icon type="left" className="returnIcon" size="lg"></Icon>
                </div>
            </div>
            <div className="trainListWinBody cityWinBody">
                <div className="blueBgBar"></div>
                <TrainBlockList trainInfoData={trainInfoData}/>
                <TrainSort />
            </div>

            <Calen show={showCalen} hideCalen={()=>setShowCalen(false)}/>
        </div>
    );
}

export default Trainlist;