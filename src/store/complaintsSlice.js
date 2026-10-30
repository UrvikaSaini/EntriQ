import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// Fetch complaints from MySQL through the backend
export const fetchComplaints = createAsyncThunk(
  "complaints/fetchComplaints",
  async () => {
    const response = await fetch(
      "http://localhost:5000/api/complaints"
    );

    if (!response.ok) {
      throw new Error("Failed to fetch complaints");
    }

    const data = await response.json();

    // Match database fields to the existing UI
    return data.map((item) => ({
      id: item.id,
      name: item.resident_name,
      flatNo: item.flat_no || "",
      complaint: item.description,
      status: item.status,
      category: item.category,
    }));
  }
);

// Add a new complaint
export const addComplaint = createAsyncThunk(
  "complaints/addComplaint",
  async (complaint) => {
    const response = await fetch(
      "http://localhost:5000/api/complaints",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
  resident_name: complaint.name,
  flat_no: complaint.flatNo,
  description: complaint.complaint,
  category: complaint.category || "General",
}),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to add complaint");
    }

    // Return the saved record's database ID
    return {
      ...complaint,
      id: data.id,
    };
  }
);

// Resolve a complaint
export const resolveComplaint = createAsyncThunk(
  "complaints/resolveComplaint",
  async (id) => {
    const response = await fetch(
      `http://localhost:5000/api/complaints/${id}/resolve`,
      { method: "PATCH" }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to resolve complaint");
    }

    return id;
  }
);

const complaintsSlice = createSlice({
  name: "complaints",

  initialState: {
    complaints: [],
    loading: false,
    error: null,
  },

  reducers: {},

  extraReducers: (builder) => {
    builder
      .addCase(fetchComplaints.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchComplaints.fulfilled, (state, action) => {
        state.loading = false;
        state.complaints = action.payload;
      })
      .addCase(fetchComplaints.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(addComplaint.fulfilled, (state, action) => {
        state.complaints.unshift(action.payload);
      })
      .addCase(addComplaint.rejected, (state, action) => {
        state.error = action.error.message;
      })
      .addCase(resolveComplaint.fulfilled, (state, action) => {
        const item = state.complaints.find(
          (complaint) => complaint.id === action.payload
        );

        if (item) {
          item.status = "Resolved";
        }
      })
      .addCase(resolveComplaint.rejected, (state, action) => {
        state.error = action.error.message;
      });
  },
});

export default complaintsSlice.reducer;
