import { createBrowserRouter, RouterProvider } from "react-router-dom";

import AddChallenge from "./Components/AddChallenge";
// import AdminInterface from "./Pages/AdminInterface/AdminInterface";
import ExamPage from "./Pages/ExamPage/ExamPage";

const router = createBrowserRouter([
  {
    path: "/",
    element: <ExamPage />,
  },
  {
    path: "/add-challenge",
    element: <AddChallenge />,
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
