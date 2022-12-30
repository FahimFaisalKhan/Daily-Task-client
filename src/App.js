import "./App.css";

import { RouterProvider } from "react-router-dom";
import { router } from "./routes/router";
import { Provider, useSelector } from "react-redux";
import { store } from "./redux/store";
import { Toaster } from "react-hot-toast";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { selectUser } from "./redux/authSlice";

function App() {
  const queryClient = new QueryClient();

  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
      </QueryClientProvider>

      <Toaster />
    </Provider>
  );
}

export default App;
