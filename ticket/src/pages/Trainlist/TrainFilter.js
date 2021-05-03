import {useEffect, useRef, useState, useContext} from "react";
import "./trainFilter.scss";
import {SETCODETYPE,SETTIMEZONE,SETPASSENTYPE} from "@/Reducer/actions";
import {storeContext} from "@/Reducer";
import TrainFilterSelContent from "./TrainFilterSelContent";
import {FILTER_CODETYPE,FILTER_PASSENTYPE,FILTER_TIMEZONE} from "_jsPath/constants";

const {name:FILTER_CODETYPENAME,list:FILTER_CODETYPELIST}=FILTER_CODETYPE;
const {name:FILTER_PASSENTYPENAME,list:FILTER_PASSENTYPELIST}=FILTER_PASSENTYPE;
const {name:FILTER_TIMEZONENAME,list:FILTER_TIMEZONELIST}=FILTER_TIMEZONE;
const TrainFilter=props=>{  //查询结果页中的筛选弹出窗口
    const {
        codeType,
        codeTypeDispatch,
        timeZone,
        timeZoneDispatch,
        passenType,
        passenTypeDispatch
    }=useContext(storeContext);
    const {show,hideFilterWin}=props;
    const [winDisplay,setWinDisplay]=useState("none");  //本窗口的显示隐藏，由于要使transition奏效，隐藏时要延迟隐藏
    const [contentTrans,setContentTrans]=useState(null);    //内容部分的transform样式
    const codeTypeAllRef=useRef(null);      //列车类型单选项“不限”的引用对象
    const passengerTypeAllRef=useRef(null); //乘客类型单选项“不限”的引用对象
    const timeZoneAllRef=useRef(null);      //发车时间段单选项“不限”的引用对象
    const filterClearHandle=()=>{   //点击“清空筛选”时执行，将筛选条件全部重置为“不限”
        codeTypeAllRef.current.click();
        passengerTypeAllRef.current.click();
        timeZoneAllRef.current.click();
    };
    const filterConfirmHandle=()=>{ //点击“确定”时执行，根据筛选改变上下文状态
        const newCodeType=document.querySelector("[name=trainCodeType]:checked").value;
        const newPassenType=Number( document.querySelector("[name=passengerType]:checked").value );
        const newTimeZone=document.querySelector("[name=trainStartTimeZone]:checked").value;
        codeTypeDispatch({type:SETCODETYPE,codeType:newCodeType});
        passenTypeDispatch({type:SETPASSENTYPE,passenType:newPassenType});
        timeZoneDispatch({type:SETTIMEZONE,timeZone:newTimeZone});
        hideFilterWin();
    };
    
    useEffect(()=>{ //要使内容显示的transition奏效，当前窗口显示则立即显示，隐藏则待内容动画执行完后再隐藏
        if(show){
            setWinDisplay("block");
            setContentTrans("unset");
        }else{
            setContentTrans("translateY(100%)");
            setTimeout(()=>setWinDisplay("none"),150);
        }
    },[show]);

    return (
        <div 
            className="trainFilterWin"
            style={{display:show?"block":winDisplay}}
        >
            <div className="trainFilterMask" onClick={hideFilterWin}></div>
            <div 
                className="trainFilterContent"
                style={{transform:contentTrans}}
            >
                <div className="trainFilterContentHead">
                    <span className="filterCancel" onClick={hideFilterWin}>取消</span>
                    <span className="filterClear" onClick={filterClearHandle}>清空筛选</span>
                    <span className="filterConfirm" onClick={filterConfirmHandle}>确定</span>
                </div>
                <div className="trainFilterContentBody">
                    <div className="trainFilterPanel">
                        <div className="trainFilterTitle">车型选择</div>
                        <div className="trainFilterSelPanel">
                            {FILTER_CODETYPELIST.map((filter_codeTypeItem,filter_codeTypeInd)=>{
                                const curRefVal=filter_codeTypeInd===0?codeTypeAllRef:null;
                                const {val,upText}=filter_codeTypeItem;
                                return <TrainFilterSelContent 
                                    iName={FILTER_CODETYPENAME}
                                    iID={`${FILTER_CODETYPENAME}_${val}`}
                                    iVal={val}
                                    iDefChecked={codeType===val}
                                    lRef={curRefVal}
                                    lUpText={upText}
                                    key={`${FILTER_CODETYPENAME}_${val}`}
                                />;
                            })}
                        </div>
                    </div>
                    <div className="trainFilterPanel">
                        <div className="trainFilterTitle">乘客类型</div>
                        <div className="trainFilterSelPanel">
                            {FILTER_PASSENTYPELIST.map((filter_passenTypeItem,filter_passenTypeInd)=>{
                                const curRefVal=filter_passenTypeInd===0?passengerTypeAllRef:null;
                                const {val,upText}=filter_passenTypeItem;
                                return <TrainFilterSelContent 
                                    iName={FILTER_PASSENTYPENAME}
                                    iID={`${FILTER_PASSENTYPENAME}_${val}`}
                                    iVal={val}
                                    iDefChecked={passenType===val}
                                    lRef={curRefVal}
                                    lUpText={upText}
                                    key={`${FILTER_PASSENTYPENAME}_${val}`}
                                />;
                            })}
                        </div>
                    </div>
                    <div className="trainFilterPanel">
                        <div className="trainFilterTitle">发车时段</div>
                        <div className="trainFilterSelPanel">
                            {FILTER_TIMEZONELIST.map((filter_timeZoneItem,filter_timeZoneInd)=>{
                                const curRefVal=filter_timeZoneInd===0?timeZoneAllRef:null;
                                const {val,upText,downText}=filter_timeZoneItem;
                                return <TrainFilterSelContent 
                                    iName={FILTER_TIMEZONENAME}
                                    iID={`${FILTER_TIMEZONENAME}_${val}`}
                                    iVal={val}
                                    iDefChecked={timeZone===val}
                                    lRef={curRefVal}
                                    lUpText={upText}
                                    lDownText={downText}
                                    key={`${FILTER_TIMEZONENAME}_${val}`}
                                />;
                            })}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TrainFilter;