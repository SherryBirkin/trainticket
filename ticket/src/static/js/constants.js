export const CITYTYPE_FROM="出发";
export const CITYTYPE_TO="到达";
export const seatTypeArr=["商务座","特等座","一等座","二等座","高级软卧","软卧","硬卧","硬座","无座"];
export const FILTER_CODETYPE={
    name:"trainCodeType",
    list:[
        {val:"all",upText:"不限"},
        {val:"fast",upText:"高铁动车"},
        {val:"normal",upText:"普通车次"}
    ]
};
export const FILTER_PASSENTYPE={
    name:"passengerType",
    list:[
        {val:1,upText:"不限"},
        {val:3,upText:"学生票"}
    ]
};
export const FILTER_TIMEZONE={
    name:"trainStartTimeZone",
    list:[
        {val:"all",upText:"不限"},
        {val:"0-6",upText:"早上",downText:"00:00 - 06:00"},
        {val:"6-12",upText:"上午",downText:"06:00 - 12:00"},
        {val:"12-18",upText:"下午",downText:"12:00 - 18:00"},
        {val:"18-24",upText:"晚上",downText:"18:00 - 24:00"},
    ]
};
