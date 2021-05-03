const Koa=require("koa");
const KoaRouter=require("koa-router");
const bodyParser=require("koa-bodyparser");
const {historyApiFallback}=require("koa2-connect-history-api-fallback");
const koaStatic=require("koa-static");
const axios=require("axios");

const app=new Koa();
const router=new KoaRouter();
const port=8045;

router.get("/ticket/cities.do",async (ctx)=>{
    ctx.type="application/json";
    ctx.body={
        data:require("./json/cities.json"),
        result:"SUCCESS"
    };
});
router.post("/ticket/query.do",async (ctx)=>{
    const {leftTicketDTO}=ctx.request.body,
        {train_date,from_station,to_station,ticket_type}=leftTicketDTO;
    let dataReturn={
            data:null,
            result:"ERROR",
            errMsg:"request from 12306 error occurs"
        }
    let tarUrl=`https://kyfw.12306.cn/otn/leftTicketPrice/query?`+
            Object.keys(leftTicketDTO)
                .map(key=>("leftTicketDTO."+key+"="+leftTicketDTO[key]))
                .join("&");

    ctx.type="application/json";
    try{
        const reqData=await axios.get(tarUrl);
        if(reqData.status===200&&reqData.data&&reqData.data.httpstatus===200){
            dataReturn={
                data:reqData.data.data,
                result:"SUCCESS",
                errMsg:null
            }
        }
        ctx.body={...dataReturn};
    }catch(err){
        ctx.body={...dataReturn};
    }
});

app.use(historyApiFallback());
app.use(bodyParser());
app.use(koaStatic(__dirname+"/public"));
app.use(router.routes());
app.listen(port,()=>console.log("start success,visit http://localhost:8045"));
