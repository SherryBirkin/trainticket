import {useContext, useState} from "react";
import {storeContext} from "@/Reducer";
import {SETSORTTYPE} from "@/Reducer/actions";
import TrainFilter from "./TrainFilter";
import "./trainSort.scss";

const TrainSort=()=>{   //查询结果页中的排序选择栏
    const {sortType,sortTypeDispatch,codeType,timeZone}=useContext(storeContext);
    const changeSortType=newSortType=>{ //改变排序方式
        sortTypeDispatch({type:SETSORTTYPE,sortType:newSortType});
    }
    const [showFilterWin,setShowFilterWin]=useState(false);

    return (
        <div className="trainSort">
            <div className="trainSortPanel">
                <div className="sortBlock" onClick={()=>setShowFilterWin(true)}>
                    筛选
                    <div 
                        className="redSpot" 
                        style={{
                            display:codeType==="all"&&timeZone==="all"?"none":"inline-block"
                        }}
                    ></div>
                </div>
                <div 
                    className={`sortBlock ${sortType===0?"activeSortBlock":""}`} 
                    onClick={()=>changeSortType(0)}
                >
                    出发早-晚
                </div>
                <div 
                    className={`sortBlock ${sortType===1?"activeSortBlock":""}`}  
                    onClick={()=>changeSortType(1)}
                >
                    耗时短-长
                </div>
                <div 
                    className={`sortBlock ${sortType===2?"activeSortBlock":""}`}  
                    onClick={()=>changeSortType(2)}
                >
                    价格低-高
                </div>
            </div>
            <div className="trainSortUnderBlur"></div>
            <TrainFilter show={showFilterWin} hideFilterWin={()=>setShowFilterWin(false)}/>
        </div>
    );
}

export default TrainSort;