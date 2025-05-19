import { IDepartmentRepository } from "./IDepartmentRepository";
import { APIDepartmentRepository } from "./APIDepartmentRepository";
// import { MockDepartmentRepository } from "./MockDepartmentRepository"; // optional

const USE_MOCK_DATA = false;

const departmentRepository: IDepartmentRepository = USE_MOCK_DATA
  ? {} as any // or new MockDepartmentRepository()
  : new APIDepartmentRepository();

export default departmentRepository;
