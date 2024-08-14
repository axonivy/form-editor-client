import { rm } from 'node:fs';

const teardown = async () => {
  rm('./form-test-project/src_hd/temp', { force: true, recursive: true }, () => {});
  rm('./form-test-project/src_dataClasses/temp', { force: true, recursive: true }, () => {});
};
export default teardown;
