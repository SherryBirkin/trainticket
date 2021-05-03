const CityHash = props=>{
    const {allCity}=props;
    if(!allCity)return null;
    const allCityKeys=Object.keys(allCity);

    return (
        <div className="cityHashList">
            <div className="cityHashPanel">
                <a className="cityHash" href="#cityHash_his">历 史</a>
            </div>
            <div className="cityHashPanel">
                <a className="cityHash" href="#cityHash_hot">热 门</a>
            </div>
            {allCityKeys.map(cityKey=>(
                <div className="cityHashPanel" key={cityKey}>
                    <a className="cityHash" href={`#cityHash_${cityKey}`}>{cityKey}</a>
                </div>
            ))}
        </div>
    );
}

export default CityHash;