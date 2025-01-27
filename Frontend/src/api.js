import axios from "axios";
const BASE_URL="http://localhost:4000" 
axios.defaults.withCredentials = true
export const signupApi=(creds)=>{
    return axios.post(`${BASE_URL}/auth/signup`,creds);
}
export const verifyApi=(token)=>{
    return axios.post(`${BASE_URL}/auth/verify/${token}`);
}
export const loginApi=(creds)=>{
    return axios.post(`${BASE_URL}/auth/login`,creds);
}
export const getUserApi=(id)=>{
    return axios.get(`${BASE_URL}/auth/${id}`);
}
export const getAllUserApi=(filter="both",sort="asc",page=1,limit=10)=>{
    return axios.get(`${BASE_URL}/auth/?filterby=${filter}&sortby=${sort}&page=${page}&limit=${limit}`);
}
export const deleteUserApi=(id)=>{
    return axios.delete(`${BASE_URL}/auth/${id}`);
}
export const bookmarkApi = (questionId) =>{
    return axios.post(`${BASE_URL}/quiz/bookmark/${questionId}`);
}
export const unbookmarkApi = (questionId) =>{
    return axios.delete(`${BASE_URL}/quiz/bookmark/${questionId}`);
}
export const getBookmarkedQuestions = async () => {
    return axios.get(`${BASE_URL}/quiz/bookmark`);
}
export const updateUserApi=(id,data)=>{
    return axios.patch(`${BASE_URL}/auth/${id}`,data);
}
export const getQuestionCountsApi=()=>{
    return axios.get(`${BASE_URL}/quiz/counts`);
}
export const postQuestionApi=(data)=>{
    return axios.post(`${BASE_URL}/quiz`,data);
}
export const deleteQuestionApi=(id)=>{
    return axios.delete(`${BASE_URL}/quiz/${id}`);
}
export const updateQuestionApi=(id,data)=>{
    return axios.patch(`${BASE_URL}/quiz/${id}`,data);
}
export const getQuestionsApi=(level,offset=0)=>{
    return axios.get(`${BASE_URL}/quiz/?level=${level}&limit=75&offset=${offset}`);
}
export const getQuestionByIdApi=(id)=>{
    return axios.get(`${BASE_URL}/quiz/question/${id}`);
}
export const getAllQuestionApi=(section,type,level,sort,page,limit)=>{
    return axios.get(`${BASE_URL}/quiz/all/?section=${section}&type=${type}&level=${level}&sortby=${sort}&page=${page}&limit=${limit}`);
}
export const postNoticeApi=(data)=>{
    return axios.post(`${BASE_URL}/notices`,data);
}
export const getNoticesApi=()=>{
    return axios.get(`${BASE_URL}/notices`);
}
export const deleteNoticeApi=(id)=>{
    return axios.delete(`${BASE_URL}/notices/${id}`);
}
export const sendMessageApi = (data) => {
    return axios.post(`${BASE_URL}/messages/send`, data);
}
export const getMessagesApi = () => {
    return axios.get(`${BASE_URL}/messages`);
}
export const deleteMessageApi = (messageId) => {
    return axios.delete(`${BASE_URL}/messages/${messageId}`);
}
export const markMessageAsReadApi = (messageId) => {
    return axios.patch(`${BASE_URL}/messages/${messageId}/read`);
}

export const saveTestAttemptApi = (data) => {
    return axios.post(`${BASE_URL}/test-attempt`, data);
}

export const getTestHistoryApi = (userId, params = {}) => {
    const { page = 1, limit = 10, quizType, level } = params;
    let url = `${BASE_URL}/test-attempt/history/${userId}?page=${page}&limit=${limit}`;
    if (quizType && quizType !== 'all') url += `&quizType=${quizType}`;
    if (level && level !== 'all') url += `&level=${level}`;
    return axios.get(url);
}

export const getTestAttemptDetailsApi = (attemptId) => {
    return axios.get(`${BASE_URL}/test-attempt/${attemptId}`);
}

export const getTestAnalyticsApi = (userId) => {
    return axios.get(`${BASE_URL}/test-attempt/test-analytics/${userId}`);
}