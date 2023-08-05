import { Navigate, Route, Routes } from "react-router-dom";

import Header from "./components/Header";
import { SignIn, SignUp, CreatePost, NewPost, AdminPanel, Posts, PostBoilerPlate, EditPost } from "./pages";
import { useStateValue } from "./context/StateProvider";
import { useEffect, useMemo } from "react";
import { userActionType } from "./context/reducer";
import fetchUser from "./utils/fetchUser";
import ThemeSwitch from "./components/ThemeSwitch";
import ProtectedCreate from "./components/ProtectedCreate";
import Footer from "./components/Footer";
import Quizzes from "./pages/Quizzes";
import NewQuiz from "./pages/NewQuiz";
import QuizBoilerPlate from "./pages/QuizBoilerPlate";
import HomePage from "./pages/HomePage";

function App() {
  const [{ user }, dispatch] = useStateValue();

  // const Admin = 0b0100;
  // const Mod = 0b0010;
  // const Owner = 0b0001;
  // const User = 0b0000;

  // Looks for cookies to find already logged in user
  useEffect(() => {
    (async () => {
      let fetched_user = await fetchUser("/api/auth/verifyAccessToken");
      dispatch({
        type: userActionType.SET_USER,
        user: fetched_user,
      });
    })();
  }, []);

  return (
    user !== undefined && (
      <>
        <div className="relative w-full h-full min-h-screen">
          <Header />
          <Routes>
            <Route exact path="/" element={<HomePage />} />
            <Route exact path="adminpanel" element={<AdminPanel />} />
            <Route exact path="auth">
              <Route exact path="signin" element={<SignIn />} />
              <Route exact path="signup" element={<SignUp />} />
            </Route>
            <Route exact path="createpost">
              <Route exact index element={<ProtectedCreate component={<CreatePost />} user={user} />} />
              <Route exact path="post" element={<ProtectedCreate component={<NewPost />} user={user} />} />
              <Route exact path="elimination" element={<ProtectedCreate component={<NewQuiz />} user={user} />} />
            </Route>
            <Route exact path="posts">
              <Route exact index element={<Posts />} />
              <Route exact path=":preview/:userName/:postURL" element={<PostBoilerPlate />} />
              <Route exact path=":userName/:postURL" element={<PostBoilerPlate />} />
              <Route exact path="edit/:userName/:postURL" element={<ProtectedCreate component={<EditPost />} user={user} />} />
              <Route exact path="edit/:preview/:userName/:postURL" element={<ProtectedCreate component={<EditPost />} user={user} />} />
            </Route>
            <Route exact path="quizzes">
              <Route exact index element={<Quizzes />} />
              <Route exact path=":preview/:userName/:quizURL" element={<QuizBoilerPlate />} />
              <Route exact path=":userName/:quizURL" element={<QuizBoilerPlate />} />
              <Route exact path="edit/:preview/:userName/:quizURL" element={<ProtectedCreate component={<EditPost />} user={user} />} />
              <Route exact path="edit/:userName/:quizURL" element={<ProtectedCreate component={<EditPost />} user={user} />} />
            </Route>
          </Routes>
          <ThemeSwitch />
        </div>
        <div id="footer__margin" className="mb-16">
          {" "}
        </div>
        <Footer />
      </>
    )
  );
}

export default App;
