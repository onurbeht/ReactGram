import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import photoService from "../services/photoService";

const initialState = {
  photos: [],
  photo: {},
  error: false,
  success: false,
  loading: false,
  message: null,
};

//Funções
//Publish user photo
export const publishPhoto = createAsyncThunk(
  "photo/publish",
  async (photo, thunkAPI) => {
    const token = thunkAPI.getState().auth.user.token;

    const data = await photoService.publishPhoto(photo, token);

    //Check for errors
    if (data.errors) {
      return thunkAPI.rejectWithValue(data.errors[0]);
    }

    return data;
  }
);

//Get user photos
export const getUserPhotos = createAsyncThunk(
  "photo/userPhotos",
  async (id, thunkAPI) => {
    const token = thunkAPI.getState().auth.user.token;

    const data = await photoService.getUserPhotos(id, token);

    return data;
  }
);

//Delete user photo
export const deleteUserPhoto = createAsyncThunk(
  "photo/delete",
  async (id, thunkAPI) => {
    const token = thunkAPI.getState().auth.user.token;

    const data = await photoService.deleteUserPhoto(id, token);

    if (data.errors) {
      return thunkAPI.rejectWithValue(data.errors[0]);
    }

    return data;
  }
);

//Update a photo
export const updatePhoto = createAsyncThunk(
  "photo/update",
  async (photoData, thunkAPI) => {
    const token = thunkAPI.getState().auth.user.token;

    const data = await photoService.updatePhoto(
      { title: photoData.title },
      photoData.id,
      token
    );

    if (data.errors) {
      return thunkAPI.rejectWithValue(data.errors[0]);
    }

    return data;
  }
);

//Get photo by id
export const getPhoto = createAsyncThunk(
  "photo/getPhoto",
  async (id, thunkAPI) => {
    const token = thunkAPI.getState().auth.user.token;

    const data = photoService.getPhoto(id, token);

    //check for errors
    if (data.errors) {
      return thunkAPI.rejectWithValue(data.errors[0]);
    }

    return data;
  }
);

//Like a photo
export const likePhoto = createAsyncThunk(
  "photo/like",
  async (id, thunkAPI) => {
    const token = thunkAPI.getState().auth.user.token;

    const data = photoService.LikePhoto(id, token);

    //check for errors
    if (data.errors) {
      return thunkAPI.rejectWithValue(data.errors[0]);
    }

    return data;
  }
);

//Comment a photo
export const commentPhoto = createAsyncThunk(
  "photo/comment",
  async (commentData, thunkAPI) => {
    const token = thunkAPI.getState().auth.user.token;

    const data = photoService.CommentPhoto(
      { comment: commentData.comment },
      commentData.id,
      token
    );

    //check for errors
    if (data.errors) {
      return thunkAPI.rejectWithValue(data.errors[0]);
    }

    return data;
  }
);

export const photoSlice = createSlice({
  name: "photo",
  initialState,
  reducers: {
    resetMessage: (state) => {
      state.message = null;
    },
  },
  extraReducers: (builder) => {
    builder
      //Publish
      .addCase(publishPhoto.pending, (state) => {
        state.loading = true;
        state.error = false;
      })
      .addCase(publishPhoto.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.success = true;
        state.photo = action.payload;
        state.photos.unshift(state.photo);
        state.message = "Foto publicada com sucesso!";
      })
      .addCase(publishPhoto.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.photo = {};
      })
      //Get user photos
      .addCase(getUserPhotos.pending, (state) => {
        state.loading = true;
        state.error = false;
      })
      .addCase(getUserPhotos.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.success = true;
        state.photos = action.payload;
      })
      //Delete
      .addCase(deleteUserPhoto.pending, (state) => {
        state.loading = true;
        state.error = false;
      })
      .addCase(deleteUserPhoto.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.success = true;
        state.photos = state.photos.filter((photo) => {
          return photo._id !== action.payload.id;
        });
        state.message = action.payload.message;
      })
      .addCase(deleteUserPhoto.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.photo = {};
      })
      //Update
      .addCase(updatePhoto.pending, (state) => {
        state.loading = true;
        state.error = false;
      })
      .addCase(updatePhoto.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.success = true;
        state.photos.map((photo) => {
          if (photo._id === action.payload.photo._id) {
            return (photo.title = action.payload.photo.title);
          }
          return photo;
        });
        state.message = action.payload.message;
      })
      .addCase(updatePhoto.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.photo = {};
      })
      //Get photo
      .addCase(getPhoto.pending, (state) => {
        state.loading = true;
        state.error = false;
      })
      .addCase(getPhoto.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.success = true;
        state.photo = action.payload;
      })
      .addCase(getPhoto.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.photo = {};
      })
      //Like a photo
      .addCase(likePhoto.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.success = true;

        if ("photoId" in action.payload) {
          state.photo.likes.push(action.payload.userId);
        } else {
          state.photo.likes.splice(
            state.photo.likes.indexOf(action.payload.userId, 1)
          );
        }

        state.photos.map((photo) => {
          if (photo._id === action.payload.photoId) {
            return photo.likes.push(action.payload.userId);
          }
          return photo;
        });
        state.message = action.payload.message;
      })
      .addCase(likePhoto.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      //Comment
      .addCase(commentPhoto.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.success = true;

        state.photo.comments.push(action.payload.comment);

        state.message = action.payload.message;
      })
      .addCase(commentPhoto.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.photo = {};
      });
  },
});

export const { resetMessage } = photoSlice.actions;
export default photoSlice.reducer;
