"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.updateGlobalLookups = exports.updateCatHerd = exports.deleteGlobalLookups = exports.deleteCatHerd = exports.createGlobalLookups = exports.createCatHerd = void 0;

/* eslint-disable */
// this is an auto generated file. This will be overwritten
const createCatHerd =
/* GraphQL */
`
  mutation CreateCatHerd(
    $input: CreateCatHerdInput!
    $condition: ModelCatHerdConditionInput
  ) {
    createCatHerd(input: $input, condition: $condition) {
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
exports.createCatHerd = createCatHerd;
const updateCatHerd =
/* GraphQL */
`
  mutation UpdateCatHerd(
    $input: UpdateCatHerdInput!
    $condition: ModelCatHerdConditionInput
  ) {
    updateCatHerd(input: $input, condition: $condition) {
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
exports.updateCatHerd = updateCatHerd;
const deleteCatHerd =
/* GraphQL */
`
  mutation DeleteCatHerd(
    $input: DeleteCatHerdInput!
    $condition: ModelCatHerdConditionInput
  ) {
    deleteCatHerd(input: $input, condition: $condition) {
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
exports.deleteCatHerd = deleteCatHerd;
const createGlobalLookups =
/* GraphQL */
`
  mutation CreateGlobalLookups(
    $input: CreateGlobalLookupsInput!
    $condition: ModelGlobalLookupsConditionInput
  ) {
    createGlobalLookups(input: $input, condition: $condition) {
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
exports.createGlobalLookups = createGlobalLookups;
const updateGlobalLookups =
/* GraphQL */
`
  mutation UpdateGlobalLookups(
    $input: UpdateGlobalLookupsInput!
    $condition: ModelGlobalLookupsConditionInput
  ) {
    updateGlobalLookups(input: $input, condition: $condition) {
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
exports.updateGlobalLookups = updateGlobalLookups;
const deleteGlobalLookups =
/* GraphQL */
`
  mutation DeleteGlobalLookups(
    $input: DeleteGlobalLookupsInput!
    $condition: ModelGlobalLookupsConditionInput
  ) {
    deleteGlobalLookups(input: $input, condition: $condition) {
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
exports.deleteGlobalLookups = deleteGlobalLookups;