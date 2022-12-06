/* Amplify Params - DO NOT EDIT
	API_CATHERD_CATHERDTABLE_ARN
	API_CATHERD_CATHERDTABLE_NAME
	API_CATHERD_GRAPHQLAPIENDPOINTOUTPUT
	API_CATHERD_GRAPHQLAPIIDOUTPUT
	API_CATHERD_GRAPHQLAPIKEYOUTPUT
	ENV
	REGION
Amplify Params - DO NOT EDIT */ "use strict";
const axios = require("axios");
const AWS = require("aws-sdk");
const gql = require("graphql-tag");
const graphql = require("graphql");
const { print } = graphql;
const { databyClassification } = require("/opt/graphql/queries");
const { listCatHerds } = require("/opt/graphql/queries");
const { getPdBaseUrl, getPaginatedData } = require("/opt/envHelpers");

AWS.config.update({
  accessKeyId: process.env.AWS_ACCESSKEY,
  secretAccessKey: process.env.AWS_SECRETACCESSKEY,
  region: process.env.AWS_REGIONNAME,
});

let myDocClient = new AWS.DynamoDB(); // Create the DynamoDB service object
exports.handler = async (event) => {
  try {
    const data = await getPaginatedData({
      messageNextToken: null,
      resData: [],
      variables: {
        classification: "DRIVER",
      },
      query: databyClassification,
      queryName: "databyClassification",
      url: process.env.API_CATHERD_GRAPHQLAPIENDPOINTOUTPUT,
      method: "post",
    });
    let dynamoDriver = {};
    if (data !== null) {
      data.map((item) => {
        if (item?.id) {
          dynamoDriver[item.id] =
            item;
        }
      });
    }

    let baseUrl = getPdBaseUrl(process.env.ENV);
    const response = await axios({
      url: `${baseUrl}/pch/pch_sync/driver`,
      method: "GET",
      headers: {
        "x-api-key": "7b7aa78f506a40bc0320fa308efc19bf",
      },
    });
    if (response?.data?.data) {
      let batch_list = [];
      let itemList = [];
      console.log("------------------------------------");
      let index = 0
      
      for(let driverItem of response.data.data){
        // response.data.data.map(async(driverItem, index) => {
       
        let boxes = driverItem?.assigned_boxes.map((box)=>{
          return {
              box_id: box.box_id,
              box_number: box.box_number,
              rolling_time: box.rolling_time !== "" ? new Date(box.rolling_time).toISOString() ?? new Date().toISOString() : null,
              proppant_type: box.proppant_type,
              proppant_type_id: box.proppant_type_id,
          }
        })
        let loadNum = dynamoDriver[`DRIVER#${driverItem.driver_id}#${driverItem.tenant_id}#${driverItem.id}`]?.load_no ?? '';
        let jobName = dynamoDriver[`DRIVER#${driverItem.driver_id}#${driverItem.tenant_id}#${driverItem.id}`]?.job_name ?? '';
        if(driverItem.accepted_load_id !== ''){
        try{
            const res = await axios({
              url: `${baseUrl}/pch/pch_sync/load?load_id=${driverItem.accepted_load_id}&running_only=1`,
              method: "GET",
              headers: {
                "x-api-key": "7b7aa78f506a40bc0320fa308efc19bf",
              },
            });
            // if(res?.data?.data.length === 0){
            //   console.log('not found in db', driverItem.accepted_load_id)
            // }
            if(res?.data?.data && res?.data?.data.length > 0){
              loadNum = res?.data?.data[0].load_no;
              jobName = res?.data?.data[0].job_name;
            }
        }catch(e){
          console.log("error in load detail", e)
        }
        }
        let marshalled_item = AWS.DynamoDB.Converter.marshall({
          id: `DRIVER#${driverItem.driver_id}#${driverItem.tenant_id}#${driverItem.id}` ,
          driver_name: driverItem.driver_name ,
          driver_id: driverItem.driver_id,
          cat: `DRIVER#${driverItem.tenant_id}#${driverItem.id}`,
          dd_tenant:  dynamoDriver[`DRIVER#${driverItem.driver_id}#${driverItem.tenant_id}#${driverItem.id}`]
              ? dynamoDriver[`DRIVER#${driverItem.driver_id}#${driverItem.tenant_id}#${driverItem.id}`].dd_tenant
              : "TENANT#"
          ,
          gsi1sk: dynamoDriver[
              `DRIVER#${driverItem.driver_id}#${driverItem.tenant_id}#${driverItem.id}`
            ]
              ? dynamoDriver[
                  `DRIVER#${driverItem.driver_id}#${driverItem.tenant_id}#${driverItem.id}`
                ].gsi1sk
              : "ZONE#"
          ,
          type: dynamoDriver[
              `DRIVER#${driverItem.driver_id}#${driverItem.tenant_id}#${driverItem.id}`
            ]
              ? dynamoDriver[
                  `DRIVER#${driverItem.driver_id}#${driverItem.tenant_id}#${driverItem.id}`
                ].type
              : "DRIVER_ZONE#"
          ,
          is_assigned:
              ((driverItem.no_of_assigned_loads === "0" ||driverItem.no_of_assigned_loads === "")&& driverItem.accepted_load_id ==="")
                ? false
                : true
          ,
          no_of_assigned_loads:  driverItem && driverItem.no_of_assigned_loads !== null ? driverItem.no_of_assigned_loads : "0",
          job_name: jobName,
          load_no: loadNum,
          _typename: "CatHerd",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          _lastChangedAt: new Date().getTime(),
          _version:  1 ,
          classification: "DRIVER" ,
          on_duty: 
              driverItem && driverItem.on_duty !== null
                ? driverItem.on_duty
                : ""
          ,
          shift:  driverItem && driverItem.shift !== null ? driverItem.shift : "",
          
          carrier_id: driverItem && driverItem.id !== null ? driverItem.id : "",
          
          carrier_name: driverItem && driverItem.name !== null ? driverItem.name : "",
          tenant_id:
              driverItem && driverItem.tenant_id !== null
                ? driverItem.tenant_id
                : "",
          tenant_name: 
              driverItem && driverItem.tenant_name !== null
                ? driverItem.tenant_name
                : "",
          tenant_type: 
              driverItem && driverItem.tenant_type !== null
                ? driverItem.tenant_type
                : "",
          driver_carrier_tenant: 
              driverItem && driverItem.id !== null
                ? `${driverItem.driver_id}${driverItem.id}${driverItem.tenant_id}`
                : "",

          phone_no: 
              driverItem && driverItem.phone_no !== null
                ? driverItem.phone_no
                : "",
          email: 
              driverItem && driverItem.email !== null
                ? driverItem.email
                : "",
          on_duty: 
              driverItem && driverItem.on_duty !== null
                ? driverItem.on_duty
                : "",
          trailer_number:
              driverItem && driverItem.trailer_number !== null
                ? driverItem.trailer_number
                : "",
          truck_number: 
              driverItem && driverItem.truck_number !== null
                ? driverItem.truck_number
                : "",
          no_of_assigned_loads: 
              driverItem && driverItem.no_of_assigned_loads !== null
                ? driverItem.no_of_assigned_loads
                : "",
          accepted_load_id: 
              driverItem && driverItem.accepted_load_id !== null
                ? driverItem.accepted_load_id
                : "",
          assign_load_status: 
              driverItem && driverItem.driver_load_status !== null
                ? driverItem.driver_load_status
                : "0", 
          assigned_load_ids: driverItem && driverItem.assigned_load_ids !== null
          ? driverItem.assigned_load_ids
          : "", 
          assigned_boxes: boxes ?? [],
              // driverItem && driverItem.assigned_boxes !== null
              //   ? driverItem.assigned_boxes
              //   : [],
          check_in: 
              driverItem && driverItem.check_in !== null
                ? driverItem.check_in
                : "",
          checked_time: 
              driverItem && driverItem.checked_time !== null
                ? driverItem.checked_time
                : "",
          last_delivered_date:
              driverItem && driverItem.last_delivered_date !== null
                ? driverItem.last_delivered_date
                : "",
          carrier_status: 
            driverItem ? driverItem.carrier_status : "",
          turns_per_shift: driverItem ? driverItem.turns_per_shift : "",
          avatar: driverItem ? driverItem.avatar : "",
          no_of_load_delivered_in_current_shift:driverItem
              ? driverItem.no_of_load_delivered_in_current_shift
              : "",
          driver_linked_status:  driverItem ? driverItem.driver_linked_status : "",
        });

        itemList.push({
          PutRequest: {
            Item: marshalled_item,
          },
        });
        if (
          dynamoDriver[
            `DRIVER#${driverItem.driver_id}#${driverItem.tenant_id}#${driverItem.id}`
          ]
        ) {
          delete dynamoDriver[
            `DRIVER#${driverItem.driver_id}#${driverItem.tenant_id}#${driverItem.id}`
          ];
        }
        
        if (
          (index % 24 === 0 && index !== 0) ||
          index === response.data.data.length - 1
        ) {
          batch_list.push(itemList);
          itemList = [];
        }
      // });
        index++;
      }
     

      console.log("-----left drivers", Object.keys(dynamoDriver).length);
      if (Object.keys(dynamoDriver).length > 0) {
        itemList = [];
        Object.keys(dynamoDriver).map((key) => {
          console.log("batch delete items----",key)
          let driver = dynamoDriver[key];
          if (itemList.length >= 24) {
            batch_list.push(itemList);
            itemList = [];
          }
          itemList.push({
            DeleteRequest: {
              Key: {
                id: { S: driver.id },
                cat: { S: driver.cat },
              },
            },
          });
        });
        batch_list.push(itemList);
        // console.log("batch delete items----", batch_list.length);
      }
      for (let batchList of batch_list) {
        var params = {
          RequestItems: {
            // [process.env.API_CATHERD_CATHERDTABLE_NAME]: batchList
            [process.env.API_CATHERD_CATHERDTABLE_NAME]: batchList,
          },
        };
        try {
          const lambdaResult = await myDocClient
            .batchWriteItem(params)
            .promise();
          console.log("batch sucessfull", lambdaResult);
        } catch (e) {
          console.log("batch error", e);
          batchList.map((re) => console.log(re.PutRequest.Item.id));
        }
      }
    }
  } catch (e) {
    console.log("error--------", e);
    return null;
  }
};

const getDrDeckByList = async (_variables) => {
  // get driver accepted loads and verion information
  try {
    const response = await axios({
      url: process.env.API_CATHERD_GRAPHQLAPIENDPOINTOUTPUT,
      method: "post",
      headers: {
        Authorization: "SUPER_ACCESS_DD",
      },
      data: {
        query: print(listCatHerds),
        variables: _variables,
      },
    });
    if (response.data.data.listCatHerds.items)
      return response.data.data.listCatHerds.items;
    else return null;
  } catch (err) {
    console.log("Error Getting Zone", err);
  }
};
