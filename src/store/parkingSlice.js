
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// Convert database data into the format used by Parking.jsx
function formatSlot(slot) {
  return {
    id: slot.slot_id,
    status: slot.status,
    vehicle: slot.vehicle_number || "",
  };
}

// Fetch all parking slots
export const fetchParkingSlots = createAsyncThunk(
  "parking/fetchParkingSlots",
  async () => {
    const response = await fetch(
      "http://localhost:5000/api/parking"
    );

    if (!response.ok) {
      throw new Error("Failed to fetch parking slots");
    }

    const data = await response.json();
    return data.map(formatSlot);
  }
);

// Add a vehicle to a slot
export const addVehicle = createAsyncThunk(
  "parking/addVehicle",
  async ({ slotId, vehicleNumber }) => {
    const response = await fetch(
      `http://localhost:5000/api/parking/${slotId}/vehicle`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ vehicleNumber }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to add vehicle");
    }

    return {
      slotId,
      vehicleNumber: vehicleNumber.trim().toUpperCase(),
    };
  }
);

// Remove a vehicle from a slot
export const removeVehicle = createAsyncThunk(
  "parking/removeVehicle",
  async (slotId) => {
    const response = await fetch(
      `http://localhost:5000/api/parking/${slotId}/vehicle`,
      {
        method: "DELETE",
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to remove vehicle");
    }

    return slotId;
  }
);

const parkingSlice = createSlice({
  name: "parking",

  initialState: {
    slots: [],
    loading: false,
    error: null,
  },

  reducers: {},

  extraReducers: (builder) => {
    builder
      .addCase(fetchParkingSlots.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchParkingSlots.fulfilled, (state, action) => {
        state.loading = false;
        state.slots = action.payload;
      })
      .addCase(fetchParkingSlots.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      .addCase(addVehicle.fulfilled, (state, action) => {
        const slot = state.slots.find(
          (item) => item.id === action.payload.slotId
        );

        if (slot) {
          slot.status = "Occupied";
          slot.vehicle = action.payload.vehicleNumber;
        }
      })
      .addCase(addVehicle.rejected, (state, action) => {
        state.error = action.error.message;
      })

      .addCase(removeVehicle.fulfilled, (state, action) => {
        const slot = state.slots.find(
          (item) => item.id === action.payload
        );

        if (slot) {
          slot.status = "Available";
          slot.vehicle = "";
        }
      })
      .addCase(removeVehicle.rejected, (state, action) => {
        state.error = action.error.message;
      });
  },
});

export default parkingSlice.reducer;
