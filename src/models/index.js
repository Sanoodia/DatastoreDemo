// @ts-check
import { initSchema } from '@aws-amplify/datastore';
import { schema } from './schema';



const { CatHerd, GlobalLookups, LinkedCarrier, Box, LoadList, UserEmail, UserSMS, CustomContact } = initSchema(schema);

export {
  CatHerd,
  GlobalLookups,
  LinkedCarrier,
  Box,
  LoadList,
  UserEmail,
  UserSMS,
  CustomContact
};