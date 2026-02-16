import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "./redux/store";
import "./index.css";

// Layouts
import AdminLayout from "./components/Layout/AdminLayout";
import UserLayout from "./components/Layout/UserLayout";
import RequireAuth from "./components/RequireAuth";

// Auth
import Login from "./pages/Login";
import Register from "./pages/Register";

// Admin Pages
import AdminDashboard from "./pages/Admin/Dashboard";
import CreatePoll from "./pages/Admin/CreatePoll";
import AdminPollList from "./pages/Admin/PollList";
import PollResults from "./pages/Admin/PollResults";

// User Pages
import UserDashboard from "./pages/User/Dashboard";
import PollDetail from "./pages/User/PollDetail";
import UserPollResults from "./pages/User/PollResults";
import MyVotesView from "./pages/User/MyVotes";

function App() {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Root Redirect */}
          <Route path="/" element={<Navigate to="/login" replace />} />

          {/* Admin Routes */}
          <Route
            path="/admin"
            element={
              <RequireAuth adminOnly={true}>
                <AdminLayout />
              </RequireAuth>
            }
          >
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="polls" element={<AdminPollList />} />
            <Route path="polls/create" element={<CreatePoll />} />
            <Route path="polls/:id/results" element={<PollResults />} />
            <Route index element={<Navigate to="dashboard" replace />} />
          </Route>

          {/* User Routes */}
          <Route
            path="/"
            element={
              <RequireAuth>
                <UserLayout />
              </RequireAuth>
            }
          >
            <Route path="polls" element={<UserDashboard />} />
            <Route path="polls/:id" element={<PollDetail />} />
            <Route path="polls/:id/results" element={<UserPollResults />} />
            <Route path="my-votes" element={<MyVotesView />} />
          </Route>

          {/* Catch-all */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </BrowserRouter>
    </Provider>
  );
}

export default App;
