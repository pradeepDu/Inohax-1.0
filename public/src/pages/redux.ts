import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { configureStore } from "@reduxjs/toolkit";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";

// Define the interface for the user info
interface UserInfo {
  type: string;
  username: string;
  collegeName: string;
  year: string;
  stars: number;
  tags: Array<any>;
  email: string;
}

// Define the initial state for the question slice

// Define the initial state structure
interface AuthInitialState {
  userInfo: UserInfo | undefined;
}

const initialState: AuthInitialState = {
  userInfo: {
    type: "",
    username: "Dipesh Mishra",
    collegeName: "Pillai College of Engineering",
    year: "Ty",
    stars: 0,
    tags: [],
    email: "mavinash422@gmail.com",
  },
};

// Create the slice
export const userSlice = createSlice({
  name: "userInfo",
  initialState,
  reducers: {
    // Define your action with a strongly typed payload
    setUserType: (state, action) => {
      state.userInfo!.type = action.payload.type;
    },
    setUserTags: (state, action) => {
      state.userInfo!.tags = [...state.userInfo!.tags, action.payload.tag];
    },
    setIncrementStar: (state, action) => {
      state.userInfo!.stars = state.userInfo!.stars + action.payload;
    },
  },
});

export const { setUserType, setUserTags, setIncrementStar } = userSlice.actions;

type RandomUsers = Array<UserInfo>;

const initialRandomUsers: RandomUsers = [
  {
    type: "user",
    username: "Rajendra Mishra",
    collegeName: "Pillai College of Engineering",
    year: "Ty",
    stars: 1,
    tags: ["ai", "ml"],
    email: "dipeshmishra@pillai.edu.in",
  },
  {
    type: "user",
    username: "Rahul Patel",
    collegeName: "Pillai College of Engineering",
    year: "Sy",
    stars: 2,
    tags: ["webdev", "android"],
    email: "rahulpatel@pillai.edu.in",
  },
  {
    type: "user",
    username: "Anjali Gupta",
    collegeName: "Pillai College of Engineering",
    year: "Fy",
    stars: 1,
    tags: ["ai", "webdev"],
    email: "anjali.gupta@pillai.edu.in",
  },
  {
    type: "user",
    username: "Suresh Reddy",
    collegeName: "Pillai College of Engineering",
    year: "Sy",
    stars: 1,
    tags: ["android", "ml"],
    email: "sureshreddy@pillai.edu.in",
  },
  {
    type: "user",
    username: "Pooja Singh",
    collegeName: "Pillai College of Engineering",
    year: "Ty",
    stars: 2,
    tags: ["webdev", "ai"],
    email: "pooja.singh@pillai.edu.in",
  },
  {
    type: "user",
    username: "Ravi Kumar",
    collegeName: "Pillai College of Engineering",
    year: "Ty",
    stars: 1,
    tags: ["ml", "android"],
    email: "ravi.kumar@pillai.edu.in",
  },
  {
    type: "user",
    username: "Ayesha Khan",
    collegeName: "Pillai College of Engineering",
    year: "Sy",
    stars: 1,
    tags: ["webdev", "ml"],
    email: "ayesha.khan@pillai.edu.in",
  },
  {
    type: "user",
    username: "Sahil Sharma",
    collegeName: "Pillai College of Engineering",
    year: "Fy",
    stars: 2,
    tags: ["android", "react"],
    email: "sahilsharma@pillai.edu.in",
  },
  {
    type: "user",
    username: "Nidhi Verma",
    collegeName: "Pillai College of Engineering",
    year: "Ty",
    stars: 1,
    tags: ["ml", "ai"],
    email: "nidhi.verma@pillai.edu.in",
  },
  {
    type: "user",
    username: "Amit Desai",
    collegeName: "Pillai College of Engineering",
    year: "Ty",
    stars: 3,
    tags: ["webdev", "android"],
    email: "amit.desai@pillai.edu.in",
  },
];

interface QuestionState {
  question: string;
  language: string;
}

const initialQuestionState: QuestionState = {
  question: "", // Initial value for the question
  language: "",
};

export const questionSlice = createSlice({
  name: "question",
  initialState: initialQuestionState,
  reducers: {
    setQuestion: (state, action) => {
      state.question = action.payload.question; // Set the question with the new value
    },
    setLanguage: (state, action) => {
      state.language = action.payload.language;
    },
  },
});

export const { setQuestion, setLanguage } = questionSlice.actions;

// Create the slice for random users
export const randomUserSlice = createSlice({
  name: "randomUsers",
  initialState: initialRandomUsers,
  reducers: {},
});

export const {} = randomUserSlice.actions;

export const store = configureStore({
  reducer: {
    userInfo: userSlice.reducer, // Your existing user slice
    question: questionSlice.reducer, // The new question slice
    randomUsers: randomUserSlice.reducer, // Random user slice
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
