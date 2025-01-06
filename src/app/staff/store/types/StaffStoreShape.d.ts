import { type StaffItem } from "../../staff";

type StaffStoreShape = {
  activeStaffId: number | null;
  setActiveStaffId: (value: number | null) => void;
  activeStaffDetails: Partial<StaffItem>;
  setActiveStaffDetails: (value: Partial<StaffItem>) => void;
};

export default StaffStoreShape;
