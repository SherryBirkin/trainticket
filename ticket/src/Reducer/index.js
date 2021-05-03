import React,{createContext,useReducer} from "react";
import {
    SETSTARTCITY,
    SETENDCITY,
    SETDATE,
    SETPASSENTYPE,
    SETCODETYPE,
    SETSORTTYPE,
    SETTIMEZONE,
    SETHOTCITYLIST,
    SETALLCITY
} from "./actions";

export const storeContext=createContext(null);

const startCityReducer=(state,action)=>{    //改变出发站点
    const {type,name,code}=action;
    switch(type){
        case SETSTARTCITY:
            return {name,code};
        default:
            throw new Error();
    }
};
const endCityReducer=(state,action)=>{  //改变到达站点
    const {type,name,code}=action;
    switch(type){
        case SETENDCITY:
            return {name,code};
        default:
            throw new Error();
    }
};
const dateReducer=(state,action)=>{ //改变出发日期
    const {type,date}=action;
    switch(type){
        case SETDATE:
            return date;
        default:
            throw new Error();
    }
};
const passenTypeReducer=(state,action)=>{   //改变乘客类型
    const {type,passenType,passenTypeName}=action;
    switch(type){
        case SETPASSENTYPE:
            if(passenType){
                return passenType;
            }else{
                if(passenTypeName==="all"){
                    return 1;
                }else if(passenTypeName==="student"){
                    return 3;
                }
            }
            break;
        default:
            throw new Error();
    }
};
const codeTypeReducer=(state,action)=>{ //改变列车类型
    const {type,codeType}=action;
    switch(type){
        case SETCODETYPE:
            return codeType;
        default:
            throw new Error();
    }
};
const sortTypeReducer=(state,action)=>{ //改变排序类型
    const {type,sortType}=action;
    switch(type){
        case SETSORTTYPE:
            return sortType;
        default:
            throw new Error();
    }
};
const timeZoneReducer=(state,action)=>{ //改变筛选条件的出发时间段
    const {type,timeZone}=action;
    switch(type){
        case SETTIMEZONE:
            return timeZone;
        default:
            throw new Error();
    }
};
const hotCityListReducer=(state,action)=>{
    const {type,hotCityList}=action;
    switch(type){
        case SETHOTCITYLIST:
            return hotCityList;
        default:
            throw new Error();
    }
};
const allCityReducer=(state,action)=>{
    const {type,allCity}=action;
    switch(type){
        case SETALLCITY:
            return allCity;
        default:
            throw new Error();
    }
};

const Reducer=({children})=>{
    const [startCity,startCityDispatch]=useReducer(startCityReducer,{name:"上海",code:"SHH"});
    const [endCity,endCityDispatch]=useReducer(endCityReducer,{name:"北京",code:"BJP"});
    const [date,dateDispatch]=useReducer(dateReducer,new Date());
    const [passenType,passenTypeDispatch]=useReducer(passenTypeReducer,1);
    const [codeType,codeTypeDispatch]=useReducer(codeTypeReducer,"all");
    const [sortType,sortTypeDispatch]=useReducer(sortTypeReducer,0);
    const [timeZone,timeZoneDispatch]=useReducer(timeZoneReducer,"all");
    const [hotCityList,hotCityListDispatch]=useReducer(hotCityListReducer,[]);
    const [allCity,allCityDispatch]=useReducer(allCityReducer,null);

    return (
        <storeContext.Provider value={{
            startCity,
            startCityDispatch,
            endCity,
            endCityDispatch,
            date,
            dateDispatch,
            passenType,
            passenTypeDispatch,
            codeType,
            codeTypeDispatch,
            sortType,
            sortTypeDispatch,
            timeZone,
            timeZoneDispatch,
            hotCityList,
            hotCityListDispatch,
            allCity,
            allCityDispatch
        }}>
            {children}
        </storeContext.Provider>
    )
};

export default Reducer;