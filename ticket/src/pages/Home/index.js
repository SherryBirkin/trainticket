import React,{useContext, useState, useMemo, useCallback} from "react";
import {storeContext} from "@/Reducer";
import "./home.scss";
import homeBgImg from "_imgPath/index-default.png";
import Calen from "_components/Calen";
import { SETPASSENTYPE,SETCODETYPE } from "../../Reducer/actions";
import {showDateStr,formatDateStr,queryTrainReq,requestingNotice} from "_jsPath/common";
import City from "_components/City";
import {CITYTYPE_FROM,CITYTYPE_TO} from "_jsPath/constants";
import {SETSTARTCITY,SETENDCITY} from "@/Reducer/actions";
import {useHistory} from "react-router-dom";
import {Toast} from "antd-mobile";

const Home = ()=>{
    const {
        startCity,
        startCityDispatch,
        endCity,
        endCityDispatch,
        date,
        passenType,
        passenTypeDispatch,
        codeType,
        codeTypeDispatch,
    }=useContext(storeContext);
    const [showCalen,setShowCalen]=useState(false);
    const [showCity,setShowCity]=useState(false);
    const [origSelCity,setOrigSelCity]=useState(null);
    const [cityType,setCityType]=useState("");
    const [sepRotateNum,setSepRotateNum]=useState(0);
    const history=useHistory();

    const exchangeCity=(e)=>{   //点击交换图标时执行的方法：互换出发和到达地址。
        const citySepElem=e.target,
            tarDeg=180*(sepRotateNum+1);
        citySepElem.style.transform="rotate("+tarDeg+"deg)";
        setSepRotateNum(sepRotateNum=>sepRotateNum+1);

        const tempStartCity=JSON.parse(JSON.stringify(startCity));
        startCityDispatch({type:SETSTARTCITY,...endCity});
        endCityDispatch({type:SETENDCITY,...tempStartCity});
    };
    const showCityWin=(cityData,type)=>{    //显示城市选择窗口
        setOrigSelCity(cityData);
        setCityType(type);
        setShowCity(true);
    };
    const showDate=useMemo(()=>showDateStr(date),[date]);   //显示在首页的日期，格式为“*月*日”
    const studentCheckFn=useCallback((e)=>{ //学生票勾选与否时执行的方法
        const isChecked=e.target.checked;
        passenTypeDispatch({type:SETPASSENTYPE,passenType:isChecked?3:1});
    },[passenTypeDispatch]);
    const fastCheckFn=useCallback((e)=>{    //动车高铁勾选与否时执行的方法
        const isChecked=e.target.checked;
        codeTypeDispatch({type:SETCODETYPE,codeType:isChecked?"fast":"all"});
    },[codeTypeDispatch]);
    const queryTrainHandle=async ()=>{    //点击查询时执行的方法
        const dateStr=formatDateStr(date);
        const {code:startCode}=startCity,
            {code:endCode}=endCity;
        const ticketType=passenType;
        // const leftTicketDTO={
        //     train_date:dateStr,
        //     from_station:startCode,
        //     to_station:endCode,
        //     ticket_type:ticketType
        // };
        // fetch(`/12306api/otn/leftTicketPrice/query?leftTicketDTO.train_date=${dateStr}&leftTicketDTO.from_station=ZSQ&leftTicketDTO.to_station=ZJZ&leftTicketDTO.ticket_type=1`)
        //     .then(res=>res.json()).then(data=>console.log(data));
        requestingNotice(Toast);
        const queReqData=await queryTrainReq({dateStr,startCode,endCode,ticketType});
        Toast.hide();
        const {reqResult,data}=queReqData;
        if(reqResult==="SUCCESS"){
            // history.push("/trainlist");
            history.push({
                pathname:"/trainlist",
                query:JSON.stringify({resData:data})
            });
        }else if(reqResult==="ERROR"){
            Toast.info("查询列车失败，请稍后再试！",1);
        }
    };

    return (
        <div className="commonPage home">
            <div className="homeImg">
                <img src={homeBgImg} width="100%" alt="homebg"/>
            </div>
            <div className="homeContent">
                <div className="homePanel panelWithLine cityHomePanel">
                    <div className="startCity" onClick={()=>showCityWin(startCity,CITYTYPE_FROM)}>{startCity.name}</div>
                    <div className="citySep" onClick={exchangeCity}></div>
                    <div className="endCity" onClick={()=>showCityWin(endCity,CITYTYPE_TO)}>{endCity.name}</div>
                </div>
                <div className="homePanel panelWithLine dateHomePanel" onClick={()=>setShowCalen(true)}>
                    <div className="date">{showDate}</div>
                </div>
                <div className="homePanel checkboxHomePanel">
                    <div className="studentCheckbox">
                        <input 
                            type="checkbox" 
                            className="gloCheckbox studentCheckbox" 
                            id="studentCheckbox"
                            defaultChecked={passenType===3}
                            onChange={studentCheckFn}
                        />
                        <label className="studentText" htmlFor="studentCheckbox">学生票</label>
                    </div>
                    <div className="fastCheckbox">
                        <input 
                            type="checkbox" 
                            className="gloCheckbox fastCheckbox" 
                            id="fastCheckbox"
                            defaultChecked={codeType==="fast"}
                            onChange={fastCheckFn}
                        />
                        <label className="fastText" htmlFor="fastCheckbox">高铁动车</label>
                    </div>
                </div>
                <div className="homePanel btnHomePanel">
                    <span className="gloBtn queryBtn" onClick={queryTrainHandle}>查询</span>
                </div>
            </div>

            <Calen show={showCalen} hideCalen={()=>setShowCalen(false)}/>
            <City 
                show={showCity} 
                hideCityWin={()=>setShowCity(false)} 
                origSelCity={origSelCity} 
                cityType={cityType}
            />
        </div>
    );
}

export default Home;