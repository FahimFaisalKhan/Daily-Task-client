import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
} from "react-router-dom";
import MainLayout from "../Layouts/MainLayout";
import MyTasks from "../Pages/MyTasks/MyTasks";
import AddTasks from "../Pages/AddTasks/AddTasks";
import CompletedTasks from "../Pages/CompletedTasks/CompletedTasks";
import TaskDetail from "../Pages/TaskDetail/TaskDetail";
import Signup from "../Pages/Signup/Signup";
import Loading from "./Loading";
import SignIn from "../Pages/SignIn/SignIn";
import PrivateRoute from "./PrivateRoute";
import MyMedia from "../Pages/MyMedia/MyMedia";

export const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<MainLayout />}>
      <Route
        path="/"
        element={
          <PrivateRoute>
            <MyTasks />
          </PrivateRoute>
        }
      />
      <Route
        path="/media"
        element={
          <PrivateRoute>
            <MyMedia />
          </PrivateRoute>
        }
      />
      <Route
        path="/add"
        element={
          <PrivateRoute>
            <AddTasks />
          </PrivateRoute>
        }
      />
      <Route
        path="/completed"
        element={
          <PrivateRoute>
            <CompletedTasks />
          </PrivateRoute>
        }
      />
      <Route
        path="/detail/:id"
        element={
          <PrivateRoute>
            <TaskDetail />
          </PrivateRoute>
        }
      />
      <Route path="/signup" element={<Signup />} />
      <Route path="/signin" element={<SignIn />} />
    </Route>
  )
);
