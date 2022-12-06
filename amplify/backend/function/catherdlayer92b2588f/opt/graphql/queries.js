"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.syncGlobalLookups = exports.syncCatHerds = exports.loadByJobId = exports.listGlobalLookups = exports.listCatHerds = exports.getGlobalLookups = exports.getCatHerdByClassification = exports.getCatHerd = exports.databyDriverId = exports.databyClassification = exports.databyCarrier = exports.dataByZone = exports.dataByTenantClass = exports.dataByTenant = exports.dataByDDTenant = exports.dataByCategory = exports.allLoadsById = exports.allJobsByJobId = void 0;

/* eslint-disable */
// this is an auto generated file. This will be overwritten
const getCatHerd =
/* GraphQL */
`
  query GetCatHerd($id: ID!, $cat: String!) {
    getCatHerd(id: $id, cat: $cat) {
      id
      cat
      type
      gsi1sk
      tenant_id
      dd_tenant
      tenant_name
      tenant_type
      z_name
      status
      terminal
      district
      carrier
      basin
      crew
      jobs
      loads
      drivers
      is_assigned
      assign_load_status
      assigned_load_ids
      am_shift_start_time
      pm_shift_start_time
      cc_email
      am_alert_time
      pm_alert_time
      load_name
      load_no
      load_id
      job_id
      linked_terminal_id
      terminal_id
      terminal_name
      linked_product_id
      product_id
      product_name
      stage
      assigned_driver
      load_status
      load_created_at
      carrier_status
      operator_id
      operator_name
      job_name
      load_ids
      district_id
      district_name
      crew_id
      crew_name
      basin_id
      basin_name
      linked_carrier {
        carrier_id
        carrier_name
        carrier_linked_id
        carrier_status
        carrier_linked_status
      }
      job_status
      working_status
      driver_name
      driver_id
      classification
      phone_no
      email
      on_duty
      driver_carrier_tenant
      shift
      carrier_id
      carrier_name
      accepted_load_id
      assigned_boxes {
        box_id
        box_number
        rolling_time
        proppant_type
        proppant_type_id
      }
      last_delivered_date
      check_in
      checked_time
      accepted_on_during_checked_in
      trailer_number
      truck_number
      user_id
      turns_per_shift
      no_of_load_delivered_in_current_shift
      driver_status
      driver_linked_status
      avatar
      no_of_assigned_loads
      accepted_loads {
        acceptedAt
        completedAt
        load_no
        job_no
      }
      active_load
      driver_imported_at
      import_tag
      agg_drivers
      agg_active_drivers
      agg_active_loads
      am_target
      pm_target
      shift_alert_email {
        id
        name
        email
      }
      shift_alert_sms {
        id
        name
        phone_no
      }
      custom_contact {
        id
        reference
        type
        value
      }
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
    }
  }
`;
exports.getCatHerd = getCatHerd;
const listCatHerds =
/* GraphQL */
`
  query ListCatHerds(
    $id: ID
    $cat: ModelStringKeyConditionInput
    $filter: ModelCatHerdFilterInput
    $limit: Int
    $nextToken: String
    $sortDirection: ModelSortDirection
  ) {
    listCatHerds(
      id: $id
      cat: $cat
      filter: $filter
      limit: $limit
      nextToken: $nextToken
      sortDirection: $sortDirection
    ) {
      items {
        id
        cat
        type
        gsi1sk
        tenant_id
        dd_tenant
        tenant_name
        tenant_type
        z_name
        status
        terminal
        district
        carrier
        basin
        crew
        jobs
        loads
        drivers
        is_assigned
        assign_load_status
        assigned_load_ids
        am_shift_start_time
        pm_shift_start_time
        cc_email
        am_alert_time
        pm_alert_time
        load_name
        load_no
        load_id
        job_id
        linked_terminal_id
        terminal_id
        terminal_name
        linked_product_id
        product_id
        product_name
        stage
        assigned_driver
        load_status
        load_created_at
        carrier_status
        operator_id
        operator_name
        job_name
        load_ids
        district_id
        district_name
        crew_id
        crew_name
        basin_id
        basin_name
        linked_carrier {
          carrier_id
          carrier_name
          carrier_linked_id
          carrier_status
          carrier_linked_status
        }
        job_status
        working_status
        driver_name
        driver_id
        classification
        phone_no
        email
        on_duty
        driver_carrier_tenant
        shift
        carrier_id
        carrier_name
        accepted_load_id
        assigned_boxes {
          box_id
          box_number
          rolling_time
          proppant_type
          proppant_type_id
        }
        last_delivered_date
        check_in
        checked_time
        accepted_on_during_checked_in
        trailer_number
        truck_number
        user_id
        turns_per_shift
        no_of_load_delivered_in_current_shift
        driver_status
        driver_linked_status
        avatar
        no_of_assigned_loads
        accepted_loads {
          acceptedAt
          completedAt
          load_no
          job_no
        }
        active_load
        driver_imported_at
        import_tag
        agg_drivers
        agg_active_drivers
        agg_active_loads
        am_target
        pm_target
        shift_alert_email {
          id
          name
          email
        }
        shift_alert_sms {
          id
          name
          phone_no
        }
        custom_contact {
          id
          reference
          type
          value
        }
        createdAt
        updatedAt
        _version
        _deleted
        _lastChangedAt
      }
      nextToken
      startedAt
    }
  }
`;
exports.listCatHerds = listCatHerds;
const syncCatHerds =
/* GraphQL */
`
  query SyncCatHerds(
    $filter: ModelCatHerdFilterInput
    $limit: Int
    $nextToken: String
    $lastSync: AWSTimestamp
  ) {
    syncCatHerds(
      filter: $filter
      limit: $limit
      nextToken: $nextToken
      lastSync: $lastSync
    ) {
      items {
        id
        cat
        type
        gsi1sk
        tenant_id
        dd_tenant
        tenant_name
        tenant_type
        z_name
        status
        terminal
        district
        carrier
        basin
        crew
        jobs
        loads
        drivers
        is_assigned
        assign_load_status
        assigned_load_ids
        am_shift_start_time
        pm_shift_start_time
        cc_email
        am_alert_time
        pm_alert_time
        load_name
        load_no
        load_id
        job_id
        linked_terminal_id
        terminal_id
        terminal_name
        linked_product_id
        product_id
        product_name
        stage
        assigned_driver
        load_status
        load_created_at
        carrier_status
        operator_id
        operator_name
        job_name
        load_ids
        district_id
        district_name
        crew_id
        crew_name
        basin_id
        basin_name
        linked_carrier {
          carrier_id
          carrier_name
          carrier_linked_id
          carrier_status
          carrier_linked_status
        }
        job_status
        working_status
        driver_name
        driver_id
        classification
        phone_no
        email
        on_duty
        driver_carrier_tenant
        shift
        carrier_id
        carrier_name
        accepted_load_id
        assigned_boxes {
          box_id
          box_number
          rolling_time
          proppant_type
          proppant_type_id
        }
        last_delivered_date
        check_in
        checked_time
        accepted_on_during_checked_in
        trailer_number
        truck_number
        user_id
        turns_per_shift
        no_of_load_delivered_in_current_shift
        driver_status
        driver_linked_status
        avatar
        no_of_assigned_loads
        accepted_loads {
          acceptedAt
          completedAt
          load_no
          job_no
        }
        active_load
        driver_imported_at
        import_tag
        agg_drivers
        agg_active_drivers
        agg_active_loads
        am_target
        pm_target
        shift_alert_email {
          id
          name
          email
        }
        shift_alert_sms {
          id
          name
          phone_no
        }
        custom_contact {
          id
          reference
          type
          value
        }
        createdAt
        updatedAt
        _version
        _deleted
        _lastChangedAt
      }
      nextToken
      startedAt
    }
  }
`;
exports.syncCatHerds = syncCatHerds;
const getGlobalLookups =
/* GraphQL */
`
  query GetGlobalLookups($id: ID!, $cat: String!) {
    getGlobalLookups(id: $id, cat: $cat) {
      id
      cat
      name
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
    }
  }
`;
exports.getGlobalLookups = getGlobalLookups;
const listGlobalLookups =
/* GraphQL */
`
  query ListGlobalLookups(
    $id: ID
    $cat: ModelStringKeyConditionInput
    $filter: ModelGlobalLookupsFilterInput
    $limit: Int
    $nextToken: String
    $sortDirection: ModelSortDirection
  ) {
    listGlobalLookups(
      id: $id
      cat: $cat
      filter: $filter
      limit: $limit
      nextToken: $nextToken
      sortDirection: $sortDirection
    ) {
      items {
        id
        cat
        name
        createdAt
        updatedAt
        _version
        _deleted
        _lastChangedAt
      }
      nextToken
      startedAt
    }
  }
`;
exports.listGlobalLookups = listGlobalLookups;
const syncGlobalLookups =
/* GraphQL */
`
  query SyncGlobalLookups(
    $filter: ModelGlobalLookupsFilterInput
    $limit: Int
    $nextToken: String
    $lastSync: AWSTimestamp
  ) {
    syncGlobalLookups(
      filter: $filter
      limit: $limit
      nextToken: $nextToken
      lastSync: $lastSync
    ) {
      items {
        id
        cat
        name
        createdAt
        updatedAt
        _version
        _deleted
        _lastChangedAt
      }
      nextToken
      startedAt
    }
  }
`;
exports.syncGlobalLookups = syncGlobalLookups;
const dataByCategory =
/* GraphQL */
`
  query DataByCategory(
    $cat: String!
    $gsi1sk: ModelStringKeyConditionInput
    $sortDirection: ModelSortDirection
    $filter: ModelCatHerdFilterInput
    $limit: Int
    $nextToken: String
  ) {
    dataByCategory(
      cat: $cat
      gsi1sk: $gsi1sk
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        cat
        type
        gsi1sk
        tenant_id
        dd_tenant
        tenant_name
        tenant_type
        z_name
        status
        terminal
        district
        carrier
        basin
        crew
        jobs
        loads
        drivers
        is_assigned
        assign_load_status
        assigned_load_ids
        am_shift_start_time
        pm_shift_start_time
        cc_email
        am_alert_time
        pm_alert_time
        load_name
        load_no
        load_id
        job_id
        linked_terminal_id
        terminal_id
        terminal_name
        linked_product_id
        product_id
        product_name
        stage
        assigned_driver
        load_status
        load_created_at
        carrier_status
        operator_id
        operator_name
        job_name
        load_ids
        district_id
        district_name
        crew_id
        crew_name
        basin_id
        basin_name
        linked_carrier {
          carrier_id
          carrier_name
          carrier_linked_id
          carrier_status
          carrier_linked_status
        }
        job_status
        working_status
        driver_name
        driver_id
        classification
        phone_no
        email
        on_duty
        driver_carrier_tenant
        shift
        carrier_id
        carrier_name
        accepted_load_id
        assigned_boxes {
          box_id
          box_number
          rolling_time
          proppant_type
          proppant_type_id
        }
        last_delivered_date
        check_in
        checked_time
        accepted_on_during_checked_in
        trailer_number
        truck_number
        user_id
        turns_per_shift
        no_of_load_delivered_in_current_shift
        driver_status
        driver_linked_status
        avatar
        no_of_assigned_loads
        accepted_loads {
          acceptedAt
          completedAt
          load_no
          job_no
        }
        active_load
        driver_imported_at
        import_tag
        agg_drivers
        agg_active_drivers
        agg_active_loads
        am_target
        pm_target
        shift_alert_email {
          id
          name
          email
        }
        shift_alert_sms {
          id
          name
          phone_no
        }
        custom_contact {
          id
          reference
          type
          value
        }
        createdAt
        updatedAt
        _version
        _deleted
        _lastChangedAt
      }
      nextToken
      startedAt
    }
  }
`;
exports.dataByCategory = dataByCategory;
const dataByZone =
/* GraphQL */
`
  query DataByZone(
    $gsi1sk: String!
    $cat: ModelStringKeyConditionInput
    $sortDirection: ModelSortDirection
    $filter: ModelCatHerdFilterInput
    $limit: Int
    $nextToken: String
  ) {
    dataByZone(
      gsi1sk: $gsi1sk
      cat: $cat
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        cat
        type
        gsi1sk
        tenant_id
        dd_tenant
        tenant_name
        tenant_type
        z_name
        status
        terminal
        district
        carrier
        basin
        crew
        jobs
        loads
        drivers
        is_assigned
        assign_load_status
        assigned_load_ids
        am_shift_start_time
        pm_shift_start_time
        cc_email
        am_alert_time
        pm_alert_time
        load_name
        load_no
        load_id
        job_id
        linked_terminal_id
        terminal_id
        terminal_name
        linked_product_id
        product_id
        product_name
        stage
        assigned_driver
        load_status
        load_created_at
        carrier_status
        operator_id
        operator_name
        job_name
        load_ids
        district_id
        district_name
        crew_id
        crew_name
        basin_id
        basin_name
        linked_carrier {
          carrier_id
          carrier_name
          carrier_linked_id
          carrier_status
          carrier_linked_status
        }
        job_status
        working_status
        driver_name
        driver_id
        classification
        phone_no
        email
        on_duty
        driver_carrier_tenant
        shift
        carrier_id
        carrier_name
        accepted_load_id
        assigned_boxes {
          box_id
          box_number
          rolling_time
          proppant_type
          proppant_type_id
        }
        last_delivered_date
        check_in
        checked_time
        accepted_on_during_checked_in
        trailer_number
        truck_number
        user_id
        turns_per_shift
        no_of_load_delivered_in_current_shift
        driver_status
        driver_linked_status
        avatar
        no_of_assigned_loads
        accepted_loads {
          acceptedAt
          completedAt
          load_no
          job_no
        }
        active_load
        driver_imported_at
        import_tag
        agg_drivers
        agg_active_drivers
        agg_active_loads
        am_target
        pm_target
        shift_alert_email {
          id
          name
          email
        }
        shift_alert_sms {
          id
          name
          phone_no
        }
        custom_contact {
          id
          reference
          type
          value
        }
        createdAt
        updatedAt
        _version
        _deleted
        _lastChangedAt
      }
      nextToken
      startedAt
    }
  }
`;
exports.dataByZone = dataByZone;
const dataByTenant =
/* GraphQL */
`
  query DataByTenant(
    $tenant_id: String!
    $cat: ModelStringKeyConditionInput
    $sortDirection: ModelSortDirection
    $filter: ModelCatHerdFilterInput
    $limit: Int
    $nextToken: String
  ) {
    dataByTenant(
      tenant_id: $tenant_id
      cat: $cat
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        cat
        type
        gsi1sk
        tenant_id
        dd_tenant
        tenant_name
        tenant_type
        z_name
        status
        terminal
        district
        carrier
        basin
        crew
        jobs
        loads
        drivers
        is_assigned
        assign_load_status
        assigned_load_ids
        am_shift_start_time
        pm_shift_start_time
        cc_email
        am_alert_time
        pm_alert_time
        load_name
        load_no
        load_id
        job_id
        linked_terminal_id
        terminal_id
        terminal_name
        linked_product_id
        product_id
        product_name
        stage
        assigned_driver
        load_status
        load_created_at
        carrier_status
        operator_id
        operator_name
        job_name
        load_ids
        district_id
        district_name
        crew_id
        crew_name
        basin_id
        basin_name
        linked_carrier {
          carrier_id
          carrier_name
          carrier_linked_id
          carrier_status
          carrier_linked_status
        }
        job_status
        working_status
        driver_name
        driver_id
        classification
        phone_no
        email
        on_duty
        driver_carrier_tenant
        shift
        carrier_id
        carrier_name
        accepted_load_id
        assigned_boxes {
          box_id
          box_number
          rolling_time
          proppant_type
          proppant_type_id
        }
        last_delivered_date
        check_in
        checked_time
        accepted_on_during_checked_in
        trailer_number
        truck_number
        user_id
        turns_per_shift
        no_of_load_delivered_in_current_shift
        driver_status
        driver_linked_status
        avatar
        no_of_assigned_loads
        accepted_loads {
          acceptedAt
          completedAt
          load_no
          job_no
        }
        active_load
        driver_imported_at
        import_tag
        agg_drivers
        agg_active_drivers
        agg_active_loads
        am_target
        pm_target
        shift_alert_email {
          id
          name
          email
        }
        shift_alert_sms {
          id
          name
          phone_no
        }
        custom_contact {
          id
          reference
          type
          value
        }
        createdAt
        updatedAt
        _version
        _deleted
        _lastChangedAt
      }
      nextToken
      startedAt
    }
  }
`;
exports.dataByTenant = dataByTenant;
const dataByTenantClass =
/* GraphQL */
`
  query DataByTenantClass(
    $tenant_id: String!
    $classification: ModelStringKeyConditionInput
    $sortDirection: ModelSortDirection
    $filter: ModelCatHerdFilterInput
    $limit: Int
    $nextToken: String
  ) {
    dataByTenantClass(
      tenant_id: $tenant_id
      classification: $classification
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        cat
        type
        gsi1sk
        tenant_id
        dd_tenant
        tenant_name
        tenant_type
        z_name
        status
        terminal
        district
        carrier
        basin
        crew
        jobs
        loads
        drivers
        is_assigned
        assign_load_status
        assigned_load_ids
        am_shift_start_time
        pm_shift_start_time
        cc_email
        am_alert_time
        pm_alert_time
        load_name
        load_no
        load_id
        job_id
        linked_terminal_id
        terminal_id
        terminal_name
        linked_product_id
        product_id
        product_name
        stage
        assigned_driver
        load_status
        load_created_at
        carrier_status
        operator_id
        operator_name
        job_name
        load_ids
        district_id
        district_name
        crew_id
        crew_name
        basin_id
        basin_name
        linked_carrier {
          carrier_id
          carrier_name
          carrier_linked_id
          carrier_status
          carrier_linked_status
        }
        job_status
        working_status
        driver_name
        driver_id
        classification
        phone_no
        email
        on_duty
        driver_carrier_tenant
        shift
        carrier_id
        carrier_name
        accepted_load_id
        assigned_boxes {
          box_id
          box_number
          rolling_time
          proppant_type
          proppant_type_id
        }
        last_delivered_date
        check_in
        checked_time
        accepted_on_during_checked_in
        trailer_number
        truck_number
        user_id
        turns_per_shift
        no_of_load_delivered_in_current_shift
        driver_status
        driver_linked_status
        avatar
        no_of_assigned_loads
        accepted_loads {
          acceptedAt
          completedAt
          load_no
          job_no
        }
        active_load
        driver_imported_at
        import_tag
        agg_drivers
        agg_active_drivers
        agg_active_loads
        am_target
        pm_target
        shift_alert_email {
          id
          name
          email
        }
        shift_alert_sms {
          id
          name
          phone_no
        }
        custom_contact {
          id
          reference
          type
          value
        }
        createdAt
        updatedAt
        _version
        _deleted
        _lastChangedAt
      }
      nextToken
      startedAt
    }
  }
`;
exports.dataByTenantClass = dataByTenantClass;
const dataByDDTenant =
/* GraphQL */
`
  query DataByDDTenant(
    $dd_tenant: String!
    $cat: ModelStringKeyConditionInput
    $sortDirection: ModelSortDirection
    $filter: ModelCatHerdFilterInput
    $limit: Int
    $nextToken: String
  ) {
    dataByDDTenant(
      dd_tenant: $dd_tenant
      cat: $cat
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        cat
        type
        gsi1sk
        tenant_id
        dd_tenant
        tenant_name
        tenant_type
        z_name
        status
        terminal
        district
        carrier
        basin
        crew
        jobs
        loads
        drivers
        is_assigned
        assign_load_status
        assigned_load_ids
        am_shift_start_time
        pm_shift_start_time
        cc_email
        am_alert_time
        pm_alert_time
        load_name
        load_no
        load_id
        job_id
        linked_terminal_id
        terminal_id
        terminal_name
        linked_product_id
        product_id
        product_name
        stage
        assigned_driver
        load_status
        load_created_at
        carrier_status
        operator_id
        operator_name
        job_name
        load_ids
        district_id
        district_name
        crew_id
        crew_name
        basin_id
        basin_name
        linked_carrier {
          carrier_id
          carrier_name
          carrier_linked_id
          carrier_status
          carrier_linked_status
        }
        job_status
        working_status
        driver_name
        driver_id
        classification
        phone_no
        email
        on_duty
        driver_carrier_tenant
        shift
        carrier_id
        carrier_name
        accepted_load_id
        assigned_boxes {
          box_id
          box_number
          rolling_time
          proppant_type
          proppant_type_id
        }
        last_delivered_date
        check_in
        checked_time
        accepted_on_during_checked_in
        trailer_number
        truck_number
        user_id
        turns_per_shift
        no_of_load_delivered_in_current_shift
        driver_status
        driver_linked_status
        avatar
        no_of_assigned_loads
        accepted_loads {
          acceptedAt
          completedAt
          load_no
          job_no
        }
        active_load
        driver_imported_at
        import_tag
        agg_drivers
        agg_active_drivers
        agg_active_loads
        am_target
        pm_target
        shift_alert_email {
          id
          name
          email
        }
        shift_alert_sms {
          id
          name
          phone_no
        }
        custom_contact {
          id
          reference
          type
          value
        }
        createdAt
        updatedAt
        _version
        _deleted
        _lastChangedAt
      }
      nextToken
      startedAt
    }
  }
`;
exports.dataByDDTenant = dataByDDTenant;
const allLoadsById =
/* GraphQL */
`
  query AllLoadsById(
    $load_id: String!
    $sortDirection: ModelSortDirection
    $filter: ModelCatHerdFilterInput
    $limit: Int
    $nextToken: String
  ) {
    allLoadsById(
      load_id: $load_id
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        cat
        type
        gsi1sk
        tenant_id
        dd_tenant
        tenant_name
        tenant_type
        z_name
        status
        terminal
        district
        carrier
        basin
        crew
        jobs
        loads
        drivers
        is_assigned
        assign_load_status
        assigned_load_ids
        am_shift_start_time
        pm_shift_start_time
        cc_email
        am_alert_time
        pm_alert_time
        load_name
        load_no
        load_id
        job_id
        linked_terminal_id
        terminal_id
        terminal_name
        linked_product_id
        product_id
        product_name
        stage
        assigned_driver
        load_status
        load_created_at
        carrier_status
        operator_id
        operator_name
        job_name
        load_ids
        district_id
        district_name
        crew_id
        crew_name
        basin_id
        basin_name
        linked_carrier {
          carrier_id
          carrier_name
          carrier_linked_id
          carrier_status
          carrier_linked_status
        }
        job_status
        working_status
        driver_name
        driver_id
        classification
        phone_no
        email
        on_duty
        driver_carrier_tenant
        shift
        carrier_id
        carrier_name
        accepted_load_id
        assigned_boxes {
          box_id
          box_number
          rolling_time
          proppant_type
          proppant_type_id
        }
        last_delivered_date
        check_in
        checked_time
        accepted_on_during_checked_in
        trailer_number
        truck_number
        user_id
        turns_per_shift
        no_of_load_delivered_in_current_shift
        driver_status
        driver_linked_status
        avatar
        no_of_assigned_loads
        accepted_loads {
          acceptedAt
          completedAt
          load_no
          job_no
        }
        active_load
        driver_imported_at
        import_tag
        agg_drivers
        agg_active_drivers
        agg_active_loads
        am_target
        pm_target
        shift_alert_email {
          id
          name
          email
        }
        shift_alert_sms {
          id
          name
          phone_no
        }
        custom_contact {
          id
          reference
          type
          value
        }
        createdAt
        updatedAt
        _version
        _deleted
        _lastChangedAt
      }
      nextToken
      startedAt
    }
  }
`;
exports.allLoadsById = allLoadsById;
const loadByJobId =
/* GraphQL */
`
  query LoadByJobId(
    $job_id: String!
    $cat: ModelStringKeyConditionInput
    $sortDirection: ModelSortDirection
    $filter: ModelCatHerdFilterInput
    $limit: Int
    $nextToken: String
  ) {
    loadByJobId(
      job_id: $job_id
      cat: $cat
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        cat
        type
        gsi1sk
        tenant_id
        dd_tenant
        tenant_name
        tenant_type
        z_name
        status
        terminal
        district
        carrier
        basin
        crew
        jobs
        loads
        drivers
        is_assigned
        assign_load_status
        assigned_load_ids
        am_shift_start_time
        pm_shift_start_time
        cc_email
        am_alert_time
        pm_alert_time
        load_name
        load_no
        load_id
        job_id
        linked_terminal_id
        terminal_id
        terminal_name
        linked_product_id
        product_id
        product_name
        stage
        assigned_driver
        load_status
        load_created_at
        carrier_status
        operator_id
        operator_name
        job_name
        load_ids
        district_id
        district_name
        crew_id
        crew_name
        basin_id
        basin_name
        linked_carrier {
          carrier_id
          carrier_name
          carrier_linked_id
          carrier_status
          carrier_linked_status
        }
        job_status
        working_status
        driver_name
        driver_id
        classification
        phone_no
        email
        on_duty
        driver_carrier_tenant
        shift
        carrier_id
        carrier_name
        accepted_load_id
        assigned_boxes {
          box_id
          box_number
          rolling_time
          proppant_type
          proppant_type_id
        }
        last_delivered_date
        check_in
        checked_time
        accepted_on_during_checked_in
        trailer_number
        truck_number
        user_id
        turns_per_shift
        no_of_load_delivered_in_current_shift
        driver_status
        driver_linked_status
        avatar
        no_of_assigned_loads
        accepted_loads {
          acceptedAt
          completedAt
          load_no
          job_no
        }
        active_load
        driver_imported_at
        import_tag
        agg_drivers
        agg_active_drivers
        agg_active_loads
        am_target
        pm_target
        shift_alert_email {
          id
          name
          email
        }
        shift_alert_sms {
          id
          name
          phone_no
        }
        custom_contact {
          id
          reference
          type
          value
        }
        createdAt
        updatedAt
        _version
        _deleted
        _lastChangedAt
      }
      nextToken
      startedAt
    }
  }
`;
exports.loadByJobId = loadByJobId;
const allJobsByJobId =
/* GraphQL */
`
  query AllJobsByJobId(
    $job_id: String!
    $sortDirection: ModelSortDirection
    $filter: ModelCatHerdFilterInput
    $limit: Int
    $nextToken: String
  ) {
    allJobsByJobId(
      job_id: $job_id
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        cat
        type
        gsi1sk
        tenant_id
        dd_tenant
        tenant_name
        tenant_type
        z_name
        status
        terminal
        district
        carrier
        basin
        crew
        jobs
        loads
        drivers
        is_assigned
        assign_load_status
        assigned_load_ids
        am_shift_start_time
        pm_shift_start_time
        cc_email
        am_alert_time
        pm_alert_time
        load_name
        load_no
        load_id
        job_id
        linked_terminal_id
        terminal_id
        terminal_name
        linked_product_id
        product_id
        product_name
        stage
        assigned_driver
        load_status
        load_created_at
        carrier_status
        operator_id
        operator_name
        job_name
        load_ids
        district_id
        district_name
        crew_id
        crew_name
        basin_id
        basin_name
        linked_carrier {
          carrier_id
          carrier_name
          carrier_linked_id
          carrier_status
          carrier_linked_status
        }
        job_status
        working_status
        driver_name
        driver_id
        classification
        phone_no
        email
        on_duty
        driver_carrier_tenant
        shift
        carrier_id
        carrier_name
        accepted_load_id
        assigned_boxes {
          box_id
          box_number
          rolling_time
          proppant_type
          proppant_type_id
        }
        last_delivered_date
        check_in
        checked_time
        accepted_on_during_checked_in
        trailer_number
        truck_number
        user_id
        turns_per_shift
        no_of_load_delivered_in_current_shift
        driver_status
        driver_linked_status
        avatar
        no_of_assigned_loads
        accepted_loads {
          acceptedAt
          completedAt
          load_no
          job_no
        }
        active_load
        driver_imported_at
        import_tag
        agg_drivers
        agg_active_drivers
        agg_active_loads
        am_target
        pm_target
        shift_alert_email {
          id
          name
          email
        }
        shift_alert_sms {
          id
          name
          phone_no
        }
        custom_contact {
          id
          reference
          type
          value
        }
        createdAt
        updatedAt
        _version
        _deleted
        _lastChangedAt
      }
      nextToken
      startedAt
    }
  }
`;
exports.allJobsByJobId = allJobsByJobId;
const databyDriverId =
/* GraphQL */
`
  query DatabyDriverId(
    $driver_id: String!
    $cat: ModelStringKeyConditionInput
    $sortDirection: ModelSortDirection
    $filter: ModelCatHerdFilterInput
    $limit: Int
    $nextToken: String
  ) {
    databyDriverId(
      driver_id: $driver_id
      cat: $cat
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        cat
        type
        gsi1sk
        tenant_id
        dd_tenant
        tenant_name
        tenant_type
        z_name
        status
        terminal
        district
        carrier
        basin
        crew
        jobs
        loads
        drivers
        is_assigned
        assign_load_status
        assigned_load_ids
        am_shift_start_time
        pm_shift_start_time
        cc_email
        am_alert_time
        pm_alert_time
        load_name
        load_no
        load_id
        job_id
        linked_terminal_id
        terminal_id
        terminal_name
        linked_product_id
        product_id
        product_name
        stage
        assigned_driver
        load_status
        load_created_at
        carrier_status
        operator_id
        operator_name
        job_name
        load_ids
        district_id
        district_name
        crew_id
        crew_name
        basin_id
        basin_name
        linked_carrier {
          carrier_id
          carrier_name
          carrier_linked_id
          carrier_status
          carrier_linked_status
        }
        job_status
        working_status
        driver_name
        driver_id
        classification
        phone_no
        email
        on_duty
        driver_carrier_tenant
        shift
        carrier_id
        carrier_name
        accepted_load_id
        assigned_boxes {
          box_id
          box_number
          rolling_time
          proppant_type
          proppant_type_id
        }
        last_delivered_date
        check_in
        checked_time
        accepted_on_during_checked_in
        trailer_number
        truck_number
        user_id
        turns_per_shift
        no_of_load_delivered_in_current_shift
        driver_status
        driver_linked_status
        avatar
        no_of_assigned_loads
        accepted_loads {
          acceptedAt
          completedAt
          load_no
          job_no
        }
        active_load
        driver_imported_at
        import_tag
        agg_drivers
        agg_active_drivers
        agg_active_loads
        am_target
        pm_target
        shift_alert_email {
          id
          name
          email
        }
        shift_alert_sms {
          id
          name
          phone_no
        }
        custom_contact {
          id
          reference
          type
          value
        }
        createdAt
        updatedAt
        _version
        _deleted
        _lastChangedAt
      }
      nextToken
      startedAt
    }
  }
`;
exports.databyDriverId = databyDriverId;
const databyClassification =
/* GraphQL */
`
  query DatabyClassification(
    $classification: String!
    $sortDirection: ModelSortDirection
    $filter: ModelCatHerdFilterInput
    $limit: Int
    $nextToken: String
  ) {
    databyClassification(
      classification: $classification
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        cat
        type
        gsi1sk
        tenant_id
        dd_tenant
        tenant_name
        tenant_type
        z_name
        status
        terminal
        district
        carrier
        basin
        crew
        jobs
        loads
        drivers
        is_assigned
        assign_load_status
        assigned_load_ids
        am_shift_start_time
        pm_shift_start_time
        cc_email
        am_alert_time
        pm_alert_time
        load_name
        load_no
        load_id
        job_id
        linked_terminal_id
        terminal_id
        terminal_name
        linked_product_id
        product_id
        product_name
        stage
        assigned_driver
        load_status
        load_created_at
        carrier_status
        operator_id
        operator_name
        job_name
        load_ids
        district_id
        district_name
        crew_id
        crew_name
        basin_id
        basin_name
        linked_carrier {
          carrier_id
          carrier_name
          carrier_linked_id
          carrier_status
          carrier_linked_status
        }
        job_status
        working_status
        driver_name
        driver_id
        classification
        phone_no
        email
        on_duty
        driver_carrier_tenant
        shift
        carrier_id
        carrier_name
        accepted_load_id
        assigned_boxes {
          box_id
          box_number
          rolling_time
          proppant_type
          proppant_type_id
        }
        last_delivered_date
        check_in
        checked_time
        accepted_on_during_checked_in
        trailer_number
        truck_number
        user_id
        turns_per_shift
        no_of_load_delivered_in_current_shift
        driver_status
        driver_linked_status
        avatar
        no_of_assigned_loads
        accepted_loads {
          acceptedAt
          completedAt
          load_no
          job_no
        }
        active_load
        driver_imported_at
        import_tag
        agg_drivers
        agg_active_drivers
        agg_active_loads
        am_target
        pm_target
        shift_alert_email {
          id
          name
          email
        }
        shift_alert_sms {
          id
          name
          phone_no
        }
        custom_contact {
          id
          reference
          type
          value
        }
        createdAt
        updatedAt
        _version
        _deleted
        _lastChangedAt
      }
      nextToken
      startedAt
    }
  }
`;
exports.databyClassification = databyClassification;
const getCatHerdByClassification =
/* GraphQL */
`
  query GetCatHerdByClassification(
    $classification: String!
    $id: ModelIDKeyConditionInput
    $sortDirection: ModelSortDirection
    $filter: ModelCatHerdFilterInput
    $limit: Int
    $nextToken: String
  ) {
    getCatHerdByClassification(
      classification: $classification
      id: $id
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        cat
        type
        gsi1sk
        tenant_id
        dd_tenant
        tenant_name
        tenant_type
        z_name
        status
        terminal
        district
        carrier
        basin
        crew
        jobs
        loads
        drivers
        is_assigned
        assign_load_status
        assigned_load_ids
        am_shift_start_time
        pm_shift_start_time
        cc_email
        am_alert_time
        pm_alert_time
        load_name
        load_no
        load_id
        job_id
        linked_terminal_id
        terminal_id
        terminal_name
        linked_product_id
        product_id
        product_name
        stage
        assigned_driver
        load_status
        load_created_at
        carrier_status
        operator_id
        operator_name
        job_name
        load_ids
        district_id
        district_name
        crew_id
        crew_name
        basin_id
        basin_name
        linked_carrier {
          carrier_id
          carrier_name
          carrier_linked_id
          carrier_status
          carrier_linked_status
        }
        job_status
        working_status
        driver_name
        driver_id
        classification
        phone_no
        email
        on_duty
        driver_carrier_tenant
        shift
        carrier_id
        carrier_name
        accepted_load_id
        assigned_boxes {
          box_id
          box_number
          rolling_time
          proppant_type
          proppant_type_id
        }
        last_delivered_date
        check_in
        checked_time
        accepted_on_during_checked_in
        trailer_number
        truck_number
        user_id
        turns_per_shift
        no_of_load_delivered_in_current_shift
        driver_status
        driver_linked_status
        avatar
        no_of_assigned_loads
        accepted_loads {
          acceptedAt
          completedAt
          load_no
          job_no
        }
        active_load
        driver_imported_at
        import_tag
        agg_drivers
        agg_active_drivers
        agg_active_loads
        am_target
        pm_target
        shift_alert_email {
          id
          name
          email
        }
        shift_alert_sms {
          id
          name
          phone_no
        }
        custom_contact {
          id
          reference
          type
          value
        }
        createdAt
        updatedAt
        _version
        _deleted
        _lastChangedAt
      }
      nextToken
      startedAt
    }
  }
`;
exports.getCatHerdByClassification = getCatHerdByClassification;
const databyCarrier =
/* GraphQL */
`
  query DatabyCarrier(
    $carrier_id: String!
    $id: ModelIDKeyConditionInput
    $sortDirection: ModelSortDirection
    $filter: ModelCatHerdFilterInput
    $limit: Int
    $nextToken: String
  ) {
    databyCarrier(
      carrier_id: $carrier_id
      id: $id
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        cat
        type
        gsi1sk
        tenant_id
        dd_tenant
        tenant_name
        tenant_type
        z_name
        status
        terminal
        district
        carrier
        basin
        crew
        jobs
        loads
        drivers
        is_assigned
        assign_load_status
        assigned_load_ids
        am_shift_start_time
        pm_shift_start_time
        cc_email
        am_alert_time
        pm_alert_time
        load_name
        load_no
        load_id
        job_id
        linked_terminal_id
        terminal_id
        terminal_name
        linked_product_id
        product_id
        product_name
        stage
        assigned_driver
        load_status
        load_created_at
        carrier_status
        operator_id
        operator_name
        job_name
        load_ids
        district_id
        district_name
        crew_id
        crew_name
        basin_id
        basin_name
        linked_carrier {
          carrier_id
          carrier_name
          carrier_linked_id
          carrier_status
          carrier_linked_status
        }
        job_status
        working_status
        driver_name
        driver_id
        classification
        phone_no
        email
        on_duty
        driver_carrier_tenant
        shift
        carrier_id
        carrier_name
        accepted_load_id
        assigned_boxes {
          box_id
          box_number
          rolling_time
          proppant_type
          proppant_type_id
        }
        last_delivered_date
        check_in
        checked_time
        accepted_on_during_checked_in
        trailer_number
        truck_number
        user_id
        turns_per_shift
        no_of_load_delivered_in_current_shift
        driver_status
        driver_linked_status
        avatar
        no_of_assigned_loads
        accepted_loads {
          acceptedAt
          completedAt
          load_no
          job_no
        }
        active_load
        driver_imported_at
        import_tag
        agg_drivers
        agg_active_drivers
        agg_active_loads
        am_target
        pm_target
        shift_alert_email {
          id
          name
          email
        }
        shift_alert_sms {
          id
          name
          phone_no
        }
        custom_contact {
          id
          reference
          type
          value
        }
        createdAt
        updatedAt
        _version
        _deleted
        _lastChangedAt
      }
      nextToken
      startedAt
    }
  }
`;
exports.databyCarrier = databyCarrier;