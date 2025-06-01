import { useAuthState } from "react-firebase-hooks/auth";
import { Navigate, useLocation } from "react-router-dom";
import { auth } from "../firebase";

export default function RequireAuth({ children }) {
  const [user, loading] = useAuthState(auth);
  const location = useLocation();

  if (loading) return <p>Loading...</p>;
  if (!user) return <Navigate to="/auth" state={{ from: location }} replace />;
  return children;
}
// This component checks if the user is authenticated. If not, it redirects them to the login page.
// It uses the `useAuthState` hook from `react-firebase-hooks/auth` to get the current user state.
// The `useLocation` hook from `react-router-dom` is used to get the current location, so that the user can be redirected back to the page they were trying to access after logging in.
// The `loading` state is used to show a loading message while the authentication state is being determined.
// The `Navigate` component is used to redirect the user to the login page if they are not authenticated.
// The `children` prop is used to render the protected component if the user is authenticated.
// This component is typically used in the main application file (e.g., App.jsx) to wrap around protected routes.
// It ensures that only authenticated users can access certain parts of the application.