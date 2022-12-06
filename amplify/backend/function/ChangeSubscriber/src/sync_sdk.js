const axios = require("axios");
const graphql = require("graphql");
const { print } = graphql;
const gql = require("graphql-tag");

const {
  createCatHerd,
  updateCatHerd,
  deleteCatHerd,
} = require("/opt/graphql/mutations");

const {
  getCatHerd,
  getCatHerdByClassification,
  listCatHerds,
  loadByJobId,
  allLoadsById,
  allJobsByJobId,
  dataByCategory,
  dataByTenant,
  databyDriverId,
  databyCarrier,
  dataByTenantClass,
} = require("/opt/graphql/queries");

const { getPaginatedData } = require("/opt/envHelpers");

const getAllByTenantId = async (_variables) => {
  let variables = _variables;
  let query = dataByTenant;
  let queryName = "dataByTenant";
  let url = process.env.API_CATHERD_GRAPHQLAPIENDPOINTOUTPUT;
  let method = "post";
  try {
    let data = await getPaginatedData({
      variables,
      query,
      queryName,
      url,
      method,
    });
    return data;
  } catch (err) {
    console.log("Unable to get data", _variables);
    return null;
  }
};

const getAllByCat = async (cat) => {
  let variables = {
    cat: cat,
  };
  let query = dataByCategory;
  let queryName = "dataByCategory";
  let url = process.env.API_CATHERD_GRAPHQLAPIENDPOINTOUTPUT;
  let method = "post";
  try {
    let data = await getPaginatedData({
      variables,
      query,
      queryName,
      url,
      method,
    });
    return data;
  } catch (err) {
    console.log("Unable to get data by category", variables);
    return null;
  }
};
const getByCat = async (variables) => {
  let query = dataByCategory;
  let queryName = "dataByCategory";
  let url = process.env.API_CATHERD_GRAPHQLAPIENDPOINTOUTPUT;
  let method = "post";
  try {
    let data = await getPaginatedData({
      variables,
      query,
      queryName,
      url,
      method,
    });
    return data;
  } catch (err) {
    console.log("Unable to get data by category", variables);
    return null;
  }
};

const getDataByClassandId = async (_variables) => {
  let variables = _variables;
  let query = getCatHerdByClassification;
  let queryName = "getCatHerdByClassification";
  let url = process.env.API_CATHERD_GRAPHQLAPIENDPOINTOUTPUT;
  let method = "post";
  try {
    let data = await getPaginatedData({
      variables,
      query,
      queryName,
      url,
      method,
    });
    return data;
  } catch (err) {
    console.log("Unable to get data list by classification and id", _variables);
    return null;
  }
};

const getDriverById = async (_variables) => {
  let variables = _variables;
  let query = databyDriverId;
  let queryName = "databyDriverId";
  let url = process.env.API_CATHERD_GRAPHQLAPIENDPOINTOUTPUT;
  let method = "post";
  try {
    let data = await getPaginatedData({
      variables,
      query,
      queryName,
      url,
      method,
    });
    return data;
  } catch (err) {
    console.log("Unable to get driver list by id", _variables);
    return null;
  }
};
const getJobById = async (_variables) => {
  let variables = _variables;
  let query = allJobsByJobId;
  let queryName = "allJobsByJobId";
  let url = process.env.API_CATHERD_GRAPHQLAPIENDPOINTOUTPUT;
  let method = "post";
  try {
    let data = await getPaginatedData({
      variables,
      query,
      queryName,
      url,
      method,
    });
    return data;
  } catch (err) {
    console.log("Unable to get jobs list by id", _variables);
    return null;
  }
};

const getLoadById = async (_variables) => {
  let variables = _variables;
  let query = allLoadsById;
  let queryName = "allLoadsById";
  let url = process.env.API_CATHERD_GRAPHQLAPIENDPOINTOUTPUT;
  let method = "post";
  try {
    let data = await getPaginatedData({
      variables,
      query,
      queryName,
      url,
      method,
    });
    return data;
  } catch (err) {
    console.log("Unable to get loads list by id", _variables);
    return null;
  }
};
const getCarrierById = async (_variables) => {
  let variables = _variables;
  let query = databyCarrier;
  let queryName = "databyCarrier";
  let url = process.env.API_CATHERD_GRAPHQLAPIENDPOINTOUTPUT;
  let method = "post";
  try {
    let data = await getPaginatedData({
      variables,
      query,
      queryName,
      url,
      method,
    });
    return data;
  } catch (err) {
    console.log("Unable to get driver list by id", _variables);
    return null;
  }
};
const getDataByTenantClass = async (_variables) => {
  let variables = _variables;
  let query = dataByTenantClass;
  let queryName = "dataByTenantClass";
  let url = process.env.API_CATHERD_GRAPHQLAPIENDPOINTOUTPUT;
  let method = "post";
  try {
    let data = await getPaginatedData({
      variables,
      query,
      queryName,
      url,
      method,
    });
    return data;
  } catch (err) {
    console.log("Unable get list of targets of specific tenant", _variables);
    return null;
  }
};

