import { async } from "@firebase/util";
import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import {
  getAuth,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  updateProfile,
  signOut,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import { app } from "../configs/firebase.config";

const auth = getAuth(app);
const gProv = new GoogleAuthProvider();
const initialState = {
  userData: null,
  initialized: false,
  loading: true,
  userLoading: false,
  googleLoading: false,
  dataLoading: true,
};

export const authSlice = createSlice({
  name: "userAuth",
  initialState,
  reducers: {
    setInitialized: (state, { payload }) => {
      // Redux Toolkit allows us to write "mutating" logic in reducers. It
      // doesn't actually mutate the state because it uses the Immer library,
      // which detects changes to a "draft state" and produces a brand new
      // immutable state based off those changes
      state.initialized = payload;
    },
    login: (state, { payload }) => {
      state.userData = payload.user;
    },
    createUser: (state, { payload }) => {
      state.userData = payload.user;
    },
    logout: (state) => {
      state.userData = null;
    },
    setUserData: (state, { payload }) => {
      state.userData = { ...payload.userData };
    },
    setLoading: (state, { payload }) => {
      state.loading = payload.loading;
    },
    setUserLoading: (state, { payload }) => {
      state.userLoading = payload.userLoading;
    },
    setGoogleLoading: (state, { payload }) => {
      state.googleLoading = payload.googleLoading;
    },
    setDataLoading: (state, { payload }) => {
      state.dataLoading = payload.dataLoading;
    },
  },
});

// Action creators are generated for each case reducer function
export const {
  setInitialized,
  login,
  logout,
  createUser,
  setUserData,
  setLoading,
  loading,
  setUserLoading,
  setGoogleLoading,
  setDataLoading,
} = authSlice.actions;

export const authListener = () => async (dispatch) => {
  onAuthStateChanged(auth, (user) => {
    console.log(user);

    dispatch(setUserData({ userData: user && user.toJSON() }));

    dispatch(setLoading({ loading: false }));
  });
};

export const signOutUser = () => async (dispatch) => {
  console.log("sigining out");
  await dispatch(logout());
  await signOut(auth);
};

export const logInUser =
  ({ email, password }) =>
  async (dispatch) => {
    await dispatch(setLoading({ loading: true }));
    await dispatch(setUserLoading({ userLoading: true }));
    try {
      const userCreds = await signInWithEmailAndPassword(auth, email, password);
      dispatch(login({ user: userCreds.user.toJSON() }));
      await dispatch(setUserLoading({ userLoading: false }));
      return { succeded: true };
    } catch (err) {
      console.log(err.message);
      await dispatch(setUserLoading({ userLoading: false }));
      return { succeded: false, error: err.message };
    }
  };

export const googleSign = () => async (dispatch) => {
  await dispatch(setLoading({ loading: true }));
  await dispatch(setGoogleLoading({ googleLoading: true }));
  try {
    const userCred = await signInWithPopup(auth, gProv);
    await dispatch(createUser({ user: userCred.user.toJSON() }));
    await dispatch(setGoogleLoading({ googleLoading: false }));
    return { succeded: true };
  } catch (err) {
    console.log(err.message);
    await dispatch(setGoogleLoading({ googleLoading: false }));
    return { succeded: false, error: err.message };
  }
};
export const signUpUser =
  ({ email, password, file, name }) =>
  async (dispatch) => {
    await dispatch(setLoading({ loading: true }));
    await dispatch(setUserLoading({ userLoading: true }));
    try {
      const user = await createUserWithEmailAndPassword(auth, email, password);

      if (file) {
        const formData = new FormData();
        formData.append("image", file);
        const res = await axios.post(
          `https://api.imgbb.com/1/upload?key=e6e425086757be46a714cf930fe529d6`,
          formData
        );
        const image = res.data.data.display_url;
        await updateProfile(auth.currentUser, {
          displayName: name,
          photoURL: image,
        });
        await dispatch(createUser({ user: user.user.toJSON() }));
        await dispatch(setUserLoading({ userLoading: false }));
        return { succeded: true };
      } else {
        await updateProfile(auth.currentUser, { displayName: name });
        await dispatch(createUser({ user: user.user.toJSON() }));
        await dispatch(setUserLoading({ userLoading: false }));
        return { succeded: true };
      }
    } catch (err) {
      console.log(err.message);
      console.log("l f");
      await dispatch(setUserLoading({ userLoading: false }));
      return { succeded: false, error: err.message };
    }
  };

export const selectUser = (state) => {
  const user = state.userAuth.userData;
  const loading = state.userAuth.loading;
  const userLoading = state.userAuth.userLoading;
  const googleLoading = state.userAuth.googleLoading;
  const dataLoading = state.userAuth.dataLoading;
  return { user, loading, userLoading, googleLoading, dataLoading };
};

export default authSlice.reducer;
