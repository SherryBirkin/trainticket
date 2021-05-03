import React,{useContext} from "react"
import {Calendar} from "antd-mobile"
import {storeContext} from "@/Reducer"
import {SETDATE} from "@/Reducer/actions"

const Calen = (props)=>{
    const {show,hideCalen}=props;
    const {dateDispatch}=useContext(storeContext);
    const now=new Date();
    const nowStr=now.getTime();
    const curYear=now.getFullYear();
    const curMonth=now.getMonth();
    const curDate=now.getDate();
    const endDate=new Date(nowStr+1209600000);
    const disabledExtraHash={};
    const disabledVal={disable:true};

    if(curDate>1){
        for(let i=curDate; i>0; i--){
            const curDisabledKey=new Date(curYear,curMonth,i);
            disabledExtraHash[curDisabledKey]=disabledVal;
        }
    }

    const confirmFn=(pickedDate)=>{
        dateDispatch({
            type:SETDATE,
            date:pickedDate
        });
        hideCalen();
    }

    return (
        <>
            <Calendar
                type="one"
                visible={show}
                onConfirm={confirmFn}
                onCancel={hideCalen}
                minDate={now}
                maxDate={endDate}
            />
        </>
    );
}

export default Calen;