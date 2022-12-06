"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.onUpdateGlobalLookups = exports.onUpdateCatHerd = exports.onUpdateByTenantClassKey = exports.onUpdateById = exports.onUpdateByGsortKey = exports.onUpdateByCategory = exports.onDeleteGlobalLookups = exports.onDeleteCatHerd = exports.onDeleteByCategory = exports.onCreateGlobalLookups = exports.onCreateCatHerd = void 0;

/* eslint-disable */
// this is an auto generated file. This will be overwritten
const onUpdateByCategory =
/* GraphQL */
`
  subscription OnUpdateByCategory($cat: String) {
    onUpdateByCategory(cat: $cat) {
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
exports.onUpdateByCategory = onUpdateByCategory;
const onDeleteByCategory =
/* GraphQL */
`
  subscription OnDeleteByCategory($cat: String) {
    onDeleteByCategory(cat: $cat) {
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
exports.onDeleteByCategory = onDeleteByCategory;
const onUpdateByGsortKey =
/* GraphQL */
`
  subscription OnUpdateByGsortKey($gsi1sk: String) {
    onUpdateByGsortKey(gsi1sk: $gsi1sk) {
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
exports.onUpdateByGsortKey = onUpdateByGsortKey;
const onUpdateByTenantClassKey =
/* GraphQL */
`
  subscription OnUpdateByTenantClassKey(
    $classification: String
    $tenant_id: String
  ) {
    onUpdateByTenantClassKey(
      classification: $classification
      tenant_id: $tenant_id
    ) {
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
exports.onUpdateByTenantClassKey = onUpdateByTenantClassKey;
const onUpdateById =
/* GraphQL */
`
  subscription OnUpdateById($id: ID, $cat: String) {
    onUpdateById(id: $id, cat: $cat) {
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
exports.onUpdateById = onUpdateById;
const onCreateCatHerd =
/* GraphQL */
`
  subscription OnCreateCatHerd {
    onCreateCatHerd {
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
exports.onCreateCatHerd = onCreateCatHerd;
const onUpdateCatHerd =
/* GraphQL */
`
  subscription OnUpdateCatHerd {
    onUpdateCatHerd {
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
exports.onUpdateCatHerd = onUpdateCatHerd;
const onDeleteCatHerd =
/* GraphQL */
`
  subscription OnDeleteCatHerd {
    onDeleteCatHerd {
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
exports.onDeleteCatHerd = onDeleteCatHerd;
const onCreateGlobalLookups =
/* GraphQL */
`
  subscription OnCreateGlobalLookups {
    onCreateGlobalLookups {
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
exports.onCreateGlobalLookups = onCreateGlobalLookups;
const onUpdateGlobalLookups =
/* GraphQL */
`
  subscription OnUpdateGlobalLookups {
    onUpdateGlobalLookups {
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
exports.onUpdateGlobalLookups = onUpdateGlobalLookups;
const onDeleteGlobalLookups =
/* GraphQL */
`
  subscription OnDeleteGlobalLookups {
    onDeleteGlobalLookups {
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
exports.onDeleteGlobalLookups = onDeleteGlobalLookups;