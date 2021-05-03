const TrainSeatChangeView=(props)=>{
    const {seatInfoViewable,toggleSeatInfo}=props;
    return (
        <div 
            className="trainSeatChangeViewIconPanel"
            onClick={()=>toggleSeatInfo()}
            style={{transform:seatInfoViewable?"rotate(180deg)":"unset"}}
        >
            <span className="trainSeatChangeViewIcon xctrainiconfont icon_xiangxia"></span>
            {/* <span 
                className="trainSeatChangeViewIcon xctrainiconfont icon_xiangxia"
                onClick={()=>showSeatInfo()}
                style={{display:seatInfoViewable?"none":"block"}}
            ></span>
            <span 
                className="trainSeatChangeViewIcon xctrainiconfont icon_xiangshang"
                onClick={()=>hideSeatInfo()}
                style={{display:seatInfoViewable?"block":"none"}}
            ></span> */}
        </div>
    );
}

export default TrainSeatChangeView;