const getDrDeck = async (_variables) => {
  // get driver accepted loads and verion information
  try {
    const response = await axios({
      url: process.env.API_CATHERD_GRAPHQLAPIENDPOINTOUTPUT,
      method: "post",
      headers: {
        Authorization: "SUPER_ACCESS_DD",
      },
      data: {
        query: print(
          gql`
            ${getCatHerd}
          `
        ),
        variables: _variables,
      },
    });
    if (response?.data?.data?.getCatHerd) return response.data.data.getCatHerd;
    else return null;
  } catch (err) {
    console.log("Error Getting Zone", err);
  }
};

const getLoadsByJobId = async (_jobId, _tenantId) => {
  let variables = {
    job_id: _jobId,
    cat: { eq: `LOAD#${_tenantId}` },
  };
  let query = loadByJobId;
  let queryName = "loadByJobId";
  let url = process.env.API_CATHERD_GRAPHQLAPIENDPOINTOUTPUT;
  let method = "post";
  try {
    let data = await getPaginatedData({
      variables,
      query,
      queryName,
      url,
      method,
    });
    return data;
  } catch (err) {
    console.log("Unable to get loads of job", variables);
    return null;
  }
};

const addLoad = async (loadItem, loadJob) => {
  try {
    let response = await axios({
      url: process.env.API_CATHERD_GRAPHQLAPIENDPOINTOUTPUT,
      method: "post",
      headers: {
        // 'x-api-key': process.env.API_CATHERD_GRAPHQLAPIKEYOUTPUT
        Authorization: "SUPER_ACCESS_DD",
      },
      data: {
        query: print(
          gql`
            ${createCatHerd}
          `
        ),
        variables: {
          input: {
            id: `LOAD#${loadItem.id}`,
            job_name: loadItem.job_name,
            load_name: loadItem.product_name,
            cat: `LOAD#${loadItem.tenant_id}`,
            classification: "LOAD",
            gsi1sk: loadJob.gsi1sk ?? "ZONE#",
            dd_tenant: `TENANT#${loadItem.tenant_id}`,
            district_id: loadJob.district_id,
            district_name: loadJob.district_name,
            type: `LOAD_${loadJob.gsi1sk}`,
            load_no: loadItem.load_no ?? "",
            job_id: loadItem.job_id ?? "",
            load_id: loadItem.id,
            linked_terminal_id: loadItem.linked_terminal_id ?? "",
            terminal_id: loadItem.terminal_id ?? "",
            terminal_name: loadItem.terminal_name ?? "",
            linked_product_id: loadItem.linked_product_id ?? "",
            product_id: loadItem.product_id ?? "",
            product_name: loadItem.product_name ?? "",
            stage: loadItem.stage ?? "",
            is_assigned: false,
            load_created_at:
              new Date(loadItem.load_created_at).toISOString() ??
              new Date().toISOString(),
            tenant_id: loadItem.tenant_id,
            tenant_name: loadItem.tenant_name ?? "",
            tenant_type: loadItem.tenant_type ?? "",
            job_name: loadItem.job_name ?? "",
            load_status: "0",
            operator_id:loadItem.operator_id ?? "" ,
            operator_name: loadItem.operator_name ?? "" ,
          },
        },
      },
    });
    if (response?.data?.data) console.log("success: ", response.data.data);
    else console.log("error inserting load in db : ", loadItem);
  } catch (err) {
    console.log("Error in sending data", err);
  }
};
const addDistict = async (districtItem) => {
  try {
    let response = await axios({
      url: process.env.API_CATHERD_GRAPHQLAPIENDPOINTOUTPUT,
      method: "post",
      headers: {
        // 'x-api-key': process.env.API_CATHERD_GRAPHQLAPIKEYOUTPUT
        Authorization: "SUPER_ACCESS_DD",
      },
      data: {
        query: print(
          gql`
            ${createCatHerd}
          `
        ),
        variables: {
          input: {
            id: `DISTRICT#${districtItem.id}`,
            district_name: districtItem.name,
            cat: "DISTRICT",
            tenant_id: districtItem.tenant_id ?? "",
            tenant_name: districtItem?.tenant_name ?? "",
            dd_tenant: `TENANT#${districtItem.tenant_id}`
          },
        },
      },
    });
    if (response?.data?.data) console.log("success: ", response.data.data);
    else console.log("error inserting district in db : ", districtItem);
  } catch (err) {
    console.log("Error in sending data", err);
  }
};
const addCrew = async (crewItem) => {
  try {
    let response = await axios({
      url: process.env.API_CATHERD_GRAPHQLAPIENDPOINTOUTPUT,
      method: "post",
      headers: {
        // 'x-api-key': process.env.API_CATHERD_GRAPHQLAPIKEYOUTPUT
        Authorization: "SUPER_ACCESS_DD",
      },
      data: {
        query: print(
          gql`
            ${createCatHerd}
          `
        ),
        variables: {
          input: {
            id: `CREW#${crewItem.id}`,
            crew_name: crewItem.name,
            cat: "CREW",
            tenant_id: crewItem.tenant_id ?? "",
            tenant_name: crewItem?.tenant_name ?? "",
            district_id: crewItem?.district_id ?? 0,
            dd_tenant: `TENANT#${crewItem.tenant_id}`
          },
        },
      },
    });
    if (response?.data?.data) console.log("success: ", response.data.data);
    else console.log("error inserting crew in db : ", crewItem);
  } catch (err) {
    console.log("Error in sending data", err);
  }
};

const addCarrierTarget = async (_item) => {
  try {
    let response = await axios({
      url: process.env.API_CATHERD_GRAPHQLAPIENDPOINTOUTPUT,
      method: "post",
      headers: {
        // 'x-api-key': process.env.API_CATHERD_GRAPHQLAPIKEYOUTPUT
        Authorization: "SUPER_ACCESS_DD",
      },
      data: {
        query: print(
          gql`
            ${createCatHerd}
          `
        ),
        variables: {
          input: {
            id: `CT#${_item.carrier_id}#${_item.zone.replace("ZONE#", "")}`,
            classification: "TARGET",
            cat: `CT#${_item.tenant_id}#${_item.zone.replace("ZONE#", "")}`,
            tenant_id: _item.tenant_id,
            carrier_id: _item.carrier_id,
            gsi1sk: _item.zone,
            dd_tenant: `TENANT#${_item.tenant_id}`,
            tenant_name: _item.tenant_name,
            am_target: 0,
            pm_target: 0,
            carrier_name: _item.carrier_name,
          },
        },
      },
    });
    if (response?.data?.data) console.log("success: ", response.data.data);
    else console.log("error inserting load in db : ", _item);
  } catch (err) {
    console.log("Error in adding carrier", err);
  }
};
const addJob = async (jobItem, zoneId) => {
  try {
    let response = await axios({
      url: process.env.API_CATHERD_GRAPHQLAPIENDPOINTOUTPUT,
      method: "post",
      headers: {
        // 'x-api-key': process.env.API_CATHERD_GRAPHQLAPIKEYOUTPUT
        Authorization: "SUPER_ACCESS_DD",
      },
      data: {
        query: print(
          gql`
            ${createCatHerd}
          `
        ),
        variables: {
          input: {
            id: `JOB#${jobItem.id}`,
            cat: `JOB#${jobItem.tenant_id}`,
            classification: "JOB",
            gsi1sk: zoneId ?? "ZONE#",
            dd_tenant: `TENANT#${jobItem.tenant_id}`,
            type: `JOB_${zoneId ?? "ZONE#"}`,
            tenant_id: jobItem.tenant_id,
            tenant_name: jobItem.tenant_name ? jobItem.tenant_name : "",
            tenant_type: jobItem.tenant_type,
            job_name: jobItem.name,
            job_id: jobItem.id,
            working_status: jobItem.working_status,
            job_status: jobItem.status,
            district_id: jobItem.district_id,
            district_name: jobItem.district_name,
            crew_id: jobItem.crew_id,
            crew_name: jobItem.crew_name,
            basin_id: jobItem.basin_id,
            basin_name: jobItem.basin_name,
            linked_carrier: jobItem.linked_carrier,
          },
        },
      },
    });
    if (response?.data?.data) {
      console.log("success: ", response.data.data);
    } else {
      console.log("error inserting job in db : ", jobItem);
    }
  } catch (err) {
    console.log("Error in sending data", err);
  }
};

const addDriver = async (driverItem) => {
  try {
    let response = await axios({
      url: process.env.API_CATHERD_GRAPHQLAPIENDPOINTOUTPUT,
      method: "post",
      headers: {
        // 'x-api-key': process.env.API_CATHERD_GRAPHQLAPIKEYOUTPUT
        Authorization: "SUPER_ACCESS_DD",
      },
      data: {
        query: print(
          gql`
            ${createCatHerd}
          `
        ),
        variables: {
          input: {
            id: `DRIVER#${driverItem.driver_id}#${driverItem.tenant_id}#${driverItem.id}`,
            cat: `DRIVER#${driverItem.tenant_id}#${driverItem.id}`,
            classification: "DRIVER",
            driver_id: driverItem.driver_id,
            phone_no: driverItem.phone_no,
            gsi1sk: "ZONE#",
            email: driverItem.email,
            on_duty: driverItem.on_duty,
            accepted_load_id: driverItem.accepted_load_id,
            assigned_boxes:
              driverItem?.assigned_boxes.map((box) => {
                return {
                  box_id: box.box_id,
                  box_number: box.box_number,
                  rolling_time: box.rolling_time !== "" ? new Date(box.rolling_time).toISOString() ?? new Date().toISOString() : null,
                  proppant_type: box.proppant_type,
                  proppant_type_id: box.proppant_type_id,
                };
              }) ?? [],
            last_delivered_date: driverItem.last_delivered_date,
            check_in: driverItem.check_in,
            checked_time: driverItem.checked_time,
            accepted_on_during_checked_in:
              driverItem.accepted_on_during_checked_in,
            trailer_number: driverItem.trailer_number,
            truck_number: driverItem.truck_number,
            type: "DRIVER_ZONE#",
            dd_tenant: "TENANT#",
            tenant_id: driverItem.tenant_id,
            tenant_name: driverItem.tenant_name,
            tenant_type: driverItem.tenant_type,
            driver_name: driverItem.driver_name,
            on_duty: driverItem.on_duty,
            shift: driverItem.shift,
            driver_status: driverItem.driver_status,
            driver_linked_status: driverItem.driver_linked_status,
            carrier_status: driverItem.carrier_status,
            turns_per_shift: driverItem.turns_per_shift,
            no_of_load_delivered_in_current_shift:
              driverItem.no_of_load_delivered_in_current_shift,
            carrier_id: driverItem.id,
            carrier_name: driverItem.name,
            user_id: driverItem.user_id,
            avatar: driverItem.avatar,
            is_assigned:
              driverItem.no_of_assigned_loads === "" ||
              driverItem.no_of_assigned_loads === "0"
                ? false
                : true,
            assigned_load_ids: driverItem.assigned_load_ids,
            assign_load_status: driverItem.driver_load_status,
            no_of_assigned_loads: driverItem.no_of_assigned_loads,
          },
        },
      },
    });
    if (response?.data?.data) {
      console.log("success: ", response.data.data);
    } else {
      console.log("error inserting driver in db : ", driverItem);
    }
  } catch (err) {
    console.log("Error in sending data", err);
  }
};

