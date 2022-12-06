import { DataStore, Hub, syncExpression } from "aws-amplify";
import { useEffect, useState } from "react";
import ContentDiv from "./Content";
import { CatHerd } from "./models";


const Dashboard = () =>{
    const [isDataConfigured, setDataCongifured] = useState(false) 

    const dataStoreConfigure = async() => {
        try {
          await DataStore.clear();
           DataStore.configure({
            syncPageSize: 1000,
            maxRecordsToSync: 200000,
            authProviders: {
              functionAuthProvider: async () => {
                return {
                    token: '638eeb71810e5',
                };
              },
            },
            
            syncExpressions: [
                syncExpression(CatHerd, () => {
                return user => user.or(user => [user.dd_tenant.eq('TENANT#1429')])
              }),
            ]
          });
          await DataStore.start()
        } catch (err) {
          console.log("DataStore Sync Error",err);
        }
      }
    useEffect(()=>{
        dataStoreConfigure();
        const listener = Hub.listen("datastore", async hubData => {
        try{
            const  { event, data } = hubData.payload;
            if (event === "ready") {
            console.log('data is ready')
            await setDataCongifured(true)
            // do something here once the data is synced from the cloud
            }
        }catch(e){
            console.log(e)
        }
        })
        return () => {
            listener();
        };
    },[])
    
    return(
        isDataConfigured?
        <div>DashBoard
            <ContentDiv/>
        </div>
        :
        <div>Loading</div>
    )
}
export default Dashboard;