const AWS = require("aws-sdk");
const multipart = require("aws-lambda-multipart-parser");

const auth = require("auth");

const dynamodb = new AWS.DynamoDB.DocumentClient();
const {
  getZonesQuery,
  getJobsQuery,
  getTargetsQuery,
  updateItem,
  getAllData,
  getDriversQuery,
  generateJobsQuery,
  generateLoadsQuery,
  createItem,
} = require("./queries");

exports.handler = async (event) => {
  if (auth.auth(event)) {
    try {
      if (event.httpMethod === "GET") {
        const zonesResult = await getAllData(getZonesQuery);
        const targetsResult = await getAllData(getTargetsQuery);
        const driversResult = await getAllData(getDriversQuery);
        let data = {
          zones: zonesResult,
          targets: targetsResult,
          tenant_drivers: driversResult,
        };
        return {
          statusCode: 200,
          headers: {
            "Content-Type": "application/pdf",
            "Access-Control-Allow-Origin": "*",
            "Content-Disposition": "attachment; filename=backup.json",
          },
          body: JSON.stringify(data),
          isBase64Encoded: true,
        };
      } else if (event.httpMethod === "POST") {
        const data = multipart.parse(event, false);
        const { zones, tenant_drivers, targets } = JSON.parse(
          data.backup.content
        );
        let updateZones = zones.map(async (zone) => {
          let createZone = await dynamodb.put(createItem(zone)).promise();
          let zoneJobs = [];
          if (zone.basin && zone.basin !== "") {
            let basins = zone.basin.split(",");
            let matchedBasinJobs = await getAllData(
              generateJobsQuery("basin_id", basins, zone.tenant_id)
            );
            zoneJobs = zoneJobs.concat(matchedBasinJobs);
          }
          if (zone.district && zone.district !== "") {
            let districts = zone.district.split(",");
            let matchedDistrictJobs = await getAllData(
              generateJobsQuery("district_id", districts, zone.tenant_id)
            );
            zoneJobs = zoneJobs.concat(matchedDistrictJobs);
          }
          if (zone.crew && zone.crew != "") {
            let crews = zone.crew.split(",");
            let matchedCrewJobs = await getAllData(
              generateJobsQuery("crew_id", crews, zone.tenant_id)
            );

            zoneJobs = zoneJobs.concat(matchedCrewJobs);
          }
          if (zone.jobs && zone.jobs != "") {
            let jobs = zone.jobs.split(",");
            let matchedJobs = await getAllData(
              generateJobsQuery("job_id", jobs, zone.tenant_id)
            );

            zoneJobs = zoneJobs.concat(matchedJobs);
          }

          // zoneJobs.forEach((e) => {
          //   e.gsi1sk = zone.id;
          // });
          //allJobs = allJobs.concat(zoneJobs);
          zoneJobs = zoneJobs.filter(
            (value, index, self) =>
              index === self.findIndex((t) => t.id === value.id)
          );
          const updateJobs = zoneJobs.map(async (job) => {
            job.gsi1sk = zone.id;
            let jobLoads = await getAllData(
              generateLoadsQuery(job.job_id, zone.tenant_id)
            );
            let updateLoads = jobLoads.map(async (load) => {
              load.gsi1sk = zone.id;
              return {
                loadId: load.id,
                response: await dynamodb.put(createItem(load)).promise(),
              };
            });
            return Promise.all(updateLoads).then(async (updateLoadsRes) => {
              return {
                jobId: job.id,
                response: await dynamodb.put(createItem(job)).promise(),
                updateLoads: updateLoadsRes,
              };
            });
          });

          return Promise.all(updateJobs).then(async (updateJobsRes) => {
            return {
              zoneUpdate: { zoneId: zone.id, response: createZone },
              updateJobs: updateJobsRes,
            };
          });
        });
        let updateDrivers = tenant_drivers.map(async (driver) => {
          return {
            driverId: driver.id,
            response: await dynamodb.update(updateItem(driver)).promise(),
          };
        });
        let updateTargets = targets.map(async (target) => {
          return {
            targetId: target.id,
            response: await dynamodb.put(createItem(target)).promise(),
          };
        });
        return Promise.all([
          ...updateZones,
          ...updateDrivers,
          ...updateTargets,
        ]).then(async (response) => {
          return {
            statusCode: 200,
            body: JSON.stringify({
              response: response,
            }),
          };
        });
      } else {
        return {
          statusCode: 200,
          body: JSON.stringify({
            error: "Invalid Request Type",
          }),
        };
      }
    } catch (e) {
      console.log("error", e);
      return {
        statusCode: 200,
        body: JSON.stringify({ error: e }),
      };
    }
  } else {
    return {
      statusCode: 200,
      body: JSON.stringify({ error: "Invalid Credentials" }),
    };
  }
};