const addSameDriver = async (newDriverItem, driverItem) => {
  try {
    let response = await axios({
      url: process.env.API_CATHERD_GRAPHQLAPIENDPOINTOUTPUT,
      method: "post",
      headers: {
        // 'x-api-key': process.env.API_CATHERD_GRAPHQLAPIKEYOUTPUT
        Authorization: "SUPER_ACCESS_DD",
      },
      data: {
        query: print(
          gql`
            ${createCatHerd}
          `
        ),
        variables: {
          input: {
            id: `DRIVER#${newDriverItem.driver_id}#${newDriverItem.tenant_id}#${newDriverItem.id}`,
            cat: `DRIVER#${newDriverItem.tenant_id}#${newDriverItem.id}`,
            classification: "DRIVER",
            driver_id: newDriverItem.driver_id,
            phone_no: driverItem.phone_no,
            gsi1sk: "ZONE#",
            email: driverItem.email,
            on_duty: driverItem.on_duty,
            accepted_load_id: driverItem.accepted_load_id,
            assigned_boxes: driverItem.assigned_boxes,
            last_delivered_date: driverItem.last_delivered_date,
            check_in: driverItem.check_in,
            checked_time: driverItem.checked_time,
            accepted_on_during_checked_in:
              driverItem.accepted_on_during_checked_in,
            trailer_number: driverItem.trailer_number,
            truck_number: driverItem.truck_number,
            type: "DRIVER_ZONE#",
            dd_tenant: "TENANT#",
            tenant_id: newDriverItem.tenant_id,
            tenant_name: newDriverItem.tenant_name,
            tenant_type: newDriverItem.tenant_type,
            driver_name: driverItem.driver_name,
            on_duty: driverItem.on_duty,
            shift: driverItem.shift,
            driver_status: newDriverItem.driver_status,
            driver_linked_status: newDriverItem.driver_linked_status,
            turns_per_shift: newDriverItem.turns_per_shift,
            no_of_load_delivered_in_current_shift:
              newDriverItem.no_of_load_delivered_in_current_shift,
            carrier_id: newDriverItem.id,
            carrier_name: newDriverItem.name,
            user_id: newDriverItem.user_id,
            is_assigned: driverItem.is_assigned,
            carrier_status: driverItem.carrier_status,
            avatar: driverItem.avatar,
          },
        },
      },
    });
    if (response?.data?.data) {
      console.log("success: ", response.data.data);
    } else {
      console.log("error inserting driver in db : ", driverItem);
    }
  } catch (err) {
    console.log("Error in sending data", err);
  }
};

const updateJob = async (jobItem, oldData) => {
  try {
    let response = await axios({
      url: process.env.API_CATHERD_GRAPHQLAPIENDPOINTOUTPUT,
      method: "post",
      headers: {
        // 'x-api-key': process.env.API_CATHERD_GRAPHQLAPIKEYOUTPUT
        Authorization: "SUPER_ACCESS_DD",
      },
      data: {
        query: print(
          gql`
            ${updateCatHerd}
          `
        ),
        variables: {
          input: {
            id: oldData.id,
            cat: oldData.cat,
            gsi1sk: oldData.gsi1sk,
            type: `JOB_${oldData.gsi1sk}`,
            tenant_id: jobItem.tenant_id,
            tenant_name: jobItem.tenant_name ? jobItem.tenant_name : "",
            tenant_type: jobItem.tenant_type,
            job_name: jobItem.name,
            job_id: jobItem.id,
            working_status: jobItem.working_status,
            job_status: jobItem.status,
            district_id: jobItem.district_id,
            district_name: jobItem.district_name,
            crew_id: jobItem.crew_id,
            crew_name: jobItem.crew_name,
            basin_id: jobItem.basin_id,
            basin_name: jobItem.basin_name,
            linked_carrier: jobItem.linked_carrier,
            _version: oldData._version,
          },
        },
      },
    });
    if (response?.data?.data) {
      console.log("success: ", response.data.data);
    } else {
      console.log("error updating job in db : ", response.data.errors);
    }
  } catch (err) {
    console.log("Error in sending data", err);
  }
};

const updateDriver = async (driverItem, oldData) => {
  try {
    console.log("oldData");
    let response = await axios({
      url: process.env.API_CATHERD_GRAPHQLAPIENDPOINTOUTPUT,
      method: "post",
      headers: {
        // 'x-api-key': process.env.API_CATHERD_GRAPHQLAPIKEYOUTPUT
        Authorization: "SUPER_ACCESS_DD",
      },
      data: {
        query: print(
          gql`
            ${updateCatHerd}
          `
        ),
        variables: {
          input: {
            id: oldData.id,
            cat: oldData.cat,
            classification: "DRIVER",
            phone_no: driverItem.phone_no,
            gsi1sk: oldData.gsi1sk,
            email: driverItem.email,
            on_duty: driverItem.on_duty,
            accepted_load_id: driverItem.accepted_load_id,
            assigned_boxes: driverItem?.assigned_boxes ?? [],
            last_delivered_date: driverItem.last_delivered_date,
            check_in: driverItem.check_in,
            checked_time: driverItem.checked_time,
            accepted_on_during_checked_in:
              driverItem.accepted_on_during_checked_in,
            trailer_number: driverItem.trailer_number,
            truck_number: driverItem.truck_number,
            type: "DRIVER_ZONE#",
            dd_tenant: oldData.dd_tenant,
            tenant_id: oldData.tenant_id,
            tenant_name: oldData.tenant_name,
            tenant_type: oldData.tenant_type,
            driver_name: driverItem.driver_name,
            on_duty: driverItem.on_duty,
            shift: driverItem.shift,
            driver_status: driverItem.driver_status,
            driver_linked_status: driverItem.driver_linked_status,
            turns_per_shift: driverItem.turns_per_shift,
            no_of_load_delivered_in_current_shift:
              driverItem.no_of_load_delivered_in_current_shift,
            carrier_id: oldData.carrier_id,
            carrier_name: oldData.carrier_name,
            user_id: oldData.user_id,
            assigned_load_ids: driverItem.assigned_load_ids,
            assign_load_status: driverItem.driver_load_status,
            no_of_assigned_loads: driverItem.no_of_assigned_loads,
            _version: oldData._version,
          },
        },
      },
    });
    if (response?.data?.data) {
      console.log("success: ", response.data.data);
    } else {
      console.log("error updating job in db : ", response.data.errors);
    }
  } catch (err) {
    console.log("Error in sending data", err);
  }
};

