import React, { useContext } from "react";
import Auth from "../Auth/Auth";
import EmailVerification from "../Auth/VerifyEmail";
import { Routes, Route } from "react-router-dom";
import Dashboard from "../../Pages/User/Dashboard";
import Admin from "../../Pages/Admin/Admin";
import UserRoutes from "./UserRoutes";
import AdminRoutes from "./AdminRoutes";
import Quiz from "../../Pages/User/Quiz";
import Result from "../../Pages/User/Result";
import Review from "../../Pages/User/review";
import NoticeBoard from "../../Pages/User/NoticeBoard";
import Bookmarks from "../../Pages/User/Bookmarks";
import UserMessages from "../../Pages/User/UserMessages";
import TestHistory from "../../Pages/User/TestHistory";
import QuizReview from "../../Pages/User/QuizReview";
import AllQuestions from "../../Pages/Admin/AllQuestions";
import AllUser from "../../Pages/Admin/AllUser";
import CreateAdmin from "../../Pages/Admin/CreateAdmin";
import CreateNotice from "../../Pages/Admin/CreateNotice";
import Notices from "../../Pages/Admin/Notices";
import QuestionEdit from "../../Pages/Admin/QuestionEdit";
import AdminMessages from "../../Pages/Admin/AdminMessages";
import UserHistory from "../../Pages/Admin/UserHistory";
import TestReview from "../../Pages/Admin/TestReview";
const AllRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Auth />} />
      <Route path="/verify/:token" element={<EmailVerification/>} />
      <Route path="/dashboard" element={<UserRoutes><Dashboard /></UserRoutes>} />
      <Route path="/quiz" element={<UserRoutes><Quiz /></UserRoutes>} />
      <Route path="/result" element={<UserRoutes><Result /></UserRoutes>} />
      <Route path="/review" element={<UserRoutes><Review/></UserRoutes>} />
      <Route path="/bookmarks" element={<UserRoutes><Bookmarks/></UserRoutes>} />
      <Route path="/noticeboard" element={<UserRoutes><NoticeBoard /></UserRoutes>} />
      <Route path="/user-messages" element={<UserRoutes><UserMessages /></UserRoutes>} />
      <Route path="/test-history" element={<UserRoutes><TestHistory /></UserRoutes>} />
      <Route path="/quizreview/:attemptId" element={<UserRoutes><QuizReview /></UserRoutes>} />

      <Route path="/admin" element={<AdminRoutes><Admin /></AdminRoutes>} />
      <Route path="/all-questions" element={<AdminRoutes><AllQuestions /></AdminRoutes>} />
      <Route path="/question/:id" element={<AdminRoutes><QuestionEdit /></AdminRoutes>} />
      <Route path="/all-user" element={<AdminRoutes><AllUser /></AdminRoutes>} />
      <Route path="/create-admin" element={<AdminRoutes><CreateAdmin /></AdminRoutes>} />
      <Route path="/create-notice" element={<AdminRoutes><CreateNotice /></AdminRoutes>} />
      <Route path="/notices" element={<AdminRoutes><Notices /></AdminRoutes>} />
      <Route path="/admin-messages" element={<AdminRoutes><AdminMessages /></AdminRoutes>} />
      <Route path="/user-history" element={<AdminRoutes><UserHistory /></AdminRoutes>} />
      <Route path="/testreview/:attemptId" element={<AdminRoutes><TestReview /></AdminRoutes>} />
    </Routes>
  );
};

export default AllRoutes;