import { create } from "zustand";
import type StaffStoreShape from "./types/StaffStoreShape";
import { type StaffItem } from "../staff";

const useStaff = create<StaffStoreShape>((set) => ({
  activeStaffId: null,
  setActiveStaffId(value) {
    set({
      activeStaffId: value,
    });
  },
  activeStaffDetails: {},
  setActiveStaffDetails(value: Partial<StaffItem>) {
    set({
      activeStaffDetails: value
    })
  }
}));

export default useStaff;