const updateZone = async (zoneId, version, jobs) => {
  try {
    let response = await axios({
      url: process.env.API_CATHERD_GRAPHQLAPIENDPOINTOUTPUT,
      method: "post",
      headers: {
        // 'x-api-key': process.env.API_CATHERD_GRAPHQLAPIKEYOUTPUT
        Authorization: "SUPER_ACCESS_DD",
      },
      data: {
        query: print(
          gql`
            ${updateCatHerd}
          `
        ),
        variables: {
          input: {
            id: zoneId,
            cat: "ZONE",
            jobs: jobs,
            _version: version,
          },
        },
      },
    });
    if (response?.data?.data) {
      console.log("success: ", response.data.data);
    } else {
      console.log("error updating zone in db : ", zoneId);
    }
  } catch (err) {
    console.log("Error in sending data", err);
  }
};

const deleteLoad = async (loadid, cat, version) => {
  try {
    let response = await axios({
      url: process.env.API_CATHERD_GRAPHQLAPIENDPOINTOUTPUT,
      method: "post",
      headers: {
        // 'x-api-key': process.env.API_CATHERD_GRAPHQLAPIKEYOUTPUT
        Authorization: "SUPER_ACCESS_DD",
      },
      data: {
        query: print(
          gql`
            ${deleteCatHerd}
          `
        ),
        variables: {
          input: {
            id: loadid,
            cat: cat,
            _version: version,
          },
        },
      },
    });
    if (response?.data) {
      console.log("success: ", response.data);
    } else {
      console.log("error deleting load from db : ", loadid);
    }
  } catch (err) {
    console.log("Error in sending data", err);
  }
};

const deleteDrDeck = async (_variables) => {
  try {
    let response = await axios({
      url: process.env.API_CATHERD_GRAPHQLAPIENDPOINTOUTPUT,
      method: "post",
      headers: {
        // 'x-api-key': process.env.API_CATHERD_GRAPHQLAPIKEYOUTPUT
        Authorization: "SUPER_ACCESS_DD",
      },
      data: {
        query: print(
          gql`
            ${deleteCatHerd}
          `
        ),
        variables: _variables,
      },
    });
    if (response?.data) {
      console.log("success: ", response.data);
    } else {
      console.log("error deleting load from db : ", _variables);
    }
  } catch (err) {
    console.log("Error in sending data", err);
  }
};

const updateDrDeck = async (_input) => {
  try {
    let response = await axios({
      url: process.env.API_CATHERD_GRAPHQLAPIENDPOINTOUTPUT,
      method: "post",
      headers: {
        // 'x-api-key': process.env.API_CATHERD_GRAPHQLAPIKEYOUTPUT
        Authorization: "SUPER_ACCESS_DD",
      },
      data: {
        query: print(
          gql`
            ${updateCatHerd}
          `
        ),
        variables: {
          input: _input,
        },
      },
    });
    if (response?.data?.data) console.log("Solution: ", response.data.data);
    else console.log("Unable to update load", _input);
  } catch (err) {
    console.log("Error Updating DrDeck", err);
    return err;
  }
};

module.exports = {
  addLoad,
  addJob,
  addDriver,
  addSameDriver,
  addCarrierTarget,
  addDistict,
  addCrew,

  updateJob,
  updateDriver,
  updateDrDeck,
  updateZone,

  getDrDeck,
  getDataByClassandId,
  getAllByTenantId,
  getAllByCat,
  getByCat,
  getLoadsByJobId,
  getDriverById,
  getLoadById,

  deleteLoad,
  deleteDrDeck,
};
