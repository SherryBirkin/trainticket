import React,{useContext, useState, useEffect, useMemo,useCallback,useRef} from "react";
import {storeContext} from "@/Reducer";
import {CITYTYPE_FROM,CITYTYPE_TO} from "_jsPath/constants";
import "./city.scss";
import {Icon,Toast} from "antd-mobile";
import HotCity from "./HotCity";
import {getCookie,addCookie,requestingNotice} from "_jsPath/common";
import HisCity from "./HisCity";
import {SETSTARTCITY,SETENDCITY,SETHOTCITYLIST,SETALLCITY} from "@/Reducer/actions";
import AllCity from "./AllCity";
import CityHash from "./CityHash";
import CitySearchRes from "./CitySearchRes";

const City=(props)=>{   //选择城市的弹窗
    const {
        startCityDispatch,
        endCityDispatch,
        hotCityList,
        hotCityListDispatch,
        allCity,
        allCityDispatch
    }=useContext(storeContext);
    /**存放hotCityList的初始数据，仅用于挂载时判断是否有热门城市的数据，如果没有则请求数据，反之则不请求。
     * 用它而不直接用hotCityList来判断，是因为用hotCityList的话要将hotCityList写进useEffect的依赖，
     * 这样的话hotCityList更新一次又要执行useEffect里面的方法；如果不写进依赖，则eslint有警告。
     * allCityRef同*/
    const origHotCityListRef=useRef(hotCityList);
    const allCityRef=useRef(allCity);   //存放allCity的初始数据
    const {show,origSelCity,cityType,hideCityWin}=props;
    const [showCityCancel,setShowCityCancel]=useState(false);   //是否显示搜索取消按钮
    const [hisCityCodeList,setHisCityCodeList]=useState([]);    //历史搜索城市列表
    const searchInput=useRef(null); //搜索input元素
    const [searchVal,setSearchVal]=useState("");    //搜索值
    const [showCitySearchRes,setShowCitySearchRes]=useState(false); //是否显示搜索结果结构
    const [searchHash,setSearchHash]=useState(null);
    const [codeHash,setCodeHash]=useState(null);
    const hisCityList=useMemo(()=>{
        if(!codeHash)return [];
        return hisCityCodeList.map(code=>codeHash[code]);
    },[hisCityCodeList,codeHash]);
    const cityInputHandle=e=>{  //搜索框输入后，改变搜索值
        const val=e.target.value;
        setSearchVal(val);
    }
    const searchCancelHandle=useCallback(()=>{//点击搜索取消按钮执行的方法：清空搜索输入框、隐藏搜索取消按钮
        searchInput.current.value="";
        setSearchVal("");
    },[]);
    useEffect(()=>{ //搜索值改变时，相应改变 搜索取消按钮 和 搜索结果结构 的显示隐藏
        if(searchVal){
            setShowCityCancel(true);
            setShowCitySearchRes(true);
        }else{
            setShowCityCancel(false);
            setShowCitySearchRes(false);
        }
    },[searchVal]);
    const cityClickHandle=useMemo(()=>{ //点击选择地名后，根据出发还是到达类型，改变出发或到达地名。也改变搜索历史
        let tarDispatch=null,
            tarType=null;
        switch(cityType){
            case CITYTYPE_FROM:
                tarDispatch = startCityDispatch;
                tarType=SETSTARTCITY;
                break;
            case CITYTYPE_TO:
                tarDispatch = endCityDispatch;
                tarType=SETENDCITY;
                break;
            default:
                return false;
        }
        return (tarCityCode)=>{
            setHisCityCodeList(hisCityCodeList=>{
                let newHisCityCodeList = hisCityCodeList.slice(0);
                const tarCityInd=newHisCityCodeList.indexOf(tarCityCode);
                if(tarCityInd>-1){
                    delete newHisCityCodeList[tarCityInd];
                }
                newHisCityCodeList.unshift(tarCityCode);
                return newHisCityCodeList;
            });
            const newCityData=codeHash[tarCityCode];
            const {name,code}=newCityData;
            tarDispatch({type:tarType,name,code});
            hideCityWin();
        }
    },[cityType,startCityDispatch,endCityDispatch,codeHash,hideCityWin]);

    useEffect(()=>{ //搜索历史改变时，写进cookie
        if(hisCityCodeList.length>0){
           addCookie("hisCityCode",hisCityCodeList.join("|")); 
        }
    },[hisCityCodeList]);
    const getCitiesReq=useCallback(()=>{    //请求站点数据接口，返回Promise
        return new Promise((resolve,reject)=>{
            fetch("/ticket/cities.do").then(res=>res.json()).then(data=>{
                if(data?.result==="SUCCESS"){
                    resolve(data.data);
                }else{
                    resolve(null);
                }
            }).catch(err=>reject(err));
        });
    },[]);
    const getCities = useCallback(async ()=>{   //从请求接口获取站点数据，存到上下文中
        try{
            requestingNotice(Toast);
            const data=await getCitiesReq();
            Toast.hide();
            const {hotCities:hotCityList,cityList}=data;
            const tempAllCity={};
            
            cityList.forEach((cityTypeItem,cityTypeInd)=>{
                const {title,cities:tempCityTypeList}=cityTypeItem;
                tempAllCity[title]=tempCityTypeList;
            });
            hotCityListDispatch({type:SETHOTCITYLIST,hotCityList});
            allCityDispatch({type:SETALLCITY,allCity:tempAllCity});
        }catch(err){
            Toast.info("请求城市数据失败，请稍后再试！",1);
        }
    },[getCitiesReq,hotCityListDispatch,allCityDispatch]);
    useEffect(()=>{ //如果上下文中没站点数据，则从接口获取。从cookie中获取历史站点。仅本窗口挂载时执行。
        const hisCityCodeFromCookie=getCookie("hisCityCode");
        const origHotCityList=origHotCityListRef.current;
        const origAllCity=allCityRef.current;
        if(origHotCityList?.length===0 || !origAllCity){
            getCities();
        }
        if(hisCityCodeFromCookie){
            setHisCityCodeList(hisCityCodeFromCookie.split("|"));
        }
    },[getCities]);
    
    useEffect(()=>{ //所有站点的数据改变后，相应改变 搜索关键字:该站数据 和 传给12306的站点代码:该站数据 的映射对象
        if(!allCity)return null;
        const allCityValArr=[].concat(...Object.values(allCity));
        const tempSearchObj={};
        const tempCodeObj={};
        allCityValArr.forEach(cityData=>{
            const {search,code}=cityData;
            tempSearchObj[search]=cityData;
            tempCodeObj[code]=cityData;
        });
        setSearchHash(tempSearchObj);
        setCodeHash(tempCodeObj);
    },[allCity]);
    useEffect(()=>{ 
        if(!show){  //本窗口隐藏时，搜索结果结构也隐藏，清空搜索输入框、隐藏搜索取消按钮
           setShowCitySearchRes(false); 
           searchCancelHandle();
        }
    },[show,searchCancelHandle]);

    return (
        <div className="cityWin" style={{
            display:show?"block":"none"
        }}>
            <div className="cityWinHead">
                <div className="cityWinTitle">{cityType}</div>
                <div className="citySearchPanel">
                    <div 
                        className="citySearchInputHolder"
                        style={{
                            width:showCityCancel?"calc(100% - 45px)":"100%"
                        }}>
                        <input 
                            className="gloInput citySearchInput" 
                            placeholder="北京" 
                            onInput={cityInputHandle}
                            ref={searchInput}
                            type="text"
                        />
                    </div>
                    <div 
                        className="citySearchCancelHolder"
                        style={{
                            display:showCityCancel?"block":"none"
                        }}>
                        <span className="citySearchCancel" onClick={searchCancelHandle}>取消</span>
                    </div>
                </div>
                <div className="cityWinReturn" onClick={()=>hideCityWin()}>
                    <Icon type="left" className="returnIcon" size="lg"></Icon>
                </div>
            </div>
            <div className="cityWinBody">
                <HisCity 
                    hisCityList={hisCityList} 
                    origSelCity={origSelCity} 
                    cityClickHandle={cityClickHandle}
                />
                <HotCity 
                    hotCityList={hotCityList} 
                    origSelCity={origSelCity}
                    cityClickHandle={cityClickHandle}
                />
                <AllCity 
                    allCity={allCity}
                    origSelCity={origSelCity}
                    cityClickHandle={cityClickHandle}
                />
                <CityHash allCity={allCity}/>
            </div>
            <CitySearchRes 
                show={showCitySearchRes}
                allCity={allCity}
                searchHash={searchHash}
                searchVal={searchVal}
                cityClickHandle={cityClickHandle}
            />
        </div>
    );
};

export default City;