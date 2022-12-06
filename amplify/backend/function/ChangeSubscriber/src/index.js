/* Amplify Params - DO NOT EDIT
API_CATHERD_CATHERDTABLE_ARN
API_CATHERD_CATHERDTABLE_NAME
API_CATHERD_GLOBALLOOKUPSTABLE_ARN
API_CATHERD_GLOBALLOOKUPSTABLE_NAME
API_CATHERD_GRAPHQLAPIENDPOINTOUTPUT
API_CATHERD_GRAPHQLAPIIDOUTPUT
API_CATHERD_GRAPHQLAPIKEYOUTPUT
ENV
REGION
STORAGE_PDEVENTS_ARN
STORAGE_PDEVENTS_NAME
STORAGE_PDEVENTS_STREAMARN
Amplify Params - DO NOT EDIT */
/* Amplify Params - DO NOT EDIT
API_CATHERD_CATHERDTABLE_ARN
API_CATHERD_CATHERDTABLE_NAME
API_CATHERD_GRAPHQLAPIENDPOINTOUTPUT
API_CATHERD_GRAPHQLAPIIDOUTPUT
API_CATHERD_GRAPHQLAPIKEYOUTPUT
ENV
REGION
STORAGE_PDEVENTS_ARN
STORAGE_PDEVENTS_NAME
STORAGE_PDEVENTS_STREAMARN
Amplify Params - DO NOT EDIT */
/* Amplify Params - DO NOT EDIT
API_CATHERD_GRAPHQLAPIENDPOINTOUTPUT
API_CATHERD_GRAPHQLAPIIDOUTPUT
API_CATHERD_GRAPHQLAPIKEYOUTPUT
ENV
REGION
Amplify Params - DO NOT EDIT */

/**
 * @type {import('@types/aws-lambda').APIGatewayProxyHandler}
 */

const pd = require("pd");
const dd = require("sync_sdk");
const helper = require("helper");

exports.handler = async (event) => {
  const deleteLoad = async (loadid) => {
    console.log("load to be deleted", loadid);
    const loadData = await dd.getLoadById({
      load_id: loadid,
    });
    console.log("Load to be deleted", loadData);
    if (Array.isArray(loadData)) {
      for (let load of loadData) {
        await dd.deleteLoad(load.id, load.cat, load._version);
        await helper.deleteForever({ id: load.id, cat: load.cat });
      }
      if (loadData[0]?.assigned_driver) {
        const driverData = await dd.getDriverById({
          driver_id: loadData[0].assigned_driver,
        });
        let driverDetails = await pd.getDriverDetail(
          loadData[0].assigned_driver
        );
        if (driverData) {
          let driverUpdateList = driverData.map((driver_data) => {
            let updatedDriver = driverDetails.find(
              (driver) =>
              driver.tenant_id === driver_data.tenant_id &&
              driver.id === driver_data.carrier_id
            );
            return dd.updateDrDeck({
              id: driver_data.id,
              cat: driver_data.cat,
              accepted_load_id: "",
              is_assigned: updatedDriver.no_of_assigned_loads !== "0" ||
                updatedDriver.accepted_load_id !== "" ?
                true : false,
              assign_load_status: updatedDriver.driver_load_status,
              no_of_assigned_loads: updatedDriver.no_of_assigned_loads,
              assigned_load_ids: updatedDriver.assigned_load_ids,
              _version: driver_data._version,
            });
          });
          await Promise.all(driverUpdateList);
        }
      }
      else {
        console.log("No assigned driver found with the load:", event);
      }
    }
    else {
      console.log("Failed to get load to delete:", event);
    }
  };
  //  record updated from sqs to sns

  // ------------------------------------------------ CASE RUN -----------------------------------------------

  console.log("}}}}", JSON.stringify(event));
  if (event.Records) {
    for (let rec of event.Records) {
      let body = JSON.parse(rec.Sns.Message);
      let tempBody = {...body};
      await helper.logEvent(tempBody);
      body.ActionType= parseInt(body.ActionType)

      try {
        switch (parseInt(body.ActionType)) {
          case 0: {
            console.log("Add Load......");

            const { loadid, jobid } = body;
            console.log(jobid);
            const loadJobs = await dd.getDataByClassandId({
              classification: "JOB",
              id: { eq: `JOB#${jobid}` },
            });
            const loadDetail = await pd.getLoadDetail(loadid);
            for (let loadJob of loadJobs) {
              let load = loadDetail.find(
                (l) => l.tenant_id === loadJob.tenant_id
              );
              if (load && loadJob) {
                await dd.addLoad(load, loadJob);
              }
              else {
                console.log("Failed to perform action: ", body);
                break;
              }
            }
            break;
          }
          case 1: {
            console.log("Assign Load......");

            if (!body.Driver || !body.loadid) {
              console.log("Not Receving all required Data:", body);
              break;
            }
            const driverData = await dd.getDriverById({
              driver_id: body.Driver,
            });
            const loadData = await dd.getLoadById({
              load_id: body.loadid,
            });
            console.log("load data", loadData);
            let driverDetails = await pd.getDriverDetail(body.Driver);
            if (
              Array.isArray(driverData) &&
              Array.isArray(loadData) &&
              loadData.length > 0
            ) {
              const driverUpdateList = driverData.map((driver_data) => {
                let updatedDriver = driverDetails.find(
                  (driver) =>
                  driver.tenant_id === driver_data.tenant_id &&
                  driver.id === driver_data.carrier_id
                );
                return dd.updateDrDeck({
                  id: driver_data.id,
                  cat: driver_data.cat,
                  is_assigned: true,
                  assign_load_status: updatedDriver.driver_load_status,
                  assigned_load_ids: updatedDriver.assigned_load_ids,
                  no_of_assigned_loads: updatedDriver.no_of_assigned_loads,
                  _version: driver_data._version,
                });
              });
              let loadUpdateList = loadData.map((load) => {
                return dd.updateDrDeck({
                  id: load.id,
                  cat: load.cat,
                  assigned_driver: body.Driver,
                  load_status: "1",
                  is_assigned: true,
                  _version: load._version,
                });
              });
              await Promise.all([...driverUpdateList, ...loadUpdateList]);
            }
            else {
              console.log("Failed to perform action: ", body);
              break;
            }
            break;
          }
          case 2: {
            console.log("Driver Accepted......");

            //first we update the load
            let { loadid, jobid, Driver, ActionType } = body;
            let driverDetails = await pd.getDriverDetail(body.Driver);

            const loadData = await dd.getLoadById({
              load_id: loadid,
            });
            const driverData = await dd.getDriverById({
              driver_id: Driver,
            });
            if (
              loadData &&
              Array.isArray(loadData) &&
              loadData.length > 0 &&
              driverData
            ) {
              const driverUpdateList = driverData.map((driver_data) => {
                let updatedDriver = driverDetails.find(
                  (driver) =>
                  driver.tenant_id === driver_data.tenant_id &&
                  driver.id === driver_data.carrier_id
                );
                let updatedLoad = loadData.find(
                  (load) => load.tenant_id === driver_data.tenant_id
                );
                return dd.updateDrDeck({
                  id: driver_data.id,
                  cat: driver_data.cat,
                  accepted_load_id: `${loadid}`,
                  is_assigned: true,
                  job_name: loadData[0]?.job_name ?? "",
                  load_no: loadData[0]?.load_no ?? "",
                  assign_load_status: updatedDriver.driver_load_status,
                  assigned_load_ids: updatedDriver.assigned_load_ids,
                  no_of_assigned_loads: updatedDriver.no_of_assigned_loads,
                  _version: driver_data._version,
                });
              });
              let loadUpdateList = loadData.map((load) => {
                return dd.updateDrDeck({
                  id: load.id,
                  cat: load.cat,
                  assigned_driver: Driver,
                  load_status: "2",
                  is_assigned: true,
                  _version: load._version,
                });
              });
              await Promise.all([...loadUpdateList, ...driverUpdateList]);
            }
            else {
              console.log("Failed to perform action: ", body);
            }
            break;
          }
          case 3: {
            console.log("Driver Declined......");
            const loadData = await dd.getLoadById({
              load_id: body.loadid,
            });
            let driverDetails = await pd.getDriverDetail(body.Driver);

            if (
              loadData &&
              Array.isArray(loadData) &&
              loadData.length > 0 &&
              driverDetails
            ) {
              const driverData = await dd.getDriverById({
                driver_id: loadData[0]?.assigned_driver,
              });
              if (driverData) {
                let driverUpdateList = driverData.map((driver_data) => {
                  let updatedDriver = driverDetails.find(
                    (driver) =>
                    driver.tenant_id === driver_data.tenant_id &&
                    driver.id === driver_data.carrier_id
                  );
                  return dd.updateDrDeck({
                    id: driver_data.id,
                    cat: driver_data.cat,
                    accepted_load_id: "",
                    is_assigned: updatedDriver.no_of_assigned_loads !== "0" ||
                      updatedDriver.accepted_load_id !== "" ?
                      true : false,
                    job_name: "",
                    load_no: "",
                    assign_load_status: updatedDriver.driver_load_status,
                    no_of_assigned_loads: updatedDriver.no_of_assigned_loads,
                    assigned_load_ids: updatedDriver.assigned_load_ids,
                    _version: driver_data._version,
                  });
                });
                let loadUpdateList = loadData.map((load) => {
                  return dd.updateDrDeck({
                    id: load.id,
                    cat: load.cat,
                    assigned_driver: null,
                    load_status: "3",
                    is_assigned: false,
                    _version: load._version,
                  });
                });
                await Promise.all([...driverUpdateList, ...loadUpdateList]);
              }
              else {
                console.log("Unable to get driver", body);
              }
            }
            else {
              console.log("Unable to get loads or driver_details", body);
            }
            break;
          }
          case 4:
          case 5:
          case 6: {
            console.log(
              "Load At Terminal, Load At In-Transit or Load At Destination..."
            );

            if (body.Driver) {
              let driverDetails = await pd.getDriverDetail(body.Driver);
              const driverData = await dd.getDriverById({
                driver_id: body.Driver,
              });
              if (driverData) {
                const driverUpdateList = driverData.map((driver_data) => {
                  let updatedDriver = driverDetails.find(
                    (driver) =>
                    driver.tenant_id === driver_data.tenant_id &&
                    driver.id === driver_data.carrier_id
                  );
                  return dd.updateDrDeck({
                    id: driver_data.id,
                    cat: driver_data.cat,
                    assign_load_status: body.ActionType,
                    assigned_load_ids: updatedDriver.assigned_load_ids,
                    no_of_assigned_loads: updatedDriver.no_of_assigned_loads,
                    _version: driver_data._version,
                  });
                });
                await Promise.all(driverUpdateList);
              }
            }
            const loadData = await dd.getLoadById({
              load_id: body.loadid,
            });
            if (Array.isArray(loadData) && loadData.length > 0) {
              let loadUpdateList = loadData.map((load) => {
                return dd.updateDrDeck({
                  id: load.id,
                  cat: load.cat,
                  load_status: body.ActionType,
                  _version: load._version,
                });
              });

              await Promise.all(loadUpdateList);
            }
            else {
              console.log("Unable to get the load Data", event);
            }

            break;
          }
          case 7: {
            console.log("Load Delivered...");

            const { loadid, Time } = body;
            const loadData = await dd.getLoadById({
              load_id: body.loadid,
            });

            console.log(loadData);
            if (Array.isArray(loadData) && loadData.length > 0) {
              for (let load of loadData) {
                await dd.updateDrDeck({
                  id: load.id,
                  cat: load.cat,
                  load_status: "7",
                  _version: load._version,
                });
                await helper.deleteForever({
                  id: load.id,
                  cat: load.cat,
                });
              }
            }
            else {
              console.log("Unable to find load", body);
            }
            if (body.Driver) {
              let driverDetails = await pd.getDriverDetail(body.Driver);
              const driverData = await dd.getDriverById({
                driver_id: body.Driver,
              });
              const alldriverUpdates = driverData.map((driver_data) => {
                let updatedDriver = driverDetails.find(
                  (driver) =>
                  driver.tenant_id === driver_data.tenant_id &&
                  driver.id === driver_data.carrier_id
                );
                return dd.updateDrDeck({
                  id: driver_data.id,
                  cat: driver_data.cat,
                  last_delivered_date: Time,
                  turns_per_shift: driverDetails.turns_per_shift ??
                    driver_data.turns_per_shift,
                  no_of_load_delivered_in_current_shift: driverDetails.no_of_load_delivered_in_current_shift ??
                    driver_data.no_of_load_delivered_in_current_shift,
                  accepted_load_id: "",
                  assign_load_status: updatedDriver.driver_load_status,
                  assigned_load_ids: updatedDriver.assigned_load_ids,
                  no_of_assigned_loads: updatedDriver.no_of_assigned_loads,
                  is_assigned: updatedDriver.no_of_assigned_loads !== "0" ||
                    updatedDriver.accepted_load_id !== "" ?
                    true : false,
                  load_no: "",
                  job_name: "",
                  _version: driver_data._version,
                });
              });
              await Promise.all(alldriverUpdates);
            }
            else {
              console.log("No assigned driver", body);
            }
            break;
          }
          case 8: {
            // load transfered
            let { loadid, jobid } = body;
            const loadData = await dd.getLoadById({
              load_id: loadid,
            });
            const loadJobs = await dd.getDataByClassandId({
              classification: "JOB",
              id: { eq: `JOB#${jobid}` },
            });
            const loadDetail = await pd.getRunningLoadDetail(loadid);
            for (let load of loadData) {
              let loadItem = loadDetail.find(
                (l) => l.tenant_id === load.tenant_id
              );
              let loadJob = loadJobs.find(
                (j) => j.tenant_id === load.tenant_id
              );
              console.log(
                "---------------",
                loadItem,
                loadJob,
                load,
                "---------"
              );
              if (load && loadItem && loadJob) {
                await dd.updateDrDeck({
                  id: load.id,
                  cat: load.cat,
                  _version: load._version,
                  job_name: loadItem.job_name,
                  load_name: loadItem.product_name,
                  classification: "LOAD",
                  gsi1sk: loadJob.gsi1sk ?? "ZONE#",
                  district_id: loadJob.district_id,
                  district_name: loadJob.district_name,
                  type: `LOAD_${loadJob.gsi1sk}`,
                  linked_terminal_id: loadItem.linked_terminal_id ?? "",
                  terminal_id: loadItem.terminal_id ?? "",
                  terminal_name: loadItem.terminal_name ?? "",
                  linked_product_id: loadItem.linked_product_id ?? "",
                  product_id: loadItem.product_id ?? "",
                  product_name: loadItem.product_name ?? "",
                  stage: loadItem.stage ?? "",
                  tenant_id: loadItem.tenant_id,
                  tenant_name: loadItem.tenant_name ?? "",
                  tenant_type: loadItem.tenant_type ?? "",
                  job_name: loadItem.job_name ?? "",
                  load_status: load.load_status,
                });
              }
              else {
                console.log("Failed to perform action: ", body);
                break;
              }
            }
            break;
          }
          case 9: {
            console.log("Load Cancelled");
            if (body.loadid) {
              const loadData = await dd.getLoadById({
                load_id: body.loadid,
              });
              if (
                Array.isArray(loadData) &&
                loadData.length > 0 &&
                loadData[0]?.assigned_driver
              ) {
                const driverData = await dd.getDriverById({
                  driver_id: loadData[0].assigned_driver,
                });

                const alldriverUpdates = driverData.map(async (driver_data) => {
                  let driverDetails = await pd.getDriverDetail(
                    driver_data.driver_id
                  );
                  let updatedDriver = driverDetails.find(
                    (driver) =>
                    driver.tenant_id === driver_data.tenant_id &&
                    driver.id === driver_data.carrier_id
                  );
                  return dd.updateDrDeck({
                    id: driver_data.id,
                    cat: driver_data.cat,
                    is_assigned: updatedDriver.no_of_assigned_loads !== "0" ||
                      updatedDriver.accepted_load_id !== "" ?
                      true : false,
                    assign_load_status: updatedDriver.driver_load_status,
                    assigned_load_ids: updatedDriver.assigned_load_ids,
                    no_of_assigned_loads: updatedDriver.no_of_assigned_loads,
                    _version: driver_data._version,
                  });
                });
                await Promise.all(alldriverUpdates);
              }
              await deleteLoad(body.loadid);
              break;
            }
            else {
              console.log("Failed to perform action: ", body);
              break;
            }
          }
          case 10: {
            console.log("Updating Load Driver");

            const { Driver, loadid } = body;

            const loadData = await dd.getLoadById({
              load_id: body.loadid,
            });
            if (Array.isArray(loadData) && loadData.length > 0) {
              let oldDriverDetails = await pd.getDriverDetail(
                loadData[0]?.assigned_driver
              );
              const oldDriver = await dd.getDriverById({
                driver_id: loadData[0].assigned_driver,
              });

              let newDriverDetails = await pd.getDriverDetail(body.Driver);
              const newDriver = await dd.getDriverById({
                driver_id: Driver,
              });

              // now we remove the accepted load of oldDriver
              if (Array.isArray(oldDriver) && Array.isArray(oldDriverDetails)) {
                let oldDriverUpdates = oldDriver.map((driver_data) => {
                  let updatedDriver = oldDriverDetails.find(
                    (driver) =>
                    driver.tenant_id === driver_data.tenant_id &&
                    driver.id === driver_data.carrier_id
                  );
                  return dd.updateDrDeck({
                    id: driver_data.id,
                    cat: driver_data.cat,
                    accepted_load_id: "",
                    assigned_load_ids: updatedDriver.assigned_load_ids,
                    is_assigned: updatedDriver.no_of_assigned_loads !== "0" ||
                      updatedDriver.accepted_load_id !== "" ?
                      true : false,
                    assign_load_status: updatedDriver.driver_load_status,
                    no_of_assigned_loads: updatedDriver.no_of_assigned_loads,
                    job_name: "",
                    load_no: "",
                    _version: driver_data._version,
                  });
                });
                await Promise.all(oldDriverUpdates);
              }
              else {
                console.log("Unable to upload old driver");
              }
              if (
                Array.isArray(newDriver) &&
                Array.isArray(newDriverDetails) &&
                loadData
              ) {
                let newDriverUpdates = newDriver.map((driver_data) => {
                  let updatedDriver = newDriverDetails.find(
                    (driver) =>
                    driver.tenant_id === driver_data.tenant_id &&
                    driver.id === driver_data.carrier_id
                  );
                  return dd.updateDrDeck({
                    id: driver_data.id,
                    cat: driver_data.cat,
                    accepted_load_id: `${loadid}`,
                    assign_load_status: updatedDriver.driver_load_status,
                    is_assigned: updatedDriver.no_of_assigned_loads !== "0" ||
                      updatedDriver.accepted_load_id !== "" ?
                      true : false,
                    no_of_assigned_loads: updatedDriver.no_of_assigned_loads,
                    assigned_load_ids: updatedDriver.assigned_load_ids,
                    job_name: loadData[0]?.job_name ?? "",
                    load_no: loadData[0]?.load_no ?? "",
                    _version: driver_data._version,
                  });
                });
                await Promise.all(newDriverUpdates);
              }
              else {
                console.log("Unable to update new driver");
              }
              let allLoadUpdates = loadData.map((load) => {
                return dd.updateDrDeck({
                  id: load.id,
                  cat: load.cat,
                  assigned_driver: Driver,
                  load_status: "2",
                  is_assigned: true,
                  _version: load._version,
                });
              });
              await Promise.all(allLoadUpdates);
            }
            else {
              console.log("Unable to update load: ", body);
            }
            break;
          }
          case 11: {
            console.log("Adding Job....");

            let { jobid } = body;
            //lets get the list of all zones
            let jobDetails = await pd.getJobDetail(jobid);
            if (!jobDetails || !Array.isArray(jobDetails)) {
              console.log(
                "Unable to get job detail for event: ",
                jobDetails,
                body
              );
              break;
            }
            for (let jobDetail of jobDetails) {
              const zonesList = await dd.getAllByTenantId({
                tenant_id: jobDetail.tenant_id,
                cat: { eq: "ZONE" },
              });
              const zones = zonesList.filter((zone) => zone._deleted !== true);
              console.log(zones);
              let theZone = null;
              //first trying to match the basin
              if (jobDetail && (jobDetail.basin_id || jobDetail.district_id)) {
                if (!theZone && jobDetail.crew_id)
                  theZone = zones.find(
                    (zone) => zone.crew && zone.crew.includes(jobDetail.crew_id)
                  );

                if (!theZone && jobDetail.basin_id) {
                  theZone = zones.find(
                    (zone) =>
                    zone.basin && zone.basin.includes(jobDetail.basin_id)
                  );
                }
                if (!theZone && jobDetail.district_id)
                  theZone = zones.find(
                    (zone) =>
                    zone.district &&
                    zone.district.includes(jobDetail.district_id)
                  );

                if (!theZone) {
                  await dd.addJob(jobDetail, null);
                }
                else {
                  let zoneId = theZone.id;
                  let version = theZone._version;
                  if (jobDetail && zoneId) {
                    let jobs = theZone.jobs ?
                      theZone.jobs.concat(`,${jobDetail.id}`) :
                      jobDetail.id;
                    //updating zone as well as job at the same time
                    await dd.updateZone(zoneId, version, jobs);
                    await dd.addJob(jobDetail, zoneId);
                  }
                  else {
                    console.log("Unable to get zoneId,");
                  }
                }
              }
              else {
                console.log("Failed to perform action: ", body);
              }
            }
            break;
            //case 11 ends
          }
          case 12: {
            console.log("Updating Job....");

            let { jobid } = body;
            const jobData = await dd.getDataByClassandId({
              classification: "JOB",
              id: { eq: `JOB#${jobid}` },
            });

            let jobDetails = await pd.getJobDetail(jobid);

            for (let oldData of jobData) {
              let jobDetail = jobDetails.find(
                (j) => j.tenant_id == oldData.tenant_id
              );

              //now we will check if the carrier is added.

              let { tenant_id } = jobDetail;
              const jobLoads = await dd.getLoadsByJobId(jobid, tenant_id);

              if (jobDetail && jobDetail.district_id !== oldData.district_id) {
                // we have district update

                const loadUpdateList = jobLoads.map((load) => {
                  return dd.updateDrDeck({
                    id: load.id,
                    cat: load.cat,
                    _version: load._version,
                    district_id: jobDetail.district_id,
                    district_name: jobDetail.district_name,
                  });
                });
                await Promise.all(loadUpdateList);
              }

              // checking for any extra linked carrier and making it work

              if (
                jobDetail.linked_carrier.length > oldData.linked_carrier.length
              ) {
                // new carrier is added
                let newCarriers = jobDetail.linked_carrier.filter(
                  (x) =>
                  !oldData.linked_carrier.find(
                    (y) => y.carrier_id === x.carrier_id
                  )
                );

                console.log("List of New Linked Carrier: ", newCarriers);

                for (const carrier of newCarriers) {
                  let { carrier_id } = carrier;
                  const driversList = await pd.getAllCarrierDriver(carrier_id);

                  if (!Array.isArray(driversList)) {
                    console.log("Failed to perform action: ", body);
                  }
                  else {
                    const allDrivers = driversList.filter(
                      (driver) => driver.tenant_id === tenant_id
                    );

                    if (allDrivers.length < 1) {
                      console.log("No Driver Added: ", body);
                    }

                    for (const driver of allDrivers) {
                      let driverData = await dd.getDriverById({
                        driver_id: driver.driver_id,
                      });
                      if (Array.isArray(driverData) && driverData.length < 1) {
                        await dd.addDriver(driver);
                      }
                      else {
                        await dd.addSameDriver(driver, driverData[0]);
                      }
                    }
                  }
                }
              }
              let oldZone = null;
              let newZone = null;
              if (!jobDetail || !oldData) {
                console.log("Failed to perform action: ", body);
                break;
              }
              if (
                oldData.crew_id !== jobDetail.crew_id ||
                oldData.basin_id !== jobDetail.basin_id ||
                oldData.district_id !== jobDetail.district_id
              ) {
                console.log("Zone needs updation");
                oldZone = oldData.gsi1sk;
                //now we will get all the new zone
                //for that get all the zones
                const zonesList = await dd.getAllByTenantId({
                  tenant_id,
                  cat: { eq: "ZONE" },
                });
                const zones = zonesList.filter(
                  (zone) => zone._deleted !== true
                );
                //now match the data
                if (!newZone && jobDetail.crew_id)
                  newZone = zones.find(
                    (zone) => zone.crew && zone.crew.includes(jobDetail.crew_id)
                  );
                if (!newZone && jobDetail.basin_id) {
                  newZone = zones.find(
                    (zone) =>
                    zone.basin && zone.basin.includes(jobDetail.basin_id)
                  );
                }
                //if unable to match the basin i will get the district
                if (!newZone && jobDetail.district_id)
                  newZone = zones.find(
                    (zone) =>
                    zone.district &&
                    zone.district.includes(jobDetail.district_id)
                  );

                console.log("New Zone and old zone: ", newZone, oldZone);
                if (newZone?.id === oldZone) {
                  //there is nothing for us to do
                  console.log("Same Zone so no updations required");
                  await dd.updateJob(jobDetail, oldData);
                }
                else {
                  console.log("We have different Zones");
                  //now we have to update the zone job and the loads.
                  const jobLoads = await dd.getLoadsByJobId(jobid, tenant_id);
                  //first we update the old zone
                  let loads = [];
                  if (Array.isArray(jobLoads)) {
                    loads = jobLoads.map((load) => load.load_id);
                  }
                  if (oldZone && oldZone !== "ZONE#") {
                    let zoneDetail = await dd.getDrDeck({
                      id: oldZone ?? "",
                      cat: "ZONE",
                    });
                    if (zoneDetail) {
                      zoneDetail.jobs = zoneDetail.jobs.replace(
                        `${jobid},`,
                        ""
                      );
                      zoneDetail.jobs = zoneDetail.jobs.replace(
                        `,${jobid}`,
                        ""
                      );
                      zoneDetail.jobs = zoneDetail.jobs.replace(`${jobid}`, "");
                      await dd.updateDrDeck({
                        id: zoneDetail.id,
                        cat: "ZONE",
                        loads: zoneDetail.loads,
                        jobs: zoneDetail.jobs,
                        _version: zoneDetail._version,
                      });
                    }
                  }

                  //now we update the new zone
                  if (newZone && newZone !== "ZONE#") {
                    let jobs = newZone.jobs ?
                      newZone.jobs.concat(`,${jobid}`) :
                      `${jobid}`;
                    loads.forEach((load) => {
                      newZone.loads = newZone.loads.concat(`,${load}`, "");
                    });
                    //updating zone as well as job at the same time
                    await dd.updateDrDeck({
                      id: newZone.id,
                      cat: "ZONE",
                      loads: newZone.loads,
                      jobs: jobs,
                      _version: newZone._version,
                    });
                  }
                  else {
                    console.log("Not adding job to any zone");
                  }
                  // now update the job
                  oldData.gsi1sk = newZone?.id ?? "ZONE#";
                  await dd.updateJob(jobDetail, oldData);

                  // finally updating all the loads
                  const allLoadUpdates = jobLoads.map((load) => {
                    return dd.updateDrDeck({
                      id: load.id,
                      cat: load.cat,
                      type: `LOAD_${newZone?.id ?? "ZONE#"}`,
                      gsi1sk: newZone?.id ?? "ZONE#",
                      job_name: jobDetail.name,
                      _version: load._version,
                    });
                  });
                  await Promise.all(allLoadUpdates);
                }
              }
              else {
                // hence there aren't any updates to crew, basin or district

                //we will simply update the data
                if (jobDetail && oldData) {
                  await dd.updateJob(jobDetail, oldData);
                  const allLoadUpdates = jobLoads.map((load) => {
                    return dd.updateDrDeck({
                      id: load.id,
                      cat: load.cat,
                      job_name: jobDetail.name,
                      _version: load._version,
                    });
                  });
                  await Promise.all(allLoadUpdates);
                }
                else {
                  console.log("Failed to perform action: ", body);
                }
              }
            }
            break;
          }

          case 13: {
            console.log("Deleting Job....");
            let { jobid } = body;
            const jobData = await dd.getDataByClassandId({
              classification: "JOB",
              id: { eq: `JOB#${jobid}` },
            });

            if (jobData && Array.isArray(jobData)) {
              for (let jobDetail of jobData) {
                if (jobDetail) {
                  let zoneDetail = await dd.getDrDeck({
                    id: jobDetail.gsi1sk ?? "",
                    cat: "ZONE",
                  });
                  if (zoneDetail) {
                    zoneDetail.jobs = zoneDetail.jobs.replace(`${jobid},`, "");
                    zoneDetail.jobs = zoneDetail.jobs.replace(`,${jobid}`, "");
                    zoneDetail.jobs = zoneDetail.jobs.replace(jobid, "");
                    await dd.updateZone(
                      zoneDetail.id,
                      zoneDetail._version,
                      zoneDetail.jobs
                    );
                  }
                  await dd.deleteDrDeck({
                    input: {
                      id: jobDetail.id,
                      cat: jobDetail.cat,
                      _version: jobDetail._version,
                    },
                  });
                  await helper.deleteForever({
                    id: jobDetail.id,
                    cat: jobDetail.cat,
                  });
                  const jobLoads = await dd.getLoadsByJobId(
                    jobDetail.id,
                    jobDetail.tenant_id
                  );
                  // getting all the loads of a job
                  if (Array.isArray(jobLoads)) {
                    const result = jobLoads.map((load) => {
                      if (Number.isInteger(load.load_id)) {
                        return deleteLoad(load.load_id);
                      }
                      else {
                        return Promise.resolve();
                      }
                    });
                    await Promise.all(result);
                  }
                }
              }
            }
            else {
              console.log("Failed to perform action: ", body);
              break;
            }
          }
          case 14: {
            console.log("Updating Driver Availability Status ....");
            const { Driver } = body;

            const oldData = await dd.getDriverById({
              driver_id: Driver,
            });
            if (Array.isArray(oldData)) {
              const updates = oldData.map((driver_data) => {
                return dd.updateDrDeck({
                  id: driver_data.id,
                  cat: driver_data.cat,
                  _version: driver_data._version,
                  on_duty: body.onduty,
                });
              });
              await Promise.all(updates);
              break;
            }
            else {
              console.log("Failed to perform action: ", body);
              break;
            }
          }
          case 15: {
            console.log("Updating Driver CheckIn Status ....");
            const { Driver } = body;

            const oldData = await dd.getDriverById({
              driver_id: Driver,
            });
            if (Array.isArray(oldData)) {
              const updates = oldData.map((driver_data) => {
                return dd.updateDrDeck({
                  id: driver_data.id,
                  cat: driver_data.cat,
                  _version: driver_data._version,
                  check_in: body.check_in,
                  checked_time: body.checked_time,
                });
              });
              await Promise.all(updates);
              break;
            }
            else {
              console.log("Failed to perform action: ", body);
              break;
            }
          }

          case 16: {
            console.log("Driver Added....");

            let driverDetails = await pd.getDriverDetail(body.Driver);
            const allDriverAdd = driverDetails.map((driverDetail) => {
              return dd.addDriver(driverDetail);
            });
            await Promise.all(allDriverAdd);
            break;
          }
          case 17: {
            console.log("Driver Deleted....");

            const { Driver } = body;
            const driverData = await dd.getDriverById({
              driver_id: Driver,
            });
            if (Array.isArray(driverData)) {
              const allDriverDelete = driverData.map((driver_data) => {
                return dd.deleteDrDeck({
                  input: {
                    id: driver_data.id,
                    cat: driver_data.cat,
                    _version: driver_data._version,
                  },
                });
              });
              await Promise.all(allDriverDelete);

              const allDriverPermanentDelete = driverData.map((driver_data) => {
                return helper.deleteForever({
                  id: driver_data.id,
                  cat: driver_data.cat,
                });
              });
              await Promise.all(allDriverPermanentDelete);
              break;
            }
            else {
              console.log("Failed to perform action: ", body);
              break;
            }
          }
          case 18: {
            console.log("Removing Driver of One Carrier");

            const driverData = await dd.getDriverById({
              driver_id: body.Driver,
              filter: {
                carrier_id: { eq: body.carrier_id },
              },
            });

            if (Array.isArray(driverData)) {
              const allDriverDelete = driverData.map((driver_data) => {
                return dd.deleteDrDeck({
                  input: {
                    id: driver_data.id,
                    cat: driver_data.cat,
                    _version: driver_data._version,
                  },
                });
              });
              await Promise.all(allDriverDelete);

              const allDriverPermanentDelete = driverData.map((driver_data) => {
                return helper.deleteForever({
                  id: driver_data.id,
                  cat: driver_data.cat,
                });
              });
              await Promise.all(allDriverPermanentDelete);
              break;
            }
            else {
              console.log("Failed to perform action: ", body);
              break;
            }
          }
          case 19: {
            console.log("Carrier Added");

            let { carrier_id, tenant_id } = body;
            const driversList = await pd.getAllCarrierDriver(carrier_id);

            if (!Array.isArray(driversList)) {
              console.log("Failed to perform action: ", body);
              break;
            }

            const allDrivers = driversList.filter(
              (driver) => driver.tenant_id === tenant_id
            );

            if (allDrivers.length < 1) {
              console.log("No Driver Added: ", body);
              break;
            }

            for (const driver of allDrivers) {
              let driverData = await dd.getDriverById({
                driver_id: driver.driver_id,
              });
              if (Array.isArray(driverData) && driverData.length < 1) {
                await dd.addDriver(driver);
              }
              else {
                await dd.addSameDriver(driver, driverData[0]);
              }
            }
            break;
          }
          case 20: {
            console.log("Carrier Status Changed");

            let { carrier_id, tenant_id, status } = body;

            if (status == "0") {
              console.log("Doing somethign");

              //get all the Targets with this combo
              const ctData = await dd.getDataByTenantClass({
                tenant_id: tenant_id,
                classification: { eq: "TARGET" },
                filter: { carrier_id: { eq: carrier_id } },
              });
              if (ctData) {
                //lets delete them
                let deleteCT = ctData.map((ct) => {
                  return dd.deleteDrDeck({
                    input: {
                      id: ct.id,
                      cat: ct.cat,
                      _version: ct._version,
                    },
                  });
                });
                await Promise.all(deleteCT);
                for (let ct of ctData) {
                  await helper.deleteForever({ id: ct.id, cat: ct.cat });
                }
              }
              else {
                console.log("No Targets Found");
              }
            }
            const driverData = await dd.getAllByCat(
              `DRIVER#${tenant_id}#${carrier_id}`
            );

            if (!Array.isArray(driverData)) {
              console.log("Failed to perform action: ", body);
              break;
            }

            if (driverData.length < 1) {
              console.log("NO driver to update status of ", body);
              break;
            }

            const listToUpdate = driverData.map((driver_data) => {
              return dd.updateDrDeck({
                id: driver_data.id,
                cat: driver_data.cat,
                carrier_status: status,
                _version: driver_data._version,
              });
            });

            await Promise.all(listToUpdate);
            break;
          }
          case 21: {
            console.log("Removing Carrier Drivers from tenant");

            let { carrier_id, tenant_id } = body;

            console.log(carrier_id, tenant_id);

            const driverData = await dd.getAllByCat(
              `DRIVER#${tenant_id}#${carrier_id}`
            );

            if (!Array.isArray(driverData)) {
              console.log("Failed to perform action: ", body);
              break;
            }

            let filteredDriverData = driverData.filter(
              (driver) => driver._deleted !== true
            );

            if (filteredDriverData.length < 1) {
              console.log("NO driver to remove ", body);
              break;
            }

            for (const driver_data of filteredDriverData) {
              await dd.deleteDrDeck({
                input: {
                  id: driver_data.id,
                  cat: driver_data.cat,
                  _version: driver_data._version,
                },
              });
              await helper.deleteForever({
                id: driver_data.id,
                cat: driver_data.cat,
              });
            }
          }
          case 22: {
            console.log("Deleting load....");
            if (body.loadid) {
              await deleteLoad(body.loadid);
            }
            else {
              console.log("Failed to perform action: ", body);
            }
            break;
          }
          case 23: {
            console.log("Job Carrier Status Change");
            //job carrier status changed
            let { jobid, carrier_id, status } = body;
            const jobData = await dd.getDataByClassandId({
              classification: "JOB",
              id: { eq: `JOB#${jobid}` },
            });

            let jobDetails = await pd.getJobDetail(jobid);
            for (let oldData of jobData) {
              let jobDetail = jobDetails.find(
                (j) => j.tenant_id == oldData.tenant_id
              );
              if (jobDetail && oldData) {
                await dd.updateJob(jobDetail, oldData);
                if (status == 1) {
                  console.log("Carrier was made active in job");
                  //Carrier was made active
                  // now I know this carrier id added.
                  if (oldData.gsi1sk.length > 6) {
                    let { gsi1sk } = oldData;
                    console.log(gsi1sk);
                    const allJobs = await dd.getByCat({
                      cat: `JOB#${oldData.tenant_id}`,
                      gsi1sk: { eq: gsi1sk },
                    });

                    let carrier_name = "";
                    jobDetail.linked_carrier.forEach((carrier) => {
                      if (carrier.carrier_id == carrier_id)
                        carrier_name = carrier.carrier_name;
                    });
                    let item = {
                      carrier_id,
                      tenant_id: oldData.tenant_id,
                      zone: oldData.gsi1sk,
                      tenant_name: oldData.tenant_name,
                      carrier_name: carrier_name,
                    };
                    await dd.addCarrierTarget(item);
                    break;
                  }
                  else {
                    console.log("No Zone for the job", body);
                    break;
                  }
                }
                else {
                  console.log("Carrier status made inactive in a job");
                  if (oldData) {
                    let { gsi1sk } = oldData;
                    console.log(gsi1sk);
                    const allJobs = await dd.getByCat({
                      cat: `JOB#${oldData.tenant_id}`,
                      gsi1sk: { eq: gsi1sk },
                    });
                    const ct = [];
                    allJobs.forEach((job) => {
                      console.log(job.id !== oldData.id, job.id, oldData.id);
                      if (
                        job.id !== oldData.id &&
                        Array.isArray(job.linked_carrier)
                      ) {
                        console.log(job.linked_carrier);
                        job.linked_carrier.forEach((carrier) => {
                          if (carrier.carrier_linked_status == "1")
                            ct.push(carrier.carrier_id);
                        });
                      }
                    });
                    if (!ct.includes(carrier_id)) {
                      const carrier_data = await dd.getDrDeck({
                        id: `CT#${carrier_id}#${oldData.gsi1sk.replace(
                          "ZONE#",
                          ""
                        )}`,
                        cat: `CT#${oldData.tenant_id}#${oldData.gsi1sk.replace(
                          "ZONE#",
                          ""
                        )}`,
                      });
                      await dd.deleteDrDeck({
                        input: {
                          id: carrier_data.id,
                          cat: carrier_data.cat,
                          _version: carrier_data._version,
                        },
                      });
                      await helper.deleteForever({
                        id: carrier_data.id,
                        cat: carrier_data.cat,
                      });
                      break;
                    }
                    else {
                      console.log(
                        "Another instance of Carrier exist so not deleting ct",
                        body
                      );
                      break;
                    }
                  }
                  else {
                    console.log("No Job Record Found", body);
                    break;
                  }
                }
              }
            }
          }
          case 24: {
            console.log("Updating Driver....");

            if (body.Driver) {
              if (Array.isArray(body.Driver)) {
                console.log("Updating the showl list")
                for (let driverId of body.Driver) {
                  const driverData = await dd.getDriverById({
                    driver_id: driverId,
                  });
                  let driverDetails = await pd.getDriverDetail(driverId);
                  if (driverData) {
                    const alldriverUpdated = driverData.map((driver_data) => {
                      let updatedDriver = driverDetails.filter(
                        (driver) =>
                        driver.tenant_id === driver_data.tenant_id &&
                        driver.id === driver_data.carrier_id
                      );
                      return dd.updateDriver(updatedDriver[0], driver_data);
                    });
                    await Promise.all(alldriverUpdated);
                  }
                  else {
                    console.log("Failed to perform action: ", body, driverId);
                  }
                }
              }
              else {
                const driverData = await dd.getDriverById({
                  driver_id: body.Driver,
                });
                let driverDetails = await pd.getDriverDetail(body.Driver);
                if (driverData) {
                  const alldriverUpdated = driverData.map((driver_data) => {
                    let updatedDriver = driverDetails.filter(
                      (driver) =>
                      driver.tenant_id === driver_data.tenant_id &&
                      driver.id === driver_data.carrier_id
                    );
                    return dd.updateDriver(updatedDriver[0], driver_data);
                  });
                  await Promise.all(alldriverUpdated);
                }
                else {
                  console.log("Failed to perform action: ", body);
                }
              }
            }
            else {
              console.log("Event Values Are Not Complete", body);
            }
            break;
          }
          case 25: {
            console.log("Load Reverted......");

            const { loadid, jobid } = body;

            const loadJobs = await dd.getDataByClassandId({
              classification: "JOB",
              id: { eq: `JOB#${jobid}` },
            });
            const loadDetail = await pd.getLoadDetail(loadid);
            for (let loadJob of loadJobs) {
              let load = loadDetail.find(
                (l) => l.tenant_id === loadJob.tenant_id
              );
              if (load && loadJob) {
                await dd.addLoad(load, loadJob);
              }
              else {
                console.log("Failed to perform action: ", body);
                break;
              }
            }
            break;
          }
          case 26: {
            console.log("Adding Driver to carrier");
            const { carrier_id, Driver } = body;

            const driverDetail = await pd.getDriverDetail(Driver);

            if (Array.isArray(driverDetail)) {
              const carrierDrivers = driverDetail.filter(
                (driver) => driver.id === carrier_id
              );
              const allDriverAdd = carrierDrivers.map((driver_data) => {
                return dd.addDriver(driver_data);
              });
              await Promise.all(allDriverAdd);
              break;
            }
            else {
              console.log("Failed to perform action: ", body);
              break;
            }
          }
          case 27: {
            console.log("Adding new carrier target");
            let { carrier_id, jobid } = body;
            let jobDetails = await pd.getJobDetail(jobid);

            for (let jobDetail of jobDetails) {
              let jobData = await dd.getDrDeck({
                id: `JOB#${jobid}`,
                cat: `JOB#${jobDetail.tenant_id}`,
              });

              if (jobData.gsi1sk.length > 6) {
                let { gsi1sk } = jobData;
                console.log(gsi1sk);
                // we have a zone
                //lets gather all the information to add
                let carrier_name = "";
                jobDetail.linked_carrier.forEach((carrier) => {
                  if (carrier.carrier_id == carrier_id)
                    carrier_name = carrier.carrier_name;
                });
                let item = {
                  carrier_id,
                  tenant_id: jobData.tenant_id,
                  zone: jobData.gsi1sk,
                  tenant_name: jobData.tenant_name,
                  carrier_name: carrier_name,
                };
                await dd.addCarrierTarget(item);
              }

            }
            break;
          }
          case 28: {
            console.log("removing carrier target");
            let { carrier_id, jobid } = body;
            let jobDetails = await pd.getJobDetail(jobid);

            if (!jobDetails || !Array.isArray(jobDetails)) {
              console.log(
                "Unable to get job detail for event: ",
                jobDetails,
                body
              );
              break;
            }
            for (let jobDetail of jobDetails) {
              let jobData = await dd.getDrDeck({
                id: `JOB#${jobid}`,
                cat: `JOB#${jobDetail.tenant_id}`,
              });
              if (jobData) {
                let { gsi1sk } = jobData;
                console.log(gsi1sk);
                const allJobs = await dd.getByCat({
                  cat: `JOB${jobDetail.tenant_id}`,
                  gsi1sk: { eq: gsi1sk },
                });
                const ct = [];
                allJobs.forEach((job) => {
                  console.log(job.id !== jobData.id, job.id, jobData.id);
                  if (
                    job.id !== jobData.id &&
                    Array.isArray(job.linked_carrier)
                  ) {
                    job.linked_carrier.forEach((carrier) => {
                      if (carrier.carrier_linked_status == "1")
                        ct.push(carrier.carrier_id);
                    });
                  }
                });
                if (!ct.includes(carrier_id)) {
                  const carrier_data = await dd.getDrDeck({
                    id: `CT#${carrier_id}#${jobData.gsi1sk.replace("ZONE#", "")}`,
                    cat: `CT#${jobData.tenant_id}#${jobData.gsi1sk.replace(
                    "ZONE#",
                    ""
                  )}`,
                  });
                  console.log("Carrier Data", carrier_data);
                  await dd.deleteDrDeck({
                    input: {
                      id: carrier_data.id,
                      cat: carrier_data.cat,
                      _version: carrier_data._version,
                    },
                  });
                  await helper.deleteForever({
                    id: carrier_data.id,
                    cat: carrier_data.cat,
                  });
                }
              }
              else {
                console.log("Unable to get job data");
              }

            }

            break;
          }
          case 29: {
            console.log("Box proppant type change (Dry/Wet)");

            if (body.Driver) {
              const driverData = await dd.getDriverById({
                driver_id: body.Driver,
              });
              let driverDetails = await pd.getDriverDetail(body.Driver);
              if (driverData && driverDetails) {
                const alldriverUpdated = driverData.map((driver_data) => {
                  let updatedDriver = driverDetails.find(
                    (driver) =>
                    driver.tenant_id === driver_data.tenant_id &&
                    driver.id === driver_data.carrier_id
                  );
                  return dd.updateDrDeck({
                    id: driver_data.id,
                    cat: driver_data.cat,
                    assigned_boxes: updatedDriver?.assigned_boxes.map((box) => {
                      return {
                        box_id: box.box_id,
                        box_number: box.box_number,
                        rolling_time: box.rolling_time !== "" ? new Date(box.rolling_time).toISOString() ?? new Date().toISOString() : null,
                        proppant_type: box.proppant_type,
                        proppant_type_id: box.proppant_type_id,
                      };
                    }) ?? [],
                    _version: driver_data._version,
                  });
                });
                await Promise.all(alldriverUpdated);
              }
              else {
                console.log("Failed to box Proppant type: ", body);
              }
            }
            else {
              console.log("Event Values Are Not Complete", body);
            }
            break;
          }
          case 30: {
            console.log("Boxes updated in driver profile");

            if (body.Driver) {
              const driverData = await dd.getDriverById({
                driver_id: body.Driver,
              });
              let driverDetails = await pd.getDriverDetail(body.Driver);
              if (driverData && driverDetails) {
                const alldriverUpdated = driverData.map((driver_data) => {
                  let updatedDriver = driverDetails.find(
                    (driver) =>
                      driver.tenant_id === driver_data.tenant_id &&
                      driver.id === driver_data.carrier_id
                  );
                  return dd.updateDrDeck({
                    id: driver_data.id,
                    cat: driver_data.cat,
                    assigned_boxes: updatedDriver?.assigned_boxes.map((box) => {
                      return {
                        box_id: box.box_id,
                        box_number: box.box_number,
                        rolling_time: box.rolling_time !== "" ? new Date(box.rolling_time).toISOString() ?? new Date().toISOString() : null,
                        proppant_type: box.proppant_type,
                        proppant_type_id: box.proppant_type_id,
                      };
                    }) ?? [],
                    _version: driver_data._version,
                  });
                });
                await Promise.all(alldriverUpdated);
              }
              else {
                console.log("Failed to box Proppant type: ", body);
              }
            }
            else {
              console.log("Event Values Are Not Complete", body);
            }
            break;
          }
          case 31: {
            console.log("Adding Crew");
            let { crew_id, tenant_id } = body;
            console.log(crew_id, tenant_id);

            let response = await pd.getCrewDetail(crew_id);
            let [toSave] = response.data;
            console.log("toSave", toSave);

            toSave && (await dd.addCrew(toSave));
            break;
          }
          case 32: {
            console.log("Updating Crew");
            let { crew_id, tenant_id } = body;
            const crewItem = await dd.getDrDeck({
              id: `CREW#${crew_id}`,
              cat: "CREW",
            });

            let response = await pd.getCrewDetail(crew_id);
            let [updatedCrew] = response.data;
            console.log("Crew Item", crewItem, "Updated Crew", updatedCrew);

            await dd.updateDrDeck({
              id: crewItem.id,
              cat: "CREW",
              crew_name: updatedCrew.name,
              tenant_id: updatedCrew.tenant_id ?? "",
              tenant_name: updatedCrew?.tenant_name ?? "",
              district_id: updatedCrew?.district_id ?? 0,
              _version: crewItem._version,
            });
            break;
          }
          case 33: {
            console.log("Deleting Crew");
            let { crew_id, tenant_id } = body;
            const crewItem = await dd.getDrDeck({
              id: `CREW#${crew_id}`,
              cat: "CREW",
            });
            await dd.deleteDrDeck({
              input: {
                id: crewItem.id,
                cat: crewItem.cat,
                _version: crewItem._version,
              },
            });
            break;
          }
          case 34: {
            console.log("Adding District");
            let { district_id, tenant_id } = body;
            let response = await pd.getDistrictDetail(district_id);
            let districtDetail = response.data;
            let toSave = null;
            districtDetail.map((district) => {
              if (district.tenant_id === tenant_id) toSave = district;
            });
            toSave && (await dd.addDistict(toSave));
            break;
          }
          case 35: {
            console.log("Updating District");
            let { district_id, tenant_id } = body;
            const districtItem = await dd.getDrDeck({
              id: `DISTRICT#${district_id}`,
              cat: "DISTRICT",
            });

            let response = await pd.getDistrictDetail(district_id);
            let [updatedDistrict] = response.data;
            console.log(
              "Crew Item",
              districtItem,
              "Updated Crew",
              updatedDistrict
            );
            await dd.updateDrDeck({
              id: districtItem.id,
              cat: "DISTRICT",
              district_name: updatedDistrict.name,
              tenant_id: updatedDistrict.tenant_id ?? "",
              tenant_name: updatedDistrict?.tenant_name ?? "",
              _version: districtItem._version,
            });
            break;
          }
          case 36: {
            console.log("Deleting District");
            let { district_id, tenant_id } = body;
            const districtItem = await dd.getDrDeck({
              id: `DISTRICT#${district_id}`,
              cat: "DISTRICT",
            });
            await dd.deleteDrDeck({
              input: {
                id: districtItem.id,
                cat: districtItem.cat,
                _version: districtItem._version,
              },
            });
            break;
          }

          default:
            console.log("No Case Triggered: ", event);
            break;
        }
      }
      catch (err) {
        console.log("Switch failed: ", err);
      }
    }
  }
};
