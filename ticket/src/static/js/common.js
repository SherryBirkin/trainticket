export const showDateStr=(date)=>{
    const localeDateStr=date.toLocaleDateString();
    const showStr=localeDateStr.replace(/\d{4}\/(\d{1,2})\/(\d{1,2})/,"$1月$2日");
    return showStr;
}
export const formatDateStr=(date)=>{
    const localeDateStr=date.toLocaleDateString();
    const formatStr=localeDateStr.replace(/(\d{4})\/(\d{1,2})\/(\d{1,2})/,"$1-$2-$3");
    return formatStr;
}
//将用户名添加到Cookie
export const addCookie=function(name,value,expireTime){//expireTime的单位为天
    var cookieString = name+"="+escape(value),
        finalTime=expireTime||30,
        date=new Date(),
        now=date.getTime();
    date.setTime(now+finalTime*3600*1000); //设置Cookie有效时间
    cookieString=cookieString+"; expires="+date.toGMTString();
    document.cookie=cookieString;
}
//获取Cookie
export const getCookie=function(name){
    var arr = document.cookie.match(new RegExp("(^| )"+name+"=([^;]*)(;|$)")); //通过正则表达式获取cookie为name的字符组
    if(arr!=null){
        return unescape(arr[2]); //输入返回
    }
    return null;
}
//删除Cookie
export const deleteCookie=function(name){
    var date=new Date();
    date.setTime(date.getTime()-10000);
    var value = getCookie(name);
    if(value != null){//判断值是否存在
        document.cookie = name+"=; expires="+date.toGMTString(); //Cookie值为空
    }
}

// export const queryTrainReq=({dateStr,startCode,endCode,ticketType})=>{
//     return new Promise((resolve,reject)=>{
//         fetch(`/12306api/otn/leftTicketPrice/query?leftTicketDTO.train_date=${dateStr}&leftTicketDTO.from_station=${startCode}&leftTicketDTO.to_station=${endCode}&leftTicketDTO.ticket_type=${ticketType}`)
//             .then(res=>res.json()).then(data=>{
//                 if(data?.httpstatus===200){
//                     resolve({reqResult:"SUCCESS",data:data.data});
//                 }else{
//                     resolve({reqResult:"ERROR"})
//                 }
//             }).catch(err=>{
//                 resolve({reqResult:"ERROR"})
//             });
//     });
// }
export const queryTrainReq=({dateStr,startCode,endCode,ticketType})=>{
    return new Promise((resolve,reject)=>{
        fetch(`/ticket/query.do`,{
            body:JSON.stringify({
                leftTicketDTO:{
                    train_date:dateStr,
                    from_station:startCode,
                    to_station:endCode,
                    ticket_type:ticketType
                }
            }),
            method:"POST",
            headers:{
                "content-type":"application/json"
            }
        }).then(res=>res.json()).then(data=>{
                if(data?.result==="SUCCESS"){
                    resolve({reqResult:"SUCCESS",data:data.data});
                }else{
                    resolve({reqResult:"ERROR"})
                }
            }).catch(err=>{
                resolve({reqResult:"ERROR"})
            });
    });
}

export const sortObjArr=(array,key)=>{
    let arr=array.slice();
    for(let curInd=1; curInd<arr.length; curInd++){
        const curVal=arr[curInd];
        for(let k=curInd-1; k>=0; k--){
            const tempCurKeyValNum=Number(curVal[key]),
                curKeyValNum=isNaN(tempCurKeyValNum) ? Number(curVal[key].replace(/\D/g,"")) : Number(tempCurKeyValNum),
                tempSortedCurKeyValNum=Number(arr[k][key]),
                sortedCurKeyValNum=isNaN(tempSortedCurKeyValNum) ?Number(arr[k][key].replace(/\D/g,"")) : Number(tempSortedCurKeyValNum);
            if(sortedCurKeyValNum<=curKeyValNum){
                arr[k+1]=curVal;
                break;
            }else{
                arr[k+1]=arr[k];
                if(k===0){
                    arr[0]=curVal;
                }
            }
        }
    }
    return arr;
};

export const requestingNotice=(ToastObj)=>{
    ToastObj.info(
        <div className="requestingNotice">
            <div className="requestingNoticePic"></div>
            <div className="requestingNoticeText">正在请求中，请稍候</div>
        </div>,1
    )
}