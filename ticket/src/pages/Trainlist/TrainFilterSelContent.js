import "./trainFilterSelContent.scss";

const TrainFilterSelContent=props=>{    //筛选窗口中的一块筛选条件区域
    const {iName,iID,iVal,iDefChecked,lRef,lUpText,lDownText}=props;

    return (
        <div className="trainFilterSelContent">
            <input 
                type="radio" 
                className="trainFilterSel" 
                name={iName} 
                id={iID}
                value={iVal}
                defaultChecked={iDefChecked}
            />
            <label className="trainFilterSelBlock" htmlFor={iID} ref={lRef}>
                <div className="trainFilterSelTextUp">{lUpText}</div>
                {lDownText?
                <div className="trainFilterSelTextDown">{lDownText}</div>
                :null}
                <div className="filterSelActive">
                    <span className="filterSelActiveIcon xctrainiconfont icon_dui"></span>
                </div>
            </label>
        </div>
    );
};

export default TrainFilterSelContent;