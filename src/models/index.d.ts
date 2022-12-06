import { ModelInit, MutableModel } from "@aws-amplify/datastore";
// @ts-ignore
import { LazyLoading, LazyLoadingDisabled } from "@aws-amplify/datastore";

type EagerLinkedCarrier = {
  readonly carrier_id?: string | null;
  readonly carrier_name?: string | null;
  readonly carrier_linked_id?: string | null;
  readonly carrier_status?: string | null;
  readonly carrier_linked_status?: string | null;
}

type LazyLinkedCarrier = {
  readonly carrier_id?: string | null;
  readonly carrier_name?: string | null;
  readonly carrier_linked_id?: string | null;
  readonly carrier_status?: string | null;
  readonly carrier_linked_status?: string | null;
}

export declare type LinkedCarrier = LazyLoading extends LazyLoadingDisabled ? EagerLinkedCarrier : LazyLinkedCarrier

export declare const LinkedCarrier: (new (init: ModelInit<LinkedCarrier>) => LinkedCarrier)

type EagerBox = {
  readonly box_id?: string | null;
  readonly box_number?: number | null;
  readonly rolling_time?: string | null;
  readonly proppant_type?: string | null;
  readonly proppant_type_id?: number | null;
}

type LazyBox = {
  readonly box_id?: string | null;
  readonly box_number?: number | null;
  readonly rolling_time?: string | null;
  readonly proppant_type?: string | null;
  readonly proppant_type_id?: number | null;
}

export declare type Box = LazyLoading extends LazyLoadingDisabled ? EagerBox : LazyBox

export declare const Box: (new (init: ModelInit<Box>) => Box)

type EagerLoadList = {
  readonly acceptedAt?: string | null;
  readonly completedAt?: string | null;
  readonly load_no?: string | null;
  readonly job_no?: string | null;
}

type LazyLoadList = {
  readonly acceptedAt?: string | null;
  readonly completedAt?: string | null;
  readonly load_no?: string | null;
  readonly job_no?: string | null;
}

export declare type LoadList = LazyLoading extends LazyLoadingDisabled ? EagerLoadList : LazyLoadList

export declare const LoadList: (new (init: ModelInit<LoadList>) => LoadList)

type EagerUserEmail = {
  readonly id?: string | null;
  readonly name?: string | null;
  readonly email?: string | null;
}

type LazyUserEmail = {
  readonly id?: string | null;
  readonly name?: string | null;
  readonly email?: string | null;
}

export declare type UserEmail = LazyLoading extends LazyLoadingDisabled ? EagerUserEmail : LazyUserEmail

export declare const UserEmail: (new (init: ModelInit<UserEmail>) => UserEmail)

type EagerUserSMS = {
  readonly id?: string | null;
  readonly name?: string | null;
  readonly phone_no?: string | null;
}

type LazyUserSMS = {
  readonly id?: string | null;
  readonly name?: string | null;
  readonly phone_no?: string | null;
}

export declare type UserSMS = LazyLoading extends LazyLoadingDisabled ? EagerUserSMS : LazyUserSMS

export declare const UserSMS: (new (init: ModelInit<UserSMS>) => UserSMS)

type EagerCustomContact = {
  readonly id?: string | null;
  readonly reference?: string | null;
  readonly type?: string | null;
  readonly value?: string | null;
}

type LazyCustomContact = {
  readonly id?: string | null;
  readonly reference?: string | null;
  readonly type?: string | null;
  readonly value?: string | null;
}

export declare type CustomContact = LazyLoading extends LazyLoadingDisabled ? EagerCustomContact : LazyCustomContact

export declare const CustomContact: (new (init: ModelInit<CustomContact>) => CustomContact)

type CatHerdMetaData = {
  readOnlyFields: 'createdAt' | 'updatedAt';
}

type GlobalLookupsMetaData = {
  readOnlyFields: 'createdAt' | 'updatedAt';
}

type EagerCatHerd = {
  readonly id: string;
  readonly cat: string;
  readonly type?: string | null;
  readonly gsi1sk?: string | null;
  readonly tenant_id?: string | null;
  readonly dd_tenant?: string | null;
  readonly tenant_name?: string | null;
  readonly tenant_type?: string | null;
  readonly z_name?: string | null;
  readonly status?: boolean | null;
  readonly terminal?: string | null;
  readonly district?: string | null;
  readonly carrier?: string | null;
  readonly basin?: string | null;
  readonly crew?: string | null;
  readonly jobs?: string | null;
  readonly loads?: string | null;
  readonly drivers?: string | null;
  readonly is_assigned?: boolean | null;
  readonly assign_load_status?: string | null;
  readonly assigned_load_ids?: string | null;
  readonly am_shift_start_time?: string | null;
  readonly pm_shift_start_time?: string | null;
  readonly cc_email?: string | null;
  readonly am_alert_time?: number | null;
  readonly pm_alert_time?: number | null;
  readonly load_name?: string | null;
  readonly load_no?: string | null;
  readonly load_id?: string | null;
  readonly job_id?: string | null;
  readonly linked_terminal_id?: string | null;
  readonly terminal_id?: string | null;
  readonly terminal_name?: string | null;
  readonly linked_product_id?: string | null;
  readonly product_id?: string | null;
  readonly product_name?: string | null;
  readonly stage?: string | null;
  readonly assigned_driver?: string | null;
  readonly load_status?: string | null;
  readonly load_created_at?: string | null;
  readonly carrier_status?: string | null;
  readonly operator_id?: string | null;
  readonly operator_name?: string | null;
  readonly job_name?: string | null;
  readonly load_ids?: string | null;
  readonly district_id?: string | null;
  readonly district_name?: string | null;
  readonly crew_id?: string | null;
  readonly crew_name?: string | null;
  readonly basin_id?: string | null;
  readonly basin_name?: string | null;
  readonly linked_carrier?: (LinkedCarrier | null)[] | null;
  readonly job_status?: string | null;
  readonly working_status?: string | null;
  readonly driver_name?: string | null;
  readonly driver_id?: string | null;
  readonly classification?: string | null;
  readonly phone_no?: string | null;
  readonly email?: string | null;
  readonly on_duty?: string | null;
  readonly driver_carrier_tenant?: string | null;
  readonly shift?: string | null;
  readonly carrier_id?: string | null;
  readonly carrier_name?: string | null;
  readonly accepted_load_id?: string | null;
  readonly assigned_boxes?: (Box | null)[] | null;
  readonly last_delivered_date?: string | null;
  readonly check_in?: string | null;
  readonly checked_time?: string | null;
  readonly accepted_on_during_checked_in?: string | null;
  readonly trailer_number?: string | null;
  readonly truck_number?: string | null;
  readonly user_id?: string | null;
  readonly turns_per_shift?: string | null;
  readonly no_of_load_delivered_in_current_shift?: string | null;
  readonly driver_status?: string | null;
  readonly driver_linked_status?: string | null;
  readonly avatar?: string | null;
  readonly no_of_assigned_loads?: string | null;
  readonly accepted_loads?: (LoadList | null)[] | null;
  readonly active_load?: string | null;
  readonly driver_imported_at?: string | null;
  readonly import_tag?: string | null;
  readonly agg_drivers?: number | null;
  readonly agg_active_drivers?: number | null;
  readonly agg_active_loads?: number | null;
  readonly am_target?: number | null;
  readonly pm_target?: number | null;
  readonly shift_alert_email?: (UserEmail | null)[] | null;
  readonly shift_alert_sms?: (UserSMS | null)[] | null;
  readonly custom_contact?: (CustomContact | null)[] | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

type LazyCatHerd = {
  readonly id: string;
  readonly cat: string;
  readonly type?: string | null;
  readonly gsi1sk?: string | null;
  readonly tenant_id?: string | null;
  readonly dd_tenant?: string | null;
  readonly tenant_name?: string | null;
  readonly tenant_type?: string | null;
  readonly z_name?: string | null;
  readonly status?: boolean | null;
  readonly terminal?: string | null;
  readonly district?: string | null;
  readonly carrier?: string | null;
  readonly basin?: string | null;
  readonly crew?: string | null;
  readonly jobs?: string | null;
  readonly loads?: string | null;
  readonly drivers?: string | null;
  readonly is_assigned?: boolean | null;
  readonly assign_load_status?: string | null;
  readonly assigned_load_ids?: string | null;
  readonly am_shift_start_time?: string | null;
  readonly pm_shift_start_time?: string | null;
  readonly cc_email?: string | null;
  readonly am_alert_time?: number | null;
  readonly pm_alert_time?: number | null;
  readonly load_name?: string | null;
  readonly load_no?: string | null;
  readonly load_id?: string | null;
  readonly job_id?: string | null;
  readonly linked_terminal_id?: string | null;
  readonly terminal_id?: string | null;
  readonly terminal_name?: string | null;
  readonly linked_product_id?: string | null;
  readonly product_id?: string | null;
  readonly product_name?: string | null;
  readonly stage?: string | null;
  readonly assigned_driver?: string | null;
  readonly load_status?: string | null;
  readonly load_created_at?: string | null;
  readonly carrier_status?: string | null;
  readonly operator_id?: string | null;
  readonly operator_name?: string | null;
  readonly job_name?: string | null;
  readonly load_ids?: string | null;
  readonly district_id?: string | null;
  readonly district_name?: string | null;
  readonly crew_id?: string | null;
  readonly crew_name?: string | null;
  readonly basin_id?: string | null;
  readonly basin_name?: string | null;
  readonly linked_carrier?: (LinkedCarrier | null)[] | null;
  readonly job_status?: string | null;
  readonly working_status?: string | null;
  readonly driver_name?: string | null;
  readonly driver_id?: string | null;
  readonly classification?: string | null;
  readonly phone_no?: string | null;
  readonly email?: string | null;
  readonly on_duty?: string | null;
  readonly driver_carrier_tenant?: string | null;
  readonly shift?: string | null;
  readonly carrier_id?: string | null;
  readonly carrier_name?: string | null;
  readonly accepted_load_id?: string | null;
  readonly assigned_boxes?: (Box | null)[] | null;
  readonly last_delivered_date?: string | null;
  readonly check_in?: string | null;
  readonly checked_time?: string | null;
  readonly accepted_on_during_checked_in?: string | null;
  readonly trailer_number?: string | null;
  readonly truck_number?: string | null;
  readonly user_id?: string | null;
  readonly turns_per_shift?: string | null;
  readonly no_of_load_delivered_in_current_shift?: string | null;
  readonly driver_status?: string | null;
  readonly driver_linked_status?: string | null;
  readonly avatar?: string | null;
  readonly no_of_assigned_loads?: string | null;
  readonly accepted_loads?: (LoadList | null)[] | null;
  readonly active_load?: string | null;
  readonly driver_imported_at?: string | null;
  readonly import_tag?: string | null;
  readonly agg_drivers?: number | null;
  readonly agg_active_drivers?: number | null;
  readonly agg_active_loads?: number | null;
  readonly am_target?: number | null;
  readonly pm_target?: number | null;
  readonly shift_alert_email?: (UserEmail | null)[] | null;
  readonly shift_alert_sms?: (UserSMS | null)[] | null;
  readonly custom_contact?: (CustomContact | null)[] | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

export declare type CatHerd = LazyLoading extends LazyLoadingDisabled ? EagerCatHerd : LazyCatHerd

export declare const CatHerd: (new (init: ModelInit<CatHerd, CatHerdMetaData>) => CatHerd) & {
  copyOf(source: CatHerd, mutator: (draft: MutableModel<CatHerd, CatHerdMetaData>) => MutableModel<CatHerd, CatHerdMetaData> | void): CatHerd;
}

type EagerGlobalLookups = {
  readonly id: string;
  readonly cat: string;
  readonly name?: string | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

type LazyGlobalLookups = {
  readonly id: string;
  readonly cat: string;
  readonly name?: string | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

export declare type GlobalLookups = LazyLoading extends LazyLoadingDisabled ? EagerGlobalLookups : LazyGlobalLookups

export declare const GlobalLookups: (new (init: ModelInit<GlobalLookups, GlobalLookupsMetaData>) => GlobalLookups) & {
  copyOf(source: GlobalLookups, mutator: (draft: MutableModel<GlobalLookups, GlobalLookupsMetaData>) => MutableModel<GlobalLookups, GlobalLookupsMetaData> | void): GlobalLookups;
}