import { Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import { PrivateRoute } from "../utils/withProtect";
import LoginPage from "./Auth";
import Error from "./Error";
// import LandingPage from "./LandingPage";
import MainPage from "./MainPage";

function App() {
  return (
    <Suspense fallback={<p>Loading...</p>}>
      <Routes>
        <Route index element={<LoginPage />} />
        <Route path="login" element={<LoginPage /> }/>
        <Route path='auth/*' element={
          <PrivateRoute>
            <MainPage />
          </PrivateRoute>
        } />        
        <Route path="*" element={<Error error_type={404} />}/>
      </Routes>
    </Suspense>
  );
}

export default App;
