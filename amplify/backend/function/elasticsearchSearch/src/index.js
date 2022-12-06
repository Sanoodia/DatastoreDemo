  /* Amplify Params - DO NOT EDIT
    API_CATHERD_CATHERDTABLE_ARN
    API_CATHERD_CATHERDTABLE_NAME
    API_CATHERD_GRAPHQLAPIENDPOINTOUTPUT
    API_CATHERD_GRAPHQLAPIIDOUTPUT
    API_CATHERD_GRAPHQLAPIKEYOUTPUT
    ENV
    REGION
  Amplify Params - DO NOT EDIT *//* Amplify Params - DO NOT EDIT
    API_CATHERD_GRAPHQLAPIENDPOINTOUTPUT
    API_CATHERD_GRAPHQLAPIIDOUTPUT
    API_CATHERD_GRAPHQLAPIKEYOUTPUT
    ENV
    REGION
  Amplify Params - DO NOT EDIT *//**
  * @type {import('@types/aws-lambda').APIGatewayProxyHandler}
  */
  const { searchDocument, getSdkPaginatedData } = require("./apiCalls");
  const { validateToken } = require("/opt/envHelpers");

  const AWS = require('aws-sdk');

  var dynamodb = new AWS.DynamoDB.DocumentClient();

  exports.handler = async (event) => {
    const { token, index, action_type } = JSON.parse(event.body);
    const validateTokenRes = await validateToken(process.env.ENV, token);
    if (validateTokenRes) {
      switch (action_type) {
        case "UNASSIGNED_DRIVER_TEST":{
        const params = {
          KeyConditionExpression: "classification = :class AND tenant_id = :t  ",
          FilterExpression: "dd_tenant = :dd_t",
          ExpressionAttributeNames:{"#version":"_version"},
          // Define the expression attribute value, which are substitutes for the values you want to compare.
          ExpressionAttributeValues: {
          ":class": "DRIVER",
          ":dd_t":  "TENANT#",
          ":t":  JSON.parse(event.body).tenant_id
          },
          IndexName: "byTenantClass",
          // Set the projection expression, which are the attributes that you want.
          ProjectionExpression: "driver_name, phone_no, carrier_name, carrier_status, id, #version,cat",
          TableName: process.env.API_CATHERD_CATHERDTABLE_NAME
        };
        let response = await getSdkPaginatedData(params,[])
        return {
            statusCode: 200,
            headers: {
              "Access-Control-Allow-Methods": "GET, POST, PUT, PATCH, POST, DELETE, OPTIONS",
              "Access-Control-Allow-Headers": "Content-Type",
              "Access-Control-Allow-Origin": "*",
            },

            body: JSON.stringify(response),
          };

        }
        case "GET_ZONE_DRIVER": {
          //GET ALL ZONES MATCHING GIVEN TENANT ID
          let zoneQuery = {
            query: {
              match: {
                tenant_id: JSON.parse(event.body).tenant_id,
              },
            },

            size: 10000,
            _source: {
              includes: ["id", "z_name"],
            },
          };
          let searchDocumentRes = await searchDocument(
            "zones",
            JSON.stringify(zoneQuery),
            "_search"
          );

          let result = {};
          let getDrivers = JSON.parse(searchDocumentRes).hits.hits.map(
            async (e) => {
              let driversQuery = {
                query: {
                  bool: {
                    should: [{
                      bool: {
                        must: [{
                            range: {
                              "gsi1sk.keyword": {
                                gte: e._source.id,
                                lte: e._source.id,
                              },
                            },
                          },
                          {
                            range: {
                              "check_in.keyword": {
                                gte: "1",
                                lte: "1",
                              },
                            },
                          },
                        ],
                        must_not: [],
                      },
                    }, ],
                  },
                },
              };
              let jobsQuery = {
                query: {
                  match_phrase_prefix: {
                    gsi1sk: e._source.id,
                  },
                },
              };
              let loadsQuery = {
                query: {
                  bool: {
                    must: [{
                        match_phrase_prefix: {
                          gsi1sk: e._source.id,
                        },
                      },
                      {
                        bool: {
                          should: [{
                              match_phrase_prefix: {
                                load_status: "0",
                              },
                            },
                            {
                              match_phrase_prefix: {
                                load_status: "3",
                              },
                            },
                          ],
                        },
                      },
                    ],
                    must_not: {
                      term: {
                        is_assigned: true,
                      },
                    },
                  },
                },
              };

              result[e._source.id] = {
                zone_id: e._source.id,
                zone_name: e._source.z_name,
                drivers: JSON.parse(
                  await searchDocument(
                    "drivers",
                    JSON.stringify(driversQuery),
                    "_count"
                  )
                ).count,
                loads: JSON.parse(
                  await searchDocument(
                    "loads",
                    JSON.stringify(loadsQuery),
                    "_count"
                  )
                ).count,
                jobs: JSON.parse(
                  await searchDocument(
                    "jobs",
                    JSON.stringify(jobsQuery),
                    "_count"
                  )
                ).count,
              };
            }
          );
          return Promise.all(getDrivers).then(async () => {
            let unassignedDriversQuery = {
              query: {
                bool: {
                  should: [{
                    bool: {
                      must: [{
                          range: {
                            "gsi1sk.keyword": {
                              gte: "ZONE#",
                              lte: "ZONE#",
                            },
                          },
                        },
                        {
                          range: {
                            "classification.keyword": {
                              gte: "DRIVER",
                              lte: "DRIVER",
                            },
                          },
                        },
                        {
                          range: {
                            "dd_tenant.keyword": {
                              gte: `TENANT#${JSON.parse(event.body).tenant_id}`,
                              lte: `TENANT#${JSON.parse(event.body).tenant_id}`,
                            },
                          },
                        },
                      ],
                      must_not: [],
                    },
                  }, ],
                },
              },
            };
            result["ZONE#"] = {
              drivers: JSON.parse(
                await searchDocument(
                  "drivers",
                  JSON.stringify(unassignedDriversQuery),
                  "_count"
                )
              ).count,
            };
            return {
              statusCode: 200,
              headers: {
                "Access-Control-Allow-Methods": "GET, POST, PUT, PATCH, POST, DELETE, OPTIONS",
                "Access-Control-Allow-Headers": "Content-Type",
                "Access-Control-Allow-Origin": "*",
              },

              body: JSON.stringify(result),
            };
          });
        }
        case "GET_CARRIER_DRIVER": {
          //GET ALL ZONES MATCHING GIVEN TENANT ID
          let zoneQuery = {
            query: {
              match: {
                tenant_id: JSON.parse(event.body).tenant_id,
              },
            },

            size: 10000,
            _source: {
              includes: ["id", "z_name"],
            },
          };
          let searchDocumentRes = await searchDocument(
            "zones",
            JSON.stringify(zoneQuery),
            "_search"
          );
          let result = {};
          let getDrivers = JSON.parse(searchDocumentRes).hits.hits.map(
            async (e) => {
              let groupByQuery = {
                query: {
                  match_phrase_prefix: {
                    gsi1sk: e._source.id,
                  },
                },
                size: 0,
                aggs: {
                  carrier: {
                    terms: {
                      field: "carrier_id.keyword",
                      size: 10,
                    },
                    aggs: {
                      actual: {
                        terms: {
                          field: "shift.keyword",
                          size: 10,
                        },
                        aggs: {
                          checkedIn: {
                            filter: {
                              match: {
                                check_in: "1",
                              },
                            },
                          },
                        },
                      },
                    },
                  },
                  am_checkIn: {
                    filter: {
                      bool: {
                        must: [{
                            match: {
                              check_in: "1",
                            },
                          },
                          {
                            match: {
                              shift: "AM",
                            },
                          },
                        ],
                      },
                    },
                  },
                  pm_checkIn: {
                    filter: {
                      bool: {
                        must: [{
                            match: {
                              check_in: "1",
                            },
                          },
                          {
                            match: {
                              shift: "PM",
                            },
                          },
                        ],
                      },
                    },
                  },
                  am_actual: {
                    filter: {
                      match: {
                        shift: "AM",
                      },
                    },
                  },
                  pm_actual: {
                    filter: {
                      match: {
                        shift: "PM",
                      },
                    },
                  },
                },
              };
              let groupByResponse = await searchDocument(
                "drivers",
                JSON.stringify(groupByQuery),
                "_search"
              );

              const { buckets: carriersBucket } =
              JSON.parse(groupByResponse).aggregations.carrier;
              let carriers = {};
              for (let i = 0; i < carriersBucket.length; i++) {
                const { buckets: shiftBucket } = carriersBucket[i].actual;
                let shifts = {};
                let findTargetQuery = {
                  query: {
                    match_phrase_prefix: {
                      id: `CT#${carriersBucket[i].key}#${e._source.id.replace(
                        "ZONE#",
                        ""
                      )}`,
                    },
                  },
                };
                let findTargetsResponse = await searchDocument(
                  "targets",
                  JSON.stringify(findTargetQuery),
                  "_search"
                );
                for (let j = 0; j < shiftBucket.length; j++) {
                  const { hits: targetResult } =
                  JSON.parse(findTargetsResponse).hits;
                  let am_target =
                    targetResult.length > 0 ?
                    targetResult[0]._source.am_target :
                    0;
                  let pm_target =
                    targetResult.length > 0 ?
                    targetResult[0]._source.pm_target :
                    0;

                  shifts[shiftBucket[j].key] = {
                    actual: shiftBucket[j].doc_count,
                    checkedIn: shiftBucket[j].checkedIn.doc_count,
                    target: shiftBucket[j].key === "AM" ? am_target : pm_target,
                  };
                }
                carriers[carriersBucket[i].key] = shifts;
              }

              result[e._source.id] = {
                carriers,
                am_actual: JSON.parse(groupByResponse).aggregations.am_actual.doc_count,
                pm_actual: JSON.parse(groupByResponse).aggregations.pm_actual.doc_count,
                pm_checkIn: JSON.parse(groupByResponse).aggregations.pm_checkIn.doc_count,
                am_checkIn: JSON.parse(groupByResponse).aggregations.am_checkIn.doc_count,
              };
            }
          );
          return Promise.all(getDrivers).then(async () => {
            return {
              statusCode: 200,
              headers: {
                "Access-Control-Allow-Methods": "GET, POST, PUT, PATCH, POST, DELETE, OPTIONS",
                "Access-Control-Allow-Headers": "Content-Type",
                "Access-Control-Allow-Origin": "*",
              },

              body: JSON.stringify(result),
            };
          });
        }

        case "GET_ZONE_BY_TENANT": {
          let groupByTenants = {
            size: 0,
            aggs: {
              tenants: {
                terms: {
                  field: "tenant_id.keyword",
                  size: 10,
                },
                aggs: {
                  am_targets: {
                    sum: {
                      field: "am_target",
                    },
                  },
                  pm_targets: {
                    sum: {
                      field: "pm_target",
                    },
                  },
                },
              },
            },
          };

          let groupByResponse = await searchDocument(
            "targets",
            JSON.stringify(groupByTenants),
            "_search"
          );
          let result = {};
          let getDrivers = JSON.parse(
            groupByResponse
          ).aggregations.tenants.buckets.map(async (e) => {
            let driverQuery = {
              query: {
                bool: {
                  must: [{
                    range: {
                      "dd_tenant.keyword": {
                        gte: `TENANT#${e.key}`,
                        lte: `TENANT#${e.key}`,
                      },
                    },
                  }, ],
                  must_not: [{
                    range: {
                      "gsi1sk.keyword": {
                        gte: "ZONE#",
                        lte: "ZONE#",
                      },
                    },
                  }, ],
                },
              },
              size: 0,
              aggs: {
                am_checkIn: {
                  filter: {
                    bool: {
                      must: [{
                          match: {
                            check_in: "1",
                          },
                        },
                        {
                          match: {
                            shift: "AM",
                          },
                        },
                      ],
                    },
                  },
                },
                pm_checkIn: {
                  filter: {
                    bool: {
                      must: [{
                          match: {
                            check_in: "1",
                          },
                        },
                        {
                          match: {
                            shift: "PM",
                          },
                        },
                      ],
                    },
                  },
                },
                am_actual: {
                  filter: {
                    match: {
                      shift: "AM",
                    },
                  },
                },
                pm_actual: {
                  filter: {
                    match: {
                      shift: "PM",
                    },
                  },
                },
              },
            };
            let searchDrivers = JSON.parse(
              await searchDocument(
                "drivers",
                JSON.stringify(driverQuery),
                "_search"
              )
            );
            result[e.key] = {
              // zones: {
              pm_target: e.pm_targets.value,
              am_target: e.am_targets.value,
              // },
              // drivers: {
              am_checkIn: searchDrivers.aggregations.am_checkIn.doc_count,
              pm_checkIn: searchDrivers.aggregations.pm_checkIn.doc_count,
              am_actual: searchDrivers.aggregations.am_actual.doc_count,
              pm_actual: searchDrivers.aggregations.pm_actual.doc_count,
              // },
            };
          });

          return Promise.all(getDrivers).then(async () => {
            return {
              statusCode: 200,
              headers: {
                "Access-Control-Allow-Methods": "GET, POST, PUT, PATCH, POST, DELETE, OPTIONS",
                "Access-Control-Allow-Headers": "Content-Type",
                "Access-Control-Allow-Origin": "*",
              },

              body: JSON.stringify(result),
            };
          });
        }
        case "GET_ZONE_BY_CARRIER": {
          let resultObj = {};
          let groupByTenants = {
            size: 0,
            query: {
              bool: {
                must: [{
                  range: {
                    "carrier_id.keyword": {
                      gte: JSON.parse(event.body).carrier_id,
                      lte: JSON.parse(event.body).carrier_id,
                    },
                  },
                }, ],
                must_not: [{
                  range: {
                    "gsi1sk.keyword": {
                      gte: "ZONE#",
                      lte: "ZONE#",
                    },
                  },
                }, ],
              },
            },
            aggs: {
              tenants: {
                terms: {
                  field: "tenant_id.keyword",
                  size: 10,
                },
                aggs: {
                  am_targets: {
                    sum: {
                      field: "am_target",
                    },
                  },
                  pm_targets: {
                    sum: {
                      field: "pm_target",
                    },
                  },
                  tenant_name: {
                    terms: {
                      field: "tenant_name.keyword",
                    },
                  },
                },
              },
            },
          };

          let groupByResponse = await searchDocument(
            "targets",
            JSON.stringify(groupByTenants),
            "_search"
          );
          let result = [];
          let getDrivers = JSON.parse(
            groupByResponse
          ).aggregations.tenants.buckets.map(async (e) => {
            let driverQuery = {
              query: {
                bool: {
                  must: [{
                      range: {
                        "dd_tenant.keyword": {
                          gte: `TENANT#${e.key}`,
                          lte: `TENANT#${e.key}`,
                        },
                      },
                    },
                    {
                      range: {
                        "carrier_id.keyword": {
                          gte: JSON.parse(event.body).carrier_id,
                          lte: JSON.parse(event.body).carrier_id,
                        },
                      },
                    },
                  ],
                  must_not: [{
                    range: {
                      "gsi1sk.keyword": {
                        gte: "ZONE#",
                        lte: "ZONE#",
                      },
                    },
                  }, ],
                },
              },
              size: 0,
              aggs: {
                am_checkIn: {
                  filter: {
                    bool: {
                      must: [{
                          match: {
                            check_in: "1",
                          },
                        },
                        {
                          match: {
                            shift: "AM",
                          },
                        },
                      ],
                    },
                  },
                },
                pm_checkIn: {
                  filter: {
                    bool: {
                      must: [{
                          match: {
                            check_in: "1",
                          },
                        },
                        {
                          match: {
                            shift: "PM",
                          },
                        },
                      ],
                    },
                  },
                },
                am_actual: {
                  filter: {
                    match: {
                      shift: "AM",
                    },
                  },
                },
                pm_actual: {
                  filter: {
                    match: {
                      shift: "PM",
                    },
                  },
                },
              },
            };
            let searchDrivers = JSON.parse(
              await searchDocument(
                "drivers",
                JSON.stringify(driverQuery),
                "_search"
              )
            );
            result.push({
              name: e.tenant_name.buckets[0].key,
              id: e.key,
              pm_target: e.pm_targets.value,
              am_target: e.am_targets.value,
              am_checkIn: searchDrivers.aggregations.am_checkIn.doc_count,
              pm_checkIn: searchDrivers.aggregations.pm_checkIn.doc_count,
              am_actual: searchDrivers.aggregations.am_actual.doc_count,
              pm_actual: searchDrivers.aggregations.pm_actual.doc_count,
              // },
            });
          });
          let unassignedDriversQuery = {
            query: {
              bool: {
                must: [{
                    range: {
                      "dd_tenant.keyword": {
                        gte: "TENANT#",
                        lte: "TENANT#",
                      },
                    },
                  },
                  {
                    range: {
                      "carrier_id.keyword": {
                        gte: JSON.parse(event.body).carrier_id,
                        lte: JSON.parse(event.body).carrier_id,
                      },
                    },
                  },
                ],
              },
            },
            size: 0,
          };
          let unassgnedDrivers = JSON.parse(
            await searchDocument(
              "drivers",
              JSON.stringify(unassignedDriversQuery),
              "_search"
            )
          );
          // result.push({
          //   name: "unassigned",
          //   id: "unassigned",
          //   drivers: unassgnedDrivers.hits.total.value,
          // });
          resultObj.unassigned = {
            name: "unassigned",
            id: "unassigned",
            drivers: unassgnedDrivers.hits.total.value,
          };
          resultObj.customers = result;
          return Promise.all(getDrivers).then(async () => {
            return {
              statusCode: 200,
              headers: {
                "Access-Control-Allow-Methods": "GET, POST, PUT, PATCH, POST, DELETE, OPTIONS",
                "Access-Control-Allow-Headers": "Content-Type",
                "Access-Control-Allow-Origin": "*",
              },

              body: JSON.stringify(resultObj),
            };
          });
        }
        case "GET_UNASSIGNED_DRIVERS": {
          let unassignedDriversQuery = {
            query: {
              bool: {
                should: [
                  {
                    bool: {
                      must: [
                        {
                          range: {
                            "classification.keyword": {
                              gte: "DRIVER",
                              lte: "DRIVER",
                            },
                          },
                        },
                        {
                          range: {
                            "tenant_id.keyword": {
                              gte: JSON.parse(event.body).tenant_id,
                              lte: JSON.parse(event.body).tenant_id,
                            },
                          },
                        },
                        {
                          range: {
                            "dd_tenant.keyword": {
                              gte: `TENANT#`,
                              lte: `TENANT#`,
                            },
                          },
                        },
                      ],
                      must_not: [],
                    },
                  },
                ],
              },
            },
            _source: {
              includes: [
                "id",
                "version",
                "driver_name",
                "carrier_name",
                "driver_linked_status",
                "phone_no",
                "cat"
              ],
            },
            size: 10000,
          };
          const unassgnedDrivers = JSON.parse(
            await searchDocument(
              "drivers",
              JSON.stringify(unassignedDriversQuery),
              "_search"
            )
          ).hits.hits;
  
          let filteredData = [];
          for (let i = 0; i < unassgnedDrivers.length; i++) {
            filteredData.push(unassgnedDrivers[i]._source);
          }
  
          return {
            statusCode: 200,
            headers: {
              "Access-Control-Allow-Methods":
                "GET, POST, PUT, PATCH, POST, DELETE, OPTIONS",
              "Access-Control-Allow-Headers": "Content-Type",
              "Access-Control-Allow-Origin": "*",
            },
  
            body: JSON.stringify(filteredData),
          };
        }
        case "QUERY": {
          let searchDocumentRes = await searchDocument(
            index,
            JSON.stringify(JSON.parse(event.body).query),
            "_search"
          );
          return {
            statusCode: 200,
            body: searchDocumentRes,
          };
        }
        default:
          return {
            statusCode: 400,
              body: JSON.stringify({ error: "Invalid Action Type" }),
          };
      }
    }
    else {
      if (action_type === "OPEN_URL_CARRIER_INFO") {
        //ES QUERY TO GET AM SHIFT DRIVERS THAT ARE ASSIGNED
        let assigned_AM_DQ = {
          query: {
            bool: {
              should: [{
                bool: {
                  must: [{
                      range: {
                        "gsi1sk.keyword": {
                          gte: "ZONE#" + JSON.parse(event.body).zone_id,
                          lte: "ZONE#" + JSON.parse(event.body).zone_id,
                        },
                      },
                    },
                    {
                      range: {
                        "carrier_id.keyword": {
                          gte: JSON.parse(event.body).carrier_id,
                          lte: JSON.parse(event.body).carrier_id,
                        },
                      },
                    },
                    {
                      term: {
                        is_assigned: true,
                      },
                    },
                    {
                      range: {
                        "shift.keyword": {
                          gte: "AM",
                          lte: "AM",
                        },
                      },
                    },
                  ],
                  must_not: [],
                },
              }, ],
            },
          },
          _source: {
            includes: ["driver_name", "phone_no"],
          },
          size: 10000,
        };
        //ES QUERY TO GET AM SHIFT DRIVERS THAT ARE ASSIGNED

        let assigned_PM_DQ = {
          query: {
            bool: {
              should: [{
                bool: {
                  must: [{
                      range: {
                        "gsi1sk.keyword": {
                          gte: "ZONE#" + JSON.parse(event.body).zone_id,
                          lte: "ZONE#" + JSON.parse(event.body).zone_id,
                        },
                      },
                    },
                    {
                      range: {
                        "carrier_id.keyword": {
                          gte: JSON.parse(event.body).carrier_id,
                          lte: JSON.parse(event.body).carrier_id,
                        },
                      },
                    },
                    {
                      term: {
                        is_assigned: true,
                      },
                    },
                    {
                      range: {
                        "shift.keyword": {
                          gte: "PM",
                          lte: "PM",
                        },
                      },
                    },
                  ],
                  must_not: [],
                },
              }, ],
            },
          },
          _source: {
            includes: ["driver_name", "phone_no"],
          },
          size: 10000,
        };
        //ES QUERY TO GET AM SHIFT DRIVERS THAT ARE CHECKED IN
        let checkIn_AM_DQ = {
          query: {
            bool: {
              should: [{
                bool: {
                  must: [{
                      range: {
                        "gsi1sk.keyword": {
                          gte: "ZONE#" + JSON.parse(event.body).zone_id,
                          lte: "ZONE#" + JSON.parse(event.body).zone_id,
                        },
                      },
                    },
                    {
                      range: {
                        "carrier_id.keyword": {
                          gte: JSON.parse(event.body).carrier_id,
                          lte: JSON.parse(event.body).carrier_id,
                        },
                      },
                    },
                    {
                      range: {
                        "check_in.keyword": {
                          gte: "1",
                          lte: "1",
                        },
                      },
                    },
                    {
                      range: {
                        "shift.keyword": {
                          gte: "AM",
                          lte: "AM",
                        },
                      },
                    },
                  ],
                  must_not: [],
                },
              }, ],
            },
          },
          _source: {
            includes: ["driver_name", "phone_no"],
          },
          size: 10000,
        };
        //ES QUERY TO GET PM SHIFT DRIVERS THAT ARE CHECKED IN
        let checkIn_PM_DQ = {
          query: {
            bool: {
              should: [{
                bool: {
                  must: [{
                      range: {
                        "gsi1sk.keyword": {
                          gte: "ZONE#" + JSON.parse(event.body).zone_id,
                          lte: "ZONE#" + JSON.parse(event.body).zone_id,
                        },
                      },
                    },
                    {
                      range: {
                        "carrier_id.keyword": {
                          gte: JSON.parse(event.body).carrier_id,
                          lte: JSON.parse(event.body).carrier_id,
                        },
                      },
                    },
                    {
                      range: {
                        "check_in.keyword": {
                          gte: "1",
                          lte: "1",
                        },
                      },
                    },
                    {
                      range: {
                        "shift.keyword": {
                          gte: "PM",
                          lte: "PM",
                        },
                      },
                    },
                  ],
                  must_not: [],
                },
              }, ],
            },
          },
          _source: {
            includes: ["driver_name", "phone_no"],
          },
          size: 10000,
        };
        //ES QUERY TO GET AM SHIFT DRIVERS THAT ARE NOT CHECKED IN
        let notCheckIn_AM_DQ = {
          query: {
            bool: {
              should: [{
                bool: {
                  must: [{
                      range: {
                        "gsi1sk.keyword": {
                          gte: "ZONE#" + JSON.parse(event.body).zone_id,
                          lte: "ZONE#" + JSON.parse(event.body).zone_id,
                        },
                      },
                    },
                    {
                      range: {
                        "carrier_id.keyword": {
                          gte: JSON.parse(event.body).carrier_id,
                          lte: JSON.parse(event.body).carrier_id,
                        },
                      },
                    },
                    {
                      range: {
                        "shift.keyword": {
                          gte: "AM",
                          lte: "AM",
                        },
                      },
                    },
                  ],
                  must_not: [{
                    range: {
                      "check_in.keyword": {
                        gte: "1",
                        lte: "1",
                      },
                    },
                  }, ],
                },
              }, ],
            },
          },
          _source: {
            includes: ["driver_name", "phone_no"],
          },
          size: 10000,
        };
        //ES QUERY TO GET PM SHIFT DRIVERS THAT ARE NOT CHECKED IN
        let notCheckIn_PM_DQ = {
          query: {
            bool: {
              should: [{
                bool: {
                  must: [{
                      range: {
                        "gsi1sk.keyword": {
                          gte: "ZONE#" + JSON.parse(event.body).zone_id,
                          lte: "ZONE#" + JSON.parse(event.body).zone_id,
                        },
                      },
                    },
                    {
                      range: {
                        "carrier_id.keyword": {
                          gte: JSON.parse(event.body).carrier_id,
                          lte: JSON.parse(event.body).carrier_id,
                        },
                      },
                    },
                    {
                      range: {
                        "shift.keyword": {
                          gte: "PM",
                          lte: "PM",
                        },
                      },
                    },
                  ],
                  must_not: [{
                    range: {
                      "check_in.keyword": {
                        gte: "1",
                        lte: "1",
                      },
                    },
                  }, ],
                },
              }, ],
            },
          },
          _source: {
            includes: ["driver_name", "phone_no"],
          },
          size: 10000,
        };
        //ES QUERY TO GET THE CARRIER INFO
        let carrierQuery = {
          query: {
            bool: {
              should: [{
                bool: {
                  must: [{
                      range: {
                        "gsi1sk.keyword": {
                          gte: "ZONE#" + JSON.parse(event.body).zone_id,
                          lte: "ZONE#" + JSON.parse(event.body).zone_id,
                        },
                      },
                    },
                    {
                      range: {
                        "carrier_id.keyword": {
                          gte: JSON.parse(event.body).carrier_id,
                          lte: JSON.parse(event.body).carrier_id,
                        },
                      },
                    },
                  ],
                  must_not: [],
                },
              }, ],
            },
          },

          size: 10000,
        };
        //ES QUERY TO GET THE ZONE INFO
        let zoneQuery = {
          query: {
            bool: {
              should: [{
                bool: {
                  must: [{
                    range: {
                      "id.keyword": {
                        gte: "ZONE#" + JSON.parse(event.body).zone_id,
                        lte: "ZONE#" + JSON.parse(event.body).zone_id,
                      },
                    },
                  }, ],
                  must_not: [],
                },
              }, ],
            },
          },

          size: 10000,
        };

        const checkIn_AM_DR = JSON.parse(
          await searchDocument(
            "drivers",
            JSON.stringify(checkIn_AM_DQ),
            "_search"
          )
        ).hits.hits;

        let checkIn_PM_DR = JSON.parse(
          await searchDocument(
            "drivers",
            JSON.stringify(checkIn_PM_DQ),
            "_search"
          )
        ).hits.hits;
        const notCheckIn_AM_DR = JSON.parse(
          await searchDocument(
            "drivers",
            JSON.stringify(notCheckIn_AM_DQ),
            "_search"
          )
        ).hits.hits;
        const notCheckIn_PM_DR = JSON.parse(
          await searchDocument(
            "drivers",
            JSON.stringify(notCheckIn_PM_DQ),
            "_search"
          )
        ).hits.hits;

        const assigned_AM_DR = JSON.parse(
          await searchDocument(
            "drivers",
            JSON.stringify(assigned_AM_DQ),
            "_search"
          )
        ).hits.hits;
        const assigned_PM_DR = JSON.parse(
          await searchDocument(
            "drivers",
            JSON.stringify(assigned_PM_DQ),
            "_search"
          )
        ).hits.hits;
        const carrierResponse = JSON.parse(
          await searchDocument("targets", JSON.stringify(carrierQuery), "_search")
        ).hits.hits;
        const zoneResponse = JSON.parse(
          await searchDocument("zones", JSON.stringify(zoneQuery), "_search")
        ).hits.hits;
        if (carrierResponse.length === 1)
          return {
            statusCode: 200,
            headers: {
              "Access-Control-Allow-Methods": "GET, POST, PUT, PATCH, POST, DELETE, OPTIONS",
              "Access-Control-Allow-Headers": "Content-Type",
              "Access-Control-Allow-Origin": "*",
            },

            body: JSON.stringify({
              carrierName: carrierResponse[0]._source.carrier_name,
              AM: {
                shift_start: zoneResponse[0]._source.am_shift_start_time,
                stats: {
                  checkedIn: checkIn_AM_DR.length,
                  actual: checkIn_AM_DR.length + notCheckIn_AM_DR.length,
                  targets: carrierResponse[0]._source.am_target,
                  assigned: assigned_AM_DR.length,
                },
                drivers: {
                  checkedIn: checkIn_AM_DR,
                  notCheckedIn: notCheckIn_AM_DR,
                },
              },
              PM: {
                shift_start: zoneResponse[0]._source.pm_shift_start_time,

                stats: {
                  checkedIn: checkIn_PM_DR.length,
                  actual: checkIn_PM_DR.length + notCheckIn_PM_DR.length,
                  targets: carrierResponse[0]._source.pm_target,
                  assigned: assigned_PM_DR.length,
                },
                drivers: {
                  checkedIn: checkIn_PM_DR,
                  notCheckedIn: notCheckIn_PM_DR,
                },
              },
            }),
          };
        else {
          return {
            statusCode: 404,
            headers: {
              "Access-Control-Allow-Methods": "GET, POST, PUT, PATCH, POST, DELETE, OPTIONS",
              "Access-Control-Allow-Headers": "Content-Type",
              "Access-Control-Allow-Origin": "*",
            },

            body: JSON.stringify({
              error: "Invalid Carrier Id",
            }),
          };
        }
      }
      else
        return {
          statusCode: 400,
          headers: {
            "Access-Control-Allow-Methods": "GET, POST, PUT, PATCH, POST, DELETE, OPTIONS",
            "Access-Control-Allow-Headers": "Content-Type",
            "Access-Control-Allow-Origin": "*",
          },
          body: JSON.stringify({ error: "Invalid Token" }),
        };
    }
  };
