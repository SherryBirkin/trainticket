import TrainBlock from "./TrainBlock";

const TrainBlockList=props=>{   //列车信息列表
    const {trainInfoData}=props;

    if(!trainInfoData || trainInfoData?.length===0){
        return <div className="trainListNone">暂无查到相关有余票车次</div>;
    }else{
        return (
            <>
                {trainInfoData.map((item,i)=>{
                    const {station_train_code}=item;
                    return <TrainBlock trainData={item} key={`${station_train_code}_${i}`}/>;
                })}
            </>
        );
    }
};

export default TrainBlockList